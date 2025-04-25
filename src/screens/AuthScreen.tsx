import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, Surface, Snackbar } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

export default function AuthScreen() {
    const { t } = useTranslation();
    const { signIn } = useAuth();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSignIn = async () => {
        if (!phoneNumber.trim() || !password.trim()) {
            setError(t('pleaseEnterAllFields'));
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await signIn(phoneNumber.trim(), password.trim());
        } catch (err) {
            console.error('Error signing in:', err);
            setError(t('errorSigningIn'));
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Surface style={styles.header}>
                <Text style={styles.headerTitle}>{t('login')}</Text>
                <Text style={styles.headerSubtitle}>
                    {t('loginDescription')}
                </Text>
            </Surface>

            <View style={styles.content}>
                <TextInput
                    label={t('phoneNumber')}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                    style={styles.input}
                />

                <TextInput
                    label={t('password')}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={styles.input}
                />

                <Button
                    mode="contained"
                    onPress={handleSignIn}
                    loading={loading}
                    style={styles.button}
                    labelStyle={{ fontWeight: 'bold' }}
                >
                    {t('login')}
                </Button>
            </View>

            <Snackbar
                visible={error !== null}
                onDismiss={() => setError(null)}
                duration={3000}
                style={styles.errorSnackbar}
            >
                {error}
            </Snackbar>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#00368D',
        padding: 16,
        elevation: 4,
    },
    headerTitle: {
        color: '#FEB831',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    headerSubtitle: {
        color: 'white',
        fontSize: 14,
    },
    content: {
        padding: 16,
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 8,
    },
    errorSnackbar: {
        backgroundColor: '#f44336',
    }
});