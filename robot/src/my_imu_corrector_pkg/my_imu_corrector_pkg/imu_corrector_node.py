# imu_corrector_node.py 예시 코드
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Imu

class ImuCorrector(Node):
    def __init__(self):
        super().__init__('imu_corrector')
        self.subscription = self.create_subscription(
            Imu,
            '/imu',  # 원본 IMU 토픽 구독
            self.imu_callback,
            10)
        self.publisher_ = self.create_publisher(Imu, '/imu/calibrated', 10)
        
        # 10000개 샘플로 얻은 바이어스 값
        self.accel_bias = [0.004219, -0.003826, -0.002196]
        self.gyro_bias = [0.076709, 0.051333, 0.008869]

    def imu_callback(self, msg):
        calibrated_msg = Imu()
        calibrated_msg.header = msg.header
        
        # 선형 가속도 보정
        calibrated_msg.linear_acceleration.x = msg.linear_acceleration.x - self.accel_bias[0]
        calibrated_msg.linear_acceleration.y = msg.linear_acceleration.y - self.accel_bias[1]
        calibrated_msg.linear_acceleration.z = msg.linear_acceleration.z - self.accel_bias[2]
        
        # 각속도 보정
        calibrated_msg.angular_velocity.x = msg.angular_velocity.x - self.gyro_bias[0]
        calibrated_msg.angular_velocity.y = msg.angular_velocity.y - self.gyro_bias[1]
        calibrated_msg.angular_velocity.z = msg.angular_velocity.z - self.gyro_bias[2]

        # 나머지 데이터(orientation, covariance)는 그대로 전달
        calibrated_msg.orientation = msg.orientation
        calibrated_msg.orientation_covariance = msg.orientation_covariance
        calibrated_msg.angular_velocity_covariance = msg.angular_velocity_covariance
        calibrated_msg.linear_acceleration_covariance = msg.linear_acceleration_covariance
        
        self.publisher_.publish(calibrated_msg)

def main(args=None):
    rclpy.init(args=args)
    imu_corrector = ImuCorrector()
    rclpy.spin(imu_corrector)
    imu_corrector.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
