import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface, Card, Button, Appbar } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function DataPackScreen() {
    const { t } = useTranslation();
    const { user, isLoading } = useAuth();
    const navigation = useNavigation();

    useEffect(() => {
        if (!isLoading && !user) {
            navigation.navigate('Login' as never);
            return;
        }
    }, [user, isLoading]);

    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.appbar}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color="#FEB831" />
                <Appbar.Content title={t('dataPacks')} titleStyle={styles.appbarTitle} />
            </Appbar.Header>
            <Surface style={styles.header}>
                <Text style={styles.headerTitle}>{t('dataPacks')}</Text>
                <Text style={styles.headerSubtitle}>
                    {t('dataPacksDescription')}
                </Text>
            </Surface>
            <ScrollView style={styles.container}>
                {/* Data packs mapping will go here */}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    appbar: {
        backgroundColor: '#00368D',
        elevation: 4,
    },
    appbarTitle: {
        color: '#FEB831',
        fontSize: 20,
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    packCard: {
        margin: 16,
        marginBottom: 8,
    },
    packHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    packName: {
        flex: 1,
        marginRight: 8,
    },
    validityChip: {
        backgroundColor: '#e3f2fd',
    },
    description: {
        marginBottom: 16,
        color: '#666',
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dataAmount: {
        color: '#00368D',
        fontWeight: 'bold',
    },
    price: {
        color: '#4caf50',
        fontWeight: 'bold',
    },
    errorSnackbar: {
        backgroundColor: '#f44336',
    },
    successSnackbar: {
        backgroundColor: '#4caf50',
    },
});