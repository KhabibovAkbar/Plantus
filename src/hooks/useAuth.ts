import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { useAppStore } from '../store/appStore';
import { User } from '@supabase/supabase-js';

export function useAuth() {
  const { user, session, isLoggedIn, setUser, setSession } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session
    const checkSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
        }
      } catch (error) {
        console.error('Check session error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          setSession(session);
          setUser(session.user);
        } else {
          setSession(null);
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    session,
    isLoggedIn,
    loading,
  };
}

export default useAuth;
