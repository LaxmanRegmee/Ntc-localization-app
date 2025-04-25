import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Surface, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

interface Props {
    children: React.ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <ErrorFallback error={this.state.error} onReset={() => this.setState({ hasError: false })} />;
        }

        return this.props.children;
    }
}

function ErrorFallback({ error, onReset }: { error?: Error; onReset: () => void }) {
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            <Surface style={styles.surface}>
                <Text style={styles.title}>{t('somethingWentWrong')}</Text>
                <Text style={styles.error}>{error?.message}</Text>
                <Button mode="contained" onPress={onReset} style={styles.button}>
                    {t('tryAgain')}
                </Button>
            </Surface>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    surface: {
        padding: 16,
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
        elevation: 4,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#f44336',
    },
    error: {
        marginBottom: 16,
        textAlign: 'center',
        color: '#666',
    },
    button: {
        marginTop: 8,
    },
});