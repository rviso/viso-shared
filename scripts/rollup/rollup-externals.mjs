import { deps, thirdDeps } from '../deps/deps.mjs'

export const externals = (name, type) => {
  const result = []
  deps[name].dependencies.forEach((dep) => {
    if (deps[dep]) {
      result.push(dep)
    } else if (thirdDeps[dep]) {
      if (thirdDeps[dep].external) {
        result.push(...thirdDeps[dep].external)
      } else {
        result.push(dep)
      }
    } else {
      if (type !== 'dist') {
        result.push(dep)
      }
    }
  })

  return result
}

export const getAllExternals = () => {
  const target = Object.keys(deps)

  Object.key(thirdDeps).forEach((key) => {
    if (thirdDeps[key].external) {
      target.push(...thirdDeps[key].external)
    } else {
      target.push(key)
    }
  })

  console.log(target)

  return target
}
