import { supabase } from '../lib/supabase';

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
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .maybeSingle();

    if (error) {
      console.error('Error fetching user preferences:', error);
      return null;
    }

    return data as UserPreferences | null;
  },

  async createPreferences(preferences: Partial<UserPreferences>) {
    const { data, error } = await supabase
      .from('user_preferences')
      .insert({
        theme: preferences.theme || 'light',
        default_tool: preferences.default_tool || null,
        settings: preferences.settings || {},
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user preferences:', error);
      return null;
    }

    return data as UserPreferences;
  },

  async updatePreferences(updates: Partial<UserPreferences>) {
    const { data, error } = await supabase
      .from('user_preferences')
      .update(updates)
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id!)
      .select()
      .single();

    if (error) {
      console.error('Error updating user preferences:', error);
      return null;
    }

    return data as UserPreferences;
  },

  async setTheme(theme: 'light' | 'dark') {
    return this.updatePreferences({ theme });
  },

  async setDefaultTool(toolId: string) {
    return this.updatePreferences({ default_tool: toolId });
  },

  async updateSettings(settings: Record<string, any>) {
    const currentPrefs = await this.getPreferences();
    const updatedSettings = {
      ...currentPrefs?.settings,
      ...settings,
    };

    return this.updatePreferences({ settings: updatedSettings });
  },
};
