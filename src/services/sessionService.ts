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

export const sessionService = {
  async startSession() {
    const { data, error } = await supabase
      .from('user_sessions')
      .insert({
        started_at: new Date().toISOString(),
        tools_used: [],
      })
      .select()
      .single();

    if (error) {
      console.error('Error starting session:', error);
      return null;
    }

    localStorage.setItem('current_session_id', data.id);
    return data as UserSession;
  },

  async endSession(sessionId?: string) {
    const id = sessionId || localStorage.getItem('current_session_id');

    if (!id) {
      console.warn('No active session to end');
      return null;
    }

    const { data, error } = await supabase
      .from('user_sessions')
      .update({
        ended_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error ending session:', error);
      return null;
    }

    localStorage.removeItem('current_session_id');
    return data as UserSession;
  },

  async addToolToSession(toolId: string): Promise<UserSession | null> {
    const sessionId = localStorage.getItem('current_session_id');

    if (!sessionId) {
      await this.startSession();
      return this.addToolToSession(toolId);
    }

    const { data: currentSession } = await supabase
      .from('user_sessions')
      .select('tools_used')
      .eq('id', sessionId)
      .single();

    if (!currentSession) {
      console.error('Session not found');
      return null;
    }

    const toolsUsed = Array.isArray(currentSession.tools_used)
      ? currentSession.tools_used
      : [];

    if (!toolsUsed.includes(toolId)) {
      toolsUsed.push(toolId);
    }

    const { data, error } = await supabase
      .from('user_sessions')
      .update({ tools_used: toolsUsed })
      .eq('id', sessionId)
      .select()
      .single();

    if (error) {
      console.error('Error adding tool to session:', error);
      return null;
    }

    return data as UserSession;
  },

  async getCurrentSession() {
    const sessionId = localStorage.getItem('current_session_id');

    if (!sessionId) {
      return null;
    }

    const { data, error } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('id', sessionId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching current session:', error);
      return null;
    }

    return data as UserSession | null;
  },

  async getSessionHistory(limit: number = 20) {
    const { data, error } = await supabase
      .from('user_sessions')
      .select('*')
      .order('started_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching session history:', error);
      return [];
    }

    return data as UserSession[];
  },

  async getSessionStats() {
    const { data, error } = await supabase
      .from('user_sessions')
      .select('*');

    if (error) {
      console.error('Error fetching session stats:', error);
      return null;
    }

    const totalSessions = data.length;
    const completedSessions = data.filter(s => s.ended_at).length;
    const averageToolsPerSession = data.length > 0
      ? data.reduce((acc, s) => acc + (Array.isArray(s.tools_used) ? s.tools_used.length : 0), 0) / data.length
      : 0;

    return {
      totalSessions,
      completedSessions,
      activeSessions: totalSessions - completedSessions,
      averageToolsPerSession: Math.round(averageToolsPerSession * 10) / 10,
    };
  },
};
