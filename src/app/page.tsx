'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { AppState, useAppContext } from '@/app/AppContext';
import BubbleChart from '@/app/components/Bubbles/BubbleChart';
import {Button} from '@heroui/button'; 

const Home: React.FC<AppState> = () => {
  const { lunch, setLunch } = useAppContext();
  const { location, setLocation } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log("lunch", lunch);
  console.log("location", location);
  
  useEffect(() => {
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });
          },
          (error) => {
            setError("Failed to get location. Please allow location access.");
            setLoading(false);
          },
          {
            enableHighAccuracy: true, // Set to false to get less accurate data, reducing fluctuation
          }
        );
      } else {
        setError("Geolocation is not supported by this browser.");
        setLoading(false);
      }
    };
    getCurrentLocation();
  }, []);
  
  // use effect - fetch data
  useEffect(() => {
    if (!location) return; // Don't fetch data if location is not available
    // Fetch the data from the /api/get route when the component mounts
    async function fetchData() {
      console.log("inside fetchData", location?.latitude, location?.longitude);
      // const googleApiKey = "AIzaSyAmD4sAv2G6r3vEIJwS53tskWnWU8IukBY"; // Replace with your Google API key
      // const response2 = await axios.post(
      //   'https://www.googleapis.com/geolocation/v1/geolocate?key=' + googleApiKey,
      //   {
      //     location: {
      //       lat: location?.latitude,
      //       lng: location?.longitude
      //     }
      //   }
      // );
      // console.log("browser location", location);
      // console.log("google location", response2.data.location);
      
      const response = await axios.get('/api/list', {
        params: {
            latitude: location?.latitude,
            longitude: location?.longitude,
        },
      });

      if (response.status < 200 || response.status >= 300) {
        throw new Error('Failed to fetch');
      }
      
      const result = response;

      setLunch(result.data.results);
    }
    fetchData();
  }, [location?.latitude, location?.longitude]);

  return (
    <div className="container mx-auto">
      {location && (
        <p>
          Location: {location.latitude}, {location.longitude}
        </p>
      )}
      <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>
      <Button>Click me</Button>
    <div>
    </div>
      <BubbleChart lunch={lunch} />
    </div>
  );
};

export default Home;
