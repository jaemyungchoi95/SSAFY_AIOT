import os
from launch import LaunchDescription
from launch_ros.actions import Node
from launch.actions import ExecuteProcess, TimerAction, RegisterEventHandler
from ament_index_python.packages import get_package_share_directory
from launch.event_handlers import OnProcessExit
from launch.actions import IncludeLaunchDescription
from launch.launch_description_sources import PythonLaunchDescriptionSource
import rclpy

def generate_launch_description():
    pkg_share       = get_package_share_directory('my_cartographer')
    nav2_pkg_share  = get_package_share_directory('nav2_bringup')
    urdf_file_name  = 'my_robot.urdf'
    urdf_path       = os.path.join(pkg_share, 'urdf', urdf_file_name)

    lua_dir         = os.path.join(pkg_share, 'config')
    ydlidar_yaml    = os.path.join(pkg_share, 'config', 'ydlidar.yaml')
    imu_yaml        = os.path.join(pkg_share, 'config', 'imu.yaml')
    rviz_config     = os.path.join(pkg_share, 'rviz', 'cartographer_config.rviz')
    camera_yaml     = os.path.join(pkg_share, 'config', 'camera.yaml')
    nav2_launch     = os.path.join(nav2_pkg_share, 'launch', 'navigation_launch.py')
    nav2_params     = os.path.join(pkg_share, 'config', 'nav2_params.yaml')

    map_save_path   = os.path.join(
            os.path.expanduser('~'),
            'ros2_ws', 'maps', 'autonomouse_map'
    )

    # 1. LiDAR Driver
    ydlidar_node = Node(
            package='ydlidar_ros2_driver',
            executable='ydlidar_ros2_driver_node',
            name='ydlidar_ros2_driver_node',
            output='screen',
            parameters=[ydlidar_yaml],
    )

    # 2. USB Camera Driver
    camera_node = Node(
            package='usb_cam',
            executable='usb_cam_node_exe',
            name='usb_cam_node',
            output='screen',
            parameters=[camera_yaml],
            remappings=[  # you can change topic name 
                ('/image_raw',      '/camera/image_raw'),
                ('/camera_info',    '/camera/camera_info'),
            ]
    )

    # 3. IMU Driver
    imu_node = Node(
        package='mpu6050driver',
        executable='mpu6050driver',
        name='mpu6050driver',
        output='screen',
        parameters=[imu_yaml],
    )

    # 이건 이제 움직이려면 사용하면 안 됨
    # 4. TF: odom → base_link
    tf_odom_to_base = ExecuteProcess(
        cmd=[
            'ros2', 'run', 'tf2_ros', 'static_transform_publisher',
            '0', '0', '0',
            '0', '0', '0',
            'odom', 'base_link'
        ],
        output='screen'
    )
    
    # 이건 이제 urdf 에서 관리할 거임
    # 5. TF: base_link → laser_frame
    tf_base_to_laser = ExecuteProcess(
        cmd=[
            'ros2', 'run', 'tf2_ros', 'static_transform_publisher',
            '0', '0', '0.02',
            '0', '0', '0',
            'base_link', 'laser_frame'
        ],
        output='screen'
    )

    # 6. Cartographer SLAM
    carto_node = ExecuteProcess(
        cmd=[
            'ros2', 'run', 'cartographer_ros', 'cartographer_node',
            '-configuration_directory', lua_dir,
            '-configuration_basename', 'my_robot.lua',
        ],
        output='screen'
    )

    # 7. Occupancy Grid Map
    occupancy_node = Node(
        package='cartographer_ros',
        executable='cartographer_occupancy_grid_node',
        name='occupancy_grid_node',
        output='screen',
        parameters=[{'use_sim_time': False}],
    )

    # 8. Rviz2
    rviz_node = Node(
        package='rviz2',
        executable='rviz2',
        name='rviz2',
        output='screen',
        arguments=['-d',rviz_config],
    )

    # 9. SLAM 종료 시 지도 저장
    map_saver = ExecuteProcess(
        cmd=[
            'ros2', 'run', 'nav2_map_server', 'map_saver_cli',
            '-f', map_save_path
        ],
        output='screen'
    )
    save_map_on_exit = RegisterEventHandler(
        OnProcessExit(
            target_action=carto_node,
            on_exit=[ map_saver ]
        )
    )

    


    # 10. Nav2 로봇 상태관리&컨트롤러
    nav2 = IncludeLaunchDescription(
            PythonLaunchDescriptionSource(nav2_launch),
            launch_arguments={
                'map': map_save_path,
                'use_sim_time': 'false',
                'params_file': nav2_params,
                'autostart': 'true'
                }.items(),
    )

    # 11. Frontier 기반 탐사 노드
    explorer = Node(
            package='explore_lite',
            executable='explore',
            name='explore_node',
            output='screen',
            parameters=[nav2_params]
    )

    # 12. Motor Control Node
    # /cmd_vel Topic으로 Motor Control
    motor_controller_node = Node(
            package='motor_controller',
            executable='motor_node',
            name='robot_motor_controller',
            output='screen'
    )

    # 13 Robot State Publisher Node
    robot_state_publisher_node = Node(
        package='robot_state_publisher',
        executable='robot_state_publisher',
        name='robot_state_publisher',
        output='screen',
        parameters=[{'robot_description': open(urdf_path).read()}],
        arguments=[urdf_path]
    )

    # 14. S3 Upload
    map_uploader_node = Node(
        package='map_uploader',
        executable='map_uploader_node',
        name='map_uploader_node',
        output='screen',
        parameters=[
            {'map_topic': '/map'}, # Cartographer의 /map 토픽 사용
            {'s3_bucket_name': 'are-you-hot'},
            {'upload_interval_sec': 600.0}, # 10분
            {'map_save_path': '/tmp/robot_maps'} # 로봇 내부의 임시 저장 경로
        ]
    )

    # 15. Custom Teleop Node
    custom_teleop_node = Node(
            package='my_teleop_controller',
            executable='custom_teleop_node',
            name='custom_teleop_node',
            output='screen'
    )

    return LaunchDescription([
        ydlidar_node,
        camera_node,
        imu_node,
        # tf_odom_to_base,
        # tf_base_to_laser,
        carto_node,
        occupancy_node,
        rviz_node,
        save_map_on_exit,
        nav2,
        explorer,
        motor_controller_node,
        robot_state_publisher_node,
        map_uploader_node,
        # custom_teleop_node,
    ])

