from flask import Flask, request
import boto3
import os
import numpy as np
import cv2
from PIL import Image
from collections import deque
from awscrt import mqtt
from awsiot import mqtt_connection_builder
import json
import requests
from pprint import pprint
import uuid

# 환경변수를 읽어오기 위한 코드 
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
s3 = boto3.client('s3')

# --- 설정 ---
BUCKET = "are-you-hot"
PREFIX = "iot_credentials"
CERT = "/tmp/certificate.pem.crt"
KEY = "/tmp/private.pem.key"
CA = "/tmp/AmazonRootCA1.pem"
API_BASE_URL = "http://api.are-u-hot.kro.kr"

# --- 인증서 다운로드 ---
def download_certificates():
    if not os.path.exists(CERT):
        s3.download_file(BUCKET, f"{PREFIX}/certificate.pem.crt", CERT)
        s3.download_file(BUCKET, f"{PREFIX}/private.pem.key", KEY)
        s3.download_file(BUCKET, f"{PREFIX}/AmazonRootCA1.pem", CA)

# --- 맵 처리 ---
def process_map(pgm_path):
    arr = np.array(Image.open(pgm_path))
    min_v, max_v = int(arr.min()), int(arr.max())
    unknowns = [v for v in np.unique(arr) if v not in (min_v, max_v)]
    filled = arr.copy()
    filled[np.isin(arr, unknowns)] = min_v
    return filled, min_v, max_v

