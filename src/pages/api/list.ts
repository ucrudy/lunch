import {getLogoPathLocal } from '@/lib/logoPath';
import { getMenuPathLocal } from '@/lib/menuPath';
import { Lunch } from '@/types/lunch';
import { NextApiRequest, NextApiResponse } from 'next';

const FOURSQUARE_API_KEY = process.env.FOURSQUARE_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { latitude, longitude, distance, offset } = req.query;
    const rawPriceRange = req.query['priceRange[]'];
    const priceRange = Array.isArray(rawPriceRange) ? rawPriceRange : [rawPriceRange];

    const radius = distance ? Math.round(parseInt(distance as string) * 1609.34) : 4000;
    const keyword = 'lunch';
    const limit = (parseInt(offset as string) == 0) ? 20 : 10;

    const min_price = priceRange[0] || 1;
    const max_price = priceRange[1] || 4;
    const url = `https://api.foursquare.com/v3/places/search?ll=${latitude},${longitude}&radius=${radius}&query=${keyword}&limit=${limit}&min_price=${min_price}&max_price=${max_price}&offset=${offset}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
        'Authorization': FOURSQUARE_API_KEY || '',
        'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      const tasks = data.results.map(async (result: Lunch) => {
        // get the logo path
        try {
          result.logo = await getLogoPathLocal(result.name) || '';
        } catch (e) {
          result.logo = '';
          console.log(e);
        }

        // get the menu link
        try {
          result.menu_link = await getMenuPathLocal(result.name) || '';
        } catch (e) {
          result.menu_link = '';
          console.log(e);
        }

        return result;
      });

      await Promise.all(tasks);

      res.json(data);

    } catch (error) {
      res.status(500).json({ error: 'Error fetching data /list', data: error });
    }
  } else {
    // Handle other HTTP methods (e.g., POST, PUT)
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
