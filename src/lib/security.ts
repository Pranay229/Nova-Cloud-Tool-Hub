import { supabase } from './supabase';

export const security = {
  sanitizeError: (error: unknown): string => {
    if (typeof error === 'string') return 'An error occurred';

    if (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof (error as { message: string }).message === 'string'
    ) {
      const message = (error as { message: string }).message.toLowerCase();
      if (message.includes('password') ||
          message.includes('token') ||
          message.includes('key') ||
          message.includes('secret')) {
        return 'Authentication error occurred';
      }
      if (message.includes('unique') || message.includes('duplicate')) {
        return 'This record already exists';
      }
      if (message.includes('not found')) {
        return 'Resource not found';
      }
    }
    return 'An error occurred. Please try again.';
  },

  rateLimit: (() => {
    const limits = new Map<string, { count: number; resetTime: number }>();

    return (key: string, maxRequests: number = 10, windowMs: number = 60000): boolean => {
      const now = Date.now();
      const record = limits.get(key);

      if (!record || now > record.resetTime) {
        limits.set(key, { count: 1, resetTime: now + windowMs });
        return true;
      }

      if (record.count >= maxRequests) {
        return false;
      }

      record.count++;
      return true;
    };
  })(),

  generateCSRFToken: (): string => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  },

  verifyCSRFToken: (token: string, storedToken: string): boolean => {
    return token === storedToken && token.length === 64;
  },

  hashData: async (data: string): Promise<string> => {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  },

  isStrongPassword: (password: string): boolean => {
    return (
      password.length >= 8 &&
      /[a-z]/.test(password) &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      !/(.)\1{2,}/.test(password)
    );
  },

  checkAuth: async (): Promise<boolean> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return !!session?.user;
    } catch (error) {
      console.error('Error checking auth:', error);
      return false;
    }
  },

  logSecurityEvent: (event: string, details?: unknown) => {
    const sanitizedDetails = {
      timestamp: new Date().toISOString(),
      event,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      details: details ? security.sanitizeError(details) : undefined,
    };
    console.warn('[SECURITY]', sanitizedDetails);
  },
};

export class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  constructor(
    private maxRequests: number = 10,
    private windowMs: number = 60000
  ) {}

  check(identifier: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    let requestTimes = this.requests.get(identifier) || [];
    requestTimes = requestTimes.filter(time => time > windowStart);

    if (requestTimes.length >= this.maxRequests) {
      return false;
    }

    requestTimes.push(now);
    this.requests.set(identifier, requestTimes);

    return true;
  }

  reset(identifier: string): void {
    this.requests.delete(identifier);
  }
}
