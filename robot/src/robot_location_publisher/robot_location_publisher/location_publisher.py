#!/usr/bin/env python3
import json, ssl, time, threading
from math import pi
from datetime import datetime, timezone

import rclpy
from rclpy.node import Node
from rclpy.duration import Duration
from rclpy.time import Time

import tf2_ros
from tf2_ros import TransformException
import tf_transformations as tft

import paho.mqtt.client as mqtt

# ===== MQTT 설정 =====
BROKER_ADDRESS = "a3jylvd3aub3bf-ats.iot.ap-northeast-2.amazonaws.com"
PORT = 8883
TOPIC = "aiot/robot/shoot_location"

CA_PATH   = "/home/a202/AWS_AUTH/AmazonRootCA1.pem"
CERT_PATH = "/home/a202/AWS_AUTH/certificate.pem.crt"
KEY_PATH  = "/home/a202/AWS_AUTH/private.pem.key"

CLIENT_ID = "robot-location-publisher-ros2-paho-001"
KEEPALIVE = 30

# ===== 프레임/주기 =====
MAP_CANDIDATES  = ["map"]
ODOM_CANDIDATES = ["odom", "odom_combined"]
BASE_CANDIDATES = ["base_link", "base_footprint"]
HZ = 10
ROBOT_ID = 1

# ===== 유틸 =====
def yaw_deg_from_quat(qx, qy, qz, qw):
    _, _, yaw = tft.euler_from_quaternion([qx, qy, qz, qw])
    return yaw * 180.0 / pi

def to_compass_deg(yaw_deg_math):
    # 북=0°, 시계방향, [0,360)
    return (90.0 - yaw_deg_math) % 360.0

def iso_ms():
    # UTC, naive ISO with milliseconds
    return datetime.now(timezone.utc).replace(tzinfo=None).isoformat(timespec="milliseconds")

# ===== MQTT 래퍼 (paho 1.x/2.x 호환) =====
class PahoClient:
    def __init__(self, node: Node):
        self.node = node
        self._connected = threading.Event()

        # v2가 있으면 사용(DeprecationWarning 회피), 없으면 1.x로 폴백
        self.client = None
        if hasattr(mqtt, "CallbackAPIVersion"):
            try:
                self.client = mqtt.Client(
                    client_id=CLIENT_ID,
                    protocol=mqtt.MQTTv311,
                    callback_api_version=mqtt.CallbackAPIVersion.VERSION2,
                )
            except TypeError:
                self.client = None
        if self.client is None:
            self.client = mqtt.Client(client_id=CLIENT_ID, protocol=mqtt.MQTTv311)

        # TLS
        self.client.tls_set(
            ca_certs=CA_PATH,
            certfile=CERT_PATH,
            keyfile=KEY_PATH,
            tls_version=ssl.PROTOCOL_TLS_CLIENT,
            cert_reqs=ssl.CERT_REQUIRED,
        )
        self.client.tls_insecure_set(False)

        # 콜백: v1/v2 모두 수용 (인자 수/타입 차이를 흡수)
        def on_connect(client, userdata, *args, **kwargs):
            """
            v1: (client, userdata, flags, rc)
            v2: (client, userdata, flags, reasonCode, properties)
            """
            rc = None
            if len(args) >= 2:
                rc = args[1]  # v2 reasonCode
            elif len(args) == 1:
                rc = args[0]  # v1 rc
            code = getattr(rc, "value", rc) if rc is not None else 1
            if code == 0:
                self.node.get_logger().info("MQTT connected.")
                self._connected.set()
            else:
                self.node.get_logger().error(f"MQTT connect failed rc={code}")

        def on_disconnect(client, userdata, *args, **kwargs):
            """
            v1: (client, userdata, rc)
            v2: (client, userdata, reasonCode, properties)
            """
            rc = args[0] if args else 0
            code = getattr(rc, "value", rc)
            self._connected.clear()
            self.node.get_logger().warning(f"MQTT disconnected rc={code}")

        self.client.on_connect = on_connect
        self.client.on_disconnect = on_disconnect

    def connect(self):
        self.client.loop_start()
        backoff = 1.0
        while rclpy.ok():
            try:
                self.client.connect(BROKER_ADDRESS, PORT, KEEPALIVE)
                if self._connected.wait(timeout=5.0):
                    return
            except Exception as e:
                self.node.get_logger().warning(f"MQTT connect error: {e}")
            time.sleep(backoff)
            backoff = min(backoff * 2, 10.0)

    def publish(self, topic, payload, qos=0):
        if not self._connected.is_set():
            self.node.get_logger().warning("MQTT not connected, retry connect…")
            self.connect()
        self.client.publish(topic, payload, qos=qos)

    def close(self):
        try:
            self.client.disconnect()
        finally:
            self.client.loop_stop()

