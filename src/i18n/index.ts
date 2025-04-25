import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { storage } from '../utils/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './en';
import ne from './ne';

const LANGUAGE_KEY = 'selected_language';

export const getStoredLanguage = async () => {
    try {
        return await AsyncStorage.getItem(LANGUAGE_KEY) || 'ne';
    } catch {
        return 'ne';
    }
};

export const setStoredLanguage = async (lang: string) => {
    try {
        await AsyncStorage.setItem(LANGUAGE_KEY, lang);
    } catch (error) {
        console.error('Error saving language preference:', error);
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            ne: { translation: ne }
        },
        lng: 'en',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        },
        react: {
            useSuspense: false
        }
    });

// Save language preference whenever it changes
i18n.on('languageChanged', (lng) => {
    storage.setLanguage(lng);
});

export default i18n;