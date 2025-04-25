import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Linking } from 'react-native';
import { List, Text, Surface, Card, Appbar } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function CustomerCareScreen() {
    const { t } = useTranslation();
    const { user, isLoading } = useAuth();
    const navigation = useNavigation();

    useEffect(() => {
        if (!isLoading && !user) {
            navigation.navigate('Login' as never);
            return;
        }
    }, [user, isLoading]);

    const handleCall = () => {
        Linking.openURL('tel:1415');
    };

    if (!user) {
        return null;
    }

    return (
        <ScrollView style={styles.container}>
            <Appbar.Header style={styles.appbar}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color="#FEB831" />
                <Appbar.Content title={t('customerCare')} titleStyle={styles.appbarTitle} />
            </Appbar.Header>
            <Surface style={styles.header}>
                <Text style={styles.headerTitle}>{t('customerCare')}</Text>
                <Text style={styles.headerSubtitle}>
                    {t('customerCareDescription')}
                </Text>
            </Surface>

            <Card style={styles.card}>
                <Card.Content>
                    <List.Section>
                        <List.Item
                            title={t('customerCareNumber')}
                            description="1415"
                            left={props => <List.Icon {...props} icon="phone" />}
                            onPress={handleCall}
                        />
                        <List.Item
                            title={t('customerCareEmail')}
                            description="care@ntc.net.np"
                            left={props => <List.Icon {...props} icon="email" />}
                            onPress={() => Linking.openURL('mailto:care@ntc.net.np')}
                        />
                        <List.Item
                            title={t('customerCareWhatsApp')}
                            description="+977 9861011415"
                            left={props => <List.Icon {...props} icon="whatsapp" />}
                            onPress={() => Linking.openURL('whatsapp://send?phone=9779861011415')}
                        />
                        <List.Item
                            title={t('customerCareViber')}
                            description="+977 9861011415"
                            left={props => <List.Icon {...props} icon="chat" />}
                            onPress={() => Linking.openURL('viber://chat?number=9779861011415')}
                        />
                    </List.Section>
                </Card.Content>
            </Card>

            <Card style={styles.card}>
                <Card.Content>
                    <Text style={styles.sectionTitle}>{t('workingHours')}</Text>
                    <List.Item
                        title={t('weekdays')}
                        description="10:00 AM - 5:00 PM"
                        left={props => <List.Icon {...props} icon="calendar-week" />}
                    />
                    <List.Item
                        title={t('weekends')}
                        description="10:00 AM - 2:00 PM"
                        left={props => <List.Icon {...props} icon="calendar-weekend" />}
                    />
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#00368D',
    },
});