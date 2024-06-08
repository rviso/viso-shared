import fs from 'fs'
import path from 'path'
import { root } from './helper.mjs'

export const numberString = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']

// 数字表情
export const emojisNumber = ['1️⃣', ' 2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '👉️']

export const createLogFile = () => {
  const logPath = path.resolve(root, './logs')

  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const monthStr = month < 10 ? `0${month}` : month
  const dayStr = day < 10 ? `0${day}` : day
  const hourStr = hour < 10 ? `0${hour}` : hour
  const minuteStr = minute < 10 ? `0${minute}` : minute
  const secondStr = second < 10 ? `0${second}` : second

  const fileName = `${year}${monthStr}${dayStr}${hourStr}${minuteStr}${secondStr}.log`

  const filePath = path.resolve(logPath, fileName)

  return filePath
}

const logFilePath = createLogFile()

// 写入错误日志
export const writeErrorLog = (error) => {
  let errorText = ''

  // 如果文件存在，则读取文件内容
  if (fs.existsSync(logFilePath)) {
    errorText = fs.readFileSync(logFilePath, 'utf-8')
  }

  // 判断文件目录是否存在
  if (!fs.existsSync(path.dirname(logFilePath))) {
    fs.mkdirSync(path.dirname(logFilePath))
  }

  // 写入文件
  fs.writeFileSync(logFilePath, `${errorText + error}\n`)
}

// 读取错误日志
export const readErrorLog = () => {
  if (fs.existsSync(logFilePath)) {
    return fs.readFileSync(logFilePath, 'utf-8')
  }
  return ''
}
