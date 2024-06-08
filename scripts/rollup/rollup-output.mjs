import path from 'path'
import { deps, thirdDeps } from '../deps/deps.mjs'
import { kebabCase, pascalCase } from '../helper.mjs'
import { externals } from './rollup-externals.mjs'

export const globals = (name) => {
  const keys = externals(name)
  const global = {}

  keys.forEach((key) => {
    if (deps[key]) {
      global[key] = deps[key].name
    } else if (thirdDeps[key]) {
      global[key] = thirdDeps[key].name
    }
  })

  return global
}

// 输出es
export const esModuleConfig = (name) => {
  const fullPath = deps[name].fullPath

  return {
    format: 'es',
    dir: path.resolve(fullPath, 'es'),
    exports: 'named',
    name: deps[name].name,
    entryFileNames: '[name].js',
    preserveModules: true,
    preserveModulesRoot: path.resolve(fullPath, 'src'),
    esModule: true,
    inlineDynamicImports: false,
    minifyInternalExports: false,
    indent: true,
    plugins: [],
    globals: {
      ...globals(name),
    },
  }
}

// 输出cjs
export const cjsModuleConfig = (name) => {
  const fullPath = deps[name].fullPath

  return {
    format: 'cjs',
    dir: path.resolve(fullPath, 'lib'),
    name: deps[name].name,
    exports: 'named',
    entryFileNames: '[name].js',
    preserveModules: true,
    preserveModulesRoot: path.resolve(fullPath, 'src'),
    inlineDynamicImports: false,
    minifyInternalExports: false,
    indent: true,
    plugins: [],
    globals: {
      ...globals(name),
    },
  }
}

export const esmConfig = (name) => {
  const fullPath = deps[name].fullPath

  const fileName = kebabCase(pascalCase(name, 'Ve'))

  return {
    file: path.resolve(fullPath, `dist/${fileName}.esm.js`),
    format: 'esm',
    name: deps[name].name,
    exports: 'named',
    sourcemap: false,
    inlineDynamicImports: true,
    minifyInternalExports: false,
    indent: false,
    plugins: [],
    globals: {
      ...globals(name),
    },
  }
}

export const cjsConfig = (name) => {
  const fullPath = deps[name].fullPath

  const fileName = kebabCase(pascalCase(name, 'Ve'))

  return {
    file: path.resolve(fullPath, `dist/${fileName}.cjs.js`),
    format: 'cjs',
    name: deps[name].name,
    exports: 'named',
    sourcemap: false,
    inlineDynamicImports: true,
    minifyInternalExports: false,
    indent: false,
    plugins: [],
    globals: {
      ...globals(name),
    },
  }
}

// 输出umd
export const umdConfig = (name) => {
  const fullPath = deps[name].fullPath

  const fileName = kebabCase(pascalCase(name, 'Ve'))

  return {
    file: path.resolve(fullPath, `dist/${fileName}.umd.js`),
    format: 'umd',
    name: deps[name].name,
    exports: 'named',
    sourcemap: false,
    inlineDynamicImports: true,
    minifyInternalExports: false,
    indent: false,
    plugins: [],
    globals: {
      ...globals(name),
    },
  }
}
