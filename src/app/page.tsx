import { getFFBSettings } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function Home() {
  try {
    const ffbSettingsData = {
      settings: await getFFBSettings()
    };
    
    // ... rest of your component code ...
    
  } catch (error) {
    console.error('Failed to fetch FFB settings:', error);
    // You might want to handle the error appropriately in your UI
    return <div>Error loading settings. Please try again later.</div>;
  }
} 