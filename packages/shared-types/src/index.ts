/**
 * @description 修改对象的某个字段类型
 * @example
 * type A = { a: string, b: number }
 * type B = ModifyField<A, 'b', string>
 * // B = { a: string, b: string }
 */
export type ModifyField<T, K extends keyof T, V> = Omit<T, K> & {
  [P in K]: V
}

export type Nullable<T> = T | null | undefined

export interface Dictionary<T> {
  get length(): number

  set(key: string, value: T): void
  add(key: string, value: T): void
  remove(key: string): void
  get(key: string): Nullable<T>
  getAllKeys(): string[]
  getAllValues(): T[]
  hasKey(key: string): boolean
  clear(): void
  forEach(callback: (value: T, key: string) => void): void

  [Symbol.iterator](): IterableIterator<[string, T]>
}

export type ReadyOnlyType<T> = {
  readonly [P in keyof T]: T[P]
}

export type PromiseFn<T = unknown, P = void> = (...args: T[]) => Promise<P>

export type Fn<T = unknown, P = void> = (...args: T[]) => P

export type MaybePromiseFn<T = unknown, P = void> = PromiseFn<T, P> | Fn<T, P>

export type PromiseLikeFn<T = unknown, P = void> = Promise<T> | PromiseFn<T, P>

export type VoidFn<T = unknown> = Fn<T, void>

export type voidPromiseFn<T = unknown> = PromiseFn<T, void>

export type DeepPartial<T> =
  | T
  | (T extends Array<infer U>
      ? DeepPartial<U>[]
      : T extends Map<infer K, infer V>
        ? Map<DeepPartial<K>, DeepPartial<V>>
        : T extends Set<infer M>
          ? Set<DeepPartial<M>>
          : T extends object
            ? { [K in keyof T]?: DeepPartial<T[K]> }
            : T)

type _NumbersFrom0ToNRec<
  Nr extends number,
  Counter extends unknown[],
  Accumulator extends number,
> = Counter['length'] extends Nr
  ? Accumulator
  : _NumbersFrom0ToNRec<Nr, [unknown, ...Counter], Accumulator | Counter['length']>

type _NumbersFrom0ToN<Nr extends number> = Nr extends Nr
  ? number extends Nr
    ? number
    : Nr extends 0
      ? never
      : _NumbersFrom0ToNRec<Nr, [], 0>
  : never

export type NrRange<Start extends number, End extends number> = Exclude<_NumbersFrom0ToN<End>, _NumbersFrom0ToN<Start>>

export const __types__ = () => ({})
