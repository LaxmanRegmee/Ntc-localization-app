import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface, Card, TextInput, Button, Appbar } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Recharge'>;

export default function RechargeScreen({ navigation }: Props) {
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.appbar}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color="#FEB831" />
                <Appbar.Content title={t('recharge')} titleStyle={styles.appbarTitle} />
            </Appbar.Header>
            <Surface style={styles.header}>
                <Text style={styles.headerTitle}>{t('recharge')}</Text>
                <Text style={styles.headerSubtitle}>
                    {t('rechargeDescription')}
                </Text>
            </Surface>

            <View style={styles.content}>
                <TextInput
                    label={t('rechargePin')}
                    // value={pin}
                    // onChangeText={setPin}
                    keyboardType="numeric"
                    style={styles.input}
                    secureTextEntry
                />

                <Button
                    mode="contained"
                    // onPress={handleRecharge}
                    // loading={loading}
                    style={styles.button}
                    labelStyle={{ fontWeight: 'bold' }}
                >
                    {t('recharge')}
                </Button>
            </View>

            {/* <Snackbar
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
                {t('rechargeSuccess')}
            </Snackbar> */}
        </View>
    );
}

const styles = StyleSheet.create({
    appbar: {
        backgroundColor: '#00368D',
        elevation: 4,
    },
    appbarTitle: {
        color: '#FEB831',
        fontSize: 20,
        fontWeight: 'bold',
    },
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
    },
    successSnackbar: {
        backgroundColor: '#4caf50',
    },
});