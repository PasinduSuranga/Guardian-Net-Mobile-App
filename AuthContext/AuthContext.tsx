// ---
// NOTE: The errors you see about "expo-router" and "AsyncStorage" are expected
// in this web preview. This environment doesn't have your Expo project's
// libraries installed. The code itself is correct and will run in your app.
// ---
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePathname, useRouter, useSegments } from 'expo-router';
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';

// --- UPDATED ---
// We've added the 'loading' state back.
interface AuthContextType {
  session: string | null;
  sessionStatus: 'loading' | 'authenticated' | 'unauthenticated';
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  sessionStatus: 'loading', // <-- UPDATED: Start in 'loading' state
  signIn: async () => {},
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function useProtectedRoute() {
  const { sessionStatus } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const segments = useSegments();

  useEffect(() => {
    // --- ADDED BACK ---
    // Do nothing while the session is being loaded.
    if (sessionStatus === 'loading') {
      return;
    }
    // -----------------


    const inAuthGroup = segments[0] === '(auth)';

    // These are your public pages
    const isPublicPage =
      pathname === "/" || pathname === "/about";


    // 1. User is not signed in and is trying to access a protected route.
    if (
      sessionStatus === 'unauthenticated' &&
      !inAuthGroup &&
      !isPublicPage
    ) {
      router.replace('/(auth)/login');
    }

    // 2. User IS signed in and IS in the (auth) group (e.g., login page)
    if (sessionStatus === 'authenticated' && inAuthGroup) {
      router.replace('/(tabs)/findCaregivers');
    }
  }, [router, pathname, sessionStatus, segments]);
}

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState<string | null>(null);
  const [sessionStatus, setSessionStatus] = useState<
    'loading' | 'authenticated' | 'unauthenticated'
  >('loading'); // <-- UPDATED: Start in 'loading' state
  
  const router = useRouter();

  // --- ADDED BACK: LOAD SESSION FROM STORAGE ---
  useEffect(() => {
    const loadSession = async () => {
      try {
        // Check storage for the token
        const token = await AsyncStorage.getItem('session');
        if (token) {
          setSession(token);
          setSessionStatus('authenticated');
        } else {
          setSessionStatus('unauthenticated');
        }
      } catch (e) {
        console.error('Failed to load session from storage', e);
        setSessionStatus('unauthenticated');
      }
    };

    loadSession();
  }, []);
  // -----------------------------------------

  const authValue: AuthContextType = {
    session,
    sessionStatus,
    signIn: async (token: string) => {
      try {
        // --- ADDED BACK ---
        // Save the token to storage
        await AsyncStorage.setItem('session', token);
        // ------------------
        setSession(token);
        setSessionStatus('authenticated');
        // Let the useProtectedRoute hook handle redirects
      } catch (e) {
        console.error('Failed to set session state or storage', e);
      }
    },
    signOut: async () => {
      try {
        // --- ADDED BACK ---
        // Remove the token from storage
        await AsyncStorage.removeItem('session');
        // ------------------
        setSession(null);
        setSessionStatus('unauthenticated');
        
        // Redirect to landing page ('/') on sign out.
        router.replace('/');

      } catch (e) {
        console.error('Failed to clear session or storage', e);
      }
    },
  };

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};

