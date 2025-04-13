import { getLogoPathApi, getLogoPathLocal } from '@/lib/logoPath';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { latitude, longitude } = req.query;

    const radius = 6000;
    const keyword = 'fast food';
    const limit = 6;
    const foursquareApiKey = 'fsq3v5Khp/RLK2ZAn2HoqG64KGkOTHmBYW2sFBnnYKjx83A=';
    const fUrl = `https://api.foursquare.com/v3/places/search?ll=${latitude},${longitude}&radius=${radius}&query=${keyword}&limit=${limit}`;

    try {
      const response = await fetch(fUrl, {
        method: 'GET',
        headers: {
        'Authorization': foursquareApiKey,  // Set the authorization token as a header
        'Content-Type': 'application/json',     // Optional: Set content type to JSON
        },
      });
      const data = await response.json();

      const tasks = data.results.map(async (result: any) => {
        result.menu_link = 'https://www.mcdonalds.com/menu';

        // get the logo path, local if exists, otherwise from API
        const name = await getLogoPathLocal(result.name);
        if (name) {
          result.logo = name;
        } else {
          result.logo = await getLogoPathApi(result.name);
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
