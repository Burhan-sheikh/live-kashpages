import { useState, useEffect } from 'react';
import { Shop } from '@/types';
import { getShop, getUserShops } from '@/lib/firebase/firestore';

/**
 * Hook to get a single shop by ID
 */
export function useShop(shopId: string | null) {
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shopId) {
      setShop(null);
      setLoading(false);
      return;
    }

    const fetchShop = async () => {
      setLoading(true);
      const { shop, error } = await getShop(shopId);
      setShop(shop);
      setError(error);
      setLoading(false);
    };

    fetchShop();
  }, [shopId]);

  return { shop, loading, error };
}

/**
 * Hook to get all shops for a user
 */
export function useUserShops(userId: string | null) {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setShops([]);
      setLoading(false);
      return;
    }

    const fetchShops = async () => {
      setLoading(true);
      const { shops, error } = await getUserShops(userId);
      setShops(shops);
      setError(error);
      setLoading(false);
    };

    fetchShops();
  }, [userId]);

  const refetch = async () => {
    if (!userId) return;
    const { shops, error } = await getUserShops(userId);
    setShops(shops);
    setError(error);
  };

  return { shops, loading, error, refetch };
}
