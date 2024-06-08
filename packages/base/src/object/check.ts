/**
 * 创建一个方法，深度递归检查对象是否包含空值
 */
export function deepCheckEmpty<T>(obj: T): boolean {
  if (obj === null || obj === undefined) {
    return true
  }
  if (typeof obj === 'object') {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (deepCheckEmpty(obj[key])) {
          return true
        }
      }
    }
  }
  return false
}
