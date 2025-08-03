import rclpy
from rclpy.node import Node
from nav_msgs.msg import OccupancyGrid
import time
import os
import yaml
from PIL import Image # Pillow 라이브러리 (pip install Pillow)
import boto3
from botocore.exceptions import NoCredentialsError, ClientError

class MapUploaderNode(Node):
    def __init__(self):
        super().__init__('map_uploader_node')
        self.declare_parameter('map_topic', '/map')
        self.declare_parameter('s3_bucket_name', 'your-s3-bucket-name') # TODO: S3 버킷 이름 설정
        self.declare_parameter('upload_interval_sec', 600.0) # 10분 (600초)
        self.declare_parameter('map_save_path', '/tmp/maps') # TODO: 지도를 임시 저장할 경로 설정

        self.map_topic = self.get_parameter('map_topic').get_parameter_value().string_value
        self.s3_bucket_name = self.get_parameter('s3_bucket_name').get_parameter_value().string_value
        self.upload_interval_sec = self.get_parameter('upload_interval_sec').get_parameter_value().double_value
        self.map_save_path = self.get_parameter('map_save_path').get_parameter_value().string_value

        # Ensure the save directory exists
        os.makedirs(self.map_save_path, exist_ok=True)

        self.subscription = self.create_subscription(
            OccupancyGrid,
            self.map_topic,
            self.map_callback,
            10 # QoS depth
        )
        self.current_map = None
        self.get_logger().info(f'Subscribing to {self.map_topic} topic.')

        # Create a timer to periodically upload the map
        self.timer = self.create_timer(self.upload_interval_sec, self.upload_map_timer_callback)
        self.get_logger().info(f'Map uploader node started. Uploading map every {self.upload_interval_sec} seconds to S3 bucket: {self.s3_bucket_name}.')

        try:
            self.s3_client = boto3.client('s3')
            self.get_logger().info("AWS S3 client initialized.")
        except NoCredentialsError:
            self.get_logger().error("AWS credentials not found. Please configure AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables or IAM role.")
            self.s3_client = None
        except Exception as e:
            self.get_logger().error(f"Error initializing S3 client: {e}")
            self.s3_client = None

    def map_callback(self, msg):
        self.current_map = msg
        # self.get_logger().info("Received a new map message.")
    
    def save_map_to_files(self, map_data, timestamp_str):
        if map_data is None:
            self.get_logger().warn("No map received yet. Skipping map save operation.")
            return None, None

        self.get_logger().info(f"Map data info: width={map_data.info.width}, height={map_data.info.height}, resolution={map_data.info.resolution}")

        sample_step = (len(map_data.data) // 200) + 1
        sample_data = map_data.data[::sample_step]

        self.get_logger().info(f"Sample map data values (first 100 and a few samples): {list(map_data.data[:100])} ... sampled: {list(sample_data)}")

        # 맵 데이터에 포함된 고유한 값들을 확인합니다.
        unique_values = set(map_data.data)
        self.get_logger().info(f"Unique values in map data: {sorted(list(unique_values))}")
        robot_id = 1
        map_name = f"{robot_id}_map_{timestamp_str}"
        pgm_filepath = os.path.join(self.map_save_path, f"{map_name}.pgm")
        yaml_filepath = os.path.join(self.map_save_path, f"{map_name}.yaml")

        # --- 아래부터 새로운 PGM 이미지 생성 및 저장 로직으로 교체합니다 ---
        # 기존:
        # Save PGM file
        # width = map_data.info.width
        # height = map_data.info.height
        # data = map_data.data
        # ... (이하 img.save(pgm_filepath)까지 모든 줄을 삭제)

        # 새로운 코드:
        img = Image.new('L', (map_data.info.width, map_data.info.height))
        pixels = img.load() # 픽셀을 직접 조작하기 위해 load() 사용

        for y in range(map_data.info.height):
            for x in range(map_data.info.width):
                map_idx = y * map_data.info.width + x # ROS Map 데이터는 행 우선 (row-major)
                occupancy_value = map_data.data[map_idx]

                pixel_value = 0 # 기본값은 검정

                if occupancy_value == -1:
                    # Unknown space: gray (205)
                    pixel_value = 205
                elif occupancy_value == 0:
                    # Free space: white (255)
                    pixel_value = 255
                elif occupancy_value > 0 and occupancy_value <= 100:
                    # Occupied space: scale from 0-100 to 255-0 (white to black)
                    # Higher occupancy (closer to 100) should be darker (closer to 0)
                    # Lower occupancy (closer to 0) should be lighter (closer to 255)
                    pixel_value = 255 - int(occupancy_value * 2.55) # 100 -> 0, 0 -> 255
                else:
                    # Any other unexpected value also treated as unknown/black for safety
                    pixel_value = 0

                # PGM은 Y축이 아래로 증가하는 반면, ROS Map은 위로 증가하는 경향이 있으므로 Y축을 뒤집어줍니다.
                pixels[x, map_data.info.height - 1 - y] = pixel_value

        img.save(pgm_filepath)
        self.get_logger().info(f"Map PGM saved to: {pgm_filepath}")
        # --- 새로운 PGM 이미지 생성 및 저장 로직 끝 ---


        # Save YAML file (이 부분은 그대로 두세요)
        yaml_content = {
            'image': f"{map_name}.pgm",
            'resolution': map_data.info.resolution,
            'origin': [map_data.info.origin.position.x,
                       map_data.info.origin.position.y,
                       map_data.info.origin.orientation.z], # Assuming 2D orientation
            'negate': 0,
            'occupied_thresh': 0.65,
            'free_thresh': 0.196
        }
        with open(yaml_filepath, 'w') as yaml_file:
            yaml.dump(yaml_content, yaml_file, default_flow_style=False)
        self.get_logger().info(f"Map YAML saved to: {yaml_filepath}")

        return pgm_filepath, yaml_filepath

    def upload_to_s3(self, file_path):
        if not self.s3_client:
            self.get_logger().error("S3 client not initialized. Cannot upload.")
            return

        file_name = os.path.basename(file_path)
        s3_object_key = f"maps/{file_name}"
        try:
            self.s3_client.upload_file(file_path, self.s3_bucket_name, s3_object_key)
            self.get_logger().info(f"Successfully uploaded {file_name} to s3://{self.s3_bucket_name}/{file_name}")
            return True
        except NoCredentialsError:
            self.get_logger().error("AWS credentials not available. Failed to upload.")
            return False
        except ClientError as e:
            self.get_logger().error(f"Error uploading {file_name} to S3: {e}")
            return False
        except Exception as e:
            self.get_logger().error(f"An unexpected error occurred during S3 upload: {e}")
            return False

    def upload_map_timer_callback(self):
        self.get_logger().info(f"Timer triggered. Attempting to save and upload map...")
        if self.current_map is None:
            self.get_logger().warn("No map data received yet. Skipping upload.")
            return

        timestamp_str = time.strftime("%Y%m%d_%H%M%S")
        pgm_path, yaml_path = self.save_map_to_files(self.current_map, timestamp_str)

        if pgm_path and yaml_path:
            self.upload_to_s3(pgm_path)
            self.upload_to_s3(yaml_path) # Upload both PGM and YAML

def main(args=None):
    rclpy.init(args=args)
    node = MapUploaderNode()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
