'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface ReviewFormProps {
  activityId: string;
  userId: string;
  onReviewSubmitted: () => void;
}

export default function ReviewForm({ activityId, userId, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (rating === 0) {
      setMessage('Please select a rating.');
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from('reviews')
      .insert({
        activity_id: activityId,
        user_id: userId,
        rating: rating,
        review_text: reviewText,
      });

    if (error) {
      setMessage('Error submitting review: ' + error.message);
      console.error('Error submitting review:', error);
    } else {
      setMessage('Review submitted successfully!');
      setRating(0);
      setReviewText('');
      onReviewSubmitted(); // Callback to refresh reviews or update UI
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Submit Your Review</h2>
      <div className="mb-4">
        <label htmlFor="rating" className="block text-gray-700 text-sm font-bold mb-2">
          Rating:
        </label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-3xl ${
                star <= rating ? 'text-yellow-500' : 'text-gray-300'
              } focus:outline-none`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="reviewText" className="block text-gray-700 text-sm font-bold mb-2">
          Review:
        </label>
        <textarea
          id="reviewText"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          rows={4}
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Share your experience..."
        ></textarea>
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
      {message && <p className="mt-4 text-sm text-center">{message}</p>}
    </form>
  );
}
