import { useEffect, useState } from 'react';
import axios from 'axios';
import yaml from 'js-yaml';
import { parsePGM } from '../utils/pgmParser';

export const useMapData = () => {
    const [pgmData, setPgmData] = useState(null);
    const [mapMetadata, setMapMetadata] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 데이터 로딩을 위한 useEffect
    useEffect(() => {
      const fetchMapData = async () => {
        try {
          const [imageResponse, metadataResponse] = await Promise.all([
            axios.get('/api/map/image', { responseType: 'arraybuffer' }),
            axios.get('/api/map/metadata'),
          ]);
          
          const parsedPgm = parsePGM(imageResponse.data);
          setPgmData(parsedPgm);

          const parsedMetadata = yaml.load(metadataResponse.data);
          setMapMetadata(parsedMetadata);

        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };
      fetchMapData();
    }, []); // 최초 1회만 실행
  
    return { pgmData, mapMetadata, loading, error };
};