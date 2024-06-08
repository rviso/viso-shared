import fs from 'fs'
import path from 'path'

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
