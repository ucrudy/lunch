'use client';
import { useEffect } from 'react';
import { Funnel, Mouse } from 'lucide-react';
import {Button} from '@heroui/button'; 
import { Chip, Drawer, DrawerBody, DrawerContent, DrawerHeader } from '@heroui/react';
import { useAppContext } from '@/components/AppContext';
import BubbleChart from '@/components/Bubbles/BubbleChart';
import PriceSlider from '@/components/PriceSlider';
import DistanceSlider from '@/components/DistanceSlider';
import LoadingOverlay from '@/components/LoadingOverlay';
import InfoTag from '@/components/InfoTag';
import InfoModal from '@/components/InfoModal';
import { fetchLunch } from '@/lib/fetchLunch';

const App: React.FC = () => {
  const { lunch, setLunch, loading, setLoading, isFilterDrawerOpen, setIsFilterDrawerOpen, distance, priceRange, setIsModalOpen, isModalOpen } = useAppContext();
  const { location } = useAppContext();
  
  // get initial data of lunch places
  useEffect(() => {
    if (!location) return;
    setLoading(true);
    
    async function fetchData() {
      const lunch = await fetchLunch(location, distance, priceRange, 1);

      setLunch(lunch);
      setLoading(false);
    }
    fetchData();
  }, [location?.latitude, location?.longitude, distance, priceRange, location, setLoading, setLunch]);

  return (
    <div className="container mx-auto">
      <LoadingOverlay isLoading={loading} />
      <Drawer isOpen={isFilterDrawerOpen} placement="left" onOpenChange={() => setIsFilterDrawerOpen(false)}>
        <DrawerContent>
          {() => (
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
      
      <Button isIconOnly aria-label="settings" className="fixed top-4 left-4 z-10 bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
      radius="full" size="lg" variant="solid" onPress={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}>
        <Funnel />
      </Button>
      <BubbleChart lunch={lunch} />
      <div className="fixed bottom-2 left-1/2 -translate-x-1/2">
        <Chip classNames={{
            base: "bg-gradient-to-br from-indigo-500 to-pink-500 border-small border-white/50 shadow-pink-500/30",
            content: "drop-shadow shadow-black text-white",
          }} variant="shadow">
          <div className='flex items-center'><Mouse />Scroll for more</div>
        </Chip>
      </div>
      <InfoTag onClick={() => setIsModalOpen(!isModalOpen)} />
      <InfoModal />
    </div>
  );
};

export default App;
