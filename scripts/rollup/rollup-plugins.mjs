import path from 'path'
import { fileURLToPath } from 'url'
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'
import clear from 'rollup-plugin-clear'
import alias from '@rollup/plugin-alias'
import { babel } from '@rollup/plugin-babel'
import { deps } from '../deps/deps.mjs'

export const __dirname = path.dirname(fileURLToPath(import.meta.url))

const getBase = (name) => {
  const dep = deps[name]
  const fullPath = dep.fullPath
  return [
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    alias({}),
    resolve({
      mainFields: ['module', 'main', 'browser'], // 优先使用module字段
      preferBuiltins: false, // 是否优先使用node内置模块
    }),
    json(),
    commonjs(),
  ]
}

const getTypescript = (name, type) => {
  const dep = deps[name]
  const paths = {}
  dep.dependencies.forEach((key) => {
    if (deps[key]) {
      const _dep = deps[key]
      paths[key] = [path.resolve(_dep.fullPath, type === 'module' ? 'es' : 'src')]
    }
  })
  return [
    typescript({
      compilerOptions: {
        paths,
        /* Bundler mode */
        strict: false,
        skipLibCheck: true,
        sourceMap: false,
        declaration: false,
        declarationMap: false,
        noImplicitReturns: false,
        noImplicitAny: false,
        noUnusedLocals: false,
        noUnusedParameters: false,
        strictNullChecks: false,
      },
      exclude: ['node_modules', 'dist', 'es', 'lib', 'bin', '**/__tests__', '**/.test.ts'],
    }),
  ]
}

const getClean = (name, type) => {
  const dep = deps[name]
  const fullPath = dep.fullPath
  const esDir = path.resolve(fullPath, 'es')
  const libDir = path.resolve(fullPath, 'lib')
  const distDir = path.resolve(fullPath, 'dist')

  return [
    clear({
      targets: type === 'dist' ? [distDir] : [esDir, libDir],
    }),
  ]
}

const getBabel = (name, type) => {
  const extensions = ['.ts', 'tsx', '.js', 'jsx']

  return [
    babel({
      configFile: `${__dirname}/babel.base.mjs`,
      extensions,
      babelHelpers: 'bundled', // 生成的代码中不再包含babel的辅助函数，而是直接引用babel的辅助函数
      exclude: 'node_modules/**',
    }),
  ]
}

export const rollupPlugins = (name, type) => {
  return [...getClean(name, type), ...getBase(name), ...getTypescript(name, type), ...getBabel(name, type)]
}
