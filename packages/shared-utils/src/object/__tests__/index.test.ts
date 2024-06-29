import { describe, expect, it } from 'vitest'
import { deepMerge } from '../merge'
import { deepClone } from '../clone'
import { isObject } from '../../is'

describe('object utility', () => {
  it('deepMerge', () => {
    const source = {
      name: 'root',
      type: 'root',
      children: [
        {
          name: 'child1',
          type: 'child1',
        },
        {
          name: 'child2',
          type: 'child2',
        },
      ],
    }
    const target = {
      name: 'root',
      type: 'root2',
      children: [
        {
          name: 'child1',
          type: 'child1',
        },
        {
          name: 'child2',
          type: 'child2',
        },
      ],
    }
    const model = deepMerge(source, target)
    // 比较结果是否一致
    expect(model).toEqual({
      name: 'root',
      type: 'root2',
      children: [
        {
          name: 'child1',
          type: 'child1',
        },
        {
          name: 'child2',
          type: 'child2',
        },
      ],
    })
  })

  it('deepClone', () => {
    const source = {
      name: 'root',
      type: 'root',
      children: [
        {
          name: 'child1',
          type: 'child1',
        },
        {
          name: 'child2',
          type: 'child2',
        },
      ],
    }
    const model = deepClone(source)
    // 比较结果是否一致
    expect(model).toEqual(source)
  })

  it('isObject', () => {
    const source = {
      name: 'root',
      type: 'root',
      children: [
        {
          name: 'child1',
          type: 'child1',
        },
        {
          name: 'child2',
          type: 'child2',
        },
      ],
    }
    const model = isObject(source)
    // 比较结果是否一致
    expect(model).toEqual(true)
  })
})
