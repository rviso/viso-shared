import fs from 'fs'
import path from 'path'
import { getDirFromPackageName, kebabCase, pascalCase, root } from '../helper.mjs'
import { corePackages } from './core-packages.mjs'

// 读取pkg文件
export const readPackageConfig = (_path) => {
  const pkgPath = path.resolve(root, _path, 'package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
  return pkg
}

const getCoreDeps = () => {
  const _deps = {}

  Object.keys(corePackages).forEach((key) => {
    const item = corePackages[key]
    const pkg = readPackageConfig(item.path)
    const name = pascalCase(key, 'Ve')
    const file = kebabCase(name)
    const dir = getDirFromPackageName(key)

    _deps[key] = {
      ...item,
      isThird: false,
      name,
      file,
      version: pkg.version,
      cdnPath: `core/${dir}`,
      fullPath: path.resolve(root, item.path),
      dependencies: Object.keys(pkg.dependencies || {}),
    }
  })
  return _deps
}

export const deps = {
  ...getCoreDeps(),
}

// 检查包名是否存在
export const checkPackage = (name) => {
  if (!deps[name]) {
    throw new Error(`包${name}不存在`)
  }
}