# --- 랙 박스 및 spot 추출 ---
def extract_racks_and_spots(filled, min_v):
    h, w = filled.shape
    black = (filled == min_v).astype(np.uint8)
    bg = np.zeros_like(black)
    dq = deque()
    for x in range(w):
        if black[0, x]: dq.append((0, x)); bg[0, x] = 1
        if black[h-1, x]: dq.append((h-1, x)); bg[h-1, x] = 1
    for y in range(h):
        if black[y, 0]: dq.append((y, 0)); bg[y, 0] = 1
        if black[y, w-1]: dq.append((y, w-1)); bg[y, w-1] = 1
    while dq:
        y, x = dq.popleft()
        for ny, nx in ((y-1,x),(y+1,x),(y,x-1),(y,x+1)):
            if 0<=ny<h and 0<=nx<w and black[ny,nx] and not bg[ny,nx]:
                bg[ny,nx] = 1
                dq.append((ny,nx))
    enclosed = black - bg

    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5,5))
    clean = cv2.morphologyEx(enclosed, cv2.MORPH_CLOSE, kernel)
    clean = cv2.morphologyEx(clean, cv2.MORPH_OPEN, kernel)

    contours, _ = cv2.findContours(clean, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    raw_boxes = []
    for cnt in contours:
        if cv2.contourArea(cnt) < 0: continue
        rect = cv2.minAreaRect(cnt)
        if min(rect[1]) < 0: continue
        raw_boxes.append(cv2.boxPoints(rect).astype(int))

    # 박스 겹침 제거
    meta = []
    for box in raw_boxes:
        x0, y0, wb, hb = cv2.boundingRect(box)
        area = cv2.contourArea(box)
        meta.append({'box': box, 'rect': (x0, y0, wb, hb), 'area': area, 'keep': True})

    for i in range(len(meta)):
        for j in range(i+1, len(meta)):
            if not meta[i]['keep'] or not meta[j]['keep']:
                continue
            xi, yi, wi, hi = meta[i]['rect']
            xj, yj, wj, hj = meta[j]['rect']
            if xi < xj + wj and xi + wi > xj and yi < yj + hj and yi + hi > yj:
                if meta[i]['area'] < meta[j]['area']:
                    meta[i]['keep'] = False
                else:
                    meta[j]['keep'] = False

    boxes = [m['box'] for m in meta if m['keep']]

    # Margin point 계산
    margin, interval = 10, 20
    raw_margin = []
    for rid, box in enumerate(boxes, start=1):
        center = box.mean(axis=0)
        for side in range(4):
            p0 = box[side].astype(float)
            p1 = box[(side+1)%4].astype(float)
            d = (p1 - p0) / np.linalg.norm(p1 - p0)
            n = np.array([-d[1], d[0]])
            if np.dot(((p0+p1)/2 - center), n) < 0: n = -n
            p0o, p1o = p0 + n*margin, p1 + n*margin
            L = np.linalg.norm(p1o - p0o)
            steps = max(1, int(np.ceil(L/interval)))
            for k in range(steps+1):
                pt = p0o + d * (L/steps*k)
                px, py = int(round(pt[0])), int(round(pt[1]))
                raw_margin.append((rid, side, px, py, n))

    # 후처리 + uuid 추가
    filtered_spots = []
    for rid, side, px, py, n in raw_margin:
        if not (0 <= px < w and 0 <= py < h): continue
        if any(cv2.pointPolygonTest(b.reshape(-1,1,2), (px, py), False) >= 0 for b in boxes): continue
        if filled[py, px] == min_v: continue
        angle = (np.degrees(np.arctan2(n[1], n[0])) + 360) % 360
        filtered_spots.append({
            "rid": rid,
            "x": px,
            "y": py,
            "direction": round(angle, 1),
            "uuid": str(uuid.uuid4())  
        })

    # 최종 rackList 생성
    rack_list = []
    for rid, box in enumerate(boxes, 1):
        points = [[int(p[0]), int(p[1])] for p in box]
        center = box.mean(axis=0)
        rack_dict = {
            "x1": points[0][0], "y1": points[0][1],
            "x2": points[1][0], "y2": points[1][1],
            "x3": points[2][0], "y3": points[2][1],
            "x4": points[3][0], "y4": points[3][1],
            "centerX": int(center[0]),
            "centerY": int(center[1]),
            "spotList": []
        }
        for spot in filtered_spots:
            if spot["rid"] == rid:
                rack_dict["spotList"].append({
                    "x": spot["x"],
                    "y": spot["y"],
                    "direction": spot["direction"],
                    "uuid": spot["uuid"]
                })
        rack_list.append(rack_dict)

    return rack_list

# --- MQTT 전송 ---
def send_mqtt(endpoint, spots):
    mqtt_connection = mqtt_connection_builder.mtls_from_path(
        endpoint=endpoint,
        cert_filepath=CERT,
        pri_key_filepath=KEY,
        ca_filepath=CA,
        client_id="ec2-publisher",
        clean_session=False,
        keep_alive_secs=30
    )
    mqtt_connection.connect().result()
    future, _ = mqtt_connection.publish(
        topic="aiot/robot/shoot_location",
        qos=mqtt.QoS.AT_LEAST_ONCE,
        payload=json.dumps({"command": "shoot_spots", "spots": spots})
    )
    future.result()
    mqtt_connection.disconnect().result()
    print("MQTT publish 완료 shoot_spots")

# --- HTTP 전송 ---
def send_full_map(robot_id, object_key, rack_list):
    url = f"https://{BUCKET}.s3.ap-northeast-2.amazonaws.com/{object_key}"
    try:
        filename = os.path.basename(object_key)
        time_str = filename.split('_')[-2] + filename.split('_')[-1].split('.')[0]
        created_at = f"{time_str[:4]}-{time_str[4:6]}-{time_str[6:8]}T{time_str[8:10]}:{time_str[10:12]}:{time_str[12:14]}"
    except Exception as e:
        print(f"createdAt 파싱 실패: {e}")
        created_at = None

    payload = {
        "url": url,
        "rackList": rack_list,
        "createdAt": created_at
    }
    pprint(payload)
    try:
        res = requests.post(
            f"{API_BASE_URL}/api/robots/{robot_id}/full-map",
            json=payload,
            timeout=5
        )
        print(f"full-map HTTP 전송 성공: status={res.status_code}")
    except Exception as e:
        print(f"full-map HTTP 전송 실패: {e}")

# --- 메인 핸들러 ---
@app.route('/trigger', methods=['POST'])
def trigger():
    data = request.get_json()
    endpoint = os.environ.get("MQTT_ENDPOINT")
    if not endpoint:
        return {"status": "error", "message": "Missing MQTT_ENDPOINT"}, 400

    object_key = data['Records'][0]['s3']['object']['key']
    pgm_path = f"/tmp/{os.path.basename(object_key)}"
    s3.download_file(BUCKET, object_key, pgm_path)
    print(f"PGM 파일 다운로드 완료: {pgm_path}")

    robot_id = object_key.split('/')[-1].split('_')[0]

    test_map, min_v, _ = process_map(pgm_path)
    rack_list = extract_racks_and_spots(test_map, min_v)

    all_spots = [
        {
            "rack_id": rack_id + 1,
            "x": spot["x"],
            "y": spot["y"],
            "angle": spot["direction"],
            "uuid": spot["uuid"]
        }
        for rack_id, rack in enumerate(rack_list)
        for spot in rack["spotList"]
    ]

    send_mqtt(endpoint, all_spots)
    send_full_map(robot_id, object_key, rack_list)
    
    return {"status": "success", "robot_id": robot_id, "racks": len(rack_list), "spots": len(all_spots)}

# --- 실행 ---
if __name__ == "__main__":
    download_certificates()
    app.run(host="0.0.0.0", port=5000)
