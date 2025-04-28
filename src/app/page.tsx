'use client';
import { useEffect, useState } from 'react';
import { MapPinCheck } from 'lucide-react';
import {Button} from '@heroui/button'; 
import { useAppContext } from '@/components/AppContext';
import LoadingOverlay from '@/components/LoadingOverlay';
import App from '@/components/App';

const Home: React.FC = () => {
  const { setLoading } = useAppContext();
  const { location, setLocation } = useAppContext();
  const [showLocationPrompt, setShowLocationPrompt] = useState<boolean>(false);
  
  useEffect(() => {
    const getCurrentLocation = () => {
      if (navigator.geolocation && !location) {
        setLoading(true);
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });
            setLoading(false);
          },
          (err) => {
            if (err.code === err.PERMISSION_DENIED) {
              setShowLocationPrompt(true);
            }
            setLoading(false);
          },
          {
            enableHighAccuracy: true, // Set to false to get less accurate data, reducing fluctuation
          }
        );
      }
    };
    getCurrentLocation();
  }, [location, setLoading, setLocation]);

  if(showLocationPrompt && !location) {
    return (
      <div className="container mx-auto">
        <LoadingOverlay isLoading={false} />
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="py-6">
            <MapPinCheck size={48} />
          </div>
          <h1 className="text-2xl font-bold mb-4">Please enable location access or use
            <Button className="bg-transparent border-none text-2xl font-bold cursor-pointer underline text-blue-600 hover:text-blue-800" onPress={() => setLocation(
             { latitude: 40.754402, longitude: -73.978875 })}>Demo Location</Button>
          </h1>
        </div>
      </div>
    );
  }
  
  return (
    <App />
  );
};

export default Home;
