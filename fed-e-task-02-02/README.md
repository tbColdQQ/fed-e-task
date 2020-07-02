## 一、简答题

### 1、Webpack 的构建流程主要有哪些环节？如果可以请尽可能详尽的描述 Webpack 打包的整个过程。

```
构建流程：
0、mode：指定webpack以development的默认配置还是production的默认配置进行打包
1、entry：指定webpack的入口文件
2、module：指定项目中所需要的的加载器，按照配置处理不同模块
3、plugins：辅助webpack实现loader无法实现的功能，如在打包前清空打包目录等
4、output：指定webpack的输出
5、devtools：指定sourceMap的生成方式
6、resolve：指定模块的解析方式，如引用的文件路径的简写等
7、module.hot：HMR配置，即模块热替换

1、找到打包入口文件
2、根据文件中的import或require解析并推断依赖的模块，生成依赖树
3、递归遍历依赖树，根据配置文件中的rules属性找到模块对应的loader
4、将相关的代码交给loader处理
5、在整个打包过程中，执行在预先设定好的webpack生命周期的钩子中相对应的插件
6、处理后的代码放到输出的文件中
```



### 2、Loader 和 Plugin 有哪些不同？请描述一下开发 Loader 和 Plugin 的思路。

**Loader和Plugin的不同**

```
Loader用于对模块的源码进行转换，主要是针对js代码的转换，也可以对图像或css等资源文件进行转换
处理文件可以使用多个loader，loader的执行顺序与配置的顺序相反

Plugin目的在于解决loader无法解决的问题。webpack在生命周期的每个阶段都是预设钩子，而plugin就是在这些钩子中执行的。
```

**开发Loader的思路**

```javascript
// Loader是导出的一个函数的node模块，这个函数针对输入的内容，对输出的内容是可预见性的，即导出的这个函数应该是一个纯函数。
// 如果这个函数最终返回的是JavaScript代码的字符串。这个字符串会被写入到目标文件中或者被指定的loader的输入参数使用。
// 如果这个函数最终返回的是简单的字符串，这个字符串会作为下一个loader的输入参数，形成链式管道。
// 导出的JavaScript代码也支持ES Modules
const marked = require('marked')
module.exports = source => {
    const html = marked(source)
    return `module.exports = ${JSON.stringify(html)}`
    // return `export default JSON.stringify(html)`
}
```

**开发Plugin的思路**

```javascript
// plugin必须是一个函数或者是一个包含apply方法的对象
// webpack启动时会自动调用，并向apply方法中传入compile对象，这个对象包含webpack的一些注册信息
// 确定创建的插件的运行的时机，即 确定需要将插件挂载到webpack生命周期中的哪个钩子上
// 使用compile中相关的钩子，往钩子中传入插件名称和挂载在钩子上的函数
// webpack会往挂载在钩子上的函数中传入webpack运行上下文compilation，通过上下文做逻辑操作
// 逻辑操作的结果是更新compilation中的内容或是根据compilation中的内容做的其他操作
class MyPlugin {
    apply(compile) {
        console.log('myplugin start')
        compile.hooks.emit.tap('MyPlugin', compilation => {
            // compilation可以理解为此次打包的上下文
            for(const name in compilation.assets) {
                // console.log(compilation.assets[name].source())
                if(name.endsWith('.js')) {
                    const contents = compilation.assets[name].source()
                    const withoutComments = contents.replace(/\/\*\*+\*\//g, '')
                    compilation.assets[name] = {
                        source: () => withoutComments,
                        size: () => withoutComments.length
                    }
                }
            }
        })
    }
}
```





## 二、编程题

### 1、使用 Webpack 实现 Vue 项目打包任务

**webpack.common.js**

```javascript
/* eslint-disable */
const path = require('path')
const { dirname } = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const templateParameters = {
    BASE_URL: 'http://www.baidu.com/'
}

module.exports = {
    entry: { // 配置多个入口
        main: './src/main.js',
        demo: './src/main.js'
    },
    output: {
        // 输出的文件名
        filename: 'js/[name].bundle.[chunkhash:8].js',
        // 输出的文件目录（绝对地址）
        path: path.resolve(__dirname, 'dist'),
        // 网站根目录
        publicPath: ''
    },
    // devtools: '',
    module: {
        rules: [
            {
                test: /.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.(gif|jpg|jpeg|png|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            esModule: false,    // file-loader 的配置
                            limit: 8 * 1024,
                            name: '[name].[ext]',
                            outputPath: 'assets/'   // file-loader 的配置
                        }
                    }
                ]
            },
            {
                test: '/.js$/',
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            },
            {
                test: /.vue$/,
                use: 'vue-loader',
                exclude: file => (
                    /node_modules/.test(file) &&
                    !/\.vue\.js/.test(file)
                )
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/style.css'
        }),
        new HtmlWebpackPlugin({
            template: 'public/index.html',
            filename: 'index.html',
            chunks: ['main'],
            title: 'index',
            templateParameters
        }),
        new HtmlWebpackPlugin({
            template: 'public/index.html',
            filename: 'demo.html',
            chunks: ['demo'],
            title: 'demo',
            templateParameters
        }),
    ]

}
```

**webpack.prod.js**

```javascript
/* eslint-disable */
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const merge = require('webpack-merge')

let config = require('./webpack.common')
const newConfig = {
    mode: 'production',
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({patterns: ['public']})
    ]
}

module.exports = merge(config, newConfig)
```

**webpack.dev.js**

```javascript
/* eslint-disable */
const merge = require('webpack-merge')
const path = require('path')
let config = require('./webpack.common')
config = merge(config, {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        contentBase: path.resolve(__dirname, 'public'),
        port: 8888,
        overlay: {
            warnings: true,
            errors: true
        },
        proxy: {
            '/api': {
                target: 'https://api.github.com',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }, 
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
                enforce: 'pre',
                options: {
                    formatter: require('eslint-friendly-formatter'), // 指定错误报告的格式规范
                    emitWarning: false // true：在命令行和控制台输出警告，不会使得编译失败 | false：会强制 eslint-loader 将 lint 错误输出为编译错误，同时也意味着 lint 错误将会导致编译失败
                }
            },
            {
                test: /\.vue$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
                enforce: 'pre',
                options: {
                    formatter: require('eslint-friendly-formatter'), // 指定错误报告的格式规范
                    emitWarning: false // true：在命令行和控制台输出警告，不会使得编译失败 | false：会强制 eslint-loader 将 lint 错误输出为编译错误，同时也意味着 lint 错误将会导致编译失败
                }
            }
        ]
    }
})
module.exports = config
```

**webpack.config.js**

```javascript
/* eslint-disable */

const prodConfig = require('./webpack.prod')
const config = require('./webpack.dev')

module.exports = (env, argsv) => {
    if(env === 'production') {
        return { ...prodConfig }
    }else {
        return { ...config }
    }
}
```

**.eslintrc.js**

```javascript
/* eslint-disable */
/*
 * @Descripttion: 
 * @version: 
 * @Author: jie.niu
 * @Date: 2020-07-02 10:09:52
 * @LastEditors: jie.niu
 * @LastEditTime: 2020-07-02 15:22:55
 */ 
module.exports = {
  env: {
    browser: true,
    es2020: true
  },
  extends: [
    'plugin:vue/essential',
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 11,
  },
  plugins: [
    'vue'
  ],
  rules: {
    
  }
}
```

