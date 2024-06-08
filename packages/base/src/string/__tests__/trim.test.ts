import { describe, it, expect } from 'vitest'
import { deepTrim, wipeOffTrim } from '../trim'

describe('deepTrim', () => {
  it('should trim all string values', () => {
    const obj = {
      a: ' a ',
      b: {
        c: ' c ',
        d: {
          e: ' e '
        }
      }
    }
    const trimmed = deepTrim(obj)
    // 判断是否去除了所有空格
    expect(trimmed).toMatchSnapshot()
  })
})

describe('wipeOffTrim', () => {
  it('should wipe off trim', () => {
    const obj = {
      a: ' a ',
      b: {
        c: ' c ',
        d: {
          e: ' e '
        }
      }
    }
    const wiped = wipeOffTrim(obj)
    // 判断是否去除了所有空格
    expect(wiped).toMatchSnapshot()
  })
})
