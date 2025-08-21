import { nanoid } from 'nanoid';
import Url from '../models/Url';
import BlacklistedUrl from '../models/BlacklistedUrl';
import { RESERVED_ROUTES } from '../constants';

export const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'https:' || urlObj.protocol === 'http:';
  } catch {
    return false;
  }
};

export const validateSlug = async (slug: string): Promise<void> => {
  // Check if slug is a reserved route
  if (RESERVED_ROUTES.includes(slug.toLowerCase())) {
    throw new Error('Slug conflicts with reserved route');
  }

  // Check if slug contains only alphanumeric characters, hyphens, and underscores
  if (!/^[a-zA-Z0-9_-]+$/.test(slug)) {
    throw new Error(
      'Slug can only contain letters, numbers, hyphens, and underscores'
    );
  }

  // Check minimum and maximum length
  if (slug.length < 1 || slug.length > 50) {
    throw new Error('Slug must be between 1 and 50 characters');
  }

  // Check if slug is already taken
  const existingUrl = await Url.findOne({ shortCode: slug });
  if (existingUrl) {
    throw new Error('Custom slug already exists');
  }
};

export const generateUniqueShortCode = async (): Promise<string> => {
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    const shortCode = nanoid(6);

    // Check if it's not a reserved route
    if (RESERVED_ROUTES.includes(shortCode.toLowerCase())) {
      attempts++;
      continue;
    }

    const existingUrl = await Url.findOne({ shortCode });

    if (!existingUrl) {
      return shortCode;
    }

    attempts++;
  }

  throw new Error('Failed to generate unique short code');
};

export const checkBlacklist = async (url: string): Promise<void> => {
  const domain = new URL(url).hostname;
  const blacklistedUrl = await BlacklistedUrl.findOne({
    $or: [{ url }, { url: domain }],
  });

  if (blacklistedUrl) {
    throw new Error('URL is blacklisted');
  }
};

export const extractTitle = async (url: string): Promise<string | null> => {
  // In a real implementation, you would fetch the URL and extract the title
  // For now, return a placeholder based on domain
  try {
    const domain = new URL(url).hostname;
    return `Page from ${domain}`;
  } catch {
    return null;
  }
};

export const extractDescription = async (
  url: string
): Promise<string | null> => {
  // In a real implementation, you would fetch the URL and extract the description
  // For now, return null
  return null;
};
