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

```javascript
/*
 * @Descripttion: 
 * @version: 
 * @Author: jie.niu
 * @Date: 2020-06-10 10:07:20
 * @LastEditors: jie.niu
 * @LastEditTime: 2020-06-12 18:47:47
 */

const del = require('del')
    /**
     * src: 源文件/目录
     * dest: 目标文件/目录
     * parallel: 并行任务
     * series: 串行任务
     * watch: 监听
     */
const { src, dest, parallel, series, watch } = require('gulp')

const browserSync = require('browser-sync')
const bs = browserSync.create()

/**
 * loadPlugins 可以自动加载安装的gulp插件，使用此插件后，
 * 其他gulp插件都可以用plugins.XXX替代，如：plugins.sass, plugins.swig
 */
// const loadPlugins = require('gulp-load-plugins')
// const plugins = loadPlugins()


// 实现这个项目的构建任务
// yarn gulp test
exports.test = done => {
    console.log('gulp test')
    done()
}

// yarn gulp 命令默认执行default任务
exports.default = done => {
    console.log('gulp two')
    done()
}

const clean = async done => {
    // 方式一
    await del.sync(['temp', 'dist'])
    done() // 如果不执行done()，gulp会认为任务没有完成，会出现错误提示信息，但del操作已经完成

    // 方式二
    // return del('dist/assets/styles')
}

const cleantemp = async () => {
    return await del('temp')
}

const sass = require('gulp-sass')
const style = done => {
    // src 中的options选项，配置base可将文件所在的目录同时拷贝到目标目录下
    return src('src/assets/styles/*.scss', { base: 'src' })
        .pipe(sass({ outputStyle: 'expanded' })) // expanded 可以将样式文件内的括号展开，而不是与最后属性在同一行
        .pipe(dest('temp'))
        .pipe(bs.reload({stream: true}))    // stream: tue 指以流的方式更新浏览器内容
}

const babel = require('gulp-babel')
const script = () => {
    return src('src/assets/scripts/*.js', { base: 'src' })
        .pipe(babel({ presets: ['@babel/preset-env'] }))
        .pipe(dest('temp'))
        .pipe(bs.reload({stream: true}))
}

const swig = require('gulp-swig')
const data = {
    pkg: require('./package.json')
}
const page = () => {
    return src('src/**/*.html', { base: 'src' })
    .pipe(swig({ data, defaults: { cache: false }}))
        .pipe(dest('temp'))
        .pipe(bs.reload({ stream: true }))
}

const imagemin = require('gulp-imagemin')
const image = () => {
    return src('src/assets/images/**', { base: 'src' })
        .pipe(imagemin())
        .pipe(dest('dist'))
}

const extra = () => {
    return src('public/**', { base: 'public' })
        .pipe(dest('dist'))
}

const font = done => {
    // setTimeout(() => {
    //     src('src/assets/fonts/**', { base: 'src' })
    //         .pipe(imagemin())
    //         .pipe(dest('dist'))
    //     done()
    // }, 2000)
    return src('src/assets/fonts/**', { base: 'src' })
        .pipe(imagemin())
        .pipe(dest('dist'))

}

const useref = require('gulp-useref')
const g_if = require('gulp-if')
const uglify = require('gulp-uglify')
const cleancss = require('gulp-clean-css')
const htmlmin = require('gulp-htmlmin')
const ur = () => {
    return src('temp/**/*.html', { base: 'temp' })
        .pipe(useref({ searchPath: ['temp', '.'] }))
        .pipe(g_if(/\.js$/, uglify()))
        .pipe(g_if('/\.css$/', cleancss()))
        .pipe(g_if(/\.html$/, htmlmin({ collapseWhitespace: true, minifyCSS: true, minifyJS: true })))
        .pipe(dest('dist'))
}

const server = () => {
    watch('src/**/*.html', page)
    watch('src/assets/styles/*.scss', style)
    watch('src/assets/scripts/*.js', script)
    watch([
        'src/assets/images/**',
        'src/assets/fonts/**',
        'public/**',
    ], bs.reload)
    bs.init({
        notify: false, // 关闭页面中的提示
        port: 8888,
        open: false, // 取消自动打开浏览器
        // files: 'temp/**',   // dist下的所有文件发生变化时通知bs更新浏览器。如果在任务中使用了bs.reload()，则不需要使用此属性
        server: {
            baseDir: ['temp', 'src', 'public'],
            routes: {
                '/node_modules': 'node_modules'
            }
        }
    })
}

const build1 = series(clean, parallel(style, script, page, font, image, extra))

const build = series(clean, parallel(series(parallel(page, script, style), ur), font, image, extra), cleantemp)

const test = series(clean, font)

const dev = series(clean, parallel(style, script, page), server)

module.exports = {
    style,
    clean,
    build1,
    build,
    test,
    ur,
    server,
    dev
}

/**
 * gulp-sass    // sass编译
 * gulp-clean-css   // 压缩css
 * del  // 删除指定目录
 * gulp-babel
 * gulp-uglify // 压缩js
 * gulp-swig    // 解析html
 * gulp-htmlmin //压缩html
 * gulp-useref  // 资源合并
 * gulp-imagemin    // 压缩图片
 * gulp-if
 * gulp-load-plugins
 * browser-sync
 */
```



