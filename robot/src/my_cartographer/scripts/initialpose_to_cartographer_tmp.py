#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
from rclpy.qos import QoSProfile
from geometry_msgs.msg import PoseWithCovarianceStamped
from geometry_msgs.msg import Pose
from cartographer_ros_msgs.srv import StartTrajectory, FinishTrajectory

def pick_available_client(node, clients, timeout=0.2, retries=20):
    for _ in range(retries):
        for c in clients:
            if c.wait_for_service(timeout_sec=timeout):
                return c
    return None

class InitialposeBridge(Node):
    def __init__(self):
        super().__init__('initialpose_to_cartographer')

        # --- params from launch ---
        self.declare_parameter('config_dir', '')
        self.declare_parameter('config_basename', 'my_robot_localization.lua')
        self.declare_parameter('relative_to_trajectory_id', 0)
        self.declare_parameter('auto_finish_active', True)

        # --- subscribe /initialpose ---
        qos = QoSProfile(depth=1)  # reliable / volatile 기본
        self.create_subscription(PoseWithCovarianceStamped, '/initialpose',
                                 self.on_initialpose, qos)
        self.get_logger().info('Listening /initialpose and bridging to Cartographer...')

        # try both bare and namespaced service names
        self.finish_clients = [
            self.create_client(FinishTrajectory, '/finish_trajectory'),
            self.create_client(FinishTrajectory, '/cartographer_node/finish_trajectory')
        ]
        self.start_clients = [
            self.create_client(StartTrajectory, '/start_trajectory'),
            self.create_client(StartTrajectory, '/cartographer_node/start_trajectory')
        ]

    def on_initialpose(self, msg: PoseWithCovarianceStamped):
        cfg_dir  = self.get_parameter('config_dir').get_parameter_value().string_value
        cfg_base = self.get_parameter('config_basename').get_parameter_value().string_value
        rel_id   = self.get_parameter('relative_to_trajectory_id').get_parameter_value().integer_value
        auto_fin = self.get_parameter('auto_finish_active').get_parameter_value().bool_value

        # pick available services
        finish_cli = pick_available_client(self, self.finish_clients)
        start_cli  = pick_available_client(self, self.start_clients)
        if start_cli is None:
            self.get_logger().error('StartTrajectory service not available.')
            return

        # (optional) try to finish a couple of likely active trajectories (0/1), ignore failures
        if auto_fin and finish_cli is not None:
            for tid in (rel_id, 0, 1):
                try:
                    req_f = FinishTrajectory.Request()
                    req_f.trajectory_id = int(tid)
                    future = finish_cli.call_async(req_f)
                    rclpy.spin_until_future_complete(self, future, timeout_sec=0.5)
                except Exception as e:
                    pass  # ignore

        # build start request using the pose from /initialpose
        req = StartTrajectory.Request()
        req.configuration_directory = cfg_dir
        req.configuration_basename  = cfg_base
        req.use_initial_pose = True

        p = Pose()
        p.position = msg.pose.pose.position
        p.orientation = msg.pose.pose.orientation  # 그대로 사용 (z,w 포함)
        req.initial_pose = p
        req.relative_to_trajectory_id = int(rel_id)

        self.get_logger().info(
            f'StartTrajectory: cfg=({cfg_dir}, {cfg_base}), '
            f'pose=({p.position.x:.3f},{p.position.y:.3f}), rel_id={rel_id}'
        )

        future = start_cli.call_async(req)
        rclpy.spin_until_future_complete(self, future, timeout_sec=2.0)
        if future.result() is not None:
            self.get_logger().info('StartTrajectory request sent.')
        else:
            self.get_logger().error(f'StartTrajectory failed: {future.exception()}')

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

