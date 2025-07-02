import { createClient } from '@/utils/supabase/server';

interface ReviewListProps {
  activityId: string;
}

interface Review {
  id: string;
  rating: number;
  review_text: string;
  created_at: string;
  profiles: { // Assuming a join with the profiles table to get user names
    name: string;
  };
}

export default async function ReviewList({ activityId }: ReviewListProps) {
  const supabase = createClient();

  const { data: reviews, error } = await supabase
    .from('reviews')
    .select('*, profiles(name)') // Select all review fields and the name from the profiles table
    .eq('activity_id', activityId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reviews:', error);
    return <p className="text-red-500">Error loading reviews.</p>;
  }

  if (!reviews || reviews.length === 0) {
    return <p className="text-gray-600">No reviews yet. Be the first to review this activity!</p>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
      <div className="space-y-6">
        {reviews.map((review: Review) => (
          <div key={review.id} className="bg-gray-100 p-4 rounded-lg shadow-sm">
            <div className="flex items-center mb-2">
              <p className="font-semibold mr-2">{review.profiles?.name || 'Anonymous'}</p>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-xl ${
                      star <= review.rating ? 'text-yellow-500' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <p className="text-gray-700">{review.review_text}</p>
            <p className="text-sm text-gray-500 mt-2">{new Date(review.created_at).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
