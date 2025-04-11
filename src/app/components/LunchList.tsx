'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';

const LunchList = () => {
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
  const [data, setData] = useState<any>(null);




  return (
<div className="relative grid min-h-screen grid-cols-[1fr_2.5rem_auto_2.5rem_1fr] grid-rows-[1fr_1px_auto_1px_1fr] bg-white [--pattern-fg:var(--color-gray-950)]/5 dark:bg-gray-950 dark:[--pattern-fg:var(--color-white)]/10">
  <div className="col-start-3 row-start-3 flex max-w-lg flex-col bg-gray-100 p-2 dark:bg-white/10">
    <div className="rounded-xl bg-white p-10 text-sm/7 text-gray-700 dark:bg-gray-950 dark:text-gray-300">
      <div> 
        {location && (
          <p>
            Latitude: {location.latitude}, Longitude: {location.longitude}
          </p>
        )}
      </div>
      <h1 className="text-lg">Lunch Nearby...</h1>
      <ul className="list-disc">
        {data && data.map((restaurant: any) => (
          <li key={restaurant.fsq_id}>
            <img src={restaurant.logo} alt={restaurant.name} className="w-16 h-16" />
            <h3>{restaurant.name} - {restaurant.fsq_id}</h3>
            <p>{restaurant.location.formatted_address}</p>
          </li>
        ))}
      </ul>
    </div></div></div>
  );
};

export default LunchList;
