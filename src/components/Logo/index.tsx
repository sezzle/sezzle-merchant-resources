import { useConfig } from "../../containers/ConfigProvider";
import enLight from "../../assets/light-en.svg";
import esLight from "../../assets/light-es.svg";
import frLight from "../../assets/light-fr.svg";
import enDark from "../../assets/dark-en.svg";
import esDark from "../../assets/dark-es.svg";
import frDark from "../../assets/dark-fr.svg";
import React from "react";

function Logo(): React.JSX.Element {
  const { config } = useConfig();
  if (!config) {
    return <></>
  }
  const logoMap: Record<string, Record<string, string>> = {
    light: {
      en: enLight,
      fr: frLight,
      es: esLight,
    },
    dark: {
      en: enDark,
      fr: frDark,
      es: esDark,
    },
  };

  const logoImg: string = logoMap[config.theme][config.language];
  return <img src={logoImg} alt="Logo" />;
}

export default Logo;
