import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { DEFAULT_LANGUAGE, DEFAULT_THEME } from "../../constants";
import Translation from "../../utils/Translation";
import { ITranslation } from "../../interface";

export interface AppConfig {
  merchant_uuid: string;
  theme: string;
  language: string;
  origin: string;
  isLongTerm: boolean;
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
          origin: event.origin || "",
          isLongTerm: event.data.isLongTerm || false,
        });
        window.removeEventListener("message", handleMessage);
      }
    };

    window.addEventListener("message", handleMessage);

    // Signal to parent that we're ready to receive config
    // This fixes Safari timing issue where onload fires before React mounts
    if (window.parent !== window) {
      window.parent.postMessage({ key: "signal_about_sezzle_ready" }, "*");
    }

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  // rendering only when the config is received. If not,
  // <App> renders twice, once with default config and
  // once after the config is recieved. This will cause the
  // hooks to run twice, thus GeoIP will be hit twice and
  // event log will be sent twice.
  if (!aboutSezzleConfig) return <></>;

  const t = new Translation(aboutSezzleConfig?.language || DEFAULT_LANGUAGE);
  const translation = t.get();

  return (
    <ConfigContext.Provider value={{ config: aboutSezzleConfig, translation }}>
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
