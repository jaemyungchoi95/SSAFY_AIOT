import React, { useState, useEffect } from 'react';
import { Group, Image } from 'react-konva';
import useMarkerImage from '../hooks/useMarkerColor';

const DirectionalMarker = ({ spot, scale, onClick }) => {
  const imageSrc = useMarkerImage(spot);
  const [img, setImg] = useState(null);

  useEffect(() => {
    if (!imageSrc) return;
    const image = new window.Image();
    image.src = imageSrc;
    image.onload = () => setImg(image);
  }, [imageSrc]);

  const width = 25 / scale;
  const height = 30 / scale;

  return (
    <Group
      x={spot.x}
      y={spot.y}
      // rotation={spot.direction || 0}
      onClick={onClick}
      onTap={onClick}
    >
      {img && (
        <Image
          image={img}
          width={width}
          height={height}
          offsetX={width / 2}
          offsetY={height / 2}
        />
      )}
    </Group>
  );
};

export default DirectionalMarker;
