import Link from 'next/link';

interface ActivityCardProps {
  activity: {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url?: string;
  };
}

export default function ActivityCard({ activity }: ActivityCardProps) {
  return (
    <Link href={`/activities/${activity.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300">
        <img
          src={activity.image_url || 'https://via.placeholder.com/300'}
          alt={activity.name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2">{activity.name}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{activity.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-blue-600">${activity.price.toFixed(2)}</span>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300">
              View Details
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
