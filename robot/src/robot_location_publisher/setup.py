from setuptools import setup

package_name = 'robot_location_publisher'

setup(
    name=package_name,
    version='0.0.1',
    packages=[package_name],
    data_files=[
        ('share/ament_index/resource_index/packages',
         ['resource/' + package_name]),
        ('share/' + package_name, ['package.xml']),
    ],
    install_requires=[
        # pip로 설치할 경우(권장): colcon이 패키지 venv에 설치
        'paho-mqtt>=1.6.1',
        'tf-transformations>=1.0.0',
    ],
    zip_safe=True,
    maintainer='you',
    maintainer_email='you@example.com',
    description='Publish robot pose (TF) to MQTT (AWS IoT)',
    license='Apache-2.0',
    tests_require=['pytest'],
    entry_points={
        'console_scripts': [
            'location_publisher = robot_location_publisher.location_publisher:main',
        ],
    },
)
