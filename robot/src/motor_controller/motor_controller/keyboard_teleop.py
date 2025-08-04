#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist
import sys, tty, termios, threading, time

class KeyboardTeleop(Node):
    def __init__(self):
        super().__init__('keyboard_teleop')
        self.publisher = self.create_publisher(Twist, '/cmd_vel', 10)

        self.linear_speed = 0.0
        self.angular_speed = 0.0

        self.max_speed = 0.2
        self.step = 0.1

        self.running = True

        self.get_logger().info("키보드 조작 시작! (WASD 이동, SPACE 정지, Q 종료)")

        # 스레드 시작
        self.key_thread = threading.Thread(target=self.key_loop)
        self.key_thread.daemon = True
        self.key_thread.start()

        # 메시지 publish 루프
        self.timer = self.create_timer(0.1, self.publish_cmd)

    def get_key(self):
        fd = sys.stdin.fileno()
        old_settings = termios.tcgetattr(fd)
        try:
            tty.setraw(fd)
            key = sys.stdin.read(1)
        finally:
            termios.tcsetattr(fd, termios.TCSADRAIN, old_settings)
        return key

    def key_loop(self):
        while self.running:
            key = self.get_key()
            if key == 'w':
                self.linear_speed = min(self.linear_speed + self.step, self.max_speed)
            elif key == 's':
                self.linear_speed = max(self.linear_speed - self.step, -self.max_speed)
            elif key == 'a':
                self.angular_speed = max(self.angular_speed - self.step, -self.max_speed)
            elif key == 'd':
                self.angular_speed = min(self.angular_speed + self.step, self.max_speed)
            elif key == ' ':
                self.linear_speed = 0.0
                self.angular_speed = 0.0
            elif key == 'q':
                self.get_logger().info("종료합니다.")
                self.running = False
                break

    def publish_cmd(self):
        if not self.running:
            rclpy.shutdown()
            return
        twist = Twist()
        twist.linear.x = self.linear_speed
        twist.angular.z = self.angular_speed
        self.publisher.publish(twist)
        #if abs(self.linear_speed) > 1e-3 or abs(self.angular_speed) > 1e-3:
            #lin_sign = "+" if self.linear_speed > 0 else "-" if self.linear_speed < 0 else " "
            #ang_sign = "+" if self.angular_speed > 0 else "-" if self.angular_speed < 0 else " "

            #self.get_logger().info(
                #f"🚀 [움직임 감지] 쓰로틀: {lin_sign}{abs(self.linear_speed):.2f} | 조향: {ang_sign}{abs(self.angular_speed):.2f}"
            #)   


def main(args=None):
    rclpy.init(args=args)
    node = KeyboardTeleop()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()

