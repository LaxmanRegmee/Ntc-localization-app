import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Text, Surface, Snackbar, Card, List, Appbar } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../utils/supabase';

export default function Enable4GScreen() {
    const { t } = useTranslation();
    const { user, isLoading } = useAuth();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [has4G, setHas4G] = useState(false);

    useEffect(() => {
        if (!isLoading && !user) {
            navigation.navigate('Login' as never);
            return;
        }

        if (user) {
            check4GStatus();
        }
    }, [user, isLoading]);

    const check4GStatus = async () => {
        if (!user) return;
        
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('has_4g')
                .eq('id', user.id)
                .single();

            if (error) throw error;
            setHas4G(data?.has_4g || false);
        } catch (err) {
            console.error('Error checking 4G status:', err);
        }
    };

    const handleEnable4G = async () => {
        if (!user) {
            setError(t('pleaseLoginFirst'));
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Update user's 4G status
            const { error } = await supabase
                .from('profiles')
                .update({ has_4g: true })
                .eq('id', user.id);

            if (error) throw error;

            setSuccess(true);
            setHas4G(true);
        } catch (err) {
            console.error('Error enabling 4G:', err);
            setError(t('errorEnabling4G'));
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return null;
    }

    return (
        <ScrollView style={styles.container}>
            <Appbar.Header style={styles.appbar}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color="#FEB831" />
                <Appbar.Content title={t('enable4G')} titleStyle={styles.appbarTitle} />
            </Appbar.Header>
            <Surface style={styles.header}>
                <Text style={styles.headerTitle}>{t('enable4G')}</Text>
                <Text style={styles.headerSubtitle}>
                    {t('enable4GDescription')}
                </Text>
            </Surface>

            <Card style={styles.card}>
                <Card.Content>
                    <List.Item
                        title={t('4GStatus')}
                        description={has4G ? t('4GEnabled') : t('4GNotEnabled')}
                        left={props => (
                            <List.Icon
                                {...props}
                                icon={has4G ? 'check-circle' : 'alert-circle'}
                                color={has4G ? '#4caf50' : '#f44336'}
                            />
                        )}
                    />

                    {!has4G && (
                        <View style={styles.enableSection}>
                            <Text style={styles.requirements}>
                                {t('4GRequirements')}
                            </Text>
                            <List.Item
                                title={t('4GSIM')}
                                left={props => <List.Icon {...props} icon="sim" />}
                            />
                            <List.Item
                                title={t('4GDevice')}
                                left={props => <List.Icon {...props} icon="cellphone" />}
                            />
                            <List.Item
                                title={t('4GCoverage')}
                                left={props => <List.Icon {...props} icon="antenna" />}
                            />

                            <Button
                                mode="contained"
                                onPress={handleEnable4G}
                                loading={loading}
                                style={styles.button}
                                labelStyle={{ fontWeight: 'bold' }}
                            >
                                {t('enable4G')}
                            </Button>
                        </View>
                    )}
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
                {t('4GEnabled')}
            </Snackbar>
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
    },
    enableSection: {
        marginTop: 24,
    },
    requirements: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#00368D',
    },
    button: {
        marginTop: 24,
    },
    errorSnackbar: {
        backgroundColor: '#f44336',
    },
    successSnackbar: {
        backgroundColor: '#4caf50',
    },
});