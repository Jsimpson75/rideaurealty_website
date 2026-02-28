import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ApiCache } from './cache'

describe('ApiCache', () => {
  let storage: Record<string, string> = {}

  beforeEach(() => {
    storage = {}
    const localStorageProxy = new Proxy(storage, {
      get(target, prop: string) {
        if (prop === 'getItem') return (k: string) => target[k] ?? null
        if (prop === 'setItem') return (k: string, v: string) => { target[k] = v }
        if (prop === 'removeItem') return (k: string) => { delete target[k] }
        if (prop === 'key') return (i: number) => Object.keys(target)[i] ?? null
        if (prop === 'length') return Object.keys(target).length
        if (prop === 'clear') return () => { for (const k of Object.keys(target)) delete target[k] }
        return target[prop]
      },
    })
    vi.stubGlobal('localStorage', localStorageProxy)
    ApiCache.clear()
  })

  it('sets and gets data', () => {
    ApiCache.set('key1', { foo: 1 }, 10)
    expect(ApiCache.get<{ foo: number }>('key1')).toEqual({ foo: 1 })
  })

  it('returns null for missing key', () => {
    expect(ApiCache.get('missing')).toBeNull()
  })

  it('returns null when cache is expired', () => {
    ApiCache.set('key1', { x: 1 }, 10)
    const raw = (globalThis as any).localStorage.getItem('rideau_realty_cache_key1')
    expect(raw).toBeTruthy()
    const parsed = JSON.parse(raw)
    parsed.expiresAt = Date.now() - 1
    ;(globalThis as any).localStorage.setItem('rideau_realty_cache_key1', JSON.stringify(parsed))
    expect(ApiCache.get('key1')).toBeNull()
  })

  it('has() returns true when data exists and not expired', () => {
    ApiCache.set('key1', {}, 10)
    expect(ApiCache.has('key1')).toBe(true)
  })

  it('has() returns false when key missing or expired', () => {
    expect(ApiCache.has('missing')).toBe(false)
    ApiCache.set('key1', {}, 10)
    const raw = (globalThis as any).localStorage.getItem('rideau_realty_cache_key1')
    const parsed = JSON.parse(raw)
    parsed.expiresAt = Date.now() - 1
    ;(globalThis as any).localStorage.setItem('rideau_realty_cache_key1', JSON.stringify(parsed))
    expect(ApiCache.has('key1')).toBe(false)
  })

  it('remove() deletes entry', () => {
    ApiCache.set('key1', {}, 10)
    ApiCache.remove('key1')
    expect(ApiCache.get('key1')).toBeNull()
  })

  it('clear() removes all app cache entries', () => {
    ApiCache.set('key1', {}, 10)
    ApiCache.set('key2', {}, 10)
    ApiCache.clear()
    expect(ApiCache.get('key1')).toBeNull()
    expect(ApiCache.get('key2')).toBeNull()
  })

  it('getInfo() returns metadata for existing key', () => {
    ApiCache.set('key1', { a: 1 }, 10)
    const info = ApiCache.getInfo('key1')
    expect(info).not.toBeNull()
    expect(info!.timestamp).toBeGreaterThan(0)
    expect(info!.expiresAt).toBeGreaterThan(info!.timestamp)
    expect(info!.isExpired).toBe(false)
  })

  it('getInfo() returns null for missing key', () => {
    expect(ApiCache.getInfo('missing')).toBeNull()
  })
})
