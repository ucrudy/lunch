'use client'
import React, { createContext, useState, useContext, ReactNode } from "react";
import { Lunch } from "@/types/lunch";
import { Location } from "@/types/location";

export interface AppState {
  lunch: Lunch[] | [];
  location: Location | null;
  distance: number | null;
  priceRange: number[] | null;
  isModalOpen: boolean;
  isFilterDrawerOpen: boolean;
}

// Define the context value
interface AppContextType {
  lunch: Lunch[] | [];
  setLunch: React.Dispatch<React.SetStateAction<Lunch[] | []>>;
  location: Location | null;
  setLocation: React.Dispatch<React.SetStateAction<Location | null>>;
  distance: number | null;
  setDistance: React.Dispatch<React.SetStateAction<number | null>>;
  priceRange: number[] | null;
  setPriceRange: React.Dispatch<React.SetStateAction<number[] | null>>;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isFilterDrawerOpen: boolean;
  setIsFilterDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
// Create a context for managing modal state
const AppContext = createContext<AppContextType | undefined>(undefined);

// GlobalProvider component accepts initialValue for state
interface AppProviderProps {
  children: ReactNode;
  initialValue: AppState;
}

// ModalProvider component that will hold the modal state
export const AppProvider: React.FC<AppProviderProps> = ({ children, initialValue }) => {
  const [lunch, setLunch] = useState<Lunch[]>([]);
  const [location, setLocation] = useState<Location | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);
  const [distance, setDistance] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<number[] | null>(null);

  return (
    <AppContext.Provider value={{ lunch, setLunch, location, setLocation, isModalOpen, setIsModalOpen, isFilterDrawerOpen, setIsFilterDrawerOpen, distance, setDistance, priceRange, setPriceRange }}>
        {children}
    </AppContext.Provider>
  );
};

// Custom hook to access the global context
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within a AppProvider');
  }
  return context;
};
