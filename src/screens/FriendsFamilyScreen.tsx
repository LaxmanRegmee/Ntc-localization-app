import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { List, TextInput, Button, Text, Surface, Snackbar, IconButton, Appbar } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../utils/supabase';

interface FamilyMember {
    id: string;
    phone_number: string;
    name: string;
    relationship: string;
}

export default function FriendsFamilyScreen() {
    const { t } = useTranslation();
    const { user, isLoading } = useAuth();
    const navigation = useNavigation();
    const [members, setMembers] = useState<FamilyMember[]>([]);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [name, setName] = useState('');
    const [relationship, setRelationship] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!isLoading && !user) {
            navigation.navigate('Login' as never);
            return;
        }

        if (user) {
            loadMembers();
        }
    }, [user, isLoading]);

    const loadMembers = async () => {
        if (!user) return;

        try {
            const { data, error } = await supabase
                .from('family_members')
                .select('*')
                .eq('user_id', user.id);

            if (error) throw error;
            setMembers(data || []);
        } catch (err) {
            console.error('Error loading family members:', err);
            setError(t('errorLoadingMembers'));
        }
    };

    const handleAdd = async () => {
        if (!phoneNumber.trim() || !name.trim() || !relationship.trim()) {
            setError(t('pleaseEnterAllFields'));
            return;
        }

        if (!user) {
            setError(t('pleaseLoginFirst'));
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase
                .from('family_members')
                .insert({
                    user_id: user.id,
                    phone_number: phoneNumber,
                    name,
                    relationship
                });

            if (error) throw error;

            setSuccess(true);
            setPhoneNumber('');
            setName('');
            setRelationship('');
            await loadMembers();
        } catch (err) {
            console.error('Error adding family member:', err);
            setError(t('errorAddingMember'));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const { error } = await supabase
                .from('family_members')
                .delete()
                .eq('id', id);

            if (error) throw error;
            await loadMembers();
        } catch (err) {
            console.error('Error deleting family member:', err);
            setError(t('errorDeletingMember'));
        }
    };

    if (!user) {
        return null;
    }

    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.appbar}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color="#FEB831" />
                <Appbar.Content title={t('friendsFamily')} titleStyle={styles.appbarTitle} />
            </Appbar.Header>
            <Surface style={styles.header}>
                <Text style={styles.headerTitle}>{t('friendsFamily')}</Text>
                <Text style={styles.headerSubtitle}>
                    {t('friendsAndFamilyDescription')}
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
                    label={t('name')}
                    value={name}
                    onChangeText={setName}
                    style={styles.input}
                />

                <TextInput
                    label={t('relationship')}
                    value={relationship}
                    onChangeText={setRelationship}
                    style={styles.input}
                />

                <Button
                    mode="contained"
                    onPress={handleAdd}
                    loading={loading}
                    style={styles.button}
                    labelStyle={{ fontWeight: 'bold' }}
                >
                    {t('addMember')}
                </Button>

                {members.length > 0 && (
                    <List.Section>
                        <Text style={styles.sectionTitle}>{t('members')}</Text>
                        {members.map((member) => (
                            <List.Item
                                key={member.id}
                                title={member.name}
                                description={`${member.phone_number} - ${member.relationship}`}
                                right={props => (
                                    <IconButton
                                        {...props}
                                        icon="delete"
                                        onPress={() => handleDelete(member.id)}
                                    />
                                )}
                            />
                        ))}
                    </List.Section>
                )}
            </View>

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
                {t('memberAdded')}
            </Snackbar>
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
    content: {
        padding: 16,
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 8,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#00368D',
    },
    errorSnackbar: {
        backgroundColor: '#f44336',
    },
    successSnackbar: {
        backgroundColor: '#4caf50',
    },
});