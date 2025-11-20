export const validation = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 255;
  },

  password: (password: string): { valid: boolean; message?: string } => {
    if (password.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters' };
    }
    if (password.length > 128) {
      return { valid: false, message: 'Password must be less than 128 characters' };
    }
    if (!/[a-z]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one lowercase letter' };
    }
    if (!/[A-Z]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one uppercase letter' };
    }
    if (!/[0-9]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one number' };
    }
    return { valid: true };
  },

  sanitizeInput: (input: string, maxLength: number = 1000): string => {
    return input
      .trim()
      .slice(0, maxLength)
      .replace(/[<>]/g, '');
  },

  isValidUrl: (url: string): boolean => {
    try {
      const parsedUrl = new URL(url);
      return ['http:', 'https:'].includes(parsedUrl.protocol);
    } catch {
      return false;
    }
  },

  isValidBase64: (str: string): boolean => {
    try {
      return btoa(atob(str)) === str;
    } catch {
      return false;
    }
  },

  sanitizeFileName: (fileName: string): string => {
    return fileName
      .replace(/[^a-zA-Z0-9._-]/g, '')
      .slice(0, 255);
  },

  validateTextLength: (text: string, min: number = 0, max: number = 10000): boolean => {
    return text.length >= min && text.length <= max;
  },

  sanitizeJson: (jsonString: string): string | null => {
    try {
      const parsed = JSON.parse(jsonString);
      return JSON.stringify(parsed);
    } catch {
      return null;
    }
  },
};
