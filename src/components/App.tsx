'use client';
import { useEffect } from 'react';
import axios from 'axios';
import { Mouse, SlidersHorizontal } from 'lucide-react';
import {Button} from '@heroui/button'; 
import { Chip, Drawer, DrawerBody, DrawerContent, DrawerHeader } from '@heroui/react';
import { useAppContext } from '@/components/AppContext';
import BubbleChart from '@/components/Bubbles/BubbleChart';
import PriceSlider from '@/components/PriceSlider';
import DistanceSlider from '@/components/DistanceSlider';
import LoadingOverlay from '@/components/LoadingOverlay';
import InfoTag from '@/components/InfoTag';
import InfoModal from '@/components/InfoModal';

const App: React.FC = () => {
  const { lunch, setLunch, loading, setLoading, isFilterDrawerOpen, setIsFilterDrawerOpen, distance, priceRange, setIsModalOpen, isModalOpen } = useAppContext();
  const { location } = useAppContext();
  
  const state = useAppContext();
  console.log("state", state);
  console.log("location", location);
  
  // use effect - fetch data
  useEffect(() => {
    if (!location) return;
    setLoading(true);

    async function fetchData() {
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
      setLoading(false);
    }
    fetchData();
  }, [location?.latitude, location?.longitude, distance, priceRange]);

  return (
    <div className="container mx-auto">
      <LoadingOverlay isLoading={loading} />
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
      <div className="flex justify-center mt-4">
        <Chip color="warning" variant="flat">
          <div className='flex items-center'><Mouse />Scroll for more</div>
        </Chip>
      </div>
      <InfoTag onClick={() => setIsModalOpen(!isModalOpen)} />
      <InfoModal />
    </div>
  );
};

export default App;
