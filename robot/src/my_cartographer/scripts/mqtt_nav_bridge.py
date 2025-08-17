#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
from geometry_msgs.msg import PoseStamped
import paho.mqtt.client as mqtt
import json
import math

# --- MQTT 설정 ---
MQTT_BROKER_ADDRESS = "your_mqtt_broker_address"  # 여기에 실제 MQTT 브로커 주소를 입력하세요. (예: "192.168.1.100")
MQTT_PORT = 1883
MQTT_TOPIC = "robot/goal"  # 백엔드에서 목표 좌표를 보낼 토픽 이름

class MqttNavBridge(Node):
    def __init__(self):
        super().__init__('mqtt_nav_bridge')
        
        # Nav2의 목표 지점 토픽(/goal_pose)을 발행할 퍼블리셔 생성
        self.goal_publisher_ = self.create_publisher(PoseStamped, '/goal_pose', 10)
        
        # MQTT 클라이언트 설정
        self.mqtt_client = mqtt.Client()
        self.mqtt_client.on_connect = self.on_connect
        self.mqtt_client.on_message = self.on_message
        
        self.get_logger().info(f"Connecting to MQTT Broker at {MQTT_BROKER_ADDRESS}...")
        try:
            self.mqtt_client.connect(MQTT_BROKER_ADDRESS, MQTT_PORT, 60)
            self.mqtt_client.loop_start() # 백그라운드에서 MQTT 네트워크 처리
        except Exception as e:
            self.get_logger().error(f"Failed to connect to MQTT broker: {e}")

    # MQTT 브로커에 연결되었을 때 호출되는 함수
    def on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            self.get_logger().info("Successfully connected to MQTT Broker.")
            # 연결 성공 시 토픽 구독
            self.mqtt_client.subscribe(MQTT_TOPIC)
            self.get_logger().info(f"Subscribed to topic: {MQTT_TOPIC}")
        else:
            self.get_logger().error(f"Failed to connect to MQTT, return code {rc}\n")

    # MQTT 메시지를 수신했을 때 호출되는 함수
    def on_message(self, client, userdata, msg):
        try:
            payload = msg.payload.decode('utf-8')
            self.get_logger().info(f"Received message on topic '{msg.topic}': {payload}")
            
            # JSON 메시지 파싱
            data = json.loads(payload)
            x = float(data['x'])
            y = float(data['y'])
            yaw_degrees = float(data['yaw'])

            # Nav2가 사용할 PoseStamped 메시지 생성
            goal_pose = PoseStamped()
            goal_pose.header.stamp = self.get_clock().now().to_msg()
            goal_pose.header.frame_id = 'map' # 목표는 지도 좌표계 기준

            # 위치 설정
            goal_pose.pose.position.x = x
            goal_pose.pose.position.y = y
            goal_pose.pose.position.z = 0.0

            # 방향 설정 (Yaw 각도를 Quaternion으로 변환)
            yaw_radians = math.radians(yaw_degrees)
            q = quaternion_from_euler(0, 0, yaw_radians)
            goal_pose.pose.orientation.x = q[0]
            goal_pose.pose.orientation.y = q[1]
            goal_pose.pose.orientation.z = q[2]
            goal_pose.pose.orientation.w = q[3]

            # /goal_pose 토픽으로 발행
            self.goal_publisher_.publish(goal_pose)
            self.get_logger().info(f"Published goal to Nav2: (x={x}, y={y}, yaw={yaw_degrees})")

        except Exception as e:
            self.get_logger().error(f"Failed to process message: {e}")

# 각도를 Quaternion으로 변환하는 함수
def quaternion_from_euler(roll, pitch, yaw):
    cy = math.cos(yaw * 0.5)
    sy = math.sin(yaw * 0.5)
    cp = math.cos(pitch * 0.5)
    sp = math.sin(pitch * 0.5)
    cr = math.cos(roll * 0.5)
    sr = math.sin(roll * 0.5)

    q = [0] * 4
    q[0] = sr * cp * cy - cr * sp * sy
    q[1] = cr * sp * cy + sr * cp * sy
    q[2] = cr * cp * sy - sr * sp * cy
    q[3] = cr * cp * cy + sr * sp * sy
    return q

def main(args=None):
    rclpy.init(args=args)
    mqtt_nav_bridge = MqttNavBridge()
    rclpy.spin(mqtt_nav_bridge)
    mqtt_nav_bridge.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
