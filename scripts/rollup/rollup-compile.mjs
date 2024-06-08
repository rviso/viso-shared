import { rollup } from 'rollup'
import ora from 'ora'
import { emojisNumber, numberString, readErrorLog, writeErrorLog } from '../write-log.mjs'
import { tsc } from './tsc.mjs'
import { rollupDistConfig, rollupModuleConfig } from './rollup-config.mjs'

// const errors = []

const compile = async (name, format) => {
  const config = format === 'dist' ? rollupDistConfig(name) : rollupModuleConfig(name)

  const bundle = await rollup(config)
  if (Array.isArray(config.output)) {
    config.output.forEach(async (output) => {
      if (format !== 'dist') {
        await tsc(name, output.dir)
      }

      await bundle.write(output)
    })
  } else {
    await tsc(name, config.output.dir)

    await bundle.write(config.output)
  }
}

// 同时构建多个包， 等待所有包构建完成
export const buildDeps = (arr, index, format, errors = []) => {
  console.log(`\n👉️  正在执行第${emojisNumber[index]}  轮构建 ➡ 【${arr.join(', ')}】 👈`)

  const spinner = ora('🚀️ 正在编译...').start()
  const loader = ora('🚀️ 正在编译...').start()

  return new Promise((resolve) => {
    const len = arr.length
    let count = 0

    const queueMap = {}
    arr.forEach((name) => {
      queueMap[name] = false
    })

    arr.forEach((name) => {
      queueMap[name] = false
      spinner.text = `🚀️ 正在编译...${count + 1}/${len}`
      spinner.color = 'yellow'
      compile(name, format)
        .then(() => {
          count++
          queueMap[name] = true
          spinner.text = `🚀️ 正在编译...${count + 1}/${len}`
          spinner.color = 'yellow'
          if (!errors.includes(name)) {
            loader.succeed(` ${name} 编译成功...`)
          }
        })
        .catch((error) => {
          count++
          errors.push(name)
          const errorText = `
          ================= ${name} ===================
          ${error}
          `
          writeErrorLog(errorText)
          loader.fail(` ${name} 编译失败...`)
        })
        .finally(() => {
          if (count >= len) {
            console.log(`👌  第${emojisNumber[index]}  轮构建完成`)

            spinner.stop()
            loader.stop()
            resolve()
          }
        })
    })
  })
}

// 依次构建包
export const compilePackages = async (queue, format = 'module') => {
  const errors = []

  const count = queue.reduce((prev, cur) => prev + cur.length, 0)

  console.log(`➤➤➤  需要执行${emojisNumber[queue.length - 1]}  轮编译, 共${count}个包`)

  queue.forEach((arr, index) => {
    console.log(`🟣 第${numberString[index]}轮构建 ==>【${arr.join(', ')}】`)
  })

  for (let i = 0; i < queue.length; i++) {
    await buildDeps(queue[i], i, format, errors)
  }

  queue.forEach((arr, index) => {
    // 当前轮存在的错误数量
    const hasError = arr.some((name) => errors.includes(name))
    const errorCount = arr.filter((name) => errors.includes(name)).length

    if (!hasError) {
      console.log(
        `\n 🟢 [== 第${numberString[index]}轮构建 共${arr.length}个， 成功：${
          arr.length - errorCount
        }个，失败：${errorCount}个==]`,
      )
    } else {
      console.log(
        `\n 🔴 [== 第${numberString[index]}轮构建 共${arr.length}个，成功：${
          arr.length - errorCount
        }个，失败：${errorCount}个==]`,
      )
    }
  })

  // 获取中国时间
  const date = new Date()
  const localDate = date.toLocaleString('zh', { hour12: false })

  const errorText = `================= ${localDate} ===================`

  if (errors.length > 0) {
    writeErrorLog(errorText)
    console.log(errorText)
    console.log('🚨️  构建失败')
    console.log(`编译错误 ${errors.length} 个 ===> [${errors.join(',')}]`)
  } else {
    console.log('🎉️  所有包构建完成')
  }

  console.log(readErrorLog())
}
