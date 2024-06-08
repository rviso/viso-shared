export * from './trim'
export * from './replace'

/**
 * 获取数字
 * @param val
 * @returns
 */
export const getStringNumber = (val?: string): number => {
  return val ? Number(val.replace(/[^0-9]/gi, '')) : -1
}

/**
 * 获取单位
 * @param val
 * @returns
 */
export const getStringUnit = (val: string) => {
  return val.replace(/[0-9]*/g, '').replace(/\./, '')
}

/**
 * 拿到最后一个字符串
 * @param val
 * @returns
 */
export const getStringLastChar = (val: string) => {
  return val.substring(val.length - 1)
}

/**
 * 用中文字符替换逗号
 * @param str
 * @returns
 */
export function stringReplaceCommaWithChinese(str: string) {
  return str.replace(/,/g, '，')
}
