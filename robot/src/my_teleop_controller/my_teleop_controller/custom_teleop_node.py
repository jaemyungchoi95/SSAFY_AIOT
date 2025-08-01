import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist
import sys
import select
import termios
import tty

class CustomTeleopNode(Node):
    def __init__(self):
        super().__init__('custom_teleop_node')
        self.publisher_ = self.create_publisher(Twist, '/cmd_vel', 10)

        self.linear_speed = 0.3
        self.angular_speed = 0.8

        self.settings = None

        self.get_logger().info('Custom teleop node started. Use W, A, S, D keys.')
        self.get_logger().info('Press W/S for linear motion, A/D for angular motion.')
        self.get_logger().info('Release key to stop immediately.')
        self.get_logger().info('CTRL-C to quit.')
        self.get_logger().info(f'Linear speed: {self.linear_speed} m/s, Angular speed: {self.angular_speed} rad/s')

        self.save_terminal_settings()
        self.set_terminal_raw()

        self.twist = Twist()
        self.twist.linear.x = 0.0
        self.twist.angular.z = 0.0

        # 주기적으로 Twist 메시지를 발행하는 타이머 유지 (여전히 필요)
        # 키 입력이 없을 때도 이전에 발행한 명령을 유지하는 역할
        self.timer = self.create_timer(0.05, self.publish_twist) # 발행 주기를 더 빠르게 (20ms)

    def save_terminal_settings(self):
        self.settings = termios.tcgetattr(sys.stdin)

    def set_terminal_raw(self):
        tty.setraw(sys.stdin.fileno())

    def restore_terminal_settings(self):
        if self.settings:
            termios.tcsetattr(sys.stdin, termios.TCSADRAIN, self.settings)

    def read_key(self, timeout=0.01): # 키 읽기 타임아웃을 더 짧게 (10ms)
        """논블로킹 방식으로 키 입력을 읽습니다."""
        if select.select([sys.stdin], [], [], timeout)[0]:
            return sys.stdin.read(1)
        return None

    def publish_twist(self):
        """현재 Twist 메시지를 발행합니다."""
        self.publisher_.publish(self.twist)
        # 정지 명령이 발행될 때만 특별히 로그를 남깁니다.
        if self.twist.linear.x == 0.0 and self.twist.angular.z == 0.0:
            self.get_logger().info('Publishing STOP Twist: linear.x=0.0, angular.z=0.0')
        # else:
            # self.get_logger().info(f'Publishing Twist: linear.x={self.twist.linear.x}, angular.z={self.twist.angular.z}') # 필요 시 활성화

    def run(self):
        try:
            while rclpy.ok():
                key = self.read_key()

                # 새로운 Twist 메시지 생성
                new_linear_x = 0.0
                new_angular_z = 0.0

                if key is not None:
                    if key == '\x03': # Ctrl+C
                        self.get_logger().info('CTRL-C pressed. Shutting down.')
                        break
                    
                    if key == 'w' or key == 'W':
                        new_linear_x = self.linear_speed
                    elif key == 's' or key == 'S':
                        new_linear_x = -self.linear_speed
                    elif key == 'a' or key == 'A':
                        new_angular_z = self.angular_speed
                    elif key == 'd' or key == 'D':
                        new_angular_z = -self.angular_speed
                    
                    # ⭐ 이 줄이 수정되었습니다: self.get_logger().info로 변경
                    self.get_logger().info(f'Key pressed: "{key}", Setting Twist: linear.x={new_linear_x}, angular.z={new_angular_z}')
                
                # 키 입력이 없으면 (None 반환) Twist 값을 0으로 설정하여 정지
                # 중요한 부분: read_key가 None을 반환하면 자동으로 멈추도록 함
                self.twist.linear.x = new_linear_x
                self.twist.angular.z = new_angular_z

                rclpy.spin_once(self, timeout_sec=0.001) # ROS2 콜백 처리 (타이머 등)

        except Exception as e:
            self.get_logger().error(f"Error in teleop loop: {e}")
        finally:
            self.get_logger().info('Stopping custom teleop node.')
            self.restore_terminal_settings()
            # 종료 시 즉시 로봇 정지 명령 발행
            self.twist.linear.x = 0.0
            self.twist.angular.z = 0.0
            self.publisher_.publish(self.twist)
            self.destroy_node()

def main(args=None):
    rclpy.init(args=args)
    node = CustomTeleopNode()
    try:
        node.run()
    except KeyboardInterrupt:
        node.get_logger().info("KeyboardInterrupt detected. Shutting down.")
    finally:
        rclpy.shutdown()

if __name__ == '__main__':
    main()

