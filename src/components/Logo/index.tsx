import { useConfig } from "../../containers/ConfigProvider";
import enLight from "../../assets/Color-Logo.svg";
import enDark from "../../assets/Color-White-Logo.svg";
import React from "react";

function Logo(): React.JSX.Element {
  const { config } = useConfig();
  if (!config) {
    return <></>
  }
  const logoMap: Record<string, string> = {
      light: enLight,
      dark: enDark
  };

  const logoImg: string = logoMap[config.theme];
  return <img src={logoImg} alt="Logo" height="75px" width="300px"/>;
}

export default Logo;
