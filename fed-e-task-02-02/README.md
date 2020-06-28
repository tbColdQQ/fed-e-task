## 一、简答题

### 1、Webpack 的构建流程主要有哪些环节？如果可以请尽可能详尽的描述 Webpack 打包的整个过程。

```

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
// webpack.common.js
const path = require('path')
const { dirname } = require('path')

module.export = {
    entry: { // 配置多个入口
        main: './src/main.js',
        demo: './src/main.js'
    },
    output: {
        // 输出的文件名
        filename: '[name].bundle.[chunkhash:8].js',
        // 输出的文件目录（绝对地址）
        path: path.resolve(__dirname, 'dist'),
        // 网站根目录
        publicPath: '/'
    },
    devtools: '',
    module: {
        rules: [
            {
                test: /.less$/,
                use: [
                    'style-loader'
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
                            limit: 8 * 1024,
                            name: '[name].[ext]'
                        }
                    }
                ]
            },
            {
                test: /.vue$/,
                use: 'vue-loader'
            }
        ]
    },
    plugins: [

    ],

}
```

**webpack.prod.js**

```
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
```

