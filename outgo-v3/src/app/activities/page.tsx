import { createClient } from '@/utils/supabase/client';
import ActivityCard from './components/ActivityCard';

export default function ActivitiesPage() {
  const { latitude, longitude, loading, error: locationError } = useLocation();
  const [activities, setActivities] = useState<any[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [errorActivities, setErrorActivities] = useState<string | null>(null);

  useEffect(() => {
    async function fetchActivities() {
      setLoadingActivities(true);
      setErrorActivities(null);
      const supabase = createClient();
      let query = supabase.from('activities').select('*');

      if (latitude && longitude) {
        // This is a simplified example. In a real app, you'd use PostGIS for geospatial queries.
        // For now, we'll just log the location and fetch all activities.
        console.log(`Fetching activities near: ${latitude}, ${longitude}`);
      }

      const { data, error } = await query;

      if (error) {
        setErrorActivities(error.message);
      } else {
        setActivities(data || []);
      }
      setLoadingActivities(false);
    }

    if (!loading && !locationError) {
      fetchActivities();
    }
  }, [latitude, longitude, loading, locationError]);

  if (loading || loadingActivities) {
    return <p>Loading activities...</p>;
  }

  if (locationError) {
    return <p>Error getting location: {locationError}. Displaying all activities.</p>;
  }

  if (errorActivities) {
    return <p>Error loading activities: {errorActivities}</p>;
  }

  const supabase = createClient();
  const { data: activities, error } = await supabase.from('activities').select('*');

  if (error) {
    console.error('Error fetching activities:', error);
    return <p>Error loading activities.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">All Activities</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {activities?.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  );
}
