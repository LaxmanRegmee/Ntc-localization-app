import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { supabase } from '../utils/supabase';
import en from './en';
import ne from './ne';

export interface Translations {
    [key: string]: string | Translations;
}

export function loadDynamicTranslations() {
    return Promise.resolve(); // Placeholder for future dynamic translations
}

export function subscribeToTranslations() {
    const channel = supabase
        .channel('translations')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'translations',
            },
            async (payload) => {
                const { new: newTranslation } = payload;
                if (newTranslation) {
                    const { language, key, value } = newTranslation as { language: string; key: string; value: string };
                    const resources = i18n.getResourceBundle(language, 'translation') as Translations;
                    if (resources) {
                        resources[key] = value;
                        i18n.addResourceBundle(language, 'translation', resources);
                    }
                }
            }
        )
        .subscribe();

    return channel;
}