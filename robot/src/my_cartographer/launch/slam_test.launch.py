# 파일 이름: slam_test.launch.py

import os
from launch import LaunchDescription
from launch_ros.actions import Node
from ament_index_python.packages import get_package_share_directory

def generate_launch_description():
    pkg_share       = get_package_share_directory('my_cartographer')
    urdf_file_name  = 'my_robot.urdf'
    urdf_path       = os.path.join(pkg_share, 'urdf', urdf_file_name)
    lua_dir         = os.path.join(pkg_share, 'config')
    carto_lua_path  = os.path.join(lua_dir, 'my_robot.lua')
    ydlidar_yaml    = os.path.join(pkg_share, 'config', 'ydlidar.yaml')
    rviz_config     = os.path.join(pkg_share, 'rviz', 'cartographer_config.rviz')
    imu_yaml        = os.path.join(pkg_share, 'config', 'imu.yaml')

    # 1. Robot State Publisher (URDF 기반 TF 발행)
    robot_state_publisher_node = Node(
        package='robot_state_publisher',
        executable='robot_state_publisher',
        parameters=[{'robot_description': open(urdf_path).read(), 'use_sim_time': False}]
    )

    # 2. YDLIDAR Driver
    ydlidar_node = Node(
        package='ydlidar_ros2_driver',
        executable='ydlidar_ros2_driver_node',
        parameters=[ydlidar_yaml],
    )

    # 3. MPU6050 IMU Driver (원본 토픽을 /imu_raw로 리매핑)
    imu_node = Node(
        package='mpu6050driver',
        executable='mpu6050driver',
        parameters=[imu_yaml],
        remappings=[('/imu', '/imu/data_raw')]
    )
    
    # 4. IMU Filter (핵심!)
    imu_filter_node = Node(
        package='imu_filter_madgwick',
        executable='imu_filter_madgwick_node',
        name='imu_filter',
        parameters=[{'use_mag': False, 
                     'publish_tf': False}],
                    
        remappings=[('/imu/data_raw', '/imu/data_raw'),     # 필터 입력
                    ('/imu/data', '/imu')]    # 필터 출력
    )

    # 5. Cartographer
    cartographer_node = Node(
        package='cartographer_ros',
        executable='cartographer_node',
        arguments=[
            '-configuration_directory', lua_dir,
            '-configuration_basename', 'my_robot.lua'
        ],
        # remappings=[('/imu', '/imu')]
    )

    # 6. Occupancy Grid
    occupancy_grid_node = Node(
        package='cartographer_ros',
        executable='cartographer_occupancy_grid_node',
        parameters=[{'use_sim_time': False}],
    )

    # 7. RViz
    rviz_node = Node(
        package='rviz2',
        executable='rviz2',
        arguments=['-d', rviz_config],
    )

    # 8. Motor Control Node
    motor_controller_node = Node(
            package='motor_controller',
            executable='motor_node',
            name='robot_motor_controller', # rqt_graph에서 이 이름으로 노드가 보여야 합니다.
            output='screen'
    )

    return LaunchDescription([
        robot_state_publisher_node,
        ydlidar_node,
        # imu_node,
        # imu_filter_node,
        cartographer_node,
        occupancy_grid_node,
        rviz_node,
        motor_controller_node,
    ])
