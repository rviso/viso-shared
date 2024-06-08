/**
 * 提取字符串中的数字
 * @param str - 传入的字符串
 * @returns 返回提取出的数字
 * @example extractNumber('abc123') // 123
 */
export const extractNumber = (str?: string): number => {
  return str ? Number(str.replace(/[^0-9]/gi, '')) : -1
}

/**
 * 提取最后一个字符
 * @param str - 传入的字符串
 * @returns 返回提取出的最后一个字符
 * @example extractLastChar('abc') // c
 */
export const extractLastChar = (str: string) => {
  return str.substring(str.length - 1)
}
