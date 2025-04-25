import * as LocalAuthentication from 'expo-local-authentication';
import { storage } from './storage';
import { supabase, checkNetworkAndRetry } from './supabase';

export interface UserProfile {
    id: string;
    phone_number?: string | null;
    name?: string | null;
    email?: string | null;
    balance: number;
    data_balance: number;
    has_4g?: boolean;
}

export const auth = {
    async isBiometricAvailable(): Promise<boolean> {
        try {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            return compatible;
        } catch {
            return false;
        }
    },

    async authenticate(): Promise<boolean> {
        try {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Authenticate to continue',
                fallbackLabel: 'Use PIN instead',
                disableDeviceFallback: false,
            });
            return result.success;
        } catch {
            return false;
        }
    },

    async shouldUseBiometrics(): Promise<boolean> {
        try {
            const useBiometrics = await storage.getUseBiometrics();
            return useBiometrics || false;
        } catch {
            return false;
        }
    },
};

export const signInWithPhone = async (phoneNumber: string, password: string) => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            phone: phoneNumber,
            password,
        });

        if (error) throw error;

        if (data.user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', data.user.id)
                .single();

            await storage.setUser(data.user);
            return { user: profile as UserProfile, error: null };
        }

        return { user: null, error: new Error('No user data returned') };
    } catch (error) {
        return { user: null, error };
    }
};

export const signUpWithPhone = async (phoneNumber: string, password: string) => {
    return await checkNetworkAndRetry(async () => {
        try {
            const { data, error } = await supabase.auth.signUp({
                phone: phoneNumber,
                password,
            });

            if (error) throw error;

            if (data.user) {
                // Create user profile
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert([
                        {
                            id: data.user.id,
                            phone_number: phoneNumber,
                            name: phoneNumber, // Set phone number as default name
                            balance: 0,
                            data_balance: 0,
                        },
                    ]);

                if (profileError) throw profileError;

                await storage.setUser(data.user);
                return { user: data.user, error: null };
            }

            return { user: null, error: new Error('No user data returned') };
        } catch (error: any) {
            return { user: null, error };
        }
    });
};

export const signInWithEmail = async (email: string, password: string) => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;

        if (data.user) {
            await storage.setUser(data.user);
            return { user: data.user, error: null };
        }

        return { user: null, error: new Error('No user data returned') };
    } catch (error) {
        return { user: null, error };
    }
};

export const signUpWithEmail = async (email: string, password: string, phoneNumber?: string) => {
    return await checkNetworkAndRetry(async () => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        phone_number: phoneNumber
                    }
                }
            });

            if (error) throw error;

            if (data.user) {
                // Create user profile with a default name from email or phone
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert([
                        {
                            id: data.user.id,
                            email: email,
                            phone_number: phoneNumber || data.user?.phone || '',
                            name: email.split('@')[0], // Use email username as default name
                            balance: 0,
                            data_balance: 0,
                        }
                    ]);

                if (profileError) throw profileError;

                await storage.setUser(data.user);
                return { user: data.user, error: null };
            }

            return { user: null, error: new Error('No user data returned') };
        } catch (error: any) {
            return { user: null, error };
        }
    });
};

export const signOut = async () => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        await storage.clearUser();
        return { error: null };
    } catch (error) {
        return { error };
    }
};

export const getCurrentUser = async () => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { user: null, error: null };
        }

        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) throw error;

        return { user: profile as UserProfile, error: null };
    } catch (error) {
        return { user: null, error };
    }
};

export const getUserProfile = async () => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { profile: null, error: new Error('User not authenticated') };
        }

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) throw error;
        return { profile: data as UserProfile, error: null };
    } catch (error) {
        return { profile: null, error: error as Error };
    }
};