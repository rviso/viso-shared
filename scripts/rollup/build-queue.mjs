import { deps } from '../deps/deps.mjs'

// 筛选出当前包的依赖
export const filterDeps = (dependencies) => {
  const depKeys = Object.keys(deps)
  return dependencies.filter((dep) => depKeys.includes(dep))
}

// 获取构建队列
export const createBuildQueue = () => {
  const target = []
  const caches = []
  const current = []
  const keys = Object.keys(deps)

  keys.forEach((key) => {
    const item = deps[key]
    caches[key] = {
      ...item,
      localDeps: filterDeps(item.dependencies),
    }
  })
  let level = 0
  const next = (arr, key) => {
    const item = caches[key]
    if (!arr.includes(key)) {
      return arr
    }
    const newLocalDeps = []
    item.localDeps.forEach((dep) => {
      if (arr.includes(dep)) {
        newLocalDeps.push(dep)
      }
    })
    item.localDeps = newLocalDeps
    if (item.localDeps.length === 0) {
      if (!current.includes(key)) {
        target[level] = [...(target[level] || []), key]
        current.push(key)
      }
      const index = keys.indexOf(key)
      keys.splice(index, 1)
    }
  }
  while (keys.length) {
    const newKeys = [...keys]
    newKeys.forEach((key) => {
      next(newKeys, key)
    })
    level++
  }
  return target
}
