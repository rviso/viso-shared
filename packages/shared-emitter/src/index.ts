export type EventType = string | symbol

// 事件处理程序可以接受可选的事件参数，不应返回值
export type Handler<T = unknown> = (event: T) => void
export type WildcardHandler<T = Record<string, unknown>> = (type: keyof T, event: T[keyof T]) => void

// 一个类型的所有已注册事件处理程序的数组
export type EventHandlerList<T = unknown> = Array<Handler<T>>
export type WildCardEventHandlerList<T = Record<string, unknown>> = Array<WildcardHandler<T>>

// 事件类型及其对应的事件处理程序的映射
export type EventHandlerMap<Events extends Record<EventType, unknown>> = Map<
  keyof Events | '*',
  EventHandlerList<Events[keyof Events]> | WildCardEventHandlerList<Events>
>

export interface Emitter<Events extends Record<EventType, unknown>> {
  all: EventHandlerMap<Events>

  on<Key extends keyof Events>(type: Key, handler: Handler<Events[Key]>): void
  on(type: '*', handler: WildcardHandler<Events>): void

  off<Key extends keyof Events>(type: Key, handler?: Handler<Events[Key]>): void
  off(type: '*', handler: WildcardHandler<Events>): void

  emit<Key extends keyof Events>(type: Key, event: Events[Key]): void
  emit<Key extends keyof Events>(type: undefined extends Events[Key] ? Key : never): void

  // bind<Key extends keyof Events>(type: Key, handler: Handler<Events[Key]>): void
  // bind(type: '*', handler: WildcardHandler<Events>): void

  // unbind<Key extends keyof Events>(type: Key): void
  // unbindAll(): void

  // once<Key extends keyof Events>(type: Key, handler: Handler<Events[Key]>): void
  // once(type: '*', handler: WildcardHandler<Events>): void

  // clear(): void
}

/**
 * Mitt：小型（~200b）功能性事件发射器/发布订阅。
 * @name mitt
 * @returns {Mitt}
 */
export function createEmitter<Events extends Record<EventType, unknown>>(
  all?: EventHandlerMap<Events>,
): Emitter<Events> {
  type GenericEventHandler = Handler<Events[keyof Events]> | WildcardHandler<Events>
  all = all || new Map()

  return {
    /**
     * 一个事件名称到已注册的处理函数的映射
     */
    all,

    /**
     * 注册给定类型的事件处理程序
     * @param {string|symbol} type  事件类型，或 `'*'` 表示所有事件
     * @param {Function} handler  事件触发时的回调函数
     * @memberOf mitt
     */
    on<Key extends keyof Events>(type: Key, handler: GenericEventHandler) {
      const handlers: Array<GenericEventHandler> | undefined = all!.get(type)
      if (handlers) {
        handlers.push(handler)
      } else {
        all!.set(type, [handler] as EventHandlerList<Events[keyof Events]>)
      }
    },

    /**
     * 移除给定类型的事件处理程序，如果省略 `handler`，则移除给定类型的所有处理程序
     * @param {string|symbol} type 事件类型，或 `'*'` 表示所有事件
     * @param {Function} [handler] 事件触发时的回调函数
     * @memberOf mitt
     */
    off<Key extends keyof Events>(type: Key, handler?: GenericEventHandler) {
      const handlers: Array<GenericEventHandler> | undefined = all!.get(type)
      if (handlers) {
        if (handler) {
          handlers.splice(handlers.indexOf(handler) >>> 0, 1)
        } else {
          all!.set(type, [])
        }
      }
    },

    /**
     * 用于触发mitt的事件
     *
     * 注意： 不支持手动触发 '*' 事件
     *
     * @param {string|symbol} type - 事件名称
     * @param {Any} [evt] - 事件参数
     * @memberOf mitt
     */
    emit<Key extends keyof Events>(type: Key, evt?: Events[Key]) {
      let handlers = all!.get(type)
      if (handlers) {
        const arr = handlers as EventHandlerList<Events[keyof Events]>
        arr.slice().forEach((handler) => {
          handler(evt!)
        })
      }

      handlers = all!.get('*')
      if (handlers) {
        const arr = handlers as WildCardEventHandlerList<Events>
        arr.slice().forEach((handler) => {
          handler(type, evt!)
        })
      }
    },
  }
}
