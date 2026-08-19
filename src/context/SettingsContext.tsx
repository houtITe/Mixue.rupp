import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { subscribeToSettings, saveSettings } from "@/integrations/firebase/settings";

export type SiteSettings = {
  website: {
    name: string;
    tagline: string;
    description: string;
    logoUrl: string;
    faviconUrl: string;
  };
  business: {
    name: string;
    address: string;
    phone: string;
    email: string;
    hours: { day: string; open: string; close: string }[];
  };
  social: {
    facebook: string;
    instagram: string;
    telegram: string;
    tiktok: string;
  };
  hero: {
    title: string;
    subtitle: string;
    imageUrl: string;
  };
  footer: {
    copyright: string;
    description: string;
    contact: string;
  };
  theme: {
    primary: string;
    secondary: string;
    accent: string;
  };
  maintenanceMode: boolean;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  website: {
    name: "Mixue of RUPP",
    tagline: "Ice Cream · Tea",
    description:
      "Fresh ice cream, bubble tea and fruit refreshers on the Royal University of Phnom Penh campus.",
    logoUrl: "/logo.jpg",
    faviconUrl: "/favicon.ico",
  },
  business: {
    name: "Mixue of RUPP",
    address: "Royal University of Phnom Penh, Phnom Penh, Cambodia",
    phone: "+855 23 880 000",
    email: "mixuerupp@gmail.com",
    hours: [
      { day: "Monday–Friday", open: "08:00", close: "22:00" },
      { day: "Saturday", open: "08:00", close: "22:00" },
      { day: "Sunday", open: "09:00", close: "20:00" },
    ],
  },
  social: {
    facebook: "",
    instagram: "",
    telegram: "",
    tiktok: "",
  },
  hero: {
    title: "Sweet moments, every scoop & sip.",
    subtitle:
      "Mixue of RUPP is a modern ice-cream and tea brand built by students, for students. Freshly whipped soft-serve, hand-shaken milk teas, and fruity refreshers — all under one friendly roof.",
    imageUrl:
      "https://website-admin.snowking.cn/profile/upload/2024/03/21/home-one-3_20240321175911A121.png",
  },
  footer: {
    copyright: `© ${new Date().getFullYear()} Mixue of RUPP. All rights reserved.`,
    description:
      "Fresh ice cream, bubble tea and fruity refreshers — crafted daily on campus for the RUPP community.",
    contact: "Royal University of Phnom Penh · mixuerupp@gmail.com",
  },
  theme: {
    primary: "",
    secondary: "",
    accent: "",
  },
  maintenanceMode: false,
};

type SettingsState = {
  settings: SiteSettings;
  loading: boolean;
  updateSettings: (settings: SiteSettings) => Promise<void>;
};

const SettingsContext = createContext<SettingsState | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToSettings(DEFAULT_SETTINGS, (s) => {
      setSettings(s);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme.primary) root.style.setProperty("--primary", settings.theme.primary);
    if (settings.theme.secondary) root.style.setProperty("--secondary", settings.theme.secondary);
    if (settings.theme.accent) root.style.setProperty("--accent", settings.theme.accent);
    if (settings.website.name) document.title = settings.website.name;

    if (settings.website.faviconUrl) {
      let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = settings.website.faviconUrl;
    }

    if (settings.website.description) {
      let meta = document.querySelector<HTMLMetaElement>("meta[name='description']");
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "description";
        document.head.appendChild(meta);
      }
      meta.content = settings.website.description;
    }
  }, [settings]);

  const value = useMemo<SettingsState>(
    () => ({
      settings,
      loading,
      updateSettings: async (s) => {
        await saveSettings(s);
      },
    }),
    [settings, loading],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside <SettingsProvider>");
  return ctx;
}
