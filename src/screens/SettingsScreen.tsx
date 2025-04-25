import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { List, Surface, Text, Avatar, Button, Appbar } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

import { storage } from '../utils/storage';
import { supabase } from '../utils/supabase';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export default function SettingsScreen({ navigation }: Props) {
    const { t, i18n } = useTranslation();
   

    const handleLanguageChange = async () => {
        const newLang = i18n.language === 'en' ? 'ne' : 'en';
        await storage.setLanguage(newLang);
        i18n.changeLanguage(newLang);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };



    return (
        <ScrollView style={styles.container}>
            <Appbar.Header style={styles.appbar}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color="#FEB831" />
                <Appbar.Content title={t('settings')} titleStyle={styles.appbarTitle} />
            </Appbar.Header>
            <Surface style={styles.profileCard}>
                <View style={styles.profileHeader}>
                    <Avatar.Text
                        size={48}
                        label="LR"
                        style={styles.avatar}
                    />
                    <View style={styles.profileInfo}>
                        <Text variant="titleLarge" style={styles.profileName}>
                            Laxman Regmi
                        </Text>
                        <Text variant="bodyMedium" style={styles.profileNumber}>
                            +977-9866225000
                        </Text>
                        <Text variant="titleMedium" style={styles.profileBalance}>
                            {t('balance_amount', { amount: '1000.00' })}
                        </Text>
                    </View>
                </View>
            </Surface>

            <List.Section>
          
                <List.Item
                    title={t('language')}
                    description={i18n.language === 'en' ? t('english') : t('nepali')}
                    left={props => <List.Icon {...props} icon="translate" />}
                    onPress={handleLanguageChange}
                />
            
            </List.Section>
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
    profileCard: {
        margin: 16,
        padding: 16,
        elevation: 2,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        backgroundColor: '#00368D',
        marginRight: 16,
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    profileNumber: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    profileBalance: {
        fontSize: 16,
        color: '#4caf50',
        fontWeight: 'bold',
    },
});