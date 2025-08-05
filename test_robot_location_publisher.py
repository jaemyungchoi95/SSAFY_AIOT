from awscrt import mqtt
from awsiot import mqtt_connection_builder
import json
import time
from datetime import datetime

# 🔧 사용자 설정
ENDPOINT = "a3jylvd3aub3bf-ats.iot.ap-northeast-2.amazonaws.com"
CLIENT_ID = "robot-location-publisher-001"
PATH_TO_CERT = "certificate.pem.crt"
PATH_TO_KEY = "private.pem.key"
PATH_TO_ROOT_CA = "AmazonRootCA1.pem"
TOPIC = "aiot/robot/location"  # 로봇 위치 토픽
PORT = 8883  # MQTT TLS 기본 포트

# 로봇 위치 데이터 (snake_case 필드명)
robot_location_data = {
    "robot_id": 1,
    "x": 123.45,
    "y": 67.89,
    "direction": 90.0,
    "created_at": "2024-01-15T10:30:00"  # LocalDateTime이 파싱할 수 있는 ISO 형식
}

def publish_robot_location():
    """로봇 위치 데이터를 MQTT로 발행하는 함수"""
    
    # MQTT 연결
    mqtt_connection = mqtt_connection_builder.mtls_from_path(
        endpoint=ENDPOINT,
        cert_filepath=PATH_TO_CERT,
        pri_key_filepath=PATH_TO_KEY,
        client_id=CLIENT_ID,
        ca_filepath=PATH_TO_ROOT_CA,
        clean_session=False,
        keep_alive_secs=30,
        port=PORT
    )

    try:
        print("🔌 Connecting to AWS IoT...")
        mqtt_connection.connect().result()
        print("✅ Connected!")

        # JSON 데이터를 문자열로 변환 (공백 제거)
        message_payload = json.dumps(robot_location_data, ensure_ascii=False, separators=(',', ':'))
        
        # publish
        print(f"📤 Publishing to topic '{TOPIC}':")
        print(f"📋 Data: {message_payload}")
        
        mqtt_connection.publish(
            topic=TOPIC,
            payload=message_payload,
            qos=mqtt.QoS.AT_MOST_ONCE
        )
        
        print("✅ Message published successfully!")
        
        # 잠시 대기 후 연결 해제
        time.sleep(1)
        
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        mqtt_connection.disconnect().result()
        print("🔌 Disconnected.")

def publish_multiple_locations():
    """여러 위치 데이터를 연속으로 발행하는 함수"""
    
    # MQTT 연결
    mqtt_connection = mqtt_connection_builder.mtls_from_path(
        endpoint=ENDPOINT,
        cert_filepath=PATH_TO_CERT,
        pri_key_filepath=PATH_TO_KEY,
        client_id=CLIENT_ID,
        ca_filepath=PATH_TO_ROOT_CA,
        clean_session=False,
        keep_alive_secs=30,
        port=PORT
    )

    try:
        print("🔌 Connecting to AWS IoT...")
        mqtt_connection.connect().result()
        print("✅ Connected!")

        # 여러 위치 데이터
        locations = [
            {"robot_id": 1, "x": 100.0, "y": 200.0, "direction": 0.0, "created_at": "2024-01-15T10:30:00"},
            {"robot_id": 1, "x": 110.0, "y": 210.0, "direction": 45.0, "created_at": "2024-01-15T10:31:00"},
            {"robot_id": 1, "x": 120.0, "y": 220.0, "direction": 90.0, "created_at": "2024-01-15T10:32:00"},
            {"robot_id": 2, "x": 300.0, "y": 400.0, "direction": 180.0, "created_at": "2024-01-15T10:30:00"},
            {"robot_id": 2, "x": 310.0, "y": 410.0, "direction": 225.0, "created_at": "2024-01-15T10:31:00"}
        ]

        for i, location_data in enumerate(locations, 1):
            # JSON 데이터를 문자열로 변환
            message_payload = json.dumps(location_data, ensure_ascii=False, separators=(',', ':'))
            
            print(f"📤 Publishing location {i}/{len(locations)} to topic '{TOPIC}':")
            print(f"📋 Data: {message_payload}")
            
            mqtt_connection.publish(
                topic=TOPIC,
                payload=message_payload,
                qos=mqtt.QoS.AT_MOST_ONCE
            )
            
            print(f"✅ Location {i} published successfully!")
            time.sleep(0.5)  # 0.5초 간격으로 발행
        
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        mqtt_connection.disconnect().result()
        print("🔌 Disconnected.")

if __name__ == "__main__":
    print("🤖 Robot Location MQTT Publisher")
    print("=" * 50)
    
    choice = input("Choose mode:\n1. Single location publish\n2. Multiple locations publish\nEnter choice (1 or 2): ")
    
    if choice == "1":
        publish_robot_location()
    elif choice == "2":
        publish_multiple_locations()
    else:
        print("❌ Invalid choice. Running single location publish...")
        publish_robot_location() 