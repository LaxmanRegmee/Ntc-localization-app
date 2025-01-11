import { ApplicationSettings } from '@nativescript/core';

export class LanguageService {
  private static readonly LANGUAGE_KEY = 'selected_language';
  private currentLanguage: string;
  private translations: any;

  constructor() {
    // Get saved language or default to Nepali
    this.currentLanguage = ApplicationSettings.getString(LanguageService.LANGUAGE_KEY, 'ne');
    // Load translations based on the current language
    this.translations = this.loadTranslations();
  }

  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  setLanguage(lang: string) {
    this.currentLanguage = lang;
    ApplicationSettings.setString(LanguageService.LANGUAGE_KEY, lang);
    this.translations = this.loadTranslations(); // Reload translations when language changes
  }

  translate(key: string, params: { [key: string]: any } = {}): string {
    let translation = this.translations[key] || key;
    if (params) {
      Object.keys(params).forEach(param => {
        translation = translation.replace(`{{${param}}}`, params[param].toString());
      });
    }
    return translation;
  }

  private loadTranslations() {
    // Load the appropriate translation file based on the current language
    if (this.currentLanguage === 'ne') {
      return require('../i18n/ne.json');
    } else {
      return require('../i18n/en.json');
    }
  }
}