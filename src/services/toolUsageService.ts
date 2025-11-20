import { supabase } from '../lib/supabase';

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
    const { data, error } = await supabase
      .from('tool_usage')
      .insert({
        tool_id: toolId,
        tool_name: toolName,
        metadata: metadata || {},
      })
      .select()
      .single();

    if (error) {
      console.error('Error tracking tool usage:', error);
      return null;
    }

    return data;
  },

  async getToolUsageHistory(limit: number = 50) {
    const { data, error } = await supabase
      .from('tool_usage')
      .select('*')
      .order('used_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching tool usage history:', error);
      return [];
    }

    return data as ToolUsage[];
  },

  async getToolUsageStats() {
    const { data, error } = await supabase
      .rpc('get_user_stats');

    if (error) {
      console.error('Error fetching user stats:', error);
      return null;
    }

    return data?.[0] as UserStats | null;
  },

  async getToolUsageByToolId(toolId: string) {
    const { data, error } = await supabase
      .from('tool_usage')
      .select('*')
      .eq('tool_id', toolId)
      .order('used_at', { ascending: false });

    if (error) {
      console.error('Error fetching tool usage by tool id:', error);
      return [];
    }

    return data as ToolUsage[];
  },

  async getMostUsedTools(limit: number = 5) {
    const { data, error } = await supabase
      .from('tool_usage')
      .select('tool_id, tool_name')
      .order('used_at', { ascending: false });

    if (error) {
      console.error('Error fetching most used tools:', error);
      return [];
    }

    const toolCounts = data.reduce((acc, item) => {
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
