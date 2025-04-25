export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://qaebfqqiqdfwyaidvesh.supabase.co';
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhZWJmcXFpcWRmd3lhaWR2ZXNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNDE3OTMsImV4cCI6MjA2MDYxNzc5M30.3OI4xnSnsbR6NelCVqyYnBCkTuRCQuEehf3g72k6LHw';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn(
        'Missing Supabase configuration. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in your environment.'
    );
}