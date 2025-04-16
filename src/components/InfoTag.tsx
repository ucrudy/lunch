import React from 'react';

interface InfoTagProps {
  onClick: () => void;
}

const InfoTag: React.FC<InfoTagProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-2 left-2 underline text-4xl font-bold bg-transparent border-none p-0 m-0 cursor-pointer hover:text-gray-900"
    >
      info
    </button>
  );
};

export default InfoTag;
