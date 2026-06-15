import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import {
  DEFAULT_LANGUAGE,
  DEFAULT_THEME,
  DEFAULT_COUNTRY_CODE,
  DEFAULT_NUMBER_OF_PAYMENTS,
  DEFAULT_MAX_PRICE,
} from "../../constants";
import Translation from "../../utils/Translation";
import { ITranslation } from "../../interface";
import {
  resolveLTConfig,
  DEFAULT_LT_GROUP,
  ResolvedLTConfig,
  TermsToShow,
} from "../../utils/ltConfig";

export interface AppConfig {
  merchant_uuid: string;
  theme: string;
  language: string;
  origin: string;
  isLongTerm: boolean;
  // Merchant determines the viewer's country (we no longer auto-detect it).
  // Defaults to US; "CA" disables Pay-in-5 and all long-term financing.
  countryCode: string;
  // 4 or 5; defaults to 5. Forced to 4 in Canada.
  numberOfPayments: number;
  // Bi-weekly price bounds (mirrors sezzle-widget-react minPrice/maxPrice).
  minPrice: number;
  maxPrice: number;
  // Raw long-term inputs (resolved into `ltConfig` below).
  LTgroup?: string;
  minPriceLT?: number;
  maxPriceLT?: number;
  minAPR?: number;
  medianAPR?: number;
  maxAPR?: number;
  termsToShow?: TermsToShow;
}

interface ConfigContextType {
  config: AppConfig | undefined;
  translation: ITranslation;
  // Resolved long-term config (after Canada gating). Always present.
  ltConfig: ResolvedLTConfig;
  // numberOfPayments after Canada gating (CA => 4).
  effectiveNumberOfPayments: number;
  isCA: boolean;
}

export const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

// Build the resolved context value (LT config + Canada gating + effective
// numberOfPayments) from the raw merchant config. Exported for tests that
// provide a ConfigContext directly.
export const deriveConfigContext = (
  config: AppConfig
): Omit<ConfigContextType, "config" | "translation"> => {
  const isCA = (config.countryCode || DEFAULT_COUNTRY_CODE).toUpperCase() === "CA";

  // Backwards compatibility: isLongTerm alone (no LTgroup, no minPriceLT) enables
  // the default long-term preset, preserving the page's pre-LTgroup behaviour.
  const ltGroup =
    config.LTgroup ||
    (config.isLongTerm && !(Number(config.minPriceLT) > 0)
      ? DEFAULT_LT_GROUP
      : undefined);

  let ltConfig = resolveLTConfig({
    LTgroup: ltGroup,
    minPriceLT: config.minPriceLT,
    maxPriceLT: config.maxPriceLT,
    minAPR: config.minAPR,
    medianAPR: config.medianAPR,
    maxAPR: config.maxAPR,
    termsToShow: config.termsToShow,
  });

  // No long-term financing is offered in Canada: force the render trigger off.
  if (isCA) {
    ltConfig = { ...ltConfig, minPriceLT: 0 };
  }

  // Pay-in-5 is unavailable in Canada; otherwise honor an explicit 4, default 5.
  const effectiveNumberOfPayments = isCA
    ? 4
    : Number(config.numberOfPayments) === 4
      ? 4
      : 5;

  return { ltConfig, effectiveNumberOfPayments, isCA };
};

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
          countryCode: event.data.countryCode || DEFAULT_COUNTRY_CODE,
          numberOfPayments:
            event.data.numberOfPayments || DEFAULT_NUMBER_OF_PAYMENTS,
          minPrice: event.data.minPrice || 0,
          maxPrice: event.data.maxPrice || DEFAULT_MAX_PRICE,
          LTgroup: event.data.LTgroup,
          minPriceLT: event.data.minPriceLT,
          maxPriceLT: event.data.maxPriceLT,
          minAPR: event.data.minAPR,
          medianAPR: event.data.medianAPR,
          maxAPR: event.data.maxAPR,
          termsToShow: event.data.termsToShow,
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
  // hooks to run twice, thus the event log will be sent twice.
  if (!aboutSezzleConfig) return <></>;

  const t = new Translation(aboutSezzleConfig?.language || DEFAULT_LANGUAGE);
  const translation = t.get();
  const derived = deriveConfigContext(aboutSezzleConfig);

  return (
    <ConfigContext.Provider
      value={{ config: aboutSezzleConfig, translation, ...derived }}
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
