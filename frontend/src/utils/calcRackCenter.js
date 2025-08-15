// Text 표시를 위해한 rack 좌표의 중앙을 계산하여 반환
export const getCenter = (rack) => {
  const centerX = (rack.x1 + rack.x2 + rack.x3 + rack.x4) / 4;
  const centerY = (rack.y1 + rack.y2 + rack.y3 + rack.y4) / 4;
  return { x: centerX, y: centerY };
};
