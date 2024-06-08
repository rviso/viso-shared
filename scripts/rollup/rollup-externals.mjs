import { deps } from '../deps/deps.mjs'

export const externals = (name, type) => {
  const result = []
  deps[name].dependencies.forEach((dep) => {
    if (deps[dep]) {
      result.push(dep)
    } else {
      if (type !== 'dist') {
        result.push(dep)
      }
    }
  })

  result.push('lodash')
  result.push(/lodash\/*/)

  return result
}

export const getAllExternals = () => {
  const target = Object.keys(deps)
  return target
}
