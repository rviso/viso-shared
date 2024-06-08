import type { Nullable } from '@viso/types'

export type TimerValues = [number, number, number, number, number]

export interface TimerConfig {
  precision: string
  countdown: boolean
  startValues: TimerValues
  target: TimerValues
  callback: (timer: ITimer) => void
}

export interface TimerParams {
  precision?: TimerPrecision
  countdown?: boolean
  startValues?: TimerValues | Partial<TimerValueData>
  target?: TimerValues | Partial<TimerValueData>
  callback?: (timer: ITimer) => void
}

export type TimerPrecision = 'secondTenths' | 'seconds' | 'minutes' | 'hours' | 'days'

export type TimerValueData = Record<TimerPrecision, number>

/**
 * @description 计时器 大改easyTimer
 * @see https://albert-gonzalez.github.io/easytimer.js/
 */

const SECOND_TENTHS_PER_SECOND = 10
const SECONDS_PER_MINUTE = 60
const MINUTES_PER_HOUR = 60
const HOURS_PER_DAY = 24

const SECOND_TENTHS_POSITION = 0
const SECONDS_POSITION = 1
const MINUTES_POSITION = 2
const HOURS_POSITION = 3
const DAYS_POSITION = 4

const SECOND_TENTHS: TimerPrecision = 'secondTenths'
const SECONDS: TimerPrecision = 'seconds'
const MINUTES: TimerPrecision = 'minutes'
const HOURS: TimerPrecision = 'hours'
const DAYS: TimerPrecision = 'days'

const VALID_INPUT_VALUES: string[] = [SECOND_TENTHS, SECONDS, MINUTES, HOURS, DAYS]

// 单位毫秒数
const unitsInMilliseconds: TimerValueData = {
  secondTenths: 100,
  seconds: 1000,
  minutes: 60000,
  hours: 3600000,
  days: 86400000,
}

// 每个单位的分组，用于计算过程中控制的单位的进位
const groupedUnits: Record<TimerPrecision, number> = {
  secondTenths: SECOND_TENTHS_PER_SECOND,
  seconds: SECONDS_PER_MINUTE,
  minutes: MINUTES_PER_HOUR,
  hours: HOURS_PER_DAY,
  days: Infinity,
}

// 取余函数
const mod = (number: number, module: number) => {
  return ((number % module) + module) % module
}

class TimeCounter {
  secondTenths: number
  seconds: number
  minutes: number
  hours: number
  days: number

  constructor() {
    this.secondTenths = 0
    this.seconds = 0
    this.minutes = 0
    this.hours = 0
    this.days = 0
  }

  toString(units = ['hours', 'minutes', 'seconds'], separator = ':', leftZeroPadding = 2) {
    const arrayTime = units.map((unit) => {
      const key = unit as keyof TimeCounter

      const value = this[key]

      return value !== undefined
        ? unit === 'secondTenths'
          ? this[unit]
          : this.leftPadding(value as number, leftZeroPadding, '0')
        : null
    })

    return arrayTime.join(separator)
  }

  leftPadding(value: number, length: number, padChar: string) {
    return String(value).padStart(length, padChar)
  }

  // 获取总计数器的值
  getTotalCounter() {
    return (
      this.secondTenths +
      this.seconds * unitsInMilliseconds[SECONDS] +
      this.minutes * unitsInMilliseconds[MINUTES] +
      this.hours * unitsInMilliseconds[HOURS] +
      this.days * unitsInMilliseconds[DAYS]
    )
  }

  // 获取总秒数
  getTotalSeconds() {
    return Math.floor(this.getTotalCounter() / 1000)
  }

  reset() {
    this.secondTenths = 0
    this.seconds = 0
    this.minutes = 0
    this.hours = 0
    this.days = 0
  }
}

export interface ITimerEventHandlerMap {
  secondTenthsUpdated: (secondTenths: number) => void
  secondsUpdated: (values: Record<TimerPrecision, boolean>) => void
  minutesUpdated: (values: Record<TimerPrecision, boolean>) => void
  hoursUpdated: (values: Record<TimerPrecision, boolean>) => void
  daysUpdated: (values: Record<TimerPrecision, boolean>) => void
  targetAchieved: () => void
  start: () => void
  stop: () => void
  pause: () => void
  reset: () => void
}

export type TimerEventName = keyof ITimerEventHandlerMap

export type TimerEventHandleEvent<T extends TimerEventName> = ITimerEventHandlerMap[T]

export interface ITimer {
  customCallback?: (timer: ITimer) => void
  timerConfig: TimerConfig
  currentParams?: TimerParams

