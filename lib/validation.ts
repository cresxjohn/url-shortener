// Reserved routes that cannot be used as custom slugs
export const RESERVED_ROUTES = [
  'login',
  'signup',
  'dashboard',
  'profile',
  'analytics',
  'forgot-password',
  'reset-password',
  'terms',
  'privacy',
  'admin',
  'api',
  'app',
  'www',
  'mail',
  'ftp',
  'blog',
  'contact',
  'about',
  'help',
  'support',
  'docs',
  'documentation',
  'status',
  'health',
  'ping',
  'test',
  'dev',
  'staging',
  'prod',
  'production',
  'beta',
  'alpha',
  '_next',
  'static',
  'assets',
  'public',
  'images',
  'img',
  'css',
  'js',
  'fonts',
  'favicon',
  'robots',
  'sitemap',
  'manifest',
  '.well-known',
  'oauth',
  'auth',
  'logout',
  'register',
  'reset',
  'verify',
  'settings',
  'account',
  'billing',
  'pricing',
  'plans',
  'features',
  'enterprise',
  'business',
  'pro',
  'premium',
  'free',
  'trial',
  'demo',
];

export interface SlugValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateCustomSlug(slug: string): SlugValidationResult {
  // Check if empty
  if (!slug || slug.trim() === '') {
    return { isValid: false, error: 'Slug cannot be empty' };
  }

  // Remove whitespace
  slug = slug.trim();

  // Check length
  if (slug.length < 1 || slug.length > 50) {
    return {
      isValid: false,
      error: 'Slug must be between 1 and 50 characters',
    };
  }

  // Check if it's a reserved route
  if (RESERVED_ROUTES.includes(slug.toLowerCase())) {
    return {
      isValid: false,
      error: 'This slug is reserved and cannot be used',
    };
  }

  // Check format - only alphanumeric, hyphens, and underscores
  if (!/^[a-zA-Z0-9_-]+$/.test(slug)) {
    return {
      isValid: false,
      error: 'Slug can only contain letters, numbers, hyphens, and underscores',
    };
  }

  return { isValid: true };
}

export function sanitizeSlug(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-zA-Z0-9_-]/g, '') // Remove invalid characters
    .slice(0, 50); // Limit length
}
