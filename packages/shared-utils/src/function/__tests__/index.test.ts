import { it, describe, expect } from 'vitest'
import { getFunctionName } from '../getFunctionName'

describe('function', () => {
  it('getFunctionName', () => {
    const func = function getAnything() {}
    const name = getFunctionName(func)
    expect(name).toBe('getAnything')
  })
})