  events: Record<TimerEventName, TimerEventHandleEvent<TimerEventName>[]>
  counters: TimeCounter
  totalCounters: TimeCounter
  precision: TimerPrecision
  countdown: boolean
  timerTypeFactor: number
  intervalId: Nullable<NodeJS.Timeout | number>
  startValues?: TimerValues | Partial<TimerValueData>
  targetValues?: TimerValues | Partial<TimerValueData>
  startingDate: Nullable<number>
  targetDate: Nullable<number>
  running: boolean
  paused: boolean
  /** 是否正在运行 */
  get isRunning(): boolean
  /** 是否暂停 */
  get isPaused(): boolean

  /** 设置参数 */
  setParams(params?: TimerParams): void
  /** 设置参数并开始计时器 */
  setParamsAndStartTimer(params?: TimerParams): void
  /** 更新计数器的值，处理时间单位的进位和溢出。 */
  updateCounters(precision: string, roundedValue: number): void
  /** 更新天数 */
  updateDays(value: number): boolean
  /** 更新小时 */
  updateHours(value: number): boolean
  /** 更新分钟 */
  updateMinutes(value: number): boolean
  /** 更新秒 */
  updateSeconds(value: number): boolean
  /** 更新秒 */
  updateSecondTenths(value: number): boolean
  /** 更新单位 */
  updateUnitByPrecision(value: number, precision: string): boolean
  /** 停止计时器并重置计数器 */
  stopTimerAndResetCounters(): void
  /** 计算计时器启动的时间点 */
  calculateStartingDate(): number
  /** 更新计时器并分发事件 */
  updateTimerWithEvent(): void
  /** 将时间戳舍入到指定精度 */
  roundTimestamp(timestamp: number): number
  /** 计算两个数的整数商 */
  calculateIntegerUnitQuotient(unit: number, divisor: number): number
  /** 配置计时器起始时间或目标时间的值 */
  configInputValues(inputValues?: TimerValues | Partial<TimerValueData>): TimerValues
  /** 设置计时器的目标时间 */
  setTarget(inputTarget?: TimerValues | Partial<TimerValueData>): TimerValues
  /** 设置计时器的起始时间 */
  setStartValues(inputStartValues: TimerValues): void
  /** 检查输入值是否有效 */
  isValidInputValue(value: string): boolean
  /** 检查精度 */
  checkPrecision(precision?: TimerPrecision): TimerPrecision
  /** 检查是否达到目标时间 */
  isTargetAchieved(currentDate: number): boolean
  /** 根据时间值计算总的计数器值。 */
  calculateTotalCounterFromValues(values: number[], outputCounter?: TimeCounter): TimeCounter
  /** 重置计数器 */
  resetCounters(): void
  /** 开始计时器 */
  startTimer(): void
  /** 更新计时器 */
  updateTimer(currentTime?: number): Record<TimerPrecision, boolean>
  /** 停止计时器 */
  stopTimer(): void
  /** 开始计时 */
  start(params?: TimerParams): ITimer
  /** 重置计时器 */
  reset(): ITimer
  /** 暂停计时器 */
  pause(): ITimer
  /** 停止计时器 */
  stop(): ITimer
  /** 监听事件 */
  on<T extends TimerEventName>(eventName: T, handler: TimerEventHandleEvent<T>): ITimer
  /** 取消监听事件 */
  off<T extends TimerEventName>(eventName: T, handler: TimerEventHandleEvent<T>): ITimer
  /** 取消监听事件 */
  offAll(eventName: string): ITimer
  /** 绑定事件 */
  bind<T extends TimerEventName>(eventName: T, handler: TimerEventHandleEvent<T>): ITimer
  /** 触发事件 */
  emit<T extends TimerEventName>(eventName: T, ...args: unknown[]): ITimer
}

export class Timer implements ITimer {
  customCallback?: (timer: ITimer) => void
  timerConfig: TimerConfig
  currentParams?: TimerParams

  events: Record<TimerEventName, TimerEventHandleEvent<TimerEventName>[]>
  counters: TimeCounter
  totalCounters: TimeCounter
  precision: TimerPrecision
  countdown: boolean
  timerTypeFactor: number
  intervalId: Nullable<NodeJS.Timeout | number>
  startValues?: TimerValues
  targetValues?: TimerValues
  startingDate: number
  targetDate: number
  running: boolean
  paused: boolean

