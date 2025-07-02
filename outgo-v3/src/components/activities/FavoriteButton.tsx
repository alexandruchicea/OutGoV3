'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

interface FavoriteButtonProps {
  activityId: string;
  userId: string;
  initialIsFavorite: boolean;
}

export default function FavoriteButton({ activityId, userId, initialIsFavorite }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    setIsFavorite(initialIsFavorite);
  }, [initialIsFavorite]);

  const toggleFavorite = async () => {
    setLoading(true);
    if (isFavorite) {
      // Remove from favorites
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('activity_id', activityId);

      if (error) {
        console.error('Error removing from favorites:', error);
      } else {
        setIsFavorite(false);
      }
    } else {
      // Add to favorites
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: userId, activity_id: activityId });

      if (error) {
        console.error('Error adding to favorites:', error);
      } else {
        setIsFavorite(true);
      }
    }
    setLoading(false);
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`px-4 py-2 rounded-md ${
        isFavorite ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-800'
      } hover:opacity-80 transition-opacity duration-200`}
    >
      {loading ? (
        'Loading...'
      ) : isFavorite ? (
        'Remove from Favorites'
      ) : (
        'Add to Favorites'
      )}
    </button>
  );
}
