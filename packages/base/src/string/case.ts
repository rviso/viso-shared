import _kebabCase from 'lodash/kebabCase'
import _camelCase from 'lodash/camelCase'
import _snakeCase from 'lodash/snakeCase'
import _upperFirst from 'lodash/upperFirst'
import _lowerFirst from 'lodash/lowerFirst'
import _capitalize from 'lodash/capitalize'

/**
 * 将字符串转换为 kebab-case
 * @param str - 原字符串
 * @returns 返回转换后的字符串
 * @example kebabCase('Foo Bar') // 'foo-bar'
 */
export const kebabCase = (str: string) => _kebabCase(str)

/**
 * 将字符串转换为 camelCase
 * @param str - 原字符串
 * @returns 返回转换后的字符串
 * @example camelCase('Foo Bar') // 'fooBar'
 */
export const camelCase = (str: string) => _camelCase(str)

/**
 * 将字符串转换为 snake_case
 * @param str - 原字符串
 * @returns 返回转换后的字符串
 * @example snakeCase('Foo Bar') // 'foo_bar'
 */
export const snakeCase = (str: string) => _snakeCase(str)

/**
 * 将字符串首字母转换为大写
 * @param str - 原字符串
 * @returns 返回转换后的字符串
 * @example upperFirst('foo bar') // 'Foo bar'
 */
export const upperFirst = (str: string) => _upperFirst(str)

/**
 * 将字符串首字母转换为小写
 * @param str - 原字符串
 * @returns 返回转换后的字符串
 * @example lowerFirst('Foo Bar') // 'foo Bar'
 */
export const lowerFirst = (str: string) => _lowerFirst(str)

/**
 * 将字符串首字母转换为大写
 * @param str - 原字符串
 * @returns 返回转换后的字符串
 * @example capitalize('foo bar') // 'Foo bar'
 */
export const capitalize = (str: string) => _capitalize(str)

/**
 * 首字母大写
 * @param string
 * @returns
 */
export const formatUpperCase = (string: string) => {
  if (!string) return ''
  return string
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
    .replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
}
