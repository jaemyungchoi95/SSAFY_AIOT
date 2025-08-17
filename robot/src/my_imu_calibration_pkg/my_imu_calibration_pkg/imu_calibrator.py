import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Imu

class ImuCalibrator(Node):
    def __init__(self):
        super().__init__('imu_calibrator')
        self.subscription = self.create_subscription(
            Imu,
            '/imu',
            self.imu_callback,
            10)
        self.subscription  # prevent unused variable warning
        
        # 누적할 데이터 샘플 개수
        self.sample_count = 10000
        self.current_count = 0
        
        # 누적 변수 초기화
        self.accel_sum = [0.0, 0.0, 0.0]
        self.gyro_sum = [0.0, 0.0, 0.0]
        
        self.get_logger().info(f'IMU 데이터 {self.sample_count}개 수집 시작...')

    def imu_callback(self, msg):
        if self.current_count < self.sample_count:
            # 가속도와 각속도 값 누적
            self.accel_sum[0] += msg.linear_acceleration.x
            self.accel_sum[1] += msg.linear_acceleration.y
            self.accel_sum[2] += msg.linear_acceleration.z
            
            self.gyro_sum[0] += msg.angular_velocity.x
            self.gyro_sum[1] += msg.angular_velocity.y
            self.gyro_sum[2] += msg.angular_velocity.z
            
            self.current_count += 1
            
            if self.current_count == self.sample_count:
                self.calculate_and_print_bias()
                # 캘리브레이션이 완료되면 노드를 종료
                self.destroy_node()
                rclpy.shutdown()

    def calculate_and_print_bias(self):
        # 바이어스 계산 (누적 값을 샘플 개수로 나눔)
        accel_bias = [s / self.sample_count for s in self.accel_sum]
        gyro_bias = [s / self.sample_count for s in self.gyro_sum]
        
        # Z축 가속도 바이어스는 중력 가속도를 빼줘야 함
        # 중력 가속도 g는 대략 9.80665 m/s^2
        accel_bias[2] -= 9.80665 
        
        self.get_logger().info("--- 정적 캘리브레이션 결과 ---")
        self.get_logger().info(f"선형 가속도 바이어스(Bias): x:{accel_bias[0]:.6f}, y:{accel_bias[1]:.6f}, z:{accel_bias[2]:.6f}")
        self.get_logger().info(f"각속도 바이어스(Bias): x:{gyro_bias[0]:.6f}, y:{gyro_bias[1]:.6f}, z:{gyro_bias[2]:.6f}")
        self.get_logger().info("-----------------------------")

def main(args=None):
    rclpy.init(args=args)
    calibrator = ImuCalibrator()
    rclpy.spin(calibrator)

if __name__ == '__main__':
    main()
