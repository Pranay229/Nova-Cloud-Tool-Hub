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
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center text-gray-600">Loading stats...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Activity</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-8 h-8 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {stats?.totalToolsUsed || 0}
          </div>
          <div className="text-sm text-gray-600">Tools Used</div>
        </div>

        <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {sessionStats?.totalSessions || 0}
          </div>
          <div className="text-sm text-gray-600">Total Sessions</div>
        </div>

        <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-8 h-8 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {stats?.favoriteTool || 'N/A'}
          </div>
          <div className="text-sm text-gray-600">Favorite Tool</div>
        </div>

        <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {sessionStats?.averageToolsPerSession.toFixed(1) || 0}
          </div>
          <div className="text-sm text-gray-600">Avg Tools/Session</div>
        </div>
      </div>

      {stats?.lastUsed && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Last active:{' '}
            <span className="font-semibold text-gray-900">
              {new Date(stats.lastUsed).toLocaleString()}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
