import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import ReviewForm from '@/components/activities/ReviewForm';
import ReviewList from '@/components/activities/ReviewList';
import FavoriteButton from '@/components/activities/FavoriteButton';

export default async function ActivityDetailsPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: activity, error: activityError } = await supabase
    .from('activities')
    .select('*')
    .eq('id', params.id)
    .single();

  if (activityError || !activity) {
    console.error('Error fetching activity details:', activityError);
    notFound();
  }

  const { data: { user } } = await supabase.auth.getUser();

  let initialIsFavorite = false;
  if (user) {
    const { data: favoriteData, error: favoriteError } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('activity_id', activity.id)
      .single();

    if (favoriteError && favoriteError.code !== 'PGRST116') { // PGRST116 means no rows found
      console.error('Error fetching favorite status:', favoriteError);
    } else if (favoriteData) {
      initialIsFavorite = true;
    }
  }

  const handleReviewSubmitted = () => {
    // This function can be used to re-fetch reviews or update the UI after a review is submitted.
    // For now, we'll just log a message.
    console.log('Review submitted! You might want to re-fetch reviews here.');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{activity.name}</h1>
      {activity.image_url && (
        <img
          src={activity.image_url}
          alt={activity.name}
          className="w-full h-96 object-cover rounded-lg mb-6"
        />
      )}
      <p className="text-gray-700 mb-4">{activity.description}</p>
      <div className="flex justify-between items-center mb-6">
        <span className="text-2xl font-bold text-blue-600">${activity.price.toFixed(2)}</span>
        {user && (
          <FavoriteButton
            activityId={activity.id}
            userId={user.id}
            initialIsFavorite={initialIsFavorite}
          />
        )}
      </div>
      {/* Add more details like location, rules, time slots here */}

      {user ? (
        <div className="mt-8">
          <ReviewForm
            activityId={activity.id}
            userId={user.id}
            onReviewSubmitted={handleReviewSubmitted}
          />
        </div>
      ) : (
        <p className="mt-8 text-center text-gray-600">Please log in to submit a review.</p>
      )}

      <ReviewList activityId={activity.id} />
    </div>
  );
}
