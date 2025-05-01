import fs from 'fs';
import path from 'path';
// import sharp from 'sharp';

const BRAND_FETCH_API_KEY = process.env.BRAND_FETCH_API_KEY;
const LOGO_DEV_API_KEY = process.env.LOGO_DEV_API_KEY;

// Helper to normalize names: lowercase, remove special characters
function normalizeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export async function getLogoPathLocal(name: string): Promise<string | null> {

    const dirPath = path.join(process.cwd(), 'public', 'logos');
    const logoFiles = fs.readdirSync(dirPath);

    // Build a map of normalized logo name → file path
    const logoMap: Record<string, string> = {};
    logoFiles.forEach(file => {
        const ext = path.extname(file);
        const key = path.basename(file, ext);
        logoMap[key] = `logos/${file}`;
    });

    const key = normalizeName(name);
    const logoFile = logoMap[key];
  
    if (!logoFile) {
      const logoFileApi = await getLogoPathApi(name);
      return logoFileApi;
    }

    return logoFile; // Return the public URL path
}

export async function getLogoPathApi(name: string): Promise<string | null> {
    
    const res = await fetch(`https://api.logo.dev/search?q=${name}`, {
        headers: {
            "Authorization": `Bearer: ${LOGO_DEV_API_KEY}`
        }
    });

    const dataLogo = await res.json();

    if (Array.isArray(dataLogo) && dataLogo.length > 0) {
        const url = dataLogo[0].logo_url;
        // const normalizeNamedName = normalizeName(name);

        // fire and forget download
        // downloadImage(normalizeNamedName, url);

        return url;
    }
    
    const res2 = await fetch(`https://api.brandfetch.io/v2/search/${name}?c=${BRAND_FETCH_API_KEY}`);
    
    const dataLogoBackup = await res2.json();

    if (Array.isArray(dataLogoBackup) && dataLogoBackup.length > 0) {
        const url = dataLogoBackup[0].icon;
        // const normalizeNamedName = normalizeName(name);

        // // fire and forget download
        // downloadImage(normalizeNamedName, url);

        return url;
    } else {
        console.log("No logo found for: ", name);
    }

    return null;
}

// Async "fire-and-forget" download
// async function downloadImage(name:string, url: string) {
//     const response = await fetch(url);
//     if (!response.ok) throw new Error('Failed to fetch image');
    
//     const buffer = await response.arrayBuffer();
//     const filename = `${name}.png`;
//     const filePath = path.join(process.cwd(), 'public', 'logos', filename);

//     // Use sharp to convert to PNG and save
//     await sharp(Buffer.from(buffer))
//       .png()
//       .toFile(filePath);
//   }