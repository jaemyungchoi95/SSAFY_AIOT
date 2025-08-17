import os
from ament_index_python.packages import get_package_share_directory
from launch import LaunchDescription
from launch.actions import IncludeLaunchDescription
from launch.launch_description_sources import PythonLaunchDescriptionSource
from launch_ros.actions import Node

def generate_launch_description():
    pkg_share = get_package_share_directory('my_cartographer')
    nav2_bringup_dir = get_package_share_directory('nav2_bringup')
    
    # 설정 파일 경로들
    urdf_path = os.path.join(pkg_share, 'urdf', 'my_robot.urdf')
    carto_config_dir = os.path.join(pkg_share, 'config')
    carto_lua_filename = 'my_robot.lua'
    nav2_params_file = os.path.join(pkg_share, 'config', 'nav2_params.yaml')
    rviz_config_file = os.path.join(pkg_share, 'rviz', 'cartographer_config.rviz')
    ydlidar_yaml = os.path.join(pkg_share, 'config', 'ydlidar.yaml')
    imu_yaml = os.path.join(pkg_share, 'config', 'imu.yaml')
    
    use_sim_time = False

    # =================== 실행할 노드 목록 ===================

    # 1. 센서, 모터, 로봇 모델
    robot_state_publisher_node = Node(
        package='robot_state_publisher',
        executable='robot_state_publisher',
        parameters=[{'robot_description': open(urdf_path).read(), 'use_sim_time': use_sim_time}]
    )
    ydlidar_node = Node(
        package='ydlidar_ros2_driver',
        executable='ydlidar_ros2_driver_node',
        parameters=[ydlidar_yaml, {'use_sim_time': use_sim_time}],
    )
    imu_node = Node(
        package='ros2_mpu6050_driver',
        executable='mpu6050driver',
        name='mpu6050driver',
        parameters=[imu_yaml, {'use_sim_time': use_sim_time}],
        remappings=[('/imu', '/imu/data_raw')]
    )
    imu_filter_node = Node(
        package='imu_filter_madgwick',
        executable='imu_filter_madgwick_node',
        name='imu_filter',
        parameters=[{'use_mag': False, 'publish_tf': False, 'use_sim_time': use_sim_time}],
        remappings=[('/imu/data_raw', '/imu/data_raw'), ('/imu/data', '/imu')]
    )
    motor_controller_node = Node(
        package='motor_controller',
        executable='motor_node',
        name='robot_motor_controller',
        parameters=[{'use_sim_time': use_sim_time}]
    )

    # 2. SLAM (Cartographer) - 지도와 위치 추정을 담당
    cartographer_node = Node(
        package='cartographer_ros',
        executable='cartographer_node',
        name='cartographer_node',
        output='screen',
        parameters=[{'use_sim_time': use_sim_time}],
        arguments=['-configuration_directory', carto_config_dir, '-configuration_basename', carto_lua_filename],
        remappings=[('/imu', '/imu')]
    )

    cartographer_occupancy_grid_node = Node(
        package='cartographer_ros',
        executable='cartographer_occupancy_grid_node',
        name='cartographer_occupancy_grid_node',
        output='screen',
        parameters=[{'use_sim_time': use_sim_time}]
    )

    # 3. 자율주행 (Nav2) - 경로 계획과 제어만 담당
    nav2_navigation_node = IncludeLaunchDescription(
        PythonLaunchDescriptionSource(os.path.join(nav2_bringup_dir, 'launch', 'navigation_launch.py')),
        launch_arguments={
            'use_sim_time': 'False',
            'params_file': nav2_params_file
        }.items(),
    )
    
    # 4. 자율 탐색 (Explore-Lite) - Nav2에 목표 지점을 계속 전달
    explore_lite_node = Node(
        package='explore_lite',
        executable='explore',
        name='explore_lite',
        output='screen',
        parameters=[nav2_params_file]
    )

    # 5. RViz
    rviz_node = Node(
        package='rviz2',
        executable='rviz2',
        name='rviz2',
        arguments=['-d', rviz_config_file],
        output='screen'
    )

    return LaunchDescription([
        robot_state_publisher_node,
        ydlidar_node,
        imu_node,
        imu_filter_node,
        motor_controller_node,
        cartographer_node,
        cartographer_occupancy_grid_node,
        nav2_navigation_node,
        explore_lite_node,
        rviz_node
    ])
