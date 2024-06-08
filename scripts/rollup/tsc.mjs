import { execa } from 'execa'
import { deps } from '../deps/deps.mjs'

// 创建一个方法用于生成声明文件
export const tsc = async (name, dir) => {
  const fullPath = deps[name].fullPath

  const tsconfig = `${fullPath}/tsconfig.json`

  await execa('tsc', [
    '-p',
    tsconfig,
    '--emitDeclarationOnly',
    '--declaration',
    '--declarationMap',
    '--outDir',
    `${dir}`,
  ])

  // console.log(stdout)
}
