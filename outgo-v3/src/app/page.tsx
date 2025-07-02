import Link from "next/link";
import { createClient } from "~/utils/supabase/server";

export default async function Home() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return (
      <p>
        Supabase environment variables are not set. Please check your .env.local
        file and restart the server.
      </p>
    );
  }
  const supabase = createClient();
  const { data: activities, error } = await supabase.from("activities").select('*');

  if (error) {
    console.error("Error fetching activities:", JSON.stringify(error, null, 2));
    return <p>Error loading activities.</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          Discover Your Next Adventure
        </h1>
        <p className="mt-3 text-xl text-gray-500 sm:mt-5 sm:text-2xl">
          Find and book amazing recreational activities near you.
        </p>
        <div className="mt-8 flex justify-center">
          <div className="relative rounded-md shadow-sm w-full max-w-md">
            <input
              type="text"
              name="search"
              id="search"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-5 pr-12 sm:text-sm border-gray-300 rounded-md py-3"
              placeholder="Search activities..."
            />
            <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
              <button
                type="button"
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-900">All Activities</h2>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activities.map((activity: any) => (
              <Link href={`/activities/${activity.id}`} key={activity.id} className="group block rounded-lg p-4 bg-white shadow hover:shadow-lg transition-shadow duration-300">
                <h3 className="font-semibold text-lg text-gray-900 group-hover:text-indigo-600">{activity.name}</h3>
                <p className="text-gray-500 text-sm">{activity.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}