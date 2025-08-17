# hardware_controller.py

import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Imu
from geometry_msgs.msg import Twist
import board
import busio
import adafruit_mpu6050
from adafruit_pca9685 import PCA9685
from adafruit_motor import motor

class HardwareController(Node):
    def __init__(self):
        super().__init__('hardware_controller')

        # --- I2C 장치 초기화 ---
        try:
            # I2C 버스를 한 번만 엽니다.
            self.i2c = busio.I2C(board.SCL, board.SDA)
            # I2C 버스를 공유하여 두 장치를 초기화합니다.
            self.mpu = adafruit_mpu6050.MPU6050(self.i2c)
            self.pca = PCA9685(self.i2c)
            self.pca.frequency = 1000 # 모터 컨트롤러의 PWM 주파수 설정
            self.get_logger().info('I2C 장치 초기화 성공 (IMU, Motor Controller)')
        except Exception as e:
            self.get_logger().error(f'I2C 장치 초기화 실패: {e}')
            rclpy.shutdown()
            return

        # --- 모터 설정 (PCA9685 채널에 맞게 수정) ---
        # 예시: 왼쪽 모터는 채널 0, 1 / 오른쪽 모터는 채널 2, 3
        self.motor_left = motor.DCMotor(self.pca.channels[0], self.pca.channels[1])
        self.motor_right = motor.DCMotor(self.pca.channels[2], self.pca.channels[3])

        # --- ROS 퍼블리셔 및 서브스크라이버 ---
        self.imu_publisher = self.create_publisher(Imu, '/imu/data_raw', 10)
        self.cmd_vel_subscriber = self.create_subscription(
            Twist,
            '/cmd_vel',
            self.cmd_vel_callback,
            10)

        # 100Hz (0.01초) 주기로 IMU 데이터를 읽고 발행합니다.
        self.timer = self.create_timer(0.01, self.publish_imu_data)
        self.get_logger().info('하드웨어 컨트롤러 노드가 시작되었습니다.')

    def publish_imu_data(self):
        imu_msg = Imu()
        imu_msg.header.stamp = self.get_clock().now().to_msg()
        imu_msg.header.frame_id = 'imu_link' # URDF와 일치하는 프레임 ID 사용

        # adafruit 라이브러리는 라디안/초 단위로 값을 제공합니다.
        imu_msg.angular_velocity.x = self.mpu.gyro[0]
        imu_msg.angular_velocity.y = self.mpu.gyro[1]
        imu_msg.angular_velocity.z = self.mpu.gyro[2]

        imu_msg.linear_acceleration.x = self.mpu.acceleration[0]
        imu_msg.linear_acceleration.y = self.mpu.acceleration[1]
        imu_msg.linear_acceleration.z = self.mpu.acceleration[2]

        imu_msg.orientation_covariance[0] = -1.0

        self.imu_publisher.publish(imu_msg)

    def cmd_vel_callback(self, msg):
        # /cmd_vel 메시지를 실제 모터 제어 신호로 변환합니다.
        # 이 부분은 로봇의 실제 구동 방식(예: 차동 구동)에 맞게 수정해야 합니다.
        linear_x = msg.linear.x   # 직진 속도
        angular_z = msg.angular.z # 회전 속도

        # 간단한 차동 구동 모델 예시
        left_speed = linear_x - angular_z
        right_speed = linear_x + angular_z

        # 속도 값을 모터가 이해하는 [-1.0, 1.0] 범위로 제한
        self.motor_left.throttle = max(min(left_speed, 1.0), -1.0)
        self.motor_right.throttle = max(min(right_speed, 1.0), -1.0)

def main(args=None):
    rclpy.init(args=args)
    node = HardwareController()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
