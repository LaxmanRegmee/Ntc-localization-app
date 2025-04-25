import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { TextInput, Button, Text, Surface, Card, Snackbar, SegmentedButtons, List, Chip, Divider, Appbar } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { submitComplaint, getComplaintDetails, subscribeToComplaintUpdates, getComplaints, updateComplaintStatus } from '../utils/supabase';
import { useIsFocused } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Complain'>;

interface Complaint {
    id: string;
    subject: string;
    description: string;
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    created_at: string;
    updated_at: string;
}

interface ComplaintResponse {
    id: string;
    complaint_id: string;
    response_text: string;
    created_at: string;
    responded_by: string;
}

interface StatusHistory {
    id: string;
    complaint_id: string;
    old_status: string;
    new_status: string;
    created_at: string;
    changed_by: string;
}

export default function ComplainScreen({ navigation }: Props) {
    const { t } = useTranslation();
    const { user } = useAuth();
    const isFocused = useIsFocused();
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [responses, setResponses] = useState<Record<string, ComplaintResponse[]>>({});
    const [statusHistory, setStatusHistory] = useState<Record<string, StatusHistory[]>>({});
    const [view, setView] = useState('new');
    const [selectedComplaint, setSelectedComplaint] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (isFocused && view === 'history') {
            loadComplaints();
        }
    }, [isFocused, view]);

    useEffect(() => {
        if (selectedComplaint) {
            loadComplaintDetails(selectedComplaint);
        }
    }, [selectedComplaint]);

    const loadComplaints = async () => {
        if (!user?.id) return;
        
        setRefreshing(true);
        try {
            const { data, error } = await getComplaints(user.id);
            if (error) throw error;
            setComplaints(data || []);
        } catch (err) {
            console.error('Error loading complaints:', err);
            setError(t('errorLoadingComplaints'));
        } finally {
            setRefreshing(false);
        }
    };

    const loadComplaintDetails = async (complaintId: string) => {
        try {
            const { data, error } = await getComplaintDetails(complaintId);
            if (error) throw error;

            if (data) {
                setResponses(prev => ({ ...prev, [complaintId]: data.responses }));
                setStatusHistory(prev => ({ ...prev, [complaintId]: data.status_history }));
            }
        } catch (err) {
            console.error('Error loading complaint details:', err);
            setError(t('errorLoadingComplaintDetails'));
        }
    };

    const handleSubmit = async () => {
        if (!user?.id) {
            setError(t('pleaseLoginFirst'));
            return;
        }

        if (!subject.trim() || !description.trim()) {
            setError(t('pleaseEnterAllFields'));
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { error } = await submitComplaint(user.id, subject.trim(), description.trim());
            if (error) throw error;

            setSuccess(true);
            setSubject('');
            setDescription('');
            setTimeout(() => {
                setView('history');
                loadComplaints();
            }, 1500);
        } catch (err) {
            console.error('Error submitting complaint:', err);
            setError(t('errorSubmittingComplaint'));
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (complaintId: string, newStatus: 'open' | 'in_progress' | 'resolved' | 'closed') => {
        try {
            const { error } = await updateComplaintStatus(complaintId, newStatus);
            if (error) throw error;
            
            // Refresh complaint details to show updated status and history
            await loadComplaintDetails(complaintId);
        } catch (err) {
            console.error('Error updating status:', err);
            setError(t('errorUpdatingStatus'));
        }
    };

    const renderComplaintHistory = () => {
        if (complaints.length === 0) {
            return (
                <Text style={styles.emptyText}>{t('noComplaints')}</Text>
            );
        }

        return complaints.map((complaint) => (
            <Card key={complaint.id} style={styles.complaintCard}>
                <Card.Content>
                    <Text style={styles.complaintSubject}>{complaint.subject}</Text>
                    <Text style={styles.complaintDate}>
                        {new Date(complaint.created_at).toLocaleDateString()}
                    </Text>
                    <Text style={styles.complaintDescription}>{complaint.description}</Text>
                    
                    <View style={styles.statusSection}>
                        <Chip 
                            style={[
                                styles.statusChip,
                                { backgroundColor: getStatusColor(complaint.status) }
                            ]}
                        >
                            {t(complaint.status)}
                        </Chip>

                        <Button
                            mode="text"
                            onPress={() => {
                                const nextStatus = getNextStatus(complaint.status);
                                if (nextStatus) {
                                    handleStatusUpdate(complaint.id, nextStatus);
                                }
                            }}
                        >
                            {t('updateStatus')}
                        </Button>
                    </View>

                    {selectedComplaint === complaint.id && (
                        <>
                            <Divider style={styles.divider} />
                            <List.Section title={t('responses')}>
                                {responses[complaint.id]?.map((response, index) => (
                                    <List.Item
                                        key={index}
                                        title={response.response_text}
                                        description={new Date(response.created_at).toLocaleString()}
                                    />
                                ))}
                            </List.Section>

                            <List.Section title={t('statusHistory')}>
                                {statusHistory[complaint.id]?.map((history, index) => (
                                    <List.Item
                                        key={index}
                                        title={t('statusChanged', {
                                            from: t(history.old_status || 'open'),
                                            to: t(history.new_status)
                                        })}
                                        description={new Date(history.created_at).toLocaleString()}
                                    />
                                ))}
                            </List.Section>
                        </>
                    )}

                    <Button
                        onPress={() => setSelectedComplaint(
                            selectedComplaint === complaint.id ? null : complaint.id
                        )}
                    >
                        {selectedComplaint === complaint.id ? t('hideDetails') : t('viewDetails')}
                    </Button>
                </Card.Content>
            </Card>
        ));
    };

    // Helper function to determine next status in workflow
    const getNextStatus = (currentStatus: string): 'open' | 'in_progress' | 'resolved' | 'closed' | null => {
        switch (currentStatus) {
            case 'open':
                return 'in_progress';
            case 'in_progress':
                return 'resolved';
            case 'resolved':
                return 'closed';
            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.appbar}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color="#FEB831" />
                <Appbar.Content title={t('complain')} titleStyle={styles.appbarTitle} />
            </Appbar.Header>
            <Surface style={styles.header}>
                <Text style={styles.headerTitle}>{t('complaints')}</Text>
                <Text style={styles.headerSubtitle}>
                    {t('complaintsDescription')}
                </Text>
            </Surface>

            <SegmentedButtons
                value={view}
                onValueChange={setView}
                buttons={[
                    { value: 'new', label: t('newComplaint') },
                    { value: 'history', label: t('complaintHistory') }
                ]}
                style={styles.segmentedButtons}
            />

            {view === 'new' ? (
                <View style={styles.content}>
                    <TextInput
                        label={t('subject')}
                        value={subject}
                        onChangeText={setSubject}
                        style={styles.input}
                    />

                    <TextInput
                        label={t('description')}
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={4}
                        style={styles.input}
                    />

                    <Button
                        mode="contained"
                        onPress={handleSubmit}
                        loading={loading}
                        style={styles.button}
                    >
                        {t('submit')}
                    </Button>
                </View>
            ) : (
                <View style={styles.content}>
                    {renderComplaintHistory()}
                </View>
            )}

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
                {t('complaintSubmitted')}
            </Snackbar>
        </View>
    );
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'open':
            return '#ffeb3b';
        case 'in_progress':
            return '#2196f3';
        case 'resolved':
            return '#4caf50';
        case 'closed':
            return '#9e9e9e';
        default:
            return '#e0e0e0';
    }
};

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
    segmentedButtons: {
        margin: 16,
        marginBottom: 0,
    },
    complaintCard: {
        marginBottom: 16,
    },
    complaintSubject: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    complaintDate: {
        fontSize: 12,
        color: '#666',
        marginBottom: 8,
    },
    complaintDescription: {
        marginBottom: 8,
    },
    statusChip: {
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    divider: {
        marginVertical: 16,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 24,
        color: '#666',
    },
    errorSnackbar: {
        backgroundColor: '#f44336',
    },
    successSnackbar: {
        backgroundColor: '#4caf50',
    },
    statusSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 8,
    },
});