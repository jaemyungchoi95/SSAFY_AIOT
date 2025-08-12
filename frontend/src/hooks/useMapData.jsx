import { useEffect, useState } from 'react';
import { parsePGM } from '../utils/pgmParser';
import { useAppStore } from '../stores/useAppStore';

export const useMapData = () => {
  const imageUrl = useAppStore((state) => state.imageUrl);

  const [pgmData, setPgmData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 데이터 로딩을 위한 useEffect
  useEffect(() => {
    if (!imageUrl) {
      setPgmData(null);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setPgmData(null);

      try {
        const response = await fetch(imageUrl);
        if (!response.ok) {
          throw new Error(`Http error! status: ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const parsedData = parsePGM(arrayBuffer);
        setPgmData(parsedData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [imageUrl]);

  return { pgmData, loading, error };
};
