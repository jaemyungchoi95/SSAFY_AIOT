# bringup_ackermann_nav2.launch.py

import os
from launch import LaunchDescription
from launch.actions import (
    DeclareLaunchArgument,
    IncludeLaunchDescription,
    SetEnvironmentVariable,
    ExecuteProcess,
)
from launch.conditions import IfCondition, UnlessCondition
from launch.substitutions import LaunchConfiguration, EnvironmentVariable, PathJoinSubstitution, PythonExpression
from launch_ros.actions import Node
from ament_index_python.packages import get_package_share_directory
from launch.launch_description_sources import PythonLaunchDescriptionSource


def generate_launch_description():
    pkg_share = get_package_share_directory("my_cartographer")
    nav2_bringup_dir = get_package_share_directory("nav2_bringup")

    home = EnvironmentVariable('HOME')
    maps_dir = PathJoinSubstitution([home, 'ros2_ws', 'src', 'my_cartographer', 'maps'])

    # ---------- launch args ----------
    rviz_enable     = LaunchConfiguration("rviz")
    use_saved_map   = LaunchConfiguration("use_saved_map")
    map_yaml        = LaunchConfiguration("map")
    pbstream        = LaunchConfiguration("pbstream")
    use_sim_time    = LaunchConfiguration("use_sim_time")


    declare_args = [
            DeclareLaunchArgument('use_saved_map', default_value='true'),
            DeclareLaunchArgument('map', default_value=PathJoinSubstitution([maps_dir, 'my_map_final.yaml'])),
            DeclareLaunchArgument('pbstream', default_value=PathJoinSubstitution([maps_dir, 'my_map_final.pbstream'])),
            DeclareLaunchArgument('use_sim_time', default_value='false'),
            DeclareLaunchArgument('enable_initialpose_bridge', default_value='true'),
            DeclareLaunchArgument('rviz', default_value='true'),
    ]

    #declare_args = [
        #DeclareLaunchArgument("use_saved_map", default_value="false"),
        #DeclareLaunchArgument(
            #"map",
            #default_value=os.path.join(pkg_share, "maps", "my_map_final.yaml"),
        #),
        #DeclareLaunchArgument(
            #"pbstream",
            #default_value=os.path.join(pkg_share, "maps", "my_map_final.pbstream"),
        #),
        #DeclareLaunchArgument("use_sim_time", default_value="false"),
    #]

    # ---------- paths ----------
    urdf_path      = os.path.join(pkg_share, "urdf", "my_robot.urdf")
    ydlidar_yaml   = os.path.join(pkg_share, "config", "ydlidar.yaml")
    imu_yaml       = os.path.join(pkg_share, "config", "imu.yaml")
    carto_cfg_dir  = os.path.join(pkg_share, "config")
    carto_slam_lua = "my_robot.lua"
    carto_loc_lua  = "my_robot_localization.lua"  # pbstream 로컬라이즈용
    nav2_params    = os.path.join(pkg_share, "config", "nav2_params.yaml")
    # rviz_cfg       = os.path.join(pkg_share, "rviz", "nav2_default_view.rviz")
    rviz_cfg = os.path.join(nav2_bringup_dir, "rviz", "nav2_default_view.rviz")

    # ---------- common (센서/모터/rviz) ----------
    common_nodes = [
        SetEnvironmentVariable(name="BLINKA_I2C_BUSNUM", value="7"),

        Node(
            package="robot_state_publisher",
            executable="robot_state_publisher",
            parameters=[{
                "robot_description": open(urdf_path).read(),
                "use_sim_time": use_sim_time,
            }],
        ),

        Node(
            package="ydlidar_ros2_driver",
            executable="ydlidar_ros2_driver_node",
            name="ydlidar_ros2_driver_node",
            parameters=[ydlidar_yaml, {"use_sim_time": use_sim_time}],
        ),

        Node(
            package="ros2_mpu6050_driver",
            executable="mpu6050driver",
            name="mpu6050driver",
            parameters=[imu_yaml, {"use_sim_time": use_sim_time}],
            remappings=[("/imu", "/imu/data_raw")],
        ),

        Node(
            package="imu_filter_madgwick",
            executable="imu_filter_madgwick_node",
            name="imu_filter",
            parameters=[{
                "use_mag": False,
                "publish_tf": False,
                "use_sim_time": use_sim_time,
            }],
            remappings=[("/imu/data_raw", "/imu/data_raw"), ("/imu/data", "/imu")],
        ),

        Node(
            package="motor_controller",
            executable="motor_node",
            name="robot_motor_controller",
            parameters=[{"use_sim_time": use_sim_time}],
        ),

        Node(
            package="rviz2",
            executable="rviz2",
            name="rviz2",
            arguments=["-d", rviz_cfg],
            output="screen",
            additional_env={ "QT_XCB_FORCE_SOFTWARE_OPENGL": "1" },
            condition=IfCondition(rviz_enable),
        ),
    ]

    # ---------- SLAM (맵핑) 모드 ----------
    carto_slam = Node(
        package="cartographer_ros",
        executable="cartographer_node",
        name="cartographer_node",
        output="screen",
        parameters=[{"use_sim_time": use_sim_time}],
        arguments=[
            "-configuration_directory", carto_cfg_dir,
            "-configuration_basename", carto_slam_lua,
        ],
        remappings=[("/scan", "/scan"), ("/imu", "/imu")],
        condition=UnlessCondition(use_saved_map),
    )

    occ_grid = Node(
        package="cartographer_ros",
        executable="cartographer_occupancy_grid_node",
        name="cartographer_occupancy_grid_node",
        output="screen",
        parameters=[{"use_sim_time": use_sim_time}],
        arguments=["-resolution", "0.025", "-publish_period_sec", "0.05"],
        condition=UnlessCondition(use_saved_map),
    )

    # ---------- Localization (고정맵 + pbstream) 모드 ----------
    carto_loc = Node(
        package="cartographer_ros",
        executable="cartographer_node",
        name="cartographer_node",
        output="screen",
        parameters=[{"use_sim_time": use_sim_time}],
        arguments=[
            "-configuration_directory", carto_cfg_dir,
            "-configuration_basename", carto_loc_lua,
            "-load_frozen_state", "1",
            "-load_state_filename", pbstream,
        ],
        remappings=[("/scan", "/scan"), ("/imu", "/imu")],
        condition=IfCondition(use_saved_map),
    )

    map_server = Node(
        package="nav2_map_server",
        executable="map_server",
        name="map_server",
        output="screen",
        parameters=[{
            "yaml_filename": map_yaml,
            "use_sim_time": use_sim_time,
        }],
        condition=IfCondition(use_saved_map),
    )

    map_lifecycle = Node(
        package="nav2_lifecycle_manager",
        executable="lifecycle_manager",
        name="lifecycle_manager_localization",
        output="screen",
        parameters=[{
            "use_sim_time": use_sim_time,
            "autostart": True,
            "bond_timeout": 0.0,
            "node_names": ["map_server"],
        }],
        condition=IfCondition(use_saved_map),
    )

    # ---------- Nav2 (경로계획/컨트롤) : 두 모드 공통 ----------
    nav2 = IncludeLaunchDescription(
        PythonLaunchDescriptionSource(
            os.path.join(nav2_bringup_dir, "launch", "navigation_launch.py")
        ),
        launch_arguments={
            "use_sim_time": use_sim_time,
            "params_file": nav2_params,
        }.items(),
    )

    bridge_script = PathJoinSubstitution([pkg_share, 'scripts', 'initialpose_to_cartographer.py'])
    initialpose_bridge = ExecuteProcess(
            cmd=[
                'python3', '-u', bridge_script,
                '--ros-args',
                '-p', f'config_dir:={carto_cfg_dir}',
                '-p', f'config_basename:={carto_loc_lua}',
                '-p', 'relative_to_trajectory_id:=0',
                '-p', 'auto_finish_active:=true',
            ],
            output='screen',
            respawn=True,
            # 저장된 맵을 쓰는 모드에서만 켜는 게 안전하고 직관적
            condition=IfCondition(LaunchConfiguration('use_saved_map'))
        )


    return LaunchDescription(
        declare_args
        + common_nodes
        + [carto_slam, occ_grid, carto_loc, map_server, map_lifecycle, nav2, initialpose_bridge]
    )

