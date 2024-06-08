import type { DeepPartial } from '@viso/types'
import { isNotEmpty } from '../is'

export function shouldIncludeProperty<T>(
  filterProperties: T[],
  key: T,

  value: any,
): boolean {
  return (
    filterProperties.includes(key) &&
    value !== undefined &&
    value !== null &&
    !(typeof value === 'string' && value.trim() === '')
  )
}

export type FilterCallback = (key: string | number, value: unknown, path?: string) => boolean

const filterCallback: FilterCallback = (key: string | number, value: unknown, _path?: string): boolean => {
  return isNotEmpty(value)
}

function deepFilterObject<T>(obj: T, fn: FilterCallback = filterCallback, path = ''): Partial<T> {
  const result: Partial<T> = {}
  for (const key in obj) {
    const value = obj[key]
    const fullPath = path ? `${path}.${key}` : key
    if (fn(key, value, fullPath)) {
      if (Array.isArray(value)) {
        result[key] = deepFilterArray(value, fn, fullPath) as T[Extract<keyof T, string>]
      } else if (typeof value === 'object') {
        result[key] = deepFilterObject(value, fn, fullPath) as T[Extract<keyof T, string>]
      } else {
        result[key] = value
      }
    }
  }

  return result
}

function deepFilterArray<T>(arr: T[], fn: FilterCallback = filterCallback, _path?: string): T[] {
  const result: T[] = []

  for (let i = 0; i < arr.length; i++) {
    const value = arr[i]
    const fullPath = _path ? `${_path}[${i}]` : i.toString()
    if (fn(i, value, fullPath)) {
      if (Array.isArray(value)) {
        result.push(deepFilterArray(value, fn) as T)
      } else if (typeof value === 'object') {
        result.push(deepFilterObject(value, fn) as T)
      } else {
        result.push(value)
      }
    }
  }

  return result
}

export function deepFilter<T>(value: T, fn: FilterCallback = filterCallback): DeepPartial<T> {
  if (Array.isArray(value)) {
    return value.map((item) => deepFilter(item, fn)) as DeepPartial<T>
  } else if (typeof value === 'object') {
    return deepFilterObject(value, fn) as DeepPartial<T>
  }

  return value
}
