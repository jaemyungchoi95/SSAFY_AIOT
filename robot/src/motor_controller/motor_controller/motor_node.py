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

        # --- 수정된 부분 2: I2C 버스 번호를 7번으로 명시적 지정 ---
        self.get_logger().info('I2C 버스 7번을 초기화합니다...')
        i2c = busio.I2C(board.SCL, board.SDA)
        
        self.pca = PCA9685(i2c, address=0x40)
        self.pca.frequency = 60
        self.motor_hat = PWMThrottleHat(self.pca, channel=0)
        self.kit = ServoKit(channels=16, i2c=i2c, address=0x60)
        
        self.steering_gain = 35.0
        self.pan = 100.0


        # self.pan_gain = 5.0

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
        self.get_logger().info('모터 제어 노드가 시작되었습니다. /cmd_vel 토픽을 기다립니다.')


    def listener_callback(self, msg):
        linear_x = msg.linear.x
        angular_z = msg.angular.z
        final_throttle = linear_x * 2.0
        boost_factor = 2 
        
        if abs(angular_z) > 0.1 and linear_x > 0:
            final_throttle = linear_x * boost_factor
            self.get_logger().info(f"회전 부스트 적용! 원본: {linear_x:.2f} -> 증폭: {final_throttle:.2f}")

        throttle = max(self.speed_min, min(self.speed_max, final_throttle))
        #throttle = 0.7
        self.motor_hat.set_throttle(throttle)

        # 조향각 계산 (중앙 100도 기준, angular.z 값에 따라 조절)
        # 45.0 값은 최대 회전 각도를 결정하므로, 로봇에 맞게 조절하세요.
        steering_angle = 100.0 - (msg.angular.z * self.steering_gain) 
        
        self.pan = max(0, min(160, steering_angle))
        self.kit.servo[0].angle = self.pan

        self.get_logger().info(
            f'수신: [속도:{msg.linear.x:.2f}, 회전:{msg.angular.z:.2f}] -> 제어: [스로틀:{throttle:.2f}, 조향각:{self.pan:.1f}도]'
        )

    def destroy_node(self):
        # 노드 종료 시 모터를 정지하고 PCA 장치를 해제합니다.
        if hasattr(self, 'motor_hat'):
            self.motor_hat.set_throttle(0)
            self.kit.servo[0].angle = 100.0
            self.pca.deinit()
            self.get_logger().info("모터 정지 및 PCA 장치 해제 완료.")
        super().destroy_node()

def main(args=None):
    rclpy.init(args=args)
    node = MotorControlNode()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        # 노드가 정상적으로 종료될 수 있도록 destroy_node 호출
        if rclpy.ok():
            node.destroy_node()
            rclpy.shutdown()

if __name__ == '__main__':
    main()
