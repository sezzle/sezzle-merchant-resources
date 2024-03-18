import React, { createContext, useContext, ReactNode } from "react";
import { DEFAULT_LANGUAGE, DEFAULT_THEME } from "../../constants";
import Translation from "../../utils/Translation";
import { ITranslation } from "../../interface";

interface AppConfig {
  theme: string;
  language: string;
}

interface ConfigContextType {
  config: AppConfig;
  translation: ITranslation;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const storedConfig = localStorage.getItem("how_sezzle_works_config");
  let appConfig: AppConfig = {
    theme: DEFAULT_THEME,
    language: DEFAULT_LANGUAGE,
  };
  if (storedConfig) {
    appConfig = JSON.parse(storedConfig);
  }

  const t = new Translation(appConfig.theme);
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
