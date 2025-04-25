import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { List, Text, Surface, Card, Appbar } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'VAS'>;

export default function VASScreen({ navigation }: Props) {
    const { t } = useTranslation();
    const { user, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && !user) {
            navigation.navigate('Login' as keyof RootStackParamList);
            return;
        }
    }, [user, isLoading]);

    const services = [
        { title: t('caller_tune'), icon: 'music' },
        { title: t('call_block'), icon: 'phone-off' },
        { title: t('voice_mail'), icon: 'voicemail' },
        { title: t('call_forwarding'), icon: 'call-merge' },
        { title: t('miss_call_alert'), icon: 'bell-ring' },
        { title: t('call_waiting'), icon: 'phone-in-talk' },
    ];

    if (!user) {
        return null;
    }

    return (
        <ScrollView style={styles.container}>
            <Appbar.Header style={styles.appbar}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color="#FEB831" />
                <Appbar.Content title={t('vas')} titleStyle={styles.appbarTitle} />
            </Appbar.Header>
            <Surface style={styles.header}>
                <Text style={styles.headerTitle}>{t('vas')}</Text>
                <Text style={styles.headerSubtitle}>
                    {t('vas_description')}
                </Text>
            </Surface>

            <Card style={styles.card}>
                <Card.Content>
                    {services.map((service, index) => (
                        <List.Item
                            key={index}
                            title={service.title}
                            left={props => <List.Icon {...props} icon={service.icon} />}
                            right={props => <List.Icon {...props} icon="chevron-right" />}
                            onPress={() => {/* TODO: Implement service activation */}}
                        />
                    ))}
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
    }
});