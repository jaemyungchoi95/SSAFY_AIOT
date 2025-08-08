import { useState, useLayoutEffect, useRef } from 'react';

export const useStageSize = () => {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const element = ref.current;

    // 1. 관찰할 DOM 요소를 가져와서 판단한다.
    if (!element) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setSize({ width, height });
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);
  return [ref, size];
};
