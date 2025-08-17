import os
from launch import LaunchDescription
from launch_ros.actions import Node
from ament_index_python.packages import get_package_share_directory
from launch.actions import SetEnvironmentVariable

def generate_launch_description():
    pkg_share        = get_package_share_directory('my_cartographer')
    urdf_path        = os.path.join(pkg_share, 'urdf', 'my_robot.urdf')
    carto_config_dir = os.path.join(pkg_share, 'config')
    carto_lua_file   = 'my_robot.lua'
    ydlidar_yaml     = os.path.join(pkg_share, 'config', 'ydlidar.yaml')
    rviz_config      = os.path.join(pkg_share, 'rviz', 'cartographer_config.rviz')

    robot_state_publisher_node = Node(
        package='robot_state_publisher',
        executable='robot_state_publisher',
        parameters=[{'robot_description': open(urdf_path).read()}]
    )

    ydlidar_node = Node(
        package     ='ydlidar_ros2_driver',
        executable  ='ydlidar_ros2_driver_node',
        name        ='ydlidar_ros2_driver_node',
        parameters=[ydlidar_yaml],
    )
    
    # 원본 IMU 데이터를 '/imu' 토픽으로 발행합니다.
    imu_node = Node(
        package='ros2_mpu6050_driver',
        executable='mpu6050driver',
        name='ros2_mpu6050_driver',
        remappings=[('/imu', '/imu/data_raw')]
    )

    # --- Madgwick 필터 ---
    # '/imu/data_raw'를 입력받아 필터링된 '/imu'를 발행
    imu_filter_node = Node(
        package='imu_filter_madgwick',
        executable='imu_filter_madgwick_node',
        name='imu_filter',
        parameters=[{
            'use_mag': False, 
            'publish_tf': False, 
            'gyro_bias_x': 0.000240,
            'gyro_bias_y': -0.000765,
            'gyro_bias_z': 0.000070,
            }],
        remappings=[('/imu/data_raw', '/imu/data_raw'), ('/imu/data', '/imu')]
    )

    cartographer_node = Node(
        package='cartographer_ros',
        executable='cartographer_node',
        name='cartographer_node',
        output='screen',
        arguments=['-configuration_directory', carto_config_dir, '-configuration_basename', carto_lua_file],
        # --- 수정된 부분 3: Cartographer가 보정된 IMU 토픽을 사용하도록 수정 ---
        remappings=[
            ('/scan', '/scan'),
            ('/imu', '/imu'),
        ]
    )

    occupancy_grid_node = Node(
        package='cartographer_ros',
        executable='cartographer_occupancy_grid_node',
        name='cartographer_occupancy_grid_node',
        output='screen',
        arguments=['-resolution', '0.025', '-publish_period_sec', '0.05']
    )

    # 12. Motor Control Node
    # /cmd_vel Topic으로 Motor Control
    motor_controller_node = Node(
            package='motor_controller',
            executable='motor_node',
            name='robot_motor_controller',
            output='screen'
    )


    rviz_node = Node(
        package='rviz2',
        executable='rviz2',
        name='rviz2',
        arguments=['-d', rviz_config],
        output='screen'
    )

    return LaunchDescription([
        SetEnvironmentVariable(name='BLINKA_I2C_BUSNUM', value='7'),
        robot_state_publisher_node,
        ydlidar_node,
        imu_node,
        imu_filter_node,
        cartographer_node,
        occupancy_grid_node,
        motor_controller_node, # I2C 충돌 문제 해결 전까지 주석 처리 유지
        rviz_node,
    ])
