import fs from 'fs'
import path from 'path'
import { root } from './helper.mjs'

// 移除日志文件
export const removeErrorLog = () => {
  const filePath = path.resolve(root, './error.log')

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  }
}
