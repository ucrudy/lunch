import { Location } from "@/types/location";
import axios from "axios";

export async function fetchLunch(location: Location | null, distance: number | null, priceRange: number[] | null, page: number | null) {
    const newPage = page || 1; 
    // first page returns 20, after that return 10 each
    const offset = (newPage == 1 ? newPage - 1 : (newPage * 10));
    console.log("offset",offset);
    const response = await axios.get('/api/list', {
      params: {
          latitude: location?.latitude,
          longitude: location?.longitude,
          distance,
          priceRange,
          offset,
      },
    });

    if (response.status < 200 || response.status >= 300) {
      throw new Error('Failed to fetch');
    }
    
    return response.data.results;
  }