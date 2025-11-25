import { useEffect, useState } from 'react';
import { User, Mail, Calendar, Edit2 } from 'lucide-react';
import { profileService, UserProfile } from '../../services/profileService';
import { useAuth } from '../../contexts/AuthContext';

export function ProfileView() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const data = await profileService.getProfile();
    if (data) {
      setProfile(data);
      setFullName(data.full_name || '');
    }
    setLoading(false);
  };

  const handleSave = async () => {
    const updated = await profileService.updateProfile({ full_name: fullName });
    if (updated) {
      setProfile(updated);
      setEditing(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-700">
        <div className="text-center text-gray-400">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-100">Profile</h2>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 px-4 py-2 text-blue-400 hover:bg-blue-900/30 rounded-lg transition-colors border border-blue-800/50"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        )}
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-100">
              {profile?.full_name || 'User'}
            </h3>
            <p className="text-gray-400">{user?.email}</p>
          </div>
        </div>

        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 placeholder-gray-500"
                placeholder="Enter your full name"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleSave}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setFullName(profile?.full_name || '');
                }}
                className="flex-1 bg-gray-700 text-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors border border-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-400">
              <Mail className="w-5 h-5" />
              <span>{user?.email}</span>
            </div>

            <div className="flex items-center gap-3 text-gray-400">
              <Calendar className="w-5 h-5" />
              <span>
                Joined {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
