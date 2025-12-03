import { firebaseAuth, firestore } from '../lib/firebase';
import {
  addDoc,
  collection,
  getDocs,
  limit as firestoreLimit,
  orderBy,
  query,
  where,
} from 'firebase/firestore';

export interface ToolUsage {
  id: string;
  user_id: string;
  tool_id: string;
  tool_name: string;
  used_at: string;
  metadata?: Record<string, any>;
}

export interface UserStats {
  total_tools_used: number;
  favorite_tool: string | null;
  total_sessions: number;
  last_used: string | null;
}

export const toolUsageService = {
  async trackToolUsage(toolId: string, toolName: string, metadata?: Record<string, any>) {
    const user = firebaseAuth.currentUser;
    if (!user) {
      console.warn('User must be authenticated to track tool usage');
      return null;
    }

    try {
      const usedAt = new Date().toISOString();
      const docRef = await addDoc(collection(firestore, 'tool_usage'), {
        user_id: user.uid,
        tool_id: toolId,
        tool_name: toolName,
        metadata: metadata || {},
        used_at: usedAt,
      });

      return {
        id: docRef.id,
        user_id: user.uid,
        tool_id: toolId,
        tool_name: toolName,
        metadata: metadata || {},
        used_at: usedAt,
      } as ToolUsage;
    } catch (error) {
      console.error('Error tracking tool usage:', error);
      return null;
    }
  },

  async getToolUsageHistory(limit: number = 50) {
    const user = firebaseAuth.currentUser;
    if (!user) {
      return [];
    }

    try {
      const q = query(
        collection(firestore, 'tool_usage'),
        where('user_id', '==', user.uid),
        orderBy('used_at', 'desc'),
        firestoreLimit(limit),
      );
      const snapshot = await getDocs(q);

      return snapshot.docs.map(docSnapshot => ({
        id: docSnapshot.id,
        ...(docSnapshot.data() as Omit<ToolUsage, 'id'>),
      })) as ToolUsage[];
    } catch (error) {
      console.error('Error fetching tool usage history:', error);
      return [];
    }
  },

  async getToolUsageStats() {
    const history = await this.getToolUsageHistory(1000);
    if (history.length === 0) {
      return {
        total_tools_used: 0,
        favorite_tool: null,
        total_sessions: 0,
        last_used: null,
      };
    }

    const total_tools_used = history.length;
    const last_used = history[0]?.used_at ?? null;

    const counts = history.reduce((acc, item) => {
      acc[item.tool_id] = (acc[item.tool_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    let favorite_tool: string | null = null;
    let maxCount = 0;
    Object.entries(counts).forEach(([toolId, count]) => {
      if (count > maxCount) {
        maxCount = count;
        favorite_tool = toolId;
      }
    });

    return {
      total_tools_used,
      favorite_tool,
      total_sessions: 0,
      last_used,
    } as UserStats;
  },

  async getToolUsageByToolId(toolId: string) {
    const user = firebaseAuth.currentUser;
    if (!user) return [];

    try {
      const q = query(
        collection(firestore, 'tool_usage'),
        where('user_id', '==', user.uid),
        where('tool_id', '==', toolId),
        orderBy('used_at', 'desc'),
      );
      const snapshot = await getDocs(q);

      return snapshot.docs.map(docSnapshot => ({
        id: docSnapshot.id,
        ...(docSnapshot.data() as Omit<ToolUsage, 'id'>),
      })) as ToolUsage[];
    } catch (error) {
      console.error('Error fetching tool usage by tool id:', error);
      return [];
    }
  },

  async getMostUsedTools(limit: number = 5) {
    const history = await this.getToolUsageHistory(1000);
    const toolCounts = history.reduce((acc, item) => {
      if (!acc[item.tool_id]) {
        acc[item.tool_id] = {
          tool_id: item.tool_id,
          tool_name: item.tool_name,
          count: 0,
        };
      }
      acc[item.tool_id].count++;
      return acc;
    }, {} as Record<string, { tool_id: string; tool_name: string; count: number }>);

    return Object.values(toolCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  },
};
