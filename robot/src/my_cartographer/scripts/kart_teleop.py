#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist
from pynput import keyboard
import threading

# 속도 설정
LINEAR_SPEED = 0.2  # m/s
ANGULAR_SPEED = 0.5  # rad/s

class KartTeleop(Node):
    def __init__(self):
        super().__init__('kart_teleop')
        self.publisher_ = self.create_publisher(Twist, 'cmd_vel', 10)
        self.keys_pressed = set()
        self.lock = threading.Lock()
        self.get_logger().info("KartRider-style Teleop Node Started. Use WASD keys to drive.")
        self.get_logger().info("Press 'esc' to exit.")

    def update_twist(self):
        twist_msg = Twist()
        with self.lock:
            if keyboard.Key.esc in self.keys_pressed:
                rclpy.shutdown()
                return

            if 'w' in self.keys_pressed:
                twist_msg.linear.x = LINEAR_SPEED
            elif 's' in self.keys_pressed:
                twist_msg.linear.x = -LINEAR_SPEED

            if 'a' in self.keys_pressed:
                twist_msg.angular.z = ANGULAR_SPEED
            elif 'd' in self.keys_pressed:
                twist_msg.angular.z = -ANGULAR_SPEED
        
        self.publisher_.publish(twist_msg)

    def on_press(self, key):
        try:
            key_char = key.char
        except AttributeError:
            key_char = key  # 특수 키의 경우

        with self.lock:
            self.keys_pressed.add(key_char)
        self.update_twist()

    def on_release(self, key):
        try:
            key_char = key.char
        except AttributeError:
            key_char = key

        with self.lock:
            if key_char in self.keys_pressed:
                self.keys_pressed.remove(key_char)
        
        # ESC 키를 떼면 종료
        if key == keyboard.Key.esc:
            return False

        self.update_twist()

def main(args=None):
    rclpy.init(args=args)
    teleop_node = KartTeleop()
    
    # 키보드 리스너를 별도 스레드에서 실행
    listener = keyboard.Listener(on_press=teleop_node.on_press, on_release=teleop_node.on_release)
    listener.start()

    # 노드가 종료될 때까지 대기
    listener.join()

    teleop_node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
