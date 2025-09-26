import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface UserData {
  resume: any;
  personalityTest: any;
}

export const useUserData = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = useCallback(async () => {
    if (!user?.email) return;

    setLoading(true);
    setError(null);

    try {
      console.log('Fetching data for user email:', user.email); // Debug log
      const response = await fetch(`/api/user-data?userEmail=${encodeURIComponent(user.email)}`);
      const result = await response.json();
      
      console.log('API response:', result); // Debug log

      if (result.success) {
        setUserData(result.data);
      } else {
        setError(result.error || 'Failed to fetch user data');
      }
    } catch (err) {
      setError('Failed to fetch user data');
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    if (user?.email) {
      fetchUserData();
    }
  }, [user?.email, fetchUserData]);

  return {
    userData,
    loading,
    error,
    refetch: fetchUserData
  };
};
