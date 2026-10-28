import { useConfig } from "../../containers/ConfigProvider";
// Header lockup. Light uses the "sezzle / pay in 5" mark from the design
// handoff, but only where Pay in 5 is actually offered; otherwise (Canada, or a
// merchant on 4 payments) it falls back to the generic "Buy Now, Pay Later"
// lockup so the header never advertises a plan the page hides. Dark always
// uses the white "Buy Now, Pay Later" mark, since no white "pay in 5" lockup
// ships with the handoff.
import enLight from "../../assets/sezzle-pay-in-5.webp";
import enLightGeneric from "../../assets/sezzle-horizontal-full-color.webp";
import enDark from "../../assets/sezzle-horizontal-bnpl-white.webp";
import React from "react";

function Logo(): React.JSX.Element {
  const { config, translation, effectiveNumberOfPayments } = useConfig();
  if (!config) {
    return <></>
  }
  // Light is the default: only an explicit "dark" theme uses the white logo;
  // any other value falls back to the light lockup.
  const isDark = config.theme === "dark";
  const showPI5Lockup = !isDark && effectiveNumberOfPayments === 5;
  const logoImg: string = isDark
    ? enDark
    : showPI5Lockup
      ? enLight
      : enLightGeneric;
  // Accessible name is the localized alt text (sourced from translations, never
  // hardcoded English). width/height set each lockup's own intrinsic ratio so
  // the browser reserves the right space (CSS caps the rendered height).
  return (
    <img
      src={logoImg}
      alt={translation.logoAltText}
      width={showPI5Lockup ? 136 : 135}
      height={showPI5Lockup ? 46 : 38}
    />
  );
}

export default Logo;
