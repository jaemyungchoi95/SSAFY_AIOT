from setuptools import find_packages, setup

package_name = 'my_teleop_controller'

setup(
    name=package_name,
    version='0.0.0',
    packages=find_packages(exclude=['test']),
    data_files=[
        ('share/' + package_name, ['package.xml']),
        # ('share/' + package_name + '/launch', ['launch/my_teleop_launch.py']), # 런치 파일 추가 (선택 사항)
    ],
    install_requires=['setuptools'],
    zip_safe=True,
    maintainer='Han gyeonghun', # TODO: 본인 이름으로 변경
    maintainer_email='qhrehowl06@naver.com', # TODO: 본인 이메일로 변경
    description='TODO: Package description',
    license='TODO: License declaration',
    tests_require=['pytest'],
    entry_points={
        'console_scripts': [
            'custom_teleop_node = my_teleop_controller.custom_teleop_node:main', # <-- 이 줄을 추가합니다.
        ],
    },
)
