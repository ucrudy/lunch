'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { AppState, useAppContext } from '@/app/AppContext';
import BubbleChart from '@/app/components/Bubbles/BubbleChart';
import {Button} from '@heroui/button'; 
import LunchModal from './components/LunchModal';
import PriceSlider from './components/PriceSlider';
import DistanceSlider from './components/DistanceSlider';
import { Mouse, SlidersHorizontal } from 'lucide-react';
import { Chip, Drawer, DrawerBody, DrawerContent, DrawerHeader } from '@heroui/react';

const Home: React.FC<AppState> = () => {
  const { lunch, setLunch, isFilterDrawerOpen, setIsFilterDrawerOpen, distance, priceRange } = useAppContext();
  const { location, setLocation } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const state = useAppContext();
  console.log("state", state);
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
            distance: distance,
            priceRange: priceRange,
        },
      });

      if (response.status < 200 || response.status >= 300) {
        throw new Error('Failed to fetch');
      }
      
      const result = response;

      console.log("result", result.data.results);

      setLunch(result.data.results);
    }
    fetchData();
  }, [location?.latitude, location?.longitude, distance, priceRange]);

  return (
    <div className="container mx-auto">
      {location && (
        <p>
          Location: {location.latitude}, {location.longitude}
        </p>
      )}
      <Drawer isOpen={isFilterDrawerOpen} placement="left" onOpenChange={() => setIsFilterDrawerOpen(false)}>
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1">Filters</DrawerHeader>
              <DrawerBody className="flex items-center">
                <DistanceSlider />
                <PriceSlider />
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
      
      <Button isIconOnly aria-label="settings" className="absolute z-10 bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
      radius="full" size="lg" variant="solid" onPress={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}>
        <SlidersHorizontal />
      </Button>
      <BubbleChart lunch={lunch} />
      <LunchModal />
      <div className="flex justify-center mt-4">
        <Chip color="warning" variant="flat">
          <div className='flex items-center'><Mouse />Scroll for more</div>
        </Chip>
      </div>
    </div>
  );
};

export default Home;
