/**
 * 对字面量对象进行排序
 * @param obj - 字面量对象
 * @returns {Record<string, any>}
 */
export const sortObject = <T extends Record<string, any> = Record<string, any>>(obj: T): T => {
  const keys = Object.keys(obj).sort() as (keyof T)[]

  const result = {} as T

  keys.forEach((key) => {
    result[key] = obj[key]
  })

  return result
}
