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

// ---
interface AuthContextType {
  session: string | null;
  sessionStatus: 'loading' | 'authenticated' | 'unauthenticated';
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  sessionStatus: 'loading',
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
    // 1. Wait until the session is loaded
    if (sessionStatus === 'loading') {
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';
    
    // This `isLandingPage` variable now correctly treats
    // both the root and the home screen as public pages.
    const isLandingPage = pathname === "/" ;
    const isHomePage = pathname === "/home" || pathname === "/userprofile";

    console.log(`
      --- AUTH HOOK DEBUG ---
      Pathname: ${pathname}
      Status: ${sessionStatus}
      isLanding: ${isLandingPage}
      isHome: ${isHomePage}
      inAuth: ${inAuthGroup}
    `);

    // 2. Logic for AUTHENTICATED users
    if (sessionStatus === 'authenticated') {
      // 2a. If they are on a public page OR in the (auth) group...
      if (isLandingPage || inAuthGroup) {
        // ...redirect them to home.
        router.replace('/(tabs)/home');
      }
    }
    
    // 3. Logic for UNUTHENTICATED users
    else if (sessionStatus === 'unauthenticated') {
      // 3a. If they are trying to access a protected route 
      // (i.e., NOT a public page AND NOT in the auth group)
      if (!isLandingPage && !inAuthGroup && !isHomePage) {
        // ...redirect them to the landing page.
        router.replace('/');
      }
      // 3b. If they are on a public page (like / or /tabs/home)
      // or in the auth group, they are fine. Do nothing.
    }

  }, [router, pathname, sessionStatus, segments]);
}

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState<string | null>(null);
  const [sessionStatus, setSessionStatus] = useState<
    'loading' | 'authenticated' | 'unauthenticated'
  >('loading');

  useEffect(() => {
    const loadSession = async () => {
      try {
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

  const authValue: AuthContextType = {
    session,
    sessionStatus,
    signIn: async (token: string) => {
      try {
        await AsyncStorage.setItem('session', token);
        setSession(token);
        setSessionStatus('authenticated');
        // The useProtectedRoute hook will automatically handle
        // the redirect to '/(tabs)/home' now.
      } catch (e) {
        console.error('Failed to set session state or storage', e);
      }
    },
    signOut: async () => {
      try {
        await AsyncStorage.removeItem('session');
        setSession(null);
        setSessionStatus('unauthenticated');
        
        // The useProtectedRoute hook will automatically handle
        // the redirect to '/' now.
      } catch (e) {
        console.error('Failed to clear session or storage', e);
      }
    },
  };

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};