/** 深度清空前后空格 */
export function deepTrim(object: unknown) {
  if (typeof object === 'string') {
    return object.trim()
  }
  if (typeof object === 'object') {
    for (const key in object) {
      const obj = object as Record<string, unknown>
      obj[key] = deepTrim((object as Record<string, unknown>)[key])
    }
  }
  return object
}

// 遍历对象，去除前后的空格

export function wipeOffTrim(obj: Record<string, any>) {
  for (const i in obj) {
    if (typeof obj[i] == 'string') {
      obj[i] = obj[i].trim()
    }
    if (obj[i] == null) {
      obj[i] = ''
    }
  }
  return obj
}