  constructor(defaultParams: TimerParams = {}) {
    this.customCallback = undefined

    this.timerConfig = {
      precision: SECONDS,
      countdown: false,
      startValues: [0, 0, 0, 0, 0],
      target: [0, 0, 0, 0, 0],
      callback: () => {},
    }

    this.currentParams = undefined

    this.events = {
      secondTenthsUpdated: [],
      secondsUpdated: [],
      minutesUpdated: [],
      hoursUpdated: [],
      daysUpdated: [],
      targetAchieved: [],
      start: [],
      pause: [],
      stop: [],
      reset: [],
    }

    // 用于存储当前计时器实例的计数器值,包括 secondTenths、seconds、minutes、hours 和 days。
    this.counters = new TimeCounter()
    // 用于存储计时器实例的总计数器值
    this.totalCounters = new TimeCounter()
    // 存储计时器的时间精度, 可以是 SECOND_TENTHS、SECONDS、MINUTES、HOURS 或 DAYS。, 默认是秒
    this.precision = defaultParams.precision || SECONDS
    // 是否是倒计时
    this.countdown = !!defaultParams.countdown
    // 计时器的类型因子， 用于处理倒计时的逻辑
    this.timerTypeFactor = this.countdown ? -1 : 1
    // 存储定时器的 ID，用于在需要时清除计时器定时任务。
    this.intervalId = null

    this.startValues = undefined
    this.targetValues = undefined

    // 存储计时器的启动时间戳，用于计算计时器已运行的时间
    this.startingDate = 0

    this.targetDate = 0

    this.running = false
    this.paused = false

    this.setParams(defaultParams)
  }

  get isRunning() {
    return this.running
  }

  get isPaused() {
    return this.paused
  }

  setParams(params?: TimerParams) {
    params = params || {}

    this.precision = this.checkPrecision(params.precision)

    this.customCallback = typeof params.callback === 'function' ? params.callback : function () {}

    this.countdown = params.countdown === true

    this.timerTypeFactor = this.countdown === true ? -1 : 1

    if (typeof params.startValues === 'object') {
      this.setStartValues(params.startValues)
    } else {
      this.startValues = undefined
    }

    this.startingDate = this.calculateStartingDate()

    this.updateTimer()

    if (typeof params.target === 'object') {
      this.targetValues = this.setTarget(params.target)
    } else if (this.countdown) {
      params.target = { seconds: 0 }
      this.targetValues = this.setTarget(params.target)
    } else {
      this.targetValues = undefined
    }

    this.timerConfig = {
      precision: this.precision,
      callback: this.customCallback,
      countdown: typeof params === 'object' && params.countdown === true,
      target: this.targetValues || [0, 0, 0, 0, 0],
      startValues: this.startValues || [0, 0, 0, 0, 0],
    }

    this.currentParams = params
  }

  setParamsAndStartTimer(params?: TimerParams) {
    if (!this.isPaused) {
      this.setParams(params)
    } else {
      this.startingDate = this.calculateStartingDate()
      this.targetValues = this.setTarget(this.currentParams?.target)
    }

    this.startTimer()
  }

  /** 更新计数器的值，处理时间单位的进位和溢出。 */
  updateCounters(precision: TimerPrecision, roundedValue: number) {
    const unitsPerGroup = groupedUnits[precision]
    this.totalCounters[precision] = roundedValue

    if (precision === DAYS) {
      this.counters[precision] = Math.abs(roundedValue)
    } else if (roundedValue >= 0) {
      this.counters[precision] = mod(roundedValue, unitsPerGroup)
    } else {
      this.counters[precision] = mod(unitsPerGroup - mod(roundedValue, unitsPerGroup), unitsPerGroup)
    }
  }

  updateDays(value: number) {
    return this.updateUnitByPrecision(value, DAYS)
  }

  updateHours(value: number) {
    return this.updateUnitByPrecision(value, HOURS)
  }

  updateMinutes(value: number) {
    return this.updateUnitByPrecision(value, MINUTES)
  }

  updateSeconds(value: number) {
    return this.updateUnitByPrecision(value, SECONDS)
  }

  updateSecondTenths(value: number) {
    return this.updateUnitByPrecision(value, SECOND_TENTHS)
  }

  updateUnitByPrecision(value: number, precision: TimerPrecision) {
    const previousValue = this.totalCounters[precision]
    this.updateCounters(precision, this.calculateIntegerUnitQuotient(value, unitsInMilliseconds[precision]))

    return this.totalCounters[precision] !== previousValue
  }

  stopTimerAndResetCounters() {
    this.stopTimer()
    this.resetCounters()
  }

  /** 计算计时器启动的时间点 */
  calculateStartingDate() {
    return (
      this.roundTimestamp(Date.now()) -
      this.totalCounters.secondTenths * unitsInMilliseconds[SECOND_TENTHS] * this.timerTypeFactor
    )
  }

