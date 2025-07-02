import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { SubmitButton } from '@/components/submit-button';

export default async function SettingsPage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  // In a real application, you would fetch user settings here
  // For now, we'll just have a placeholder for notification settings

  const updateNotificationSettings = async (formData: FormData) => {
    'use server';
    const receiveNotifications = formData.get('receiveNotifications') === 'on';
    // In a real application, you would update the user's notification settings in the database
    console.log('Notification settings updated:', receiveNotifications);
    // For now, just redirect back to settings page
    return redirect('/settings');
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold text-center mb-8">Settings</h2>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">Notification Settings</h3>
        <form action={updateNotificationSettings} className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="receiveNotifications"
              name="receiveNotifications"
              className="mr-2"
              // In a real app, this would be checked based on user's current settings
              defaultChecked={true}
            />
            <label htmlFor="receiveNotifications" className="text-md">
              Receive email notifications
            </label>
          </div>
          <SubmitButton formAction={updateNotificationSettings} className="border border-foreground/20 rounded-md px-4 py-2 text-foreground w-full" pendingText="Saving...">
            Save Notification Settings
          </SubmitButton>
        </form>
      </div>

      {/* Add more settings sections here, e.g., Privacy, Security, etc. */}

    </div>
  );
}
