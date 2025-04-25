import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGE_KEY = '@ntc_app/language';
const USER_KEY = '@ntc_app/user';
const BIOMETRICS_KEY = '@ntc_app/use_biometrics';

const STORAGE_KEYS = {
  PHONE_NUMBER: '@ntc_mobile_phone',
};

export const storage = {
    // Language preferences
    getLanguage: async () => {
        try {
            const lang = await AsyncStorage.getItem(LANGUAGE_KEY);
            return lang || 'en';
        } catch {
            return 'en';
        }
    },

    setLanguage: async (lang: string) => {
        try {
            await AsyncStorage.setItem(LANGUAGE_KEY, lang);
        } catch { }
    },

    // User data
    getUser: async () => {
        try {
            const userString = await AsyncStorage.getItem(USER_KEY);
            return userString ? JSON.parse(userString) : null;
        } catch {
            return null;
        }
    },

    setUser: async (user: any) => {
        try {
            await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
        } catch { }
    },

    clearUser: async () => {
        try {
            await AsyncStorage.removeItem(USER_KEY);
        } catch { }
    },

    // Biometric preferences
    getUseBiometrics: async () => {
        try {
            const value = await AsyncStorage.getItem(BIOMETRICS_KEY);
            return value === 'true';
        } catch {
            return false;
        }
    },

    setUseBiometrics: async (useBiometrics: boolean) => {
        try {
            await AsyncStorage.setItem(BIOMETRICS_KEY, useBiometrics.toString());
        } catch { }
    },

    // Clear all data
    clearAll: async () => {
        try {
            await AsyncStorage.multiRemove([
                LANGUAGE_KEY,
                USER_KEY,
                BIOMETRICS_KEY,
            ]);
        } catch { }
    },
};

export const savePhoneNumber = async (phoneNumber: string) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.PHONE_NUMBER, phoneNumber);
  } catch (error) {
    console.error('Error saving phone number:', error);
  }
};

export const getPhoneNumber = async () => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.PHONE_NUMBER);
  } catch (error) {
    console.error('Error getting phone number:', error);
    return null;
  }
};

export const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};