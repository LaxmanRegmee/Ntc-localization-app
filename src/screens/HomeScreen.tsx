import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Linking } from 'react-native';
import { Surface, Text, Card, IconButton, Button, ActivityIndicator, Modal, TextInput, Appbar } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useAuth } from '../context/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

interface QuickAction {
    icon: string;
    label: string;
    screen: keyof RootStackParamList;
    url?: string;  
}

export default function HomeScreen({ navigation }: Props) {
    const { t } = useTranslation();
   
    const [refreshing, setRefreshing] = useState(false);

    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const quickActions: QuickAction[] = [
        { icon: 'cash-plus', label: t('recharge'), screen: 'Recharge' },
        { icon: 'database', label: t('data_pack'), screen: 'DataPack' },
        { icon: 'sim', label: t('esim'), screen: 'Home' },
        { icon: 'cash-fast', label: t('balance_transfer'), screen: 'BalanceTransfer' },
        { icon: 'message-alert', label: t('complain'), screen: 'Complain' },
        { icon: 'account-group', label: t('friends_family'), screen: 'FriendsFamily' },
        { icon: 'apps', label: t('vas'), screen: 'VAS' },
        { icon: 'tools', label: t('utilities'), screen: 'Utilities' }
    ];

    const handleCreateProfile = async () => {
        if (!name.trim() || !phoneNumber.trim()) {
            setError(t('pleaseEnterAllFields'));
            return;
        }

        setCreating(true);
        setError(null);


       
    };

    const onRefresh = async () => {
        setRefreshing(true);

        
        setRefreshing(false);
    };


    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.appbar}>
                <Appbar.Content title={t('Home')} titleStyle={styles.appbarTitle} />
                <Appbar.Action icon="cog" onPress={() => navigation.navigate('Settings')} color="#FEB831" />
            </Appbar.Header>
            <Surface style={styles.header}>
                <Text style={styles.headerTitle}>
                    {t('welcome_message', { name: 'Laxman Regmi' })}
                </Text>
            </Surface>

            <ScrollView
                style={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <Card style={styles.balanceCard}>
                    <Card.Content>
                        <Text style={styles.balanceLabel}>{t('mainBalance')}</Text>
                        <Text style={styles.balanceAmount}>
                            {t('balance_amount', { amount: '1000.00' })}
                        </Text>
                        <Text style={styles.validUntil}>{t('valid_until')}: 2024-01-31</Text>
                        <View style={styles.divider} />
                        <Text style={styles.balanceLabel}>{t('dataBalance')}</Text>
                        <Text style={styles.dataAmount}>
                            1024 MB
                        </Text>
                        <Text style={styles.validUntil}>{t('valid_until')}: 2024-01-31</Text>
                    </Card.Content>
                </Card>

                <Card style={styles.quickActionsCard}>
                    <Card.Content>
                        <Text style={styles.sectionTitle}>{t('quickActions')}</Text>
                        <View style={styles.quickActionsGrid}>
                            {quickActions.map((action, index) => (
                                <View key={index} style={styles.quickActionItem}>
                                    <IconButton
                                        icon={action.icon}
                                        size={32}
                                        onPress={() => {
                                            if (action.url) {
                                                Linking.openURL(action.url);
                                            } else {
                                                navigation.navigate(action.screen);
                                            }
                                        }}
                                        style={styles.quickActionButton}
                                    />
                                    <Text style={styles.quickActionLabel}>
                                        {action.label}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </Card.Content>
                </Card>

                <View style={styles.servicesSection}>
                    <Text style={styles.sectionTitle}>{t('services')}</Text>
                    <View style={styles.serviceButtonsContainer}>
                        <Button
                            mode="contained"
                            icon="network"
                            onPress={() => navigation.navigate('Enable4G')}
                            style={styles.serviceButton}
                            labelStyle={{ fontWeight: 'bold' }}
                        >
                            {t('enable_4g')}
                        </Button>
                        <Button
                            mode="contained"
                            icon="headset"
                            onPress={() => navigation.navigate('CustomerCare')}
                            style={styles.serviceButton}
                            labelStyle={{ fontWeight: 'bold' }}
                        >
                            {t('customer_care')}
                        </Button>
                    </View>
                </View>
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
    scrollContent: {
        flex: 1,
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
        zIndex: 1,
    },
    headerTitle: {
        color: '#FEB831',
        fontSize: 24,
        fontWeight: 'bold',
    },
    balanceCard: {
        margin: 16,
    },
    balanceLabel: {
        fontSize: 16,
        color: '#666',
        marginBottom: 4,
    },
    balanceAmount: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#00368D',
        marginBottom: 16,
    },
    dataAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#00368D',
    },
    divider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: 16,
    },
    quickActionsCard: {
        margin: 16,
        marginTop: 0,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#00368D',
    },
    quickActionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    quickActionItem: {
        width: '25%',
        alignItems: 'center',
        marginBottom: 16,
    },
    quickActionButton: {
        backgroundColor: '#e3f2fd',
    },
    quickActionLabel: {
        marginTop: 4,
        textAlign: 'center',
        fontSize: 12,
    },
    servicesSection: {
        padding: 16,
    },
    serviceButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    serviceButton: {
        flex: 1,
        marginHorizontal: 8,
    },
    validUntil: {
        fontSize: 12,
        color: '#666',
        marginBottom: 8,
    },
  
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 8,
    },
    errorText: {
        color: '#f44336',
        marginBottom: 8,
    },
});