export default {
  assumptions: {
    setComputedProperties: true,
  },
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          edge: '17',
          ie: '10',
          firefox: '60',
          chrome: '67',
          safari: '11.1',
        },
        useBuiltIns: 'entry',
        corejs: '3.6.4',
        modules: false,
      },
    ],
    '@babel/typescript',
  ],
  plugins: [
    // 支持 export default from 语法
    '@babel/plugin-proposal-export-default-from',
    // 转换 Object.assign( 方法
    '@babel/plugin-transform-object-assign',
    // 支持类属性的提案 -- 作用是将类似于 class A { a = 1 } 转换为 class A { constructor( { this.a = 1 } }
    ['@babel/plugin-transform-class-properties"'],
    // 转换计算属性 -- 作用是将类似于 const a = { ["b" + "c"]: 1 } 转换为 const a = { "bc": 1 }
    '@babel/plugin-transform-computed-properties',
    [
      '@babel/plugin-transform-runtime',
      {
        helpers: false, // 不引入辅助函数
        regenerator: false, // 不引入 regeneratorRuntime
      },
    ],
    // 支持可选的 catch 绑定
    '@babel/plugin-transform-optional-catch-binding',
    // 支持可选链式调用
    ['@babel/plugin-transform-optional-chaining'],
    // 转换 ES6 模块为 CommonJS 模块
    // ["@babel/plugin-transform-modules-umd"]
  ],
}
