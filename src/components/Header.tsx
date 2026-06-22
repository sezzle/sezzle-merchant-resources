// Sticky page header: logo (theme-aware via Logo) + a "Shop Now" CTA.
import { ITranslation } from "../interface";
import Logo from "./Logo";

interface HeaderProps {
  translation: ITranslation;
  shopUrl: string;
}

const Header = ({ translation, shopUrl }: HeaderProps) => (
  <header className="hsw-header">
    <div className="sezzle-logo" aria-label={translation.logoAltText}>
      <Logo />
    </div>
    <a
      className="hsw-btn hsw-btn-primary hsw-header-cta"
      href={shopUrl}
      rel="noreferrer"
    >
      {translation.heroShopNow}
    </a>
  </header>
);

export default Header;
