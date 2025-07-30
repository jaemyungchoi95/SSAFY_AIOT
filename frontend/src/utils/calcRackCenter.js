// Text 표시를 위해한 rack 좌표의 중앙을 계산하여 반환
export const getCenter = (rack) => {
  const xs = [rack.x1, rack.x2, rack.x3, rack.x4];
  const ys = [rack.y1, rack.y2, rack.y3, rack.y4];
  const centerX = (Math.min(...xs) + Math.max(...xs)) / 2;
  const centerY = (Math.min(...ys) + Math.max(...ys)) / 2;
  return { x: centerX, y: centerY };
};
