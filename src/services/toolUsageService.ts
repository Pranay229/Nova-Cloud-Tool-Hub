import { supabase } from '../lib/supabase';

export interface ToolUsage {
  id: string;
  user_id: string;
  tool_id: string;
  tool_name: string;
  used_at: string;
  metadata?: Record<string, any>;
  created_at?: string;
}

export interface UserStats {
  total_tools_used: number;
  favorite_tool: string | null;
  total_sessions: number;
  last_used: string | null;
}

export const toolUsageService = {
  async trackToolUsage(toolId: string, toolName: string, metadata?: Record<string, any>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.warn('User must be authenticated to track tool usage');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('tool_usage')
        .insert({
          user_id: user.id,
          tool_id: toolId,
          tool_name: toolName,
          metadata: metadata || {},
        })
        .select()
        .single();

      if (error) throw error;

      return data as ToolUsage;
    } catch (error) {
      console.error('Error tracking tool usage:', error);
      return null;
    }
  },

  async getToolUsageHistory(limit: number = 50) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('tool_usage')
        .select('*')
        .eq('user_id', user.id)
        .order('used_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []) as ToolUsage[];
    } catch (error) {
      console.error('Error fetching tool usage history:', error);
      return [];
    }
  },

  async getToolUsageStats() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return {
        total_tools_used: 0,
        favorite_tool: null,
        total_sessions: 0,
        last_used: null,
      };
    }

    try {
      // Use the database function if available, otherwise calculate manually
      const { data: functionData, error: functionError } = await supabase
        .rpc('get_user_stats');

      if (!functionError && functionData && functionData.length > 0) {
        const stats = functionData[0];
        return {
          total_tools_used: Number(stats.total_tools_used) || 0,
          favorite_tool: stats.favorite_tool,
          total_sessions: Number(stats.total_sessions) || 0,
          last_used: stats.last_used,
        } as UserStats;
      }

      // Fallback: Calculate manually
      const history = await this.getToolUsageHistory(1000);
      if (history.length === 0) {
        return {
          total_tools_used: 0,
          favorite_tool: null,
          total_sessions: 0,
          last_used: null,
        };
      }

      const toolIds = new Set(history.map(item => item.tool_id));
      const total_tools_used = toolIds.size;
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
          favorite_tool = history.find(h => h.tool_id === toolId)?.tool_name || toolId;
        }
      });

      // Get session count
      const { count: sessionCount } = await supabase
        .from('user_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      return {
        total_tools_used,
        favorite_tool,
        total_sessions: sessionCount || 0,
        last_used,
      } as UserStats;
    } catch (error) {
      console.error('Error fetching tool usage stats:', error);
      return {
        total_tools_used: 0,
        favorite_tool: null,
        total_sessions: 0,
        last_used: null,
      };
    }
  },

  async getToolUsageByToolId(toolId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('tool_usage')
        .select('*')
        .eq('user_id', user.id)
        .eq('tool_id', toolId)
        .order('used_at', { ascending: false });

      if (error) throw error;

      return (data || []) as ToolUsage[];
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

  // Subscribe to real-time updates for tool usage
  subscribeToToolUsage(callback: (payload: { eventType: string; new: ToolUsage; old?: ToolUsage }) => void) {
    const { data: { user } } = supabase.auth.getUser();
    if (!user) return null;

    return supabase
      .channel('tool_usage_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tool_usage',
          filter: `user_id=eq.${user.then(u => u.user?.id || '')}`,
        },
        (payload) => {
          callback({
            eventType: payload.eventType,
            new: payload.new as ToolUsage,
            old: payload.old as ToolUsage,
          });
        }
      )
      .subscribe();
  },
};
