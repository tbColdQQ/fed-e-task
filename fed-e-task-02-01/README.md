## 简答题

### 1、谈谈你对工程化的初步认识，结合你之前遇到过的问题说出三个以上工程化能够解决问题或者带来的价值

```
前端工程化指遵循一定的标准和规范，通过工具提高效率，降低成本的一种手段。

之前遇到的问题：
1、使用ES6+的新特性的时候，会面临的兼容问题
2、使用Less/Sass/PostCSS等工具提高css的编程性的时候，会面临运行环境不能直接支持的问题
3、使用模块化或组件化提高项目的可维护性的时候，会面临运行环境不能直接支持的问题
4、部署上线前手动压缩资源文件，并手动上传到服务器
5、多人协同开发的时候很难硬性统一代码风格
6、部分功能需要等待后端接口完成后才能开发

带来的价值：
1、自动搭建项目的基本目录结构和文件
2、格式化代码、校验代码风格，对代码进行编译/构建/打包操作
3、web server/mock等可以不用等待后端项目即可先进行开发，以及跟踪代码问题等
4、项目代码质量检查等
5、持续集成、持续部署、自动发布等
```



### 2、你认为脚手架除了为我们创建项目结构，还有什么更深的意义？

```
约定了：
1、相同的组织结构
2、相同的开发范式
3、相同的模块依赖
4、相同的工具配置
5、相同的基础代码
因此能够更好的协同开发，提高开发效率
```





## 编程题

### 1、概述脚手架实现的过程，并使用NodeJS完成一个自定义的小型脚手架工具

```
脚手架工具实际上是一个NPM模块。可以使用yeoman自定义脚手架。
```



![image-20200604222043146](..\images\image-20200604222043146.png)

创建generator-pignn-sample的脚手架
步骤：

- 按照上图创建目录结构

- 编写index.js

```javascript
// index.js
// 此文件使 Generator 的核心入口
// 需要导出一个继承自 Yeoman Generator 的类型
// Yeoman Generator 在工作时会自动调用我们在此类型中定义的一些生命周期方法
// 通过调用父类提供的一些工具方法实现功能
const Generator = require('yeoman-generator')
module.exports = class extends Generator {

    prompting() {
        return this.prompt([
            {
                type: 'input',
                name: 'projectName',
                message: 'Your Project Name',
                default: this.appname
            }
        ]).then(answers => {
            // answers => {name: 'user input value'}
            this.answers = answers
        })
    }

    writing() {
        // 批量写入文件
        const templates = [
            'css/bootstrap-theme.min.css',
            'css/bootstrap.min.css',
            'fonts/glyphicons-halflings-regular.eot',
            'fonts/glyphicons-halflings-regular.svg',
            'fonts/glyphicons-halflings-regular.ttf',
            'fonts/glyphicons-halflings-regular.woff',
            'fonts/glyphicons-halflings-regular.woff2',
            'imgs/aaa.jpg',
            'js/bootstrap.min.js',
            'js/jquery.min.js',
            'foo.txt',
            'index.html',
            'package.json',
            'README.md'
        ]
        templates.forEach(item => {
            this.fs.copyTpl(
                this.templatePath(item),
                this.destinationPath(item),
                this.answers
            )
        })
    }
}
```

- 执行 yarn link，将当前generator链接成一个工具包

- 执行 yo pignn-sample
- 上传github，发布Generator，执行 yarn publish --registry=https://registry.yarnpkg.com



### 2、尝试使用Gulp完成项目的自动化构建

```

```



### 3、使用Grunt完成项目的自动化构建

```

```

