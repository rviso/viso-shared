import { deps } from '../deps/deps.mjs'
import { cjsConfig, cjsModuleConfig, esModuleConfig, esmConfig, umdConfig } from './rollup-output.mjs'
import { rollupPlugins } from './rollup-plugins.mjs'
import { externals } from './rollup-externals.mjs'

export const rollupModuleConfig = (name) => {
  const fullPath = deps[name].fullPath
  const input = `${fullPath}/src/index.ts`

  return {
    input,
    external: externals(name, 'module'),
    output: [esModuleConfig(name), cjsModuleConfig(name)],
    plugins: rollupPlugins(name, 'module'),
  }
}

export const rollupDistConfig = (name) => {
  const fullPath = deps[name].fullPath
  const input = `${fullPath}/src/index.ts`

  return {
    input,
    external: externals(name, 'dist'),
    output: [esmConfig(name), cjsConfig(name), umdConfig(name)],
    plugins: rollupPlugins(name, 'dist'),
  }
}
