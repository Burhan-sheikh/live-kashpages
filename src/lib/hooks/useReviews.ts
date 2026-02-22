import { useState, useEffect } from 'react';
import { Review } from '@/types';
import { getShopReviews } from '@/lib/firebase/firestore';

/**
 * Hook to get reviews for a shop
 */
export function useReviews(shopId: string | null, onlyVisible: boolean = false) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shopId) {
      setReviews([]);
      setLoading(false);
      return;
    }

    const fetchReviews = async () => {
      setLoading(true);
      const { reviews, error } = await getShopReviews(shopId, onlyVisible);
      setReviews(reviews);
      setError(error);
      setLoading(false);
    };

    fetchReviews();
  }, [shopId, onlyVisible]);

  const refetch = async () => {
    if (!shopId) return;
    const { reviews, error } = await getShopReviews(shopId, onlyVisible);
    setReviews(reviews);
    setError(error);
  };

  return { reviews, loading, error, refetch };
}
