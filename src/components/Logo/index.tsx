import { useConfig } from "../../containers/ConfigProvider";
// Header uses the horizontal "Buy Now, Pay Later" lockup: full-color on light
// backgrounds, white on dark. Both share the same intrinsic ratio.
import enLight from "../../assets/sezzle-horizontal-full-color.png";
import enDark from "../../assets/sezzle-horizontal-bnpl-white.png";
import React from "react";

function Logo(): React.JSX.Element {
  const { config } = useConfig();
  if (!config) {
    return <></>
  }
  // Light is the default: only an explicit "dark" theme uses the white logo;
  // any other value falls back to the light (full-color) logo.
  const logoImg: string = config.theme === "dark" ? enDark : enLight;
  // width/height set the intrinsic ratio so the browser reserves the right
  // space (CSS still caps the rendered height to 38px).
  return <img src={logoImg} alt="Logo" width={135} height={38} />;
}

export default Logo;
