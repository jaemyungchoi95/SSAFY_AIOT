cmake_minimum_required(VERSION 3.8)
project(my_cartographer)

if(CMAKE_COMPILER_IS_GNUCXX OR CMAKE_CXX_COMPILER_ID MATCHES "Clang")
  add_compile_options(-Wall -Wextra -Wpedantic)
endif()

# find dependencies
find_package(ament_cmake REQUIRED)
find_package(rclpy REQUIRED)
find_package(rclcpp REQUIRED)
find_package(cartographer_ros REQUIRED)
find_package(tf2_ros REQUIRED)
find_package(rviz2 REQUIRED)
find_package(ydlidar_ros2_driver REQUIRED)
find_package(ros2_mpu6050_driver REQUIRED)

# uncomment the following section in order to fill in
# further dependencies manually.
# find_package(<dependency> REQUIRED)

install(
  DIRECTORY launch config rviz urdf scripts
  DESTINATION share/${PROJECT_NAME}
)

install(PROGRAMS
  scripts/kart_teleop.py
  scripts/mqtt_nav_bridge.py
  DESTINATION lib/${PROJECT_NAME}
)

ament_package()
