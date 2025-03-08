import { getFFBSettings } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const ffbSettingsData = {
    settings: await getFFBSettings()
  };
} 