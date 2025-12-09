import { supabase } from '../lib/supabase';

export interface UserSession {
  id: string;
  user_id: string;
  started_at: string;
  ended_at: string | null;
  tools_used: string[];
  session_duration: string | null;
  created_at: string;
}

async function getUserId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
}

export const sessionService = {
  async startSession() {
    try {
      const userId = await getUserId();
      if (!userId) {
        console.warn('User must be authenticated to start a session');
        return null;
      }

      const now = new Date().toISOString();

      const { data, error } = await supabase
        .from('user_sessions')
        .insert({
          user_id: userId,
          started_at: now,
          ended_at: null,
          tools_used: [],
          session_duration: null,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        localStorage.setItem('current_session_id', data.id);
      }

      return data as UserSession;
    } catch (error) {
      console.error('Error starting session:', error);
      return null;
    }
  },

  async endSession(sessionId?: string) {
    const id = sessionId || localStorage.getItem('current_session_id');

    if (!id) {
      console.warn('No active session to end');
      return null;
    }

    try {
      const { data: session, error: fetchError } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError || !session) {
        console.warn('Session not found');
        return null;
      }

      const endedAt = new Date().toISOString();
      const durationMs = new Date(endedAt).getTime() - new Date(session.started_at).getTime();
      const durationMinutes = Math.max(1, Math.round(durationMs / 60000));
      const session_duration = `${durationMinutes} min`;

      const { data, error } = await supabase
        .from('user_sessions')
        .update({
          ended_at: endedAt,
          session_duration,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      localStorage.removeItem('current_session_id');

      return data as UserSession;
    } catch (error) {
      console.error('Error ending session:', error);
      return null;
    }
  },

  async addToolToSession(toolId: string): Promise<UserSession | null> {
    let sessionId = localStorage.getItem('current_session_id');

    if (!sessionId) {
      const newSession = await this.startSession();
      if (!newSession) return null;
      sessionId = newSession.id;
    }

    try {
      const { data: session, error: fetchError } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (fetchError || !session) {
        console.error('Session not found');
        return null;
      }

      const toolsUsed = Array.isArray(session.tools_used) ? [...session.tools_used] : [];
      if (!toolsUsed.includes(toolId)) {
        toolsUsed.push(toolId);
      }

      const { data, error } = await supabase
        .from('user_sessions')
        .update({ tools_used: toolsUsed })
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;

      return data as UserSession;
    } catch (error) {
      console.error('Error adding tool to session:', error);
      return null;
    }
  },

  async getCurrentSession() {
    const sessionId = localStorage.getItem('current_session_id');

    if (!sessionId) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (error || !data) {
        return null;
      }

      return data as UserSession;
    } catch (error) {
      console.error('Error fetching current session:', error);
      return null;
    }
  },

  async getSessionHistory(limit: number = 20) {
    try {
      const userId = await getUserId();
      if (!userId) return [];

      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('started_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []) as UserSession[];
    } catch (error) {
      console.error('Error fetching session history:', error);
      return [];
    }
  },

  async getSessionStats() {
    try {
      const userId = await getUserId();
      if (!userId) {
        return {
          totalSessions: 0,
          completedSessions: 0,
          activeSessions: 0,
          averageToolsPerSession: 0,
        };
      }

      const sessions = await this.getSessionHistory(1000);

      if (sessions.length === 0) {
        return {
          totalSessions: 0,
          completedSessions: 0,
          activeSessions: 0,
          averageToolsPerSession: 0,
        };
      }

      const totalSessions = sessions.length;
      const completedSessions = sessions.filter(s => s.ended_at).length;
      const activeSessions = totalSessions - completedSessions;
      const averageToolsPerSession =
        sessions.reduce(
          (acc, s) => acc + (Array.isArray(s.tools_used) ? s.tools_used.length : 0),
          0,
        ) / totalSessions;

      return {
        totalSessions,
        completedSessions,
        activeSessions,
        averageToolsPerSession: Math.round(averageToolsPerSession * 10) / 10,
      };
    } catch (error) {
      console.error('Error fetching session stats:', error);
      return {
        totalSessions: 0,
        completedSessions: 0,
        activeSessions: 0,
        averageToolsPerSession: 0,
      };
    }
  },

  // Subscribe to real-time updates for sessions
  async subscribeToSessions(callback: (payload: { eventType: string; new: UserSession; old?: UserSession }) => void) {
    const userId = await getUserId();
    if (!userId) return null;

    return supabase
      .channel('user_sessions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_sessions',
          filter: `user_id=eq.${userId}`,
        },
        (payload: any) => {
          callback({
            eventType: payload.eventType,
            new: payload.new as UserSession,
            old: payload.old as UserSession,
          });
        }
      )
      .subscribe();
  },
};
