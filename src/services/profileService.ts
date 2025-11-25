import { supabase } from '../lib/supabase';

export interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  mfa_enabled: boolean;
}

export const profileService = {
  async getProfile() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data as UserProfile | null;
  },

  async createProfile(profile: Partial<UserProfile>) {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      console.error('No authenticated user');
      return null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userData.user.id,
        email: userData.user.email,
        full_name: profile.full_name || null,
        avatar_url: profile.avatar_url || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error);
      return null;
    }

    return data as UserProfile;
  },

  async updateProfile(updates: Partial<UserProfile>) {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      console.error('No authenticated user');
      return null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userData.user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return null;
    }

    return data as UserProfile;
  },

  async deleteProfile() {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      console.error('No authenticated user');
      return false;
    }

    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userData.user.id);

    if (error) {
      console.error('Error deleting profile:', error);
      return false;
    }

    return true;
  },

  async uploadAvatar(file: File) {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      console.error('No authenticated user');
      return null;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only images are allowed.');
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('File size exceeds 5MB limit.');
    }

    // Validate file extension
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    if (!fileExt || !allowedExtensions.includes(fileExt)) {
      throw new Error('Invalid file extension.');
    }

    const fileName = `${userData.user.id}-${Math.random()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading avatar:', uploadError);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    await this.updateProfile({ avatar_url: publicUrl });

    return publicUrl;
  },
};
