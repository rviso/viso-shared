import type { Fn, MaybePromiseFn, PromiseFn, PromiseLikeFn } from '@viso/types'

export const isPromiseLike = <T = unknown, P = void>(fn: unknown): fn is PromiseLikeFn<T, P> => {
  return fn instanceof Promise || typeof (fn as Promise<T>).then === 'function'
}

export const callPromiseOrFn = <T = unknown, P = void>(fn: MaybePromiseFn<T, P>, ...args: T[]): P | Promise<P> => {
  if (isPromiseLike(fn)) {
    return (fn as PromiseFn<T, P>)(...args)
  }
  return (fn as Fn<T, P>)(...args)
}