  /** 更新计时器并分发事件 */
  updateTimerWithEvent() {
    const currentTime = this.roundTimestamp(Date.now())
    const valuesUpdated = this.updateTimer()

    this.emit('secondTenthsUpdated', this.counters.secondTenths)
    if (valuesUpdated[SECONDS]) {
      this.emit('secondsUpdated', valuesUpdated)
    }
    if (valuesUpdated[MINUTES]) {
      this.emit('minutesUpdated', valuesUpdated)
    }
    if (valuesUpdated[HOURS]) {
      this.emit('hoursUpdated', valuesUpdated)
    }
    if (valuesUpdated[DAYS]) {
      this.emit('daysUpdated', valuesUpdated)
    }

    this.customCallback?.(this)

    if (this.isTargetAchieved(currentTime)) {
      this.stop()
      this.emit('targetAchieved', { timer: this })
    }
  }

  /** 将时间戳舍入到指定精度 */
  roundTimestamp(timestamp: number) {
    return Math.floor(timestamp / unitsInMilliseconds[this.precision]) * unitsInMilliseconds[this.precision]
  }

  /** 计算两个数的整数商 */
  calculateIntegerUnitQuotient(unit: number, divisor: number) {
    const quotient = unit / divisor

    return quotient < 0 ? Math.ceil(quotient) : Math.floor(quotient)
  }

  /** 配置计时器起始时间或目标时间的值 */
  configInputValues(inputValues?: TimerValues | Partial<TimerValueData>) {
    let values: TimerValues = [0, 0, 0, 0, 0]
    if (typeof inputValues === 'object') {
      if (Array.isArray(inputValues)) {
        if (inputValues.length !== 5) {
          throw new Error('Array size not valid')
        }
        values = inputValues
      } else {
        for (const value in inputValues) {
          if (!VALID_INPUT_VALUES.includes(value)) {
            throw new Error(`Error in startValues or target parameter: ${value} is not a valid input value`)
          }
        }
        values = [
          inputValues.secondTenths || 0,
          inputValues.seconds || 0,
          inputValues.minutes || 0,
          inputValues.hours || 0,
          inputValues.days || 0,
        ]
      }
    }

    values = values.map((value) => parseInt(`${value}`, 10)) as TimerValues

    const secondTenths = values[SECOND_TENTHS_POSITION]
    const seconds = values[SECONDS_POSITION] + this.calculateIntegerUnitQuotient(secondTenths, SECOND_TENTHS_PER_SECOND)
    const minutes = values[MINUTES_POSITION] + this.calculateIntegerUnitQuotient(seconds, SECONDS_PER_MINUTE)
    const hours = values[HOURS_POSITION] + this.calculateIntegerUnitQuotient(minutes, MINUTES_PER_HOUR)
    const days = values[DAYS_POSITION] + this.calculateIntegerUnitQuotient(hours, HOURS_PER_DAY)

    values[SECOND_TENTHS_POSITION] = secondTenths % SECOND_TENTHS_PER_SECOND
    values[SECONDS_POSITION] = seconds % SECONDS_PER_MINUTE
    values[MINUTES_POSITION] = minutes % MINUTES_PER_HOUR
    values[HOURS_POSITION] = hours % HOURS_PER_DAY
    values[DAYS_POSITION] = days

    return values
  }

  /** 设置计时器的目标时间 */
  setTarget(inputTarget?: TimerValues | Partial<TimerValueData>) {
    if (!inputTarget) {
      return [0, 0, 0, 0, 0] as TimerValues
    }

    const targetValues = this.configInputValues(inputTarget)
    const targetCounter = this.calculateTotalCounterFromValues(targetValues)
    this.targetDate =
      this.startingDate + targetCounter.secondTenths * unitsInMilliseconds[SECOND_TENTHS] * this.timerTypeFactor

    this.targetValues = targetValues
    return targetValues
  }

  /** 设置计时器的起始时间 */
  setStartValues(inputStartValues?: TimerValues | Partial<TimerValueData>) {
    const startValues = this.configInputValues(inputStartValues)
    this.counters.secondTenths = startValues[SECOND_TENTHS_POSITION]
    this.counters.seconds = startValues[SECONDS_POSITION]
    this.counters.minutes = startValues[MINUTES_POSITION]
    this.counters.hours = startValues[HOURS_POSITION]
    this.counters.days = startValues[DAYS_POSITION]

    this.totalCounters = this.calculateTotalCounterFromValues(startValues, this.totalCounters)
    this.startValues = startValues
  }

