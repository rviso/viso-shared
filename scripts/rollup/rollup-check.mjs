import path from 'path'
import fs from 'fs'
import { deps } from '../deps/deps.mjs'

const checkOutputFile = (name, errors = []) => {
  const output = path.resolve(deps[name].fullPath, 'es/index.js')
  const outputTypes = path.resolve(deps[name].fullPath, 'es/index.d.ts')

  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      // 检查当前构建是否错误
      if (errors.includes(name)) {
        clearInterval(interval)
        resolve()
        return
      }

      const exists = fs.existsSync(output)
      const typeExists = fs.existsSync(outputTypes)

      if (exists) {
        clearInterval(interval)
        if (typeExists) {
          resolve()
        } else {
          reject(new Error(`${name} 输出类型文件输出失败`))
        }
      }
    }, 500)
  })
}

export const checkQueueOutputFile = (queue) => {
  const len = queue.length
  let successCount = 0

  return new Promise((resolve) => {
    queue.forEach((name) => {
      checkOutputFile(name).then(() => {
        successCount++
        if (successCount === len) {
          resolve()
        }
      })
    })
  })
}
