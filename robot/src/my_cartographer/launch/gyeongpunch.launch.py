# my_cartographer/launch/bringup_ackermann_nav2.launch.py
import os
from launch import LaunchDescription
from launch.actions import DeclareLaunchArgument
from launch.conditions import IfCondition, UnlessCondition
from launch.substitutions import LaunchConfiguration
from launch_ros.actions import Node
from ament_index_python.packages import get_package_share_directory

def generate_launch_description():
    pkg_share = get_package_share_directory('my_cartographer')

    # --- Paths
    urdf_path        = os.path.join(pkg_share, 'urdf', 'my_robot.urdf')
    carto_config_dir = os.path.join(pkg_share, 'config')
    carto_lua_map    = 'my_robot.lua'                # SLAM(맵핑)용
    carto_lua_loc    = 'my_robot_localization.lua'   # 저장맵 로컬라이즈용
    ydlidar_yaml     = os.path.join(pkg_share, 'config', 'ydlidar.yaml')
    imu_yaml         = os.path.join(pkg_share, 'config', 'imu.yaml')
    nav2_params_file = os.path.join(pkg_share, 'config', 'nav2_params.yaml')
    rviz_config      = os.path.join(pkg_share, 'rviz', 'cartographer_config.rviz')

    # --- Args
    use_saved_map = LaunchConfiguration('use_saved_map')
    map_yaml      = LaunchConfiguration('map')
    pbstream      = LaunchConfiguration('pbstream')
    use_sim_time  = LaunchConfiguration('use_sim_time')
    start_rviz    = LaunchConfiguration('start_rviz')

    declare_args = [
        DeclareLaunchArgument('use_saved_map', default_value='true',
                              description='true: 저장맵 로컬라이즈 + Nav2, false: SLAM(맵핑) 모드'),
        DeclareLaunchArgument('map', default_value=os.path.join(pkg_share, 'maps', 'my_map_final.yaml'),
                              description='nav2_map_server가 읽을 YAML 경로'),
        DeclareLaunchArgument('pbstream', default_value=os.path.join(pkg_share, 'maps', 'my_map_final.pbstream'),
                              description='Cartographer가 로드할 pbstream 경로'),
        DeclareLaunchArgument('use_sim_time', default_value='false'),
        DeclareLaunchArgument('start_rviz', default_value='true')
    ]

    # --- Common sensors / robot
    robot_state_publisher = Node(
        package='robot_state_publisher', executable='robot_state_publisher', name='robot_state_publisher',
        parameters=[{'robot_description': open(urdf_path).read(), 'use_sim_time': use_sim_time}]
    )
    ydlidar_node = Node(
        package='ydlidar_ros2_driver', executable='ydlidar_ros2_driver_node', name='ydlidar_ros2_driver_node',
        parameters=[ydlidar_yaml, {'use_sim_time': use_sim_time}],
    )
    imu_node = Node(
        package='ros2_mpu6050_driver', executable='mpu6050driver', name='mpu6050driver',
        parameters=[imu_yaml, {'use_sim_time': use_sim_time}],
        remappings=[('/imu', '/imu/data_raw')]
    )
    imu_filter = Node(
        package='imu_filter_madgwick', executable='imu_filter_madgwick_node', name='imu_filter',
        parameters=[{'use_mag': False, 'publish_tf': False, 'use_sim_time': use_sim_time}],
        remappings=[('/imu/data_raw', '/imu/data_raw'), ('/imu/data', '/imu')]
    )
    motor_node = Node(
        package='motor_controller', executable='motor_node', name='robot_motor_controller',
        parameters=[{'use_sim_time': use_sim_time}]
    )

    # --- Cartographer
    # 1) SLAM(맵핑) 모드: pbstream 로드 없이 my_robot.lua로 실시간 SLAM + (필요하면) occupancy grid 퍼블리시
    cartographer_mapping = Node(
        condition=UnlessCondition(use_saved_map),
        package='cartographer_ros', executable='cartographer_node', name='cartographer_node', output='screen',
        parameters=[{'use_sim_time': use_sim_time}],
        arguments=['-configuration_directory', carto_config_dir,
                   '-configuration_basename', carto_lua_map],
        remappings=[('scan', '/scan'), ('imu', '/imu')]
    )
    carto_occ_grid = Node(
        condition=UnlessCondition(use_saved_map),
        package='cartographer_ros', executable='cartographer_occupancy_grid_node',
        name='cartographer_occupancy_grid_node', output='screen',
        parameters=[{'use_sim_time': use_sim_time}],
        arguments=['-resolution', '0.025', '-publish_period_sec', '0.10']
    )

    # 2) 저장맵 로컬라이즈 모드: pbstream을 load_state_filename으로 로드
    cartographer_localize = Node(
        condition=IfCondition(use_saved_map),
        package='cartographer_ros', executable='cartographer_node', name='cartographer_node', output='screen',
        parameters=[{'use_sim_time': use_sim_time,
                     'load_state_filename': pbstream}],
        arguments=['-configuration_directory', carto_config_dir,
                   '-configuration_basename', carto_lua_loc],
        remappings=[('scan', '/scan'), ('imu', '/imu')]
    )

    # --- Map server (저장맵 모드)
    map_server = Node(
        condition=IfCondition(use_saved_map),
        package='nav2_map_server', executable='map_server', name='map_server', output='screen',
        parameters=[{'yaml_filename': map_yaml, 'use_sim_time': use_sim_time}]
    )
    lifecycle_manager_loc = Node(
        condition=IfCondition(use_saved_map),
        package='nav2_lifecycle_manager', executable='lifecycle_manager', name='lifecycle_manager_localization',
        output='screen',
        parameters=[{'use_sim_time': use_sim_time,
                     'autostart': True,
                     'node_names': ['map_server']}]
    )

    # --- Nav2 stack (자율주행)
    controller_server = Node(
        package='nav2_controller', executable='controller_server', name='controller_server', output='screen',
        parameters=[nav2_params_file, {'use_sim_time': use_sim_time}]
    )
    smoother_server = Node(
        package='nav2_smoother', executable='smoother_server', name='smoother_server', output='screen',
        parameters=[nav2_params_file, {'use_sim_time': use_sim_time}]
    )
    planner_server = Node(
        package='nav2_planner', executable='planner_server', name='planner_server', output='screen',
        parameters=[nav2_params_file, {'use_sim_time': use_sim_time}]
    )
    behavior_server = Node(
        package='nav2_behaviors', executable='behavior_server', name='behavior_server', output='screen',
        parameters=[nav2_params_file, {'use_sim_time': use_sim_time}]
    )
    bt_navigator = Node(
        package='nav2_bt_navigator', executable='bt_navigator', name='bt_navigator', output='screen',
        parameters=[nav2_params_file, {'use_sim_time': use_sim_time}]
    )
    waypoint_follower = Node(
        package='nav2_waypoint_follower', executable='waypoint_follower', name='waypoint_follower', output='screen',
        parameters=[nav2_params_file, {'use_sim_time': use_sim_time}]
    )
    velocity_smoother = Node(
        package='nav2_velocity_smoother', executable='velocity_smoother', name='velocity_smoother', output='screen',
        parameters=[nav2_params_file, {'use_sim_time': use_sim_time}]
    )
    lifecycle_manager_nav = Node(
        package='nav2_lifecycle_manager', executable='lifecycle_manager', name='lifecycle_manager_navigation',
        output='screen',
        parameters=[{'use_sim_time': use_sim_time,
                     'autostart': True,
                     'bond_timeout': 0.0,
                     'node_names': ['controller_server',
                                    'smoother_server',
                                    'planner_server',
                                    'behavior_server',
                                    'bt_navigator',
                                    'waypoint_follower',
                                    'velocity_smoother']}]
    )

    # --- RViz
    rviz = Node(
        condition=IfCondition(start_rviz),
        package='rviz2', executable='rviz2', name='rviz2',
        arguments=['-d', rviz_config],
        output='screen'
    )

    return LaunchDescription(
        declare_args + [
            robot_state_publisher,
            ydlidar_node,
            imu_node,
            imu_filter,
            motor_node,

            # 맵핑 모드
            cartographer_mapping,
            carto_occ_grid,

            # 저장맵 로컬라이즈 모드
            cartographer_localize,
            map_server,
            lifecycle_manager_loc,

            # Nav2
            controller_server,
            smoother_server,
            planner_server,
            behavior_server,
            bt_navigator,
            waypoint_follower,
            velocity_smoother,
            lifecycle_manager_nav,

            # RViz
            rviz
        ]
    )

