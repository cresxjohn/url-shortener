// DTOs for API requests/responses
export interface CreateUserDto {
  email: string;
  password: string;
  name?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface CreateUrlDto {
  longUrl: string;
  customSlug?: string;
  expiresAt?: string;
}

export interface UpdateUrlDto {
  longUrl?: string;
  title?: string;
  description?: string;
  isActive?: boolean;
  expiresAt?: string | null;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
}

// API Response types
export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name?: string;
    role: string;
    isVerified: boolean;
    createdAt: string;
  };
  accessToken: string;
}

export interface RefreshResponse {
  accessToken: string;
}

export interface UrlResponse {
  id: string;
  shortCode: string;
  longUrl: string;
  title?: string;
  description?: string;
  customSlug?: string;
  isActive: boolean;
  clicks: number;
  expiresAt?: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedUrlsResponse {
  urls: UrlResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ClickAnalytics {
  id: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  country?: string;
  city?: string;
  device?: string;
  browser?: string;
  os?: string;
  urlId: string;
}

export interface AnalyticsResponse {
  url: UrlResponse;
  totalClicks: number;
  uniqueClicks: number;
  clicksByDate: { date: string; clicks: number }[];
  clicksByCountry: { country: string; clicks: number }[];
  clicksByDevice: { device: string; clicks: number }[];
  clicksByBrowser: { browser: string; clicks: number }[];
  recentClicks: ClickAnalytics[];
}

export interface ApiError {
  message: string;
  statusCode?: number;
}
