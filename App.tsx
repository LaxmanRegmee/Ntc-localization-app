import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { PaperProvider, MD3LightTheme, type MD3Theme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import './src/i18n';
import Navigation from './src/navigation';
import { AuthProvider } from './src/context/AuthContext';
import { supabase, initializeSchema } from './src/utils/supabase';

const theme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#00368D',
    onPrimary: '#FEB831',
    error: '#f44336',
  },
  fonts: {
    ...MD3LightTheme.fonts,
    displayLarge: {
      fontFamily: 'System',
      fontWeight: "400",
      fontSize: 57,
      lineHeight: 64,
      letterSpacing: -0.25,
    },
    displayMedium: {
      fontFamily: 'System',
      fontWeight: "400",
      fontSize: 45,
      lineHeight: 52,
      letterSpacing: 0,
    },
    displaySmall: {
      fontFamily: 'System',
      fontWeight: "400",
      fontSize: 36,
      lineHeight: 44,
      letterSpacing: 0,
    },
    headlineLarge: {
      fontFamily: 'System',
      fontWeight: "400",
      fontSize: 32,
      lineHeight: 40,
      letterSpacing: 0,
    },
    headlineMedium: {
      fontFamily: 'System',
      fontWeight: "400",
      fontSize: 28,
      lineHeight: 36,
      letterSpacing: 0,
    },
    headlineSmall: {
      fontFamily: 'System',
      fontWeight: "400",
      fontSize: 24,
      lineHeight: 32,
      letterSpacing: 0,
    },
    titleLarge: {
      fontFamily: 'System',
      fontWeight: "400",
      fontSize: 22,
      lineHeight: 28,
      letterSpacing: 0,
    },
    titleMedium: {
      fontFamily: 'System',
      fontWeight: "500",
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 0.15,
    },
    titleSmall: {
      fontFamily: 'System',
      fontWeight: "500",
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: 0.1,
    },
    labelLarge: {
      fontFamily: 'System',
      fontWeight: "500",
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: 0.1,
    },
    labelMedium: {
      fontFamily: 'System',
      fontWeight: "500",
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: 0.5,
    },
    labelSmall: {
      fontFamily: 'System',
      fontWeight: "500",
      fontSize: 11,
      lineHeight: 16,
      letterSpacing: 0.5,
    },
    bodyLarge: {
      fontFamily: 'System',
      fontWeight: "400",
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 0.15,
    },
    bodyMedium: {
      fontFamily: 'System',
      fontWeight: "400",
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: 0.25,
    },
    bodySmall: {
      fontFamily: 'System',
      fontWeight: "400",
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: 0.4,
    },
  },
};

const GradientBackground = ({ children }: { children: React.ReactNode }) => (
  <LinearGradient
    colors={['#00368D', '#ffffff']}
    style={styles.gradient}
    start={{ x: 0, y: 0 }}
    end={{ x: 0, y: 1 }}
    locations={[0.4, 1]} // This makes the gradient transition smoother
  >
    {children}
  </LinearGradient>
);

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        // Initialize database schema
        const { error } = await initializeSchema();
        if (error) {
          console.error('Error initializing database schema:', error);
        }
        
        // Check user session
        await checkUser();
      } catch (error) {
        console.error('Error during initialization:', error);
      } finally {
        setIsLoading(false);
      }
    }

    init();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error checking auth state:', error);
    }
  };

  return (
    <AuthProvider>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <GradientBackground>
            <Navigation />
          </GradientBackground>
        </PaperProvider>
      </SafeAreaProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

