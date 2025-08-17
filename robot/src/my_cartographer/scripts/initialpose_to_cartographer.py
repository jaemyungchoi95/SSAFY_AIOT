#!/usr/bin/env python3
import time
import rclpy
from rclpy.node import Node
from rclpy.qos import QoSProfile
from geometry_msgs.msg import PoseWithCovarianceStamped, Pose
from cartographer_ros_msgs.srv import StartTrajectory, FinishTrajectory

def pick_available_client(node, clients, timeout=0.5, retries=10):
    for _ in range(retries):
        for c in clients:
            if c.wait_for_service(timeout_sec=timeout):
                return c
    return None

class InitialposeBridge(Node):
    def __init__(self):
        super().__init__('initialpose_to_cartographer')

        # params from launch
        self.declare_parameter('config_dir', '')
        self.declare_parameter('config_basename', 'my_robot_localization.lua')
        self.declare_parameter('relative_to_trajectory_id', 0)  # ← frozen pbstream = 0
        self.declare_parameter('auto_finish_active', True)

        # /initialpose subscriber
        qos = QoSProfile(depth=1)
        self.create_subscription(PoseWithCovarianceStamped,
                                 '/initialpose', self.on_initialpose, qos)
        self.get_logger().info('Listening /initialpose and bridging to Cartographer...')

        # try both bare and namespaced service names
        self.finish_clients = [
            self.create_client(FinishTrajectory, '/finish_trajectory'),
            self.create_client(FinishTrajectory, '/cartographer_node/finish_trajectory'),
        ]
        self.start_clients = [
            self.create_client(StartTrajectory, '/start_trajectory'),
            self.create_client(StartTrajectory, '/cartographer_node/start_trajectory'),
        ]

        self._busy = False

    def _finish_active_trajectories(self):
        """Finish likely-active trajectories (1..9). Ignore errors on non-existing ones."""
        cli = pick_available_client(self, self.finish_clients)
        if cli is None:
            self.get_logger().warn('FinishTrajectory service not available.')
            return
        for tid in range(1, 10):  # 0은 frozen이라 건드리지 않음
            try:
                req = FinishTrajectory.Request()
                req.trajectory_id = tid
                fut = cli.call_async(req)
                rclpy.spin_until_future_complete(self, fut, timeout_sec=2.0)
            except Exception:
                pass
        # 토픽 해제가 실제로 반영되도록 잠깐 대기
        time.sleep(0.8)

    def on_initialpose(self, msg: PoseWithCovarianceStamped):
        if self._busy:
            self.get_logger().warn('Bridge is busy; ignoring pose.')
            return
        self._busy = True
        try:
            cfg_dir  = self.get_parameter('config_dir').get_parameter_value().string_value
            cfg_base = self.get_parameter('config_basename').get_parameter_value().string_value
            rel_id   = int(self.get_parameter('relative_to_trajectory_id').get_parameter_value().integer_value)
            auto_fin = self.get_parameter('auto_finish_active').get_parameter_value().bool_value

            # 1) 이전 활성 trajectory 종료
            if auto_fin:
                self._finish_active_trajectories()

            # 2) 새 trajectory 시작 (frozen=0 기준으로 초기포즈 적용)
            start_cli = pick_available_client(self, self.start_clients)
            if start_cli is None:
                self.get_logger().error('StartTrajectory service not available.')
                return

            req = StartTrajectory.Request()
            req.configuration_directory = cfg_dir
            req.configuration_basename  = cfg_base
            req.use_initial_pose = True
            req.initial_pose = Pose()
            req.initial_pose.position = msg.pose.pose.position
            req.initial_pose.orientation = msg.pose.pose.orientation
            req.relative_to_trajectory_id = rel_id

            self.get_logger().info(
                f'StartTrajectory: cfg=({cfg_dir}, {cfg_base}), '
                f'pose=({req.initial_pose.position.x:.3f},{req.initial_pose.position.y:.3f}), '
                f'rel_id={rel_id}'
            )

            fut = start_cli.call_async(req)
            rclpy.spin_until_future_complete(self, fut, timeout_sec=3.0)
            if fut.result() is not None:
                self.get_logger().info('StartTrajectory OK.')
            else:
                self.get_logger().error(f'StartTrajectory failed: {fut.exception()}')

        finally:
            self._busy = False

def main():
    rclpy.init()
    node = InitialposeBridge()
    try:
        rclpy.spin(node)
    finally:
        node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()

