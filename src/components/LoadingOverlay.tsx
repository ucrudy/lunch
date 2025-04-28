import { Spinner } from '@heroui/react';
import React from 'react';
import { useAppContext } from './AppContext';

type Props = {
    isLoading: boolean;
};

const LoadingOverlay: React.FC<Props> = ({ isLoading }) => {
  if (!isLoading) return null;
  const { location } = useAppContext();
  const label = !location ? 'Please enable location' : undefined;

  return (
    <div className="fixed inset-0 z-50 bg-gray-800/50 backdrop-blur-sm flex items-center justify-center">
        <Spinner label={label} labelColor="warning" color="warning" variant="gradient" size="lg" />
    </div>
  );
};

export default LoadingOverlay;
