import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, Surface, Snackbar, Card, Appbar } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../utils/supabase';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    appbar: {
        backgroundColor: '#00368D',
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
    balanceText: {
        fontSize: 16,
        color: '#4caf50',
        fontWeight: 'bold',
        marginBottom: 16,
    },
    button: {
        marginTop: 8,
    },
    card: {
        margin: 16,
    },
    errorSnackbar: {
        backgroundColor: '#f44336',
    },
    successSnackbar: {
        backgroundColor: '#4caf50',
    },
    appbarTitle: {
        color: '#FEB831',
        fontSize: 20,
        fontWeight: 'bold',
    },
    backButton: {
    },
});

export default function BalanceTransferScreen() {
    const { t } = useTranslation();
    const { user, isLoading, refreshProfile } = useAuth();
    const navigation = useNavigation();
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!isLoading && !user) {
            navigation.navigate('Login' as never);
            return;
        }
    }, [user, isLoading]);

    const handleTransfer = async () => {
        if (!recipient.trim() || !amount.trim()) {
            setError(t('pleaseEnterAllFields'));
            return;
        }

        if (!user) {
            setError(t('pleaseLoginFirst'));
            return;
        }

        const transferAmount = parseFloat(amount);
        if (isNaN(transferAmount) || transferAmount <= 0) {
            setError(t('invalidAmount'));
            return;
        }

        if (transferAmount > (user.balance || 0)) {
            setError(t('insufficientBalance'));
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Start a Supabase transaction
            const { data: recipientProfile, error: findError } = await supabase
                .from('profiles')
                .select()
                .eq('phone_number', recipient)
                .single();

            if (findError || !recipientProfile) {
                throw new Error(t('recipientNotFound'));
            }

            // Update sender's balance
            const { error: senderError } = await supabase
                .from('profiles')
                .update({ balance: (user.balance || 0) - transferAmount })
                .eq('id', user.id);

            if (senderError) throw senderError;

            // Update recipient's balance
            const { error: recipientError } = await supabase
                .from('profiles')
                .update({ balance: (recipientProfile.balance || 0) + transferAmount })
                .eq('id', recipientProfile.id);

            if (recipientError) throw recipientError;

            setSuccess(true);
            setRecipient('');
            setAmount('');
            await refreshProfile();
        } catch (err) {
            console.error('Error transferring balance:', err);
            setError(err instanceof Error ? err.message : t('errorTransferringBalance'));
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return null;
    }

    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.appbar}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color="#FEB831" style={styles.backButton} />
                <Appbar.Content title={t('balanceTransfer')} titleStyle={styles.appbarTitle} />
            </Appbar.Header>
            <Surface style={styles.header}>
                <Text style={styles.headerTitle}>{t('balanceTransfer')}</Text>
                <Text style={styles.headerSubtitle}>
                    {t('balanceTransferDescription')}
                </Text>
            </Surface>

            <Card style={styles.card}>
                <Card.Content>
                    <TextInput
                        label={t('recipientNumber')}
                        value={recipient}
                        onChangeText={setRecipient}
                        keyboardType="phone-pad"
                        style={styles.input}
                    />

                    <TextInput
                        label={t('amount')}
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="numeric"
                        style={styles.input}
                    />

                    <Text style={styles.balanceText}>
                        {t('currentBalance')}: {user.balance?.toFixed(2) || '0.00'}
                    </Text>

                    <Button
                        mode="contained"
                        onPress={handleTransfer}
                        loading={loading}
                        style={styles.button}
                        labelStyle={{ fontWeight: 'bold' }}
                    >
                        {t('transfer')}
                    </Button>
                </Card.Content>
            </Card>

            <Snackbar
                visible={error !== null}
                onDismiss={() => setError(null)}
                duration={3000}
                style={styles.errorSnackbar}
            >
                {error}
            </Snackbar>

            <Snackbar
                visible={success}
                onDismiss={() => setSuccess(false)}
                duration={3000}
                style={styles.successSnackbar}
            >
                {t('transferSuccess')}
            </Snackbar>
        </View>
    );
}