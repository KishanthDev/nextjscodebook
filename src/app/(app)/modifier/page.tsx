import SettingsClient from "@/components/modifier/ModifierClient";
import { AppSettings } from "@/types/Modifier";

// --- Fetch settings on the server ---
async function fetchSettingsSSR(): Promise<AppSettings> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/settings`, {
      cache: "no-store", // always fresh data
    });
    if (!res.ok) throw new Error(`Failed to fetch settings: ${res.status}`);
    const data = await res.json();
    return data.settings as AppSettings;
  } catch (error) {
    console.error("SSR fetch error:", error);
    // fallback to local JSON if API fails
    const localData = (await import("../../../../data/modifier.json")).default;
    return localData as AppSettings;
  }
}

export default async function ModifierPage() {
  const settings = await fetchSettingsSSR();

  return <SettingsClient initialSettings={settings} />;
}
