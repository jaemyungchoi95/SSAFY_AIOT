# 파일 이름: check_imu.launch.py

import os
from launch import LaunchDescription
from launch_ros.actions import Node
from ament_index_python.packages import get_package_share_directory

def generate_launch_description():
    pkg_share       = get_package_share_directory('my_cartographer')
    urdf_path       = os.path.join(pkg_share, 'urdf', 'my_robot.urdf')
    imu_yaml        = os.path.join(pkg_share, 'config', 'imu.yaml')
    
    # RViz 설정 파일 경로. 이 파일이 없으면 RViz가 기본 설정으로 열립니다.
    rviz_config_file = os.path.join(pkg_share, 'rviz', 'imu_test.rviz')

    # 1. Robot State Publisher (URDF의 TF 발행용)
    robot_state_publisher_node = Node(
        package='robot_state_publisher',
        executable='robot_state_publisher',
        parameters=[{'robot_description': open(urdf_path).read(), 'use_sim_time': False}]
    )

    # 2. MPU6050 IMU Driver (원본 토픽을 /imu/data_raw로 발행)
    imu_node = Node(
        package='mpu6050driver',
        executable='mpu6050driver',
        name='mpu6050driver', # yaml 파일과 이름 일치
        parameters=[imu_yaml],
        remappings=[('/imu', '/imu/data_raw')] 
    )
    
    # 3. IMU Filter (Madgwick 필터)
    imu_filter_node = Node(
        package='imu_filter_madgwick',
        executable='imu_filter_madgwick_node',
        name='imu_filter',
        parameters=[{'use_mag': False, 'publish_tf': False}],
        remappings=[('/imu/data_raw', '/imu/data_raw'),
                    ('/imu/data', '/imu/data_filtered')]
    )

    # 4. RViz 실행
    rviz_node = Node(
        package='rviz2',
        executable='rviz2',
        name='rviz2',
        arguments=['-d', rviz_config_file],
        output='screen'
    )

    return LaunchDescription([
        robot_state_publisher_node,
        imu_node,
        imu_filter_node,
        rviz_node,
    ])
