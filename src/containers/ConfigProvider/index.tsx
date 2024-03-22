import { createContext, useContext, ReactNode } from "react";
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
  config: AppConfig;
  translation: ITranslation;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const storedConfig: string =
    localStorage.getItem("about_sezzle_config") || "";
  const parsedConfig: AppConfig = JSON.parse(storedConfig);
  const appConfig: AppConfig = {
    merchant_uuid: parsedConfig.merchant_uuid || "",
    theme: parsedConfig.theme || DEFAULT_THEME,
    language: parsedConfig.language || DEFAULT_LANGUAGE,
    origin: parsedConfig.origin || "",
  };
  const t = new Translation(appConfig.language);
  const translation = t.get();
  return (
    <ConfigContext.Provider
      value={{ config: appConfig, translation: translation }}
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
