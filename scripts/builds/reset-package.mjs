import fs from 'fs'

// 读取 package.json 文件
fs.readFile('package.json', 'utf8', (err, data) => {
  if (err) {
    console.error('读取 package.json 文件时发生错误：', err)
    return
  }

  try {
    // 解析 JSON 数据
    const packageJson = JSON.parse(data)

    // 修改 main 和 module 的值
    if (packageJson.main === 'src/index.ts') {
      packageJson.main = 'lib/index.js'
    }
    if (packageJson.module === 'src/index.ts') {
      packageJson.module = 'es/index.js'
    }
    if (packageJson.types === 'src/index.ts') {
      packageJson.types = 'es/index.d.ts'
    }

    // 将修改后的 package.json 数据转换为字符串
    const updatedPackageJson = JSON.stringify(packageJson, null, 2)

    // 将修改后的数据写回 package.json 文件
    fs.writeFile('package.json', updatedPackageJson, 'utf8', (err) => {
      if (err) {
        console.error('写入 package.json 文件时发生错误：', err)
        return
      }
      console.log('package.json reset！')
    })
  } catch (parseError) {
    console.error('解析 package.json 文件时发生错误：', parseError)
  }
})
