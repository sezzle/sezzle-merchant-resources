import { useConfig } from "../../containers/ConfigProvider";
import enLight from "../../assets/light-en.svg";
import frLight from "../../assets/light-fr.svg";
import enDark from "../../assets/dark-en.svg";
import frDark from "../../assets/dark-fr.svg";

function Logo(): JSX.Element {
  const { config } = useConfig();
  if (!config) {
    return <></>
  }
  const logoMap: Record<string, Record<string, string>> = {
    light: {
      en: enLight,
      fr: frLight,
    },
    dark: {
      en: enDark,
      fr: frDark,
    },
  };

  const logoImg: string = logoMap[config.theme][config.language];
  return <img src={logoImg} alt="Logo" />;
}

export default Logo;
