import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface, Card, Button, Appbar } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function UtilitiesScreen() {
    const { t } = useTranslation();
    const { user, isLoading } = useAuth();
    const navigation = useNavigation();

    useEffect(() => {
        if (!isLoading && !user) {
            navigation.navigate('Login');
            return;
        }
    }, [user, isLoading]);

    const utilities = [
        { title: t('checkBalance'), icon: 'cash', code: '*400#' },
        { title: t('checkDataBalance'), icon: 'database', code: '*1415#' },
        { title: t('checkValidityPeriod'), icon: 'calendar-clock', code: '*111#' },
        { title: t('lastRechargeAmount'), icon: 'receipt', code: '*412#' },
        { title: t('activateRoaming'), icon: 'earth', code: '*111*7#' },
        { title: t('deactivateRoaming'), icon: 'earth-off', code: '*111*8#' },
    ];

    const handleUSSDDial = (code: string) => {
        Linking.openURL(`tel:${code}`);
    };

    if (!user) {
        return null;
    }

    return (
        <ScrollView style={styles.container}>
            <Appbar.Header style={styles.appbar}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color="#FEB831" />
                <Appbar.Content title={t('utilities')} titleStyle={styles.appbarTitle} />
            </Appbar.Header>
            <Surface style={styles.header}>
                <Text style={styles.headerTitle}>{t('utilities')}</Text>
                <Text style={styles.headerSubtitle}>
                    {t('utilitiesDescription')}
                </Text>
            </Surface>

            <Card style={styles.card}>
                <Card.Content>
                    <List.Section>
                        {utilities.map((utility, index) => (
                            <List.Item
                                key={index}
                                title={utility.title}
                                description={utility.code}
                                left={props => <List.Icon {...props} icon={utility.icon} />}
                                right={props => <List.Icon {...props} icon="chevron-right" />}
                                onPress={() => handleUSSDDial(utility.code)}
                            />
                        ))}
                    </List.Section>
                </Card.Content>
            </Card>

            <Card style={styles.helpCard}>
                <Card.Content>
                    <Text style={styles.helpTitle}>{t('needHelp')}</Text>
                    <Text style={styles.helpText}>
                        {t('utilitiesHelpText')}
                    </Text>
                </Card.Content>
            </Card>
        </ScrollView>
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
    card: {
        margin: 16,
        marginBottom: 8,
    },
    helpCard: {
        margin: 16,
        marginTop: 8,
        backgroundColor: '#e3f2fd',
    },
    helpTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#00368D',
    },
    helpText: {
        color: '#666',
    },
});