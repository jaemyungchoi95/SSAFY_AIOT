from setuptools import setup
import os
from glob import glob

package_name = 'my_cartographer'

setup(
    name=package_name,
    version='0.0.0',
    packages=[package_name],
    data_files=[
        ('share/ament_index/resource_index/packages',
            ['resource/' + package_name]),
        ('share/' + package_name, ['package.xml']),
        (os.path.join('share', package_name, 'launch'), glob('launch/*.launch.py')),
        (os.path.join('share', package_name, 'config'), glob('config/*')),
        (os.path.join('share', package_name, 'rviz'), glob('rviz/*')),
        (os.path.join('share', package_name, 'urdf'), glob('urdf/*')),
        (os.path.join('share', package_name, 'scripts'), glob('scripts/*'),
        (os.path.join('share', package_name, 'maps'), glob('maps/*')
    ],
    install_requires=['setuptools'],
    zip_safe=True,
    maintainer='a202',
    maintainer_email='a202@todo.todo',
    description='TODO: Package description',
    license='TODO: License declaration',
    tests_require=['pytest'],
    entry_points={
        'console_scripts': [
            # 이 라인을 추가하세요!
            'kart_teleop = my_cartographer.scripts.kart_teleop:main',
            'twist_to_ackermann = scripts.twist_to_ackermann:main',
        ],
    },
)
