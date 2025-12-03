import { firebaseAuth, firestore, firebaseStorage } from '../lib/firebase';
import {
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import {
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';

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
    const user = firebaseAuth.currentUser;
    if (!user) {
      console.warn('No authenticated user');
      return null;
    }

    try {
      const snapshot = await getDoc(doc(firestore, 'profiles', user.uid));

      if (!snapshot.exists()) {
        return null;
      }

      return snapshot.data() as UserProfile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  },

  async createProfile(profile: Partial<UserProfile>) {
    const user = firebaseAuth.currentUser;

    if (!user) {
      console.error('No authenticated user');
      return null;
    }

    try {
      const now = new Date().toISOString();
      const payload: UserProfile = {
        id: user.uid,
        email: user.email,
        full_name: profile.full_name || null,
        avatar_url: profile.avatar_url || null,
        created_at: now,
        updated_at: now,
        mfa_enabled: profile.mfa_enabled ?? false,
      };

      await setDoc(doc(firestore, 'profiles', user.uid), payload);
      return payload;
    } catch (error) {
      console.error('Error creating profile:', error);
      return null;
    }
  },

  async updateProfile(updates: Partial<UserProfile>) {
    const user = firebaseAuth.currentUser;

    if (!user) {
      console.error('No authenticated user');
      return null;
    }

    try {
      const updated = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      await updateDoc(doc(firestore, 'profiles', user.uid), updated);

      const snapshot = await getDoc(doc(firestore, 'profiles', user.uid));
      return snapshot.data() as UserProfile;
    } catch (error) {
      console.error('Error updating profile:', error);
      return null;
    }
  },

  async deleteProfile() {
    const user = firebaseAuth.currentUser;

    if (!user) {
      console.error('No authenticated user');
      return false;
    }

    try {
      await deleteDoc(doc(firestore, 'profiles', user.uid));
      return true;
    } catch (error) {
      console.error('Error deleting profile:', error);
      return false;
    }
  },

  async uploadAvatar(file: File) {
    const user = firebaseAuth.currentUser;

    if (!user) {
      console.error('No authenticated user');
      return null;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only images are allowed.');
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error('File size exceeds 5MB limit.');
    }

    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    if (!fileExt || !allowedExtensions.includes(fileExt)) {
      throw new Error('Invalid file extension.');
    }

    try {
      const fileName = `${user.uid}-${crypto.randomUUID()}.${fileExt}`;
      const storageRef = ref(firebaseStorage, `avatars/${fileName}`);
      await uploadBytes(storageRef, file);
      const publicUrl = await getDownloadURL(storageRef);

      await this.updateProfile({ avatar_url: publicUrl });

      return publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      return null;
    }
  },
};
