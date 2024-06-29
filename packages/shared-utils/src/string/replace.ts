// 定义所有的中文字符符号
export const chineseSymbols: Record<string, string> = {
  '!': '！',
  '?': '？',
  ',': '，',
  '.': '。',
  ':': '：',
  ';': '；',
  '(': '（',
  ')': '）',
  '[': '【',
  ']': '】',
  '{': '「',
  '}': '」',
  '<': '《',
  '>': '》',
  '"': '“',
  // eslint-disable-next-line @typescript-eslint/quotes
  "'": '‘',
  '`': '·',
  '-': '—',
  '~': '～',
  '|': '｜',
  '\\': '、',
  '/': '／',
  '@': '＠',
  '#': '＃',
  // '$': '￥',
  '%': '％',
  // '^': '……',
  '&': '＆',
  '*': '＊',
  '+': '＋',
  '=': '＝',
  _: '＿',
  '0': '〇',
  '1': '一',
  '2': '二',
  '3': '三',
  '4': '四',
  '5': '五',
  '6': '六',
  '7': '七',
  '8': '八',
  '9': '九',
}

/**
 * 实现所有匹配的字符串替换，支持正则表达式和字符串
 * @param str 原字符串
 * @param searchValue 要替换的字符串或正则表达式
 * @param replaceValue 替换的字符串
 * @returns 返回替换后的字符串
 */
export const replaceAll = (str: string, searchValue: string | RegExp, replaceValue: string) => {
  if (typeof searchValue === 'string') {
    return str.split(searchValue).join(replaceValue)
  }
  return str.replace(new RegExp(searchValue, 'g'), replaceValue)
}

/**
 * 将字符串中的中文符号替换为对应的英文符号
 * @param str - 要替换的字符串
 * @returns 返回替换后的字符串
 */
export const chineseToEnglish = (str: string) => {
  let result = str
  for (const key in chineseSymbols) {
    result = replaceAll(result, chineseSymbols[key], key)
  }
  return result
}

/**
 * 将字符串中的英文符号替换为对应的中文符号
 * @param str - 要替换的字符串
 * @returns 返回替换后的字符串
 */
export const englishToChinese = (str: string) => {
  let result = str
  for (const key in chineseSymbols) {
    result = replaceAll(result, key, chineseSymbols[key])
  }
  return result
}
