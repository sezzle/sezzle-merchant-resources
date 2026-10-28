// Sticky page header: logo (theme-aware via Logo) + a "Shop Now" CTA.
import { ITranslation } from "../interface";
import Logo from "./Logo";

interface HeaderProps {
  translation: ITranslation;
  shopUrl: string;
}

const Header = ({ translation, shopUrl }: HeaderProps) => (
  <header className="hsw-header">
    <div className="sezzle-logo">
      <Logo />
    </div>
    {/* target="_top" breaks out of the Sezzle iframe so the merchant's own
        site loads in the full window, not inside this embed. */}
    <a
      className="hsw-btn hsw-btn-primary hsw-header-cta"
      href={shopUrl}
      target="_top"
      rel="noreferrer"
    >
      {translation.heroShopNow}
    </a>
  </header>
);

export default Header;
