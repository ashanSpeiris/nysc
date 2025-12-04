import Redis from 'ioredis';

// Create Redis client
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

redis.on('connect', () => {
  console.log('✅ Redis connected successfully');
});

// Cache helper functions
export const cache = {
  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  },

  /**
   * Set value in cache with TTL (in seconds)
   */
  async set(key: string, value: any, ttl: number = 3600): Promise<boolean> {
    try {
      await redis.setex(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  },

  /**
   * Delete key from cache
   */
  async del(key: string): Promise<boolean> {
    try {
      await redis.del(key);
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  },

  /**
   * Clear all keys matching a pattern
   */
  async clearPattern(pattern: string): Promise<boolean> {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
      return true;
    } catch (error) {
      console.error('Cache clear pattern error:', error);
      return false;
    }
  },
};

// Rate limiting helper
export const rateLimit = {
  /**
   * Check if request should be rate limited
   * @param identifier - IP address or user ID
   * @param maxRequests - Maximum requests allowed
   * @param windowSeconds - Time window in seconds
   * @returns true if rate limit exceeded
   */
  async isRateLimited(
    identifier: string,
    maxRequests: number = 10,
    windowSeconds: number = 60
  ): Promise<boolean> {
    const key = `rate_limit:${identifier}`;

    try {
      const current = await redis.incr(key);

      if (current === 1) {
        await redis.expire(key, windowSeconds);
      }

      return current > maxRequests;
    } catch (error) {
      console.error('Rate limit error:', error);
      return false; // Fail open - don't block on errors
    }
  },

  /**
   * Get remaining requests for an identifier
   */
  async getRemaining(
    identifier: string,
    maxRequests: number = 10
  ): Promise<number> {
    const key = `rate_limit:${identifier}`;

    try {
      const current = await redis.get(key);
      const remaining = maxRequests - (parseInt(current || '0'));
      return Math.max(0, remaining);
    } catch (error) {
      console.error('Get remaining error:', error);
      return maxRequests;
    }
  },
};

// Statistics caching helper
export const statsCache = {
  /**
   * Cache volunteer statistics
   */
  async getVolunteerStats() {
    return await cache.get('volunteer_stats');
  },

  async setVolunteerStats(stats: any, ttl: number = 300) {
    return await cache.set('volunteer_stats', stats, ttl);
  },

  /**
   * Cache district statistics
   */
  async getDistrictStats() {
    return await cache.get('district_stats');
  },

  async setDistrictStats(stats: any, ttl: number = 300) {
    return await cache.set('district_stats', stats, ttl);
  },

  /**
   * Invalidate all statistics cache
   */
  async invalidateStats() {
    await cache.del('volunteer_stats');
    await cache.del('district_stats');
  },
};

export default redis;