# ===== ROS2 노드 =====
class LocationPublisher(Node):
    def __init__(self):
        super().__init__("robot_location_mqtt_publisher_paho")

        # TF2
        self.tf_buffer = tf2_ros.Buffer(cache_time=Duration(seconds=5.0))
        self.tf_listener = tf2_ros.TransformListener(self.tf_buffer, self)

        # MQTT
        self.mqtt = PahoClient(self)
        self.get_logger().info("Connecting MQTT...")
        self.mqtt.connect()

        # 프레임 자동 탐색/캐시
        self.map_frame = None
        self.odom_frame = None
        self.base_frame = None
        self.last_map_to_odom = None

        self._last_frame_log_t = 0.0
        self.create_timer(0.5, self._resolve_frames)
        self.create_timer(1.0 / HZ, self.tick)

    def _resolve_frames(self):
        now = Time()
        timeout = Duration(seconds=0.01)
        changed = False

        if self.base_frame is None:
            for b in BASE_CANDIDATES:
                # 우선 후보 중 하나를 잡음(유효성은 아래에서 검증)
                self.base_frame = b
                changed = True
                break

        if self.map_frame is None and self.base_frame is not None:
            for m in MAP_CANDIDATES:
                if self.tf_buffer.can_transform(m, self.base_frame, now, timeout):
                    self.map_frame = m
                    changed = True
                    break

        if self.odom_frame is None and self.base_frame is not None:
            for o in ODOM_CANDIDATES:
                if self.tf_buffer.can_transform(o, self.base_frame, now, timeout):
                    self.odom_frame = o
                    changed = True
                    break

        t = time.time()
        if changed or (t - self._last_frame_log_t) > 1.0:
            self._last_frame_log_t = t
            self.get_logger().info(
                f"Frames -> map:{self.map_frame}, odom:{self.odom_frame}, base:{self.base_frame}"
            )

    def _lookup(self, target, source, sec=0.2):
        return self.tf_buffer.lookup_transform(target, source, Time(), timeout=Duration(seconds=sec))

    def tick(self):
        if self.base_frame is None:
            self.get_logger().warning("No base frame resolved yet.")
            return

        x = y = direction = None

        # 1) map → base_link 가능하면 전역 좌표 사용
        if self.map_frame and self.tf_buffer.can_transform(self.map_frame, self.base_frame, Time(), Duration(seconds=0.0)):
            try:
                tf_mb = self._lookup(self.map_frame, self.base_frame, 0.1)
                t = tf_mb.transform.translation
                r = tf_mb.transform.rotation
                yaw_deg = yaw_deg_from_quat(r.x, r.y, r.z, r.w)
                direction = round(to_compass_deg(yaw_deg), 1)
                x, y = round(float(t.x), 3), round(float(t.y), 3)

                # map→odom 캐시
                if self.odom_frame and self.tf_buffer.can_transform(self.map_frame, self.odom_frame, Time(), Duration(seconds=0.0)):
                    try:
                        self.last_map_to_odom = self._lookup(self.map_frame, self.odom_frame, 0.01)
                    except TransformException:
                        pass
            except TransformException:
                pass

        # 2) 아니면 odom → base_link 사용(상대 좌표)
        if x is None:
            if self.odom_frame and self.tf_buffer.can_transform(self.odom_frame, self.base_frame, Time(), Duration(seconds=0.0)):
                try:
                    tf_ob = self._lookup(self.odom_frame, self.base_frame, 0.2)
                    t = tf_ob.transform.translation
                    r = tf_ob.transform.rotation
                    yaw_deg = yaw_deg_from_quat(r.x, r.y, r.z, r.w)
                    direction = round(to_compass_deg(yaw_deg), 1)
                    x, y = round(float(t.x), 3), round(float(t.y), 3)
                except TransformException as e2:
                    self.get_logger().warning(f"Pose unavailable: {e2}")
                    return
            else:
                self.get_logger().warning("No TF available yet (need map or odom with base).")
                return

        payload = {
            "robot_id": ROBOT_ID,
            "x": x,
            "y": y,
            "direction": direction,  # 북=0°, CW
            "created_at": iso_ms(),
        }
        self.mqtt.publish(TOPIC, json.dumps(payload, ensure_ascii=False, separators=(",", ":")))
        self.get_logger().info(f"[MQTT] {payload}")

    def destroy_node(self):
        try:
            self.mqtt.close()
        finally:
            super().destroy_node()

def main():
    rclpy.init()
    node = LocationPublisher()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.shutdown()

if __name__ == "__main__":
    main()