### 3、使用Grunt完成项目的自动化构建

```javascript
const sass = require('sass')
const loadGruntTasks = require('load-grunt-tasks')

module.exports = grunt => {
    grunt.registerTask('foo', () => {
        console.log('grunt foo task')
    })

    grunt.registerTask('async-task', function() {
        const done = this.async()
        setTimeout(() => {
            console.log('grunt async task')
            done()
        }, 5000)
    })

    grunt.registerTask('bad-task', () => {
        console.log('grunt bad task')
        return false
    })

    // grunt.registerTask('default', ['foo', 'bad-task', 'async-task'])

    grunt.initConfig({
        foo: () => {
            console.log('config task foo child task')
        },
        bar: 1,
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: ['**/*.html', '*.html'],
                    dest: 'dist'
                }]
            }
        },
        clean: {
            temp: 'dist'
        },
        sass: {
            options: {
                sourceMap: true,
                implementation: sass,
            },
            main: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: ['assets/styles/*.scss'],
                    dest: 'dist'
                }]
            }
        },
        babel: {
            options: {
                sourceMap: true,
                presets: ['@babel/preset-env']
            },
            main: {
                files: {
                    'dist/js/main.js': 'src/assets/scripts/main.js'
                }
            }
        },
        uglify: {
            main: {
                options: {
                    mangle: true, //混淆变量名
                    comments: false //false（删除全部注释），some（保留@preserve @license @cc_on等注释）
                },
                files: [
                    {
                        expand: true,
                        cwd: 'dist',
                        src: ['js/*.js'],
                        dest: 'dist'
                    }
                ]
            }
        },
        imagemin: {
            main: {
                options: {
                    optimizationLevel: 7,
                    pngquant: true
                },
                files: [
                    {
                        expand: true,
                        cwd: 'src',
                        src: ['assets/images/*.{png,jpg,jpeg,gif,webp,svg}'],
                        dest: 'dist'
                    }
                ]
            }
        },
        copy: {
            fonts: {
                files: [
                    {
                        expand: true,
                        cwd: 'src',
                        src: ['assets/fonts/*'],
                        dest: 'dist'
                    }
                ]
            }
        },
        watch: {
            js: {
                files: ['src/assets/scripts/*.js'],
                tasks: ['babel', 'uglify']
            },
            css: {
                files: ['src/assets/styles/*.scss'],
                tasks: ['sass']
            }
        }
    })

    // grunt.registerMultiTask('test', function() {
    //     console.log(this.target, this.data)
    // })

    grunt.registerTask('test', ['bar'], function() {
        console.log(this)
    })

    // grunt.loadNpmTasks('grunt-contrib-htmlmin')

    // grunt.loadNpmTasks('grunt-contrib-clean')

    // grunt.loadNpmTasks('grunt-sass')

    // yarn add grunt-babel @babel/core @babel/preset-env
    // grunt.loadNpmTasks('grunt-babel')

    loadGruntTasks(grunt)

    grunt.registerTask('default', ['clean', 'htmlmin', 'sass', 'babel', 'uglify', 'imagemin', 'copy', 'watch'])

    /**
     * grunt-contrib-clean
     * grunt-contrib-htmlmin
     * grunt-babel
     * grunt-contrib-uglify
     * grunt-sass
     * grunt-contrib-imagemin
     * grunt-contrib-copy
     * grunt-contrib-watch
     * load-grunt-tasks
     */
}
```

