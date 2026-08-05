import { useConfig } from "../../containers/ConfigProvider";
// Header lockup. Light uses the "sezzle / pay in 5" mark from the design
// handoff; dark falls back to the horizontal "Buy Now, Pay Later" mark, since
// no white "pay in 5" lockup ships with the handoff.
import enLight from "../../assets/sezzle-pay-in-5.webp";
import enDark from "../../assets/sezzle-horizontal-bnpl-white.png";
import React from "react";

function Logo(): React.JSX.Element {
  const { config, translation } = useConfig();
  if (!config) {
    return <></>
  }
  // Light is the default: only an explicit "dark" theme uses the white logo;
  // any other value falls back to the light lockup.
  const isDark = config.theme === "dark";
  const logoImg: string = isDark ? enDark : enLight;
  // Accessible name is the localized alt text (sourced from translations, never
  // hardcoded English). width/height set each lockup's own intrinsic ratio so
  // the browser reserves the right space (CSS caps the rendered height).
  return (
    <img
      src={logoImg}
      alt={translation.logoAltText}
      width={isDark ? 135 : 136}
      height={isDark ? 38 : 46}
    />
  );
}

export default Logo;
