import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist

from adafruit_pca9685 import PCA9685
from adafruit_servokit import ServoKit
import board
import busio
import time

class PWMThrottleHat:
    def __init__(self, pwm, channel):
        self.pwm = pwm
        self.channel = channel
        self.pwm.frequency = 60

    def set_throttle(self, throttle):
        pulse = int(0xFFFF * abs(throttle))
        if throttle < 0:
            self.pwm.channels[self.channel + 5].duty_cycle = pulse
            self.pwm.channels[self.channel + 4].duty_cycle = 0
            self.pwm.channels[self.channel + 3].duty_cycle = 0xFFFF
        elif throttle > 0:
            self.pwm.channels[self.channel + 5].duty_cycle = pulse
            self.pwm.channels[self.channel + 4].duty_cycle = 0xFFFF
            self.pwm.channels[self.channel + 3].duty_cycle = 0
        else:
            self.pwm.channels[self.channel + 5].duty_cycle = 0
            self.pwm.channels[self.channel + 4].duty_cycle = 0
            self.pwm.channels[self.channel + 3].duty_cycle = 0

class MotorControlNode(Node):
    def __init__(self):
        super().__init__('motor_control_node')

        i2c = busio.I2C(board.SCL, board.SDA)
        self.pca = PCA9685(i2c)
        self.pca.frequency = 60
        self.motor_hat = PWMThrottleHat(self.pca, channel=0)
        self.kit = ServoKit(channels=16, i2c=i2c, address=0x60)
        self.pan = 100.0
        self.pan_gain = 5.0

        self.speed = 0.0
        self.turn = 0.0

        self.speed_step = 0.05
        self.speed_max = 1.0
        self.speed_min = -1.0

        self.kit.servo[0].angle = self.pan

        self.subscription = self.create_subscription(
            Twist,
            '/cmd_vel',
            self.listener_callback,
            10
        )
        self.get_logger().info('Motor control node started.')

    def listener_callback(self, msg):
        linear_cmd = msg.linear.x
        angular_cmd = msg.angular.z

        # Set motor throttle
        self.speed += linear_cmd * 0.2
        self.speed = max(-1.0, min(1.0, self.speed))
        
        self.motor_hat.set_throttle(self.speed)

        # Set servo angle
        self.pan += angular_cmd * 5.0  # scale angular -1.0~1.0 to 45 degree left/right
        self.pan = max(20, min(180, self.pan))
        
        self.kit.servo[0].angle = self.pan

        self.get_logger().info(
            f'🔧 현재 상태 - 쓰로틀: {self.speed:.2f}, 조향각: {self.pan:.1f}도'
        )


    def destroy_node(self):
        self.motor_hat.set_throttle(0)
        self.kit.servo[0].angle = 100
        self.pca.deinit()
        super().destroy_node()
        print("Shutdown complete. Motor stopped.")

def main(args=None):
    rclpy.init(args=args)
    node = MotorControlNode()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()

