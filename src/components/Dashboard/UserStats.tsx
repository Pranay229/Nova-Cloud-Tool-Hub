import { useEffect, useState } from 'react';
import { TrendingUp, Clock, Zap, Activity } from 'lucide-react';
import { toolUsageService } from '../../services/toolUsageService';
import { sessionService } from '../../services/sessionService';

export function UserStats() {
  const [stats, setStats] = useState<{
    totalToolsUsed: number;
    favoriteTool: string | null;
    totalSessions: number;
    lastUsed: string | null;
  } | null>(null);

  const [sessionStats, setSessionStats] = useState<{
    totalSessions: number;
    completedSessions: number;
    activeSessions: number;
    averageToolsPerSession: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const userStats = await toolUsageService.getToolUsageStats();
      const sessStats = await sessionService.getSessionStats();

      if (userStats) {
        setStats({
          totalToolsUsed: userStats.total_tools_used || 0,
          favoriteTool: userStats.favorite_tool,
          totalSessions: userStats.total_sessions || 0,
          lastUsed: userStats.last_used,
        });
      }

      if (sessStats) {
        setSessionStats(sessStats);
      }

      setLoading(false);
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-700">
        <div className="text-center text-gray-400">Loading stats...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg p-8 mb-8 border border-gray-700">
      <h2 className="text-2xl font-bold text-gray-100 mb-6">Your Activity</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-xl border border-blue-800/50">
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-8 h-8 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-gray-100 mb-1">
            {stats?.totalToolsUsed || 0}
          </div>
          <div className="text-sm text-gray-400">Tools Used</div>
        </div>

        <div className="p-6 bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-xl border border-green-800/50">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-gray-100 mb-1">
            {sessionStats?.totalSessions || 0}
          </div>
          <div className="text-sm text-gray-400">Total Sessions</div>
        </div>

        <div className="p-6 bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl border border-purple-800/50">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-8 h-8 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-gray-100 mb-1">
            {stats?.favoriteTool || 'N/A'}
          </div>
          <div className="text-sm text-gray-400">Favorite Tool</div>
        </div>

        <div className="p-6 bg-gradient-to-br from-orange-900/30 to-red-900/30 rounded-xl border border-orange-800/50">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-orange-400" />
          </div>
          <div className="text-3xl font-bold text-gray-100 mb-1">
            {sessionStats?.averageToolsPerSession.toFixed(1) || 0}
          </div>
          <div className="text-sm text-gray-400">Avg Tools/Session</div>
        </div>
      </div>

      {stats?.lastUsed && (
        <div className="mt-6 pt-6 border-t border-gray-700">
          <p className="text-sm text-gray-400">
            Last active:{' '}
            <span className="font-semibold text-gray-200">
              {new Date(stats.lastUsed).toLocaleString()}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
