import type { Fn } from '@viso/types'

export function getFunctionName(fun: Fn) {
  if (fun.name !== undefined) return fun.name
  let ret = fun.toString()
  ret = ret.substr('function '.length)
  ret = ret.substr(0, ret.indexOf('('))
  return ret
}
