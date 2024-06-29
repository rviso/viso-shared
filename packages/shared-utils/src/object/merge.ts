import merge from 'lodash/merge'
/**
 * 深度合并。
 * 注意，请使用loadsh的 _.merge(source,target)方法来替代此功能
 * @param source
 * @param target
 * @param out
 * @returns
 */
export function deepMerge(source: Record<string, unknown> = {}, target: Record<string, unknown> = {}) {
  return merge(source, target)
}
