import os
from launch import LaunchDescription
from launch_ros.actions import Node
from launch.actions import ExecuteProcess
from ament_index_python.packages import get_package_share_directory

def generate_launch_description():
    pkg_share = get_package_share_directory('my_cartographer')
    
    ydlidar_yaml = os.path.join(pkg_share, 'config', 'ydlidar.yaml')

    imu_yaml = os.path.join(pkg_share, 'config', 'imu.yaml')
    lua_dir = os.path.join(pkg_share, 'config')
    rviz_config = os.path.join(pkg_shar, 'rviz', 'cartographer_config.rviz')

    return LaunchDescription([

        # 1. LiDAR 드라이버
        Node(
            package='ydlidar_ros2_driver',
            executable='ydlidar_ros2_driver_node',
            name='ydlidar_ros2_driver_node',
            output='screen',
            parameters=[ydliadr_yaml],
        ),
        # 1.5 IMU Driver
        Node(
            package='mpu6050driver',
            executable='mpu6050driver',
            name='mpu6050driver',
            output='screen',
            parameters=[imu_yaml],
        ),

        # 2. TF: odom → base_link
        ExecuteProcess(
            cmd=[
                'ros2', 'run', 'tf2_ros', 'static_transform_publisher',
                '0', '0', '0',
                '0', '0', '0',
                'odom', 'base_link'
            ],
            output='screen'
        ),

        # 3. TF: base_link → laser_frame
        ExecuteProcess(
            cmd=[
                'ros2', 'run', 'tf2_ros', 'static_transform_publisher',
                '0', '0', '0.02',
                '0', '0', '0',
                'base_link', 'laser_frame'
            ],
            output='screen'
        ),

        # 4. Cartographer SLAM
        ExecuteProcess(
            cmd=[
                'ros2', 'run', 'cartographer_ros', 'cartographer_node',
                '-configuration_directory', '/home/a202/ros2_ws/src/my_cartographer/config',
                '-configuration_basename', 'my_robot.lua',
                '--ros-args', 
                  '-r', '/scan:=/scan',
                  '-r', '/imu:=/imu',
            ],
            output='screen'
        ),

        # 5. Occupancy Grid Map 노드 추가
        Node(
            package='cartographer_ros',
            executable='cartographer_occupancy_grid_node',
            name='occupancy_grid_node',
            output='screen',
            parameters=[{'use_sim_time': False}],
            remappings=[
                ('map', '/map'),
                ('submap_list', '/submap_list'),
                ('submap_query', '/submap_query'),
                ('trajectory_node_list', '/trajectory_node_list')
            ]
        ),

        # 6. Rviz2
        Node(
            package='rviz2',
            executable='rviz2',
            name='rviz2',
            output='screen',
            arguments=[
                '-d', '/home/a202/ros2_ws/src/my_cartographer/rviz/cartographer_config.rviz'
            ],
        ),
    ])

