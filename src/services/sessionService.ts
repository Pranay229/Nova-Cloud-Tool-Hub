import { firebaseAuth, firestore } from '../lib/firebase';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit as firestoreLimit,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';

export interface UserSession {
  id: string;
  user_id: string;
  started_at: string;
  ended_at: string | null;
  tools_used: string[];
  session_duration: string | null;
  created_at: string;
}

function getUserId(): string {
  return firebaseAuth.currentUser?.uid ?? 'anonymous';
}

export const sessionService = {
  async startSession() {
    try {
      const now = new Date().toISOString();
      const userId = getUserId();

      const docRef = await addDoc(collection(firestore, 'user_sessions'), {
        user_id: userId,
        started_at: now,
        ended_at: null,
        tools_used: [],
        session_duration: null,
        created_at: now,
      });

      localStorage.setItem('current_session_id', docRef.id);

      return {
        id: docRef.id,
        user_id: userId,
        started_at: now,
        ended_at: null,
        tools_used: [],
        session_duration: null,
        created_at: now,
      } as UserSession;
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
      const sessionRef = doc(firestore, 'user_sessions', id);
      const snapshot = await getDoc(sessionRef);

      if (!snapshot.exists()) {
        console.warn('Session not found in Firestore');
        return null;
      }

      const session = snapshot.data() as Omit<UserSession, 'id'>;
      const endedAt = new Date().toISOString();
      const durationMs = new Date(endedAt).getTime() - new Date(session.started_at).getTime();
      const durationMinutes = Math.max(1, Math.round(durationMs / 60000));
      const session_duration = `${durationMinutes} min`;

      await updateDoc(sessionRef, {
        ended_at: endedAt,
        session_duration,
      });

      localStorage.removeItem('current_session_id');

      return {
        id,
        ...session,
        ended_at: endedAt,
        session_duration,
      } as UserSession;
    } catch (error) {
      console.error('Error ending session:', error);
      return null;
    }
  },

  async addToolToSession(toolId: string): Promise<UserSession | null> {
    const sessionId = localStorage.getItem('current_session_id');

    if (!sessionId) {
      await this.startSession();
      return this.addToolToSession(toolId);
    }

    try {
      const sessionRef = doc(firestore, 'user_sessions', sessionId);
      const snapshot = await getDoc(sessionRef);

      if (!snapshot.exists()) {
        console.error('Session not found in Firestore');
        return null;
      }

      const session = snapshot.data() as Omit<UserSession, 'id'>;
      const toolsUsed = Array.isArray(session.tools_used) ? [...session.tools_used] : [];

      if (!toolsUsed.includes(toolId)) {
        toolsUsed.push(toolId);
      }

      await updateDoc(sessionRef, { tools_used: toolsUsed });

      return {
        id: sessionId,
        ...session,
        tools_used: toolsUsed,
      } as UserSession;
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
      const snapshot = await getDoc(doc(firestore, 'user_sessions', sessionId));

      if (!snapshot.exists()) {
        return null;
      }

      return { id: sessionId, ...(snapshot.data() as Omit<UserSession, 'id'>) } as UserSession;
    } catch (error) {
      console.error('Error fetching current session:', error);
      return null;
    }
  },

  async getSessionHistory(limit: number = 20) {
    try {
      const userId = getUserId();
      const q = query(
        collection(firestore, 'user_sessions'),
        where('user_id', '==', userId),
        orderBy('started_at', 'desc'),
        firestoreLimit(limit),
      );
      const snapshot = await getDocs(q);

      return snapshot.docs.map(docSnapshot => ({
        id: docSnapshot.id,
        ...(docSnapshot.data() as Omit<UserSession, 'id'>),
      })) as UserSession[];
    } catch (error) {
      console.error('Error fetching session history:', error);
      return [];
    }
  },

  async getSessionStats() {
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
  },
};