  isValidInputValue(value: string) {
    return VALID_INPUT_VALUES.includes(value)
  }

  checkPrecision(precision?: TimerPrecision) {
    precision = typeof precision === 'string' ? precision : SECONDS
    if (!this.isValidInputValue(precision)) {
      throw new Error(`Error in precision parameter: ${precision} is not a valid value`)
    }

    return precision
  }

  /** 检查是否达到目标时间 */
  isTargetAchieved(currentDate: number) {
    return Array.isArray(this.targetValues) && currentDate >= this.targetDate
  }

  /** 根据时间值计算总的计数器值。 */
  calculateTotalCounterFromValues(values: TimerValues, outputCounter = new TimeCounter()) {
    const total = outputCounter

    total.days = values[DAYS_POSITION]
    total.hours = total.days * HOURS_PER_DAY + values[HOURS_POSITION]
    total.minutes = total.hours * MINUTES_PER_HOUR + values[MINUTES_POSITION]
    total.seconds = total.minutes * SECONDS_PER_MINUTE + values[SECONDS_POSITION]
    total.secondTenths = total.seconds * SECOND_TENTHS_PER_SECOND + values[SECOND_TENTHS_POSITION]

    return total
  }

  resetCounters() {
    this.counters.reset()
    this.totalCounters.reset()
  }

  startTimer() {
    const interval = unitsInMilliseconds[this.precision]

    if (this.isTargetAchieved(this.roundTimestamp(Date.now()))) {
      return
    }

    this.intervalId = setInterval(this.updateTimerWithEvent.bind(this), interval)

    this.running = true
    this.paused = false
  }

  updateTimer(currentTime: number = this.roundTimestamp(Date.now())) {
    const elapsedTime = this.timerTypeFactor > 0 ? currentTime - this.startingDate : this.startingDate - currentTime

    const valuesUpdated: Record<TimerPrecision, boolean> = {
      secondTenths: false,
      seconds: false,
      minutes: false,
      hours: false,
      days: false,
    }

    valuesUpdated[SECOND_TENTHS] = this.updateSecondTenths(elapsedTime)
    valuesUpdated[SECONDS] = this.updateSeconds(elapsedTime)
    valuesUpdated[MINUTES] = this.updateMinutes(elapsedTime)
    valuesUpdated[HOURS] = this.updateHours(elapsedTime)
    valuesUpdated[DAYS] = this.updateDays(elapsedTime)

    return valuesUpdated
  }

  stopTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }

    this.running = false
    this.paused = false
  }

  start(params = {}): ITimer {
    if (this.isRunning) {
      return this as ITimer
    }

    this.setParamsAndStartTimer({
      ...this.currentParams,
      ...params,
    })
    this.emit('start')
    return this as ITimer
  }

  reset(): ITimer {
    this.stopTimerAndResetCounters()
    this.setParamsAndStartTimer(this.currentParams)
    this.emit('reset')
    return this as ITimer
  }

  pause(): ITimer {
    this.running = false
    this.paused = true
    this.emit('pause')
    return this as ITimer
  }

  stop(): ITimer {
    this.stopTimerAndResetCounters()
    this.emit('stop')
    return this as ITimer
  }

  on<T extends TimerEventName>(eventName: T, handler: TimerEventHandleEvent<T>): ITimer {
    if (!this.events[eventName]) {
      this.events[eventName] = []
    }
    this.events[eventName].push(handler)
    return this as ITimer
  }

  off<T extends TimerEventName>(eventName: T, handler: TimerEventHandleEvent<T>): ITimer {
    const eventHandlers = this.events[eventName]
    if (eventHandlers) {
      this.events[eventName] = eventHandlers.filter((h) => h !== handler)
    }
    return this as ITimer
  }

  offAll<T extends TimerEventName>(eventName: T): ITimer {
    this.events[eventName] = []
    return this as ITimer
  }

  bind<T extends TimerEventName>(eventName: T, handler: TimerEventHandleEvent<T>): ITimer {
    this.events[eventName] = [handler]
    return this as ITimer
  }

  emit<T extends TimerEventName>(eventName: T, ...args: unknown[]): ITimer {
    const eventHandlers = this.events[eventName]
    if (eventHandlers) {
      eventHandlers.forEach((handler) => {
        try {
          const func = handler as (...args: unknown[]) => void
          func(...args)
        } catch (error) {
          console.error(error)
        }
      })
    } else {
      // console.log(`${eventName} event not registered on state ${this.name}`)
    }
    return this as ITimer
  }
}

export const createTimer = (params?: TimerParams) => {
  return new Timer(params)
}
