import enTranslation from "../translations/en.json";
import frTranslation from "../translations/fr.json";
import { DEFAULT_LANGUAGE } from "../constants";
import { ITranslation } from "../interface";

class Translation {
  private language: string | null;
  private translationsMap: Record<string, any>;

  constructor(language: string) {
    this.language = null;
    this.translationsMap = {
      en: enTranslation,
      fr: frTranslation,
    };
    this.setLanguage(language);
  }

  private setLanguage(language: string): void {
    this.language = this.validateLanguage(language);
  }

  public getLanguage(): string | null {
    return this.language;
  }

  public get(): ITranslation {
    return this.translationsMap[this.language || DEFAULT_LANGUAGE];
  }

  private validateLanguage(language: string): string {
    const supportedLanguages = Object.keys(this.translationsMap);
    return supportedLanguages.includes(language) ? language : DEFAULT_LANGUAGE;
  }
}

export default Translation;
