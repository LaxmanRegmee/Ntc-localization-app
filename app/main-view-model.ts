import { Observable } from '@nativescript/core';
import { LanguageService } from './services/language.service';

export class HelloWorldModel extends Observable {
  private languageService: LanguageService;
  private _balance: string = "NRs. 202";
  private _validUntilText: string;
  private _validUntilDate: string;
  private _user: string = "9866225000";

  constructor() {
    super();
    this.languageService = new LanguageService();
    this._validUntilText = this.translate('valid_until');
    this._validUntilDate = "2027-03-08"; // Example date, you can set this dynamically
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
    this._validUntilText = this.translate('valid_until');
    this.notifyPropertyChange('validUntilText', this._validUntilText);
  }

  get currentLanguage(): string {
    return this.languageService.getCurrentLanguage();
  }

  get balance(): string {
    return this._balance;
  }

  get validUntilText(): string {
    return this._validUntilText;
  }

  get validUntilDate(): string {
    return this._validUntilDate;
  }

  get user(): string {
    return this._user;
  }
}