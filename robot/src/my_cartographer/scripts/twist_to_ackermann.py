#!/usr/bin/env python3
import math, rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist
from std_msgs.msg import Float32

class TwistToAckermann(Node):
    def __init__(self):
        super().__init__("twist_to_ackermann")
        self.declare_parameter("wheelbase", 0.28)
        self.declare_parameter("max_steer_angle", 0.6)  # rad
        self.declare_parameter("max_speed", 0.8)        # m/s
        self.L = float(self.get_parameter("wheelbase").value)
        self.max_delta = float(self.get_parameter("max_steer_angle").value)
        self.max_speed = float(self.get_parameter("max_speed").value)
        self.sub = self.create_subscription(Twist, "/cmd_vel", self.cb, 10)
        self.pub_speed = self.create_publisher(Float32, "/motor/target_speed", 10)
        self.pub_steer = self.create_publisher(Float32, "/steer/target_angle", 10)

    def cb(self, msg: Twist):
        v = max(min(msg.linear.x, self.max_speed), -self.max_speed)
        w = msg.angular.z
        if abs(v) < 1e-3:
            delta = 0.0
        else:
            delta = math.atan(self.L * w / max(abs(v), 1e-3))
            delta = max(min(delta, self.max_delta), -self.max_delta)
        self.pub_speed.publish(Float32(data=v))
        self.pub_steer.publish(Float32(data=delta))

def main():
    rclpy.init()
    rclpy.spin(TwistToAckermann())
    rclpy.shutdown()

if __name__ == "__main__":
    main()

