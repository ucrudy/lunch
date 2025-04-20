'use client'
import React, { createContext, useState, useContext, ReactNode } from "react";
import { Lunch } from "@/types/lunch";
import { Location } from "@/types/location";

export interface AppState {
  lunch: Lunch[] | null;
  loading: boolean;
  location: Location | null;
  distance: number | null;
  priceRange: number[] | null;
  page: number | null;
  isModalOpen: boolean;
  isFilterDrawerOpen: boolean;
  isScrolling: boolean;
}

// Define the context value
interface AppContextType {
  lunch: Lunch[];
  setLunch: React.Dispatch<React.SetStateAction<Lunch[]>>;
  location: Location | null;
  setLocation: (newLocation: Location) => Promise<void>;
  distance: number | null;
  setDistance: (newDistance: number) => void;
  priceRange: number[] | null;
  setPriceRange: (newPrice: number[]) => void;
  page: number | null;
  setPage: (newPage: number) => void;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isFilterDrawerOpen: boolean;
  setIsFilterDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isScrolling: boolean;
  setIsScrolling: React.Dispatch<React.SetStateAction<boolean>>;
}
// Create a context for managing modal state
const AppContext = createContext<AppContextType | undefined>(undefined);

// GlobalProvider component accepts initialValue for state
interface AppProviderProps {
  children: ReactNode;
  initialValue: AppState;
}

// ModalProvider component that will hold the modal state
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [lunch, setLunch] = useState<Lunch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [location, setLocation] = useState<Location | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);
  const [distance, setDistanceState] = useState<number | null>(5);
  const [priceRange, setPriceRangeState] = useState<number[] | null>([1,2]);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const [page, setPage] = useState<number | null>(1);

  const updatePriceRange = async (newPrice: number[]) => {
    await setLunch([]);
    await setPage(1);
    setPriceRangeState(newPrice);
  };

  const updateDistance = async (newDistance: number) => {
    await setLunch([]);
    await setPage(1);
    setDistanceState(newDistance);
  };

  const updateLocation = async (newLocation: Location) => {
    await setLunch([]);
    await setPage(1);
    setLocation(newLocation);
  };

  return (
    <AppContext.Provider value={{ lunch, setLunch, loading, setLoading, location, page, setPage, setLocation: updateLocation, isModalOpen, setIsModalOpen, isFilterDrawerOpen, setIsFilterDrawerOpen, distance, setDistance: updateDistance, priceRange, setPriceRange: updatePriceRange, isScrolling, setIsScrolling }}>
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
