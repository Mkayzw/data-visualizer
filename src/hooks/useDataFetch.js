import { useState, useEffect } from 'react';
import axios from 'axios';

// For demo purposes, we'll generate mock data for all sources
export function useDataFetch(source, timeRange) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Generate mock data for all sources
        const dataPoints = timeRange === '1d' ? 24 : timeRange === '7d' ? 7 : 30;
        const maxValue = source === 'crypto' ? 50000 : source === 'stocks' ? 1000 : 50;
        const minValue = source === 'crypto' ? 30000 : source === 'stocks' ? 100 : 0;
        
        const mockData = Array.from({ length: dataPoints }, (_, i) => ({
          timestamp: Date.now() + i * 3600000,
          value: Math.random() * (maxValue - minValue) + minValue,
        }));
        
        setData(mockData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [source, timeRange]);

  return { data, loading, error };
} 