import { Observable } from '@nativescript/core';
import { LanguageService } from './services/language.service';

export class HelloWorldModel extends Observable {
  private languageService: LanguageService;
  private _balance: string = "Rs. 205.25";

  constructor() {
    super();
    this.languageService = new LanguageService();
    this.notifyPropertyChange('currentLanguage', this.currentLanguage);
  }

  translate(key: string, params = {}): string {
    return this.languageService.translate(key, params);
  }

  toggleLanguage() {
    const currentLang = this.languageService.getCurrentLanguage();
    const newLang = currentLang === 'en' ? 'ne' : 'en';
    this.languageService.setLanguage(newLang);
    this.notifyPropertyChange('currentLanguage', newLang);
    this.notifyPropertyChange('translations', {}); // Notify that translations have changed
  }

  get currentLanguage(): string {
    return this.languageService.getCurrentLanguage();
  }

  get balance(): string {
    return this._balance;
  }
}