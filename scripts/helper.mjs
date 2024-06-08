import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

export const __dirname = path.dirname(fileURLToPath(import.meta.url))

// 查找mono-repo的根目录，如果有package-workspace.json文件，则返回根目录
export const findRoot = () => {
  let current = __dirname
  while (current !== '/') {
    const packageWorkspace = path.resolve(current, 'pnpm-workspace.json')
    const leranWorkspace = path.resolve(current, 'lerna.json')
    if (fs.existsSync(packageWorkspace) || fs.existsSync(leranWorkspace)) {
      return current
    }
    current = path.resolve(current, '..')
  }
  return __dirname
}

// 根目录
export const root = findRoot()

// 将字符串驼峰命名转为短横线命名， 例如：VeRuntimeEditor => ve-runtime-editor
export const kebabCase = (str) => {
  // 移除首个-字符
  return str
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '')
}

// 将@veditor/xxx-xxx转为VEXxxXxx, 例如：@veditor/runtime-editor => VERuntimeEditor
export const pascalCase = (str, prefix = '') => {
  // 取出/后的字符串
  const arr = str.split('/')
  // 取出最后一个字符串
  const name = arr[arr.length - 1].replace(/-([a-z])/g, (all, letter) => letter.toUpperCase())

  // 首字母大写
  return prefix + name.charAt(0).toUpperCase() + name.slice(1)
}

// 获取包后面的名字
export const getDirFromPackageName = (name) => {
  const arr = name.split('/')
  // 取出最后一个字符串
  return arr[arr.length - 1]
}

export const checkIgnoreFile = (source, ignore) => {
  if (Array.isArray(ignore)) {
    for (const item of ignore) {
      if (item instanceof RegExp) {
        if (item.test(source)) {
          return true
        }
      } else {
        if (path.basename(source) === item) {
          return true
        }
      }
    }
  } else if (typeof ignore === 'string') {
    if (path.basename(source) === ignore) {
      return true
    }
  } else if (ignore instanceof RegExp) {
    if (ignore.test(source)) {
      return true
    }
  }
  return false
}

/**
 * 将源文件复制到目标文件夹
 * 通过递归地复制“source”目录下的所有文件，将其复制到“dest”目录下
 * @param {string} src 要复制的源文件
 * @param {string} dest 复制操作的目标文件
 * @param {IgnoreType | IgnoreType[]} ignore 忽略的文件
 */
export function copyDir(source, dest, ignore = []) {
  const stats = fs.statSync(source)

  const filename = path.basename(source)

  // 过滤掉忽略的文件
  if (checkIgnoreFile(filename, ignore)) {
    return
  }

  // 如果是目录，则递归呈现其子目录和文件
  if (stats.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true })
    for (const file of fs.readdirSync(source)) {
      copyDir(path.resolve(source, file), path.resolve(dest, file), ignore)
    }
    return
  }

  fs.copyFileSync(source, dest)
}

/**
 * 移除目录及其子目录和文件
 * @param {string} dir 要删除的目录
 * @param {IgnoreType | IgnoreType[]} ignore 忽略的文件
 * @returns {void}
 */
export function removeDir(dir, ignore) {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach((file) => {
      const curPath = path.join(dir, file)
      if (checkIgnoreFile(curPath, ignore)) {
        return
      }
      if (fs.lstatSync(curPath).isDirectory()) {
        removeDir(curPath, ignore)
      } else {
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(dir)
  }
}
