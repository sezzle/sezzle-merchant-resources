import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { DEFAULT_LANGUAGE, DEFAULT_THEME } from "../../constants";
import Translation from "../../utils/Translation";
import { ITranslation } from "../../interface";

interface AppConfig {
  merchant_uuid: string;
  theme: string;
  language: string;
  origin: string;
}

interface ConfigContextType {
  config: AppConfig | undefined;
  translation: ITranslation;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const [aboutSezzleConfig, setAboutSezzleConfig] = useState<AppConfig>();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.key === "about_sezzle_config") {
        setAboutSezzleConfig({
          merchant_uuid: event.data.merchant_uuid || "",
          theme: event.data.theme || DEFAULT_THEME,
          language: event.data.language || DEFAULT_LANGUAGE,
          origin: event.origin || ""
        });
        window.removeEventListener('message', handleMessage);
      }
    };

    window.addEventListener('message', handleMessage);
  }, []);

  const t = new Translation(aboutSezzleConfig?.language || DEFAULT_LANGUAGE);
  const translation = t.get();

  return (
    <ConfigContext.Provider
      value={{ config: aboutSezzleConfig, translation }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
};
