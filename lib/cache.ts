// Cache utility for storing API responses with expiration
export interface CacheItem<T> {
  data: T
  timestamp: number
  expiresAt: number
}

export class ApiCache {
  private static getStorageKey(key: string): string {
    return `rideau_realty_cache_${key}`
  }

  /**
   * Store data in cache with expiration
   * @param key Cache key
   * @param data Data to cache
   * @param ttlMinutes Time to live in minutes (default: 10)
   */
  static set<T>(key: string, data: T, ttlMinutes: number = 10): void {
    try {
      const now = Date.now()
      const cacheItem: CacheItem<T> = {
        data,
        timestamp: now,
        expiresAt: now + (ttlMinutes * 60 * 1000)
      }

      localStorage.setItem(
        this.getStorageKey(key),
        JSON.stringify(cacheItem)
      )
    } catch (error) {
      console.warn('Failed to store data in cache:', error)
    }
  }

  /**
   * Retrieve data from cache if not expired
   * @param key Cache key
   * @returns Cached data or null if expired/not found
   */
  static get<T>(key: string): T | null {
    try {
      const cached = localStorage.getItem(this.getStorageKey(key))
      if (!cached) return null

      const cacheItem: CacheItem<T> = JSON.parse(cached)
      const now = Date.now()

      // Check if cache has expired
      if (now > cacheItem.expiresAt) {
        this.remove(key)
        return null
      }

      return cacheItem.data
    } catch (error) {
      console.warn('Failed to retrieve data from cache:', error)
      return null
    }
  }

  /**
   * Check if cache entry exists and is not expired
   * @param key Cache key
   * @returns True if valid cache exists
   */
  static has(key: string): boolean {
    return this.get(key) !== null
  }

  /**
   * Remove specific cache entry
   * @param key Cache key
   */
  static remove(key: string): void {
    try {
      localStorage.removeItem(this.getStorageKey(key))
    } catch (error) {
      console.warn('Failed to remove cache entry:', error)
    }
  }

  /**
   * Clear all cache entries for this app
   */
  static clear(): void {
    try {
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith('rideau_realty_cache_')
      )
      keys.forEach(key => localStorage.removeItem(key))
    } catch (error) {
      console.warn('Failed to clear cache:', error)
    }
  }

  /**
   * Get cache info for debugging
   * @param key Cache key
   * @returns Cache metadata or null
   */
  static getInfo(key: string): { timestamp: number; expiresAt: number; isExpired: boolean } | null {
    try {
      const cached = localStorage.getItem(this.getStorageKey(key))
      if (!cached) return null

      const cacheItem: CacheItem<any> = JSON.parse(cached)
      const now = Date.now()

      return {
        timestamp: cacheItem.timestamp,
        expiresAt: cacheItem.expiresAt,
        isExpired: now > cacheItem.expiresAt
      }
    } catch (error) {
      return null
    }
  }
}