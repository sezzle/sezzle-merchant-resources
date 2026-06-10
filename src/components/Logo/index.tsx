import { useConfig } from "../../containers/ConfigProvider";
import enLight from "../../assets/Color-Logo.svg";
import enDark from "../../assets/Color-White-Logo.svg";
import React from "react";

function Logo(): React.JSX.Element {
  const { config } = useConfig();
  if (!config) {
    return <></>
  }
  // Light is the default: only an explicit "dark" theme uses the white logo;
  // any other value falls back to the light (full-color) logo.
  const logoImg: string = config.theme === "dark" ? enDark : enLight;
  return <img src={logoImg} alt="Logo" height="75px" width="300px"/>;
}

export default Logo;
