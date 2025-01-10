import { ApplicationSettings } from '@nativescript/core';

export class LanguageService {
  private static readonly LANGUAGE_KEY = 'selected_language';
  private currentLanguage: string;
  private translations: { [key: string]: { [key: string]: string } } = {};

  constructor() {
    // Load translations
    this.translations.en = require('../i18n/en.json');
    this.translations.ne = require('../i18n/ne.json');
    
    // Get saved language or default to Nepali
    this.currentLanguage = ApplicationSettings.getString(LanguageService.LANGUAGE_KEY, 'ne');
  }

  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  setLanguage(lang: string) {
    this.currentLanguage = lang;
    ApplicationSettings.setString(LanguageService.LANGUAGE_KEY, lang);
  }

  translate(key: string, params: { [key: string]: any } = {}): string {
    let text = this.translations[this.currentLanguage]?.[key] || key;
    
    // Replace parameters
    Object.keys(params).forEach(param => {
      text = text.replace(`{{${param}}}`, params[param].toString());
    });
    
    return text;
  }
}