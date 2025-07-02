import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { SubmitButton } from '@/components/submit-button';

export default async function ProfilePage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('name')
    .eq('id', user.id)
    .single();

  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select('*, activities(name, image_url)') // Fetch activity details along with booking
    .eq('user_id', user.id)
    .order('booking_date', { ascending: false }); // Order by booking date, newest first

  if (bookingsError) {
    console.error('Error fetching bookings:', bookingsError);
  }

  const { data: favorites, error: favoritesError } = await supabase
    .from('favorites')
    .select('*, activities(name, image_url)') // Fetch activity details along with favorite
    .eq('user_id', user.id);

  if (favoritesError) {
    console.error('Error fetching favorites:', favoritesError);
  }

  const now = new Date();
  const upcomingBookings = bookings?.filter(booking => new Date(booking.booking_date) >= now) || [];
  const pastBookings = bookings?.filter(booking => new Date(booking.booking_date) < now) || [];

  const signOut = async () => {
    'use server';
    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect('/login');
  };

  const updateProfile = async (formData: FormData) => {
    'use server';
    const name = formData.get('name') as string;
    const supabase = createClient();

    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, name });

    if (error) {
      console.error('Error updating profile:', error);
      // Handle error, maybe redirect with a message
    }

    return redirect('/profile');
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold text-center mb-8">User Profile</h2>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">Account Information</h3>
        <p className="text-lg font-medium mb-2">Email: {user.email}</p>
        <form action={updateProfile} className="space-y-4">
          <label className="text-md" htmlFor="name">
            Name
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border w-full"
            name="name"
            type="text"
            defaultValue={profile?.name || ''}
          />
          <SubmitButton formAction={updateProfile} className="border border-foreground/20 rounded-md px-4 py-2 text-foreground w-full" pendingText="Updating...">
            Update Profile
          </SubmitButton>
        </form>
        <form action={signOut} className="flex justify-center mt-6">
          <SubmitButton className="py-2 px-4 rounded-md no-underline bg-red-500 text-white hover:bg-red-600" pendingText="Signing Out...">
            Sign Out
          </SubmitButton>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">Upcoming Bookings</h3>
        {upcomingBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingBookings.map((booking) => (
              <div key={booking.id} className="border p-4 rounded-lg shadow-sm">
                <h4 className="text-lg font-bold">{booking.activities?.name}</h4>
                {booking.activities?.image_url && (
                  <img src={booking.activities.image_url} alt={booking.activities.name} className="w-full h-32 object-cover rounded-md mb-2" />
                )}
                <p>Date: {new Date(booking.booking_date).toLocaleDateString()}</p>
                <p>Status: {booking.status}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No upcoming bookings.</p>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">Past Bookings</h3>
        {pastBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pastBookings.map((booking) => (
              <div key={booking.id} className="border p-4 rounded-lg shadow-sm">
                <h4 className="text-lg font-bold">{booking.activities?.name}</h4>
                {booking.activities?.image_url && (
                  <img src={booking.activities.image_url} alt={booking.activities.name} className="w-full h-32 object-cover rounded-md mb-2" />
                )}
                <p>Date: {new Date(booking.booking_date).toLocaleDateString()}</p>
                <p>Status: {booking.status}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No past bookings.</p>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Favorite Activities</h3>
        {favorites && favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((favorite) => (
              <div key={favorite.id} className="border p-4 rounded-lg shadow-sm">
                <h4 className="text-lg font-bold">{favorite.activities?.name}</h4>
                {favorite.activities?.image_url && (
                  <img src={favorite.activities.image_url} alt={favorite.activities.name} className="w-full h-32 object-cover rounded-md mb-2" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No favorite activities yet.</p>
        )}
      </div>
    </div>
  );
}
