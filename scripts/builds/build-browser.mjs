import { createBuildQueue } from '../rollup/build-queue.mjs'
import { compilePackages } from '../rollup/rollup-compile.mjs'

const queue = createBuildQueue()

compilePackages(queue, 'dist')
