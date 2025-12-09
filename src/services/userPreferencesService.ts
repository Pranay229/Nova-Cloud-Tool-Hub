import { firebaseAuth, firestore } from '../lib/firebase';
import {
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';

export interface UserPreferences {
  id: string;
  user_id: string;
  theme: 'light' | 'dark';
  default_tool: string | null;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export const userPreferencesService = {
  async getPreferences() {
    const user = firebaseAuth.currentUser;
    if (!user) {
      return null;
    }

    try {
      const snapshot = await getDoc(doc(firestore, 'user_preferences', user.uid));
      if (!snapshot.exists()) {
        return null;
      }
      return snapshot.data() as UserPreferences;
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      return null;
    }
  },

  async createPreferences(preferences: Partial<UserPreferences>) {
    const user = firebaseAuth.currentUser;
    if (!user) {
      return null;
    }

    try {
      const now = new Date().toISOString();
      const prefs: UserPreferences = {
        id: user.uid,
        user_id: user.uid,
        theme: preferences.theme || 'light',
        default_tool: preferences.default_tool || null,
        settings: preferences.settings || {},
        created_at: now,
        updated_at: now,
      };

      const docRef = doc(firestore, 'user_preferences', user.uid);
      await setDoc(docRef, prefs);
      return prefs;
    } catch (error) {
      console.error('Error creating user preferences:', error);
      return null;
    }
  },

  async updatePreferences(updates: Partial<UserPreferences>) {
    const user = firebaseAuth.currentUser;
    if (!user) {
      return null;
    }

    try {
      const existing = await this.getPreferences();
      const updated: UserPreferences = {
        ...(existing || {
          id: user.uid,
          user_id: user.uid,
          theme: 'light',
          default_tool: null,
          settings: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }),
        ...updates,
        updated_at: new Date().toISOString(),
      };

      await setDoc(doc(firestore, 'user_preferences', user.uid), updated, { merge: true });
      return updated;
    } catch (error) {
      console.error('Error updating user preferences:', error);
      return null;
    }
  },

  async setTheme(theme: 'light' | 'dark') {
    return this.updatePreferences({ theme });
  },

  async setDefaultTool(toolId: string) {
    return this.updatePreferences({ default_tool: toolId });
  },

  async updateSettings(settings: Record<string, any>) {
    const existing = await this.getPreferences();
    const updatedSettings = {
      ...(existing?.settings || {}),
      ...settings,
    };

    return this.updatePreferences({ settings: updatedSettings });
  },
};
