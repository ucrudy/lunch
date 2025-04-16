import { Spinner } from '@heroui/react';
import React from 'react';

type Props = {
    isLoading: boolean;
};

const LoadingOverlay: React.FC<Props> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gray-800/50 backdrop-blur-sm flex items-center justify-center">
        <Spinner color="warning" variant="gradient" size="lg" />
    </div>
  );
};

export default LoadingOverlay;
