## 一、简答题

### 1、当我们点击按钮的时候动态给 data 增加的成员是否是响应式数据，如果不是的话，如果把新增成员设置成响应式数据，它的内部原理是什么。

```javascript
let vm = new Vue({
 el: '#el'
 data: {
  o: 'object',
  dog: {}
 },
 method: {
  clickHandler () {
   // 该 name 属性是否是响应式的
   this.dog.name = 'Trump'
  }
 }
})
```

**回答：**

```
给data增加的成员不是响应式数据。data内的数据在初始化Vue的时候执行了_proxyData和observer函数，对data内的成员添加了getter和setter才成为响应式数据，再次给data添加成员不会调用_proxyData和observer函数，所以不是响应式数据。
可以通过Vue.set()或vm.$set添加响应式数据，原理是调用observer的defineReactive函数为此属性添加getter和setter函数。
```



### 2、请简述 Diff 算法的执行过程

**回答：**

```
核心执行流程：
1、使用h()函数创建JavaScript对象VNode来描述真是DOM
2、init()函数设置模块，创建patch()函数
3、patch()函数比较两个新旧的VNode
4、把变化的内容更新到真是Dom树上

第3步细化如下几步：
3.1、patch(oldVNode, newVNode)
3.2、打补丁，把新节点中变化的内容渲染到真是DOM，最后返回新节点作为下一次处理的旧节点
3.3、对比新旧VNode是否相同节点（节点的key和sel相同）
3.4、如果不是相同节点，删除之前的内容，重新渲染
3.5、如果是相同的节点，再判断新的VNode是否有text，如果有并且和oldVNode的text不同，直接更新文本内容
3.6、如果新的VNode有children，判断子节点是否有变化，判断子节点的过程使用的就是diff算法
3.7、diff过程只进行同层级的比较

第3步使用patchVNode()函数，具体如下：
```

![image-20200717145817445](..\images\image-20200717145817445.png)

```
第3.6步使用updateChildren()函数，就是diff算法的核心
3.6.1、对新老节点数组的开始和结尾节点设置标记索引，遍历的过程中移动索引
3.6.2、在对开始和结束节点比较的时候，总共有四种情况：
	oldStartVNode / newStartVNode
	oldEndVNode / newEndVNode
	oldStartVNode / newEndVNode
	oldEndVNode / newStartVNode
3.6.3、如果oldStartVNode和newStartVNode是sameVNode（key和sel相同），则调用patchVNode()对比和更新节点，把就开始和新开始索引往后移动（oldStartIdx++ / oldEndIdx++）
3.6.4、如果oldStartVNode / newEndVNode相同，则调用patchVNode对比和更新节点，把oldStartVNode对应的DOM元素移动到右边，最后更新索引
3.6.4、如果不是以上情况，遍历新节点，使用newStartVNode的key在老节点数组中找相同节点，如果没有找到，说明newStartVNode是新节点（创建新节点对应的DOM元素，插入到DOM树中）
3.6.5、如果找到，则判断新节点和找到的老节点的sel选择器是否相同，如果不相同，说明节点被修改（重新创建对应的DOM元素，插入到DOM树中）；如果相同，把elmToMove对应的DOM元素，移动到左边
3.6.6、循环结束：当老节点的所有子节点先遍历完（oldStartIdx > oldEndIdx）；新节点的所有子节点先遍历完（newStartIdx > newEndIdx）
3.6.7、如果老节点的数组先遍历完（oldStartIdx > oldEndIdx），说明新节点有剩余，把剩余节点插入到右边
3.6.8、如果新节点的数组先遍历完（newStartIdx > newEndIdx），说明老节点有剩余，把剩余节点批量删除
```





## 二、编程题

### 1、模拟 VueRouter 的 hash 模式的实现，实现思路和 History 模式类似，把 URL 中的 # 后面的内容作为路由的地址，可以通过 hashchange 事件监听路由地址的变化。

```javascript
/*
 * @Descripttion: 
 * @version: 
 * @Author: jie.niu
 * @Date: 2020-07-17 16:56:25
 * @LastEditors: jie.niu
 * @LastEditTime: 2020-07-17 17:24:48
 */ 
let _Vue = null
export default class VueRouter {
    static install (Vue) {
        // 1、判断当前插件是否已经被安装
        if(VueRouter.install.installed) {
            return
        }
        VueRouter.install.installed = true
        // 2、把Vue构造函数记录到全局变量
        _Vue = Vue
        // 3、把创建的Vue实例传入的router对象注入到Vue实例上
        // 混入
        _Vue.mixin({
            beforeCreate() {
                if(this.$options.router) {
                    _Vue.prototype.$router = this.$options.router
                    this.$options.router.init()
                }
            },
        })
    }

    constructor(options) {
        this.options = options
        this.routeMap = {}
        this.data = _Vue.observable({
            current: '/'
        })
    }

    init() {
        this.createRouteMap()
        this.initComponents(_Vue)
        this.initEvent()
    }

    createRouteMap() {
        // 遍历所有的路由规则，把路由规则解析成键值对的形式，存储到routeMap中
        this.options.routes.forEach(route => {
            this.routeMap[route.path] = route.component
        })
    }

    initComponents(Vue) {
        Vue.component('router-link', {
            props: {
                to: String
            },
            // runtimeCompiler: false
            render(h) {
                return h('a', {
                    attrs: {
                        href: this.to
                    },
                    on: {
                        click: this.clickHandler
                    }
                }, [this.$slots.default])
            },
            methods: {
                clickHandler(e) {
                    console.log('clickhandler--->', this.to)
                    if(this.$router.options.mode == 'history') {
                        history.pushState({}, '', this.to)
                    }else {
                        window.location.hash = this.to
                    }
                    this.$router.data.current = this.to
                    e.preventDefault()
                }
            }
            // runtimeCompiler: true
            // template: '<a :href="to"><slot></slot></a>'  
        })

        const self = this
        Vue.component('router-view', {
            render(h) {
                const component = self.routeMap[self.data.current]
                return h(component)
            }
        })
    }

    initEvent() {
        if(this.options.mode == 'history') {
            window.addEventListener('popstate', () => {
                this.data.current = window.location.pathname
            })
        }else {
            window.addEventListener('hashchange', () => {
                console.log('hashchange--->', window.location.hash.substr(1))
                this.data.current = window.location.hash.substr(1)
            })
        }
    }
}
```



### 2、在模拟 Vue.js 响应式源码的基础上实现 v-html 指令，以及 v-on 指令。

**compiler.js**

```javascript
class Compiler {
    constructor(vm) {
        this.el = vm.$el
        this.vm = vm
        this.compiler(this.el)
    }

    // 编译模板，处理文本节点和元素节点
    compiler(el) {
        let childNodes = el.childNodes
        Array.from(childNodes).forEach(node => {
            if(this.isTextNode(node)) {
                this.compileText(node)
            }else if(this.isElementNode(node)) {
                this.compileElement(node)
            }

            // 判断node是否有子节点，如果有，需要递归调用compiler
            if(node.childNodes && node.childNodes.length) {
                this.compiler(node)
            }
        })
    }

    // 编译元素节点，处理指令
    compileElement(node) {
        // console.log(node.attributes)
        Array.from(node.attributes).forEach(attr => {
            let attrName = attr.name
            if(this.isDirective(attrName)) {
                attrName = attrName.substr(2)
                let key = attr.value
                this.update(node, key, attrName)
                
            }
        })
    }

    update(node, key, attrName) {
        if(attrName.startsWith('on')) {
            let updateFn = this['onUpdater']
            updateFn && updateFn.call(this, node, key, attrName)
        }else {
            let updateFn = this[attrName + 'Updater']
            updateFn && updateFn.call(this, node, this.vm[key], key)
        }
    }

    // 处理v-text
    textUpdater(node, value, key) {
        node.textContent = value
        new Watcher(this.vm, key, (newValue) => {
            node.textContent = newValue
        })
    }

    // 处理v-model
    modelUpdater(node, value, key) {
        node.value = value
        new Watcher(this.vm, key, (newValue) => {
            node.value = newValue
        })
        // 双向绑定
        node.addEventListener('input', () => {
            this.vm[key] = node.value
        })
    }

    // 处理v-html
    htmlUpdater(node, value, key) {
        node.innerHTML = value
        new Watcher(this.vm, key, (newValue) => {
            node.innerHTML = newValue
        })
    }

    // 处理v-on
    onUpdater(node, value, key) {
        key = key.replace(":", "")
        node.addEventListener(key.substr(2), (e) => {
            this.vm.$options.methods[value](e)
        })
        new Watcher(this.vm, key, (newValue) => {
            node.addEventListener(key.substr(2), (e) => {
                this.vm.options.methods[newValue](e)
            })
        })
    }

    // 编译文本节点，处理差值表达式
    compileText(node) {
        // console.dir(node)
        let reg = /\{\{(.+?)\}\}/
        let value = node.textContent
        if(reg.test(value)) {
            let key = RegExp.$1.trim()
            node.textContent = value.replace(reg, this.vm[key])

            // 创建watcher对象，当数据改变时更新视图
            new Watcher(this.vm, key, (newValue) => {
                node.textContent = newValue
            })
        }
    }

    // 判断元素属性是否是指令
    isDirective(attrName) {
        return attrName.startsWith('v-')
    }

    // 判断节点是否是文本节点
    isTextNode(node) {
        return node.nodeType === 3
    }

    // 判断节点是否是元素节点
    isElementNode(node) {
        return node.nodeType === 1
    }
}
```

**index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div id="app">
        <h1>差值表达式</h1>
        <h3>{{msg}}</h3>
        <h3>{{count}}</h3>
        <h1>v-text</h1>
        <div v-text="msg"></div>
        <h1>v-html</h1>
        <div v-html="htmlVal"></div>
        <h1>v-on</h1>
        <div v-on:click="clickHandle">click me</div>
        <h1>v-model</h1>
        <input type="text" v-model="msg">
        <input type="text" v-model="count">
    </div>
    <script src="./js/dep.js"></script>
    <script src="./js/watcher.js"></script>
    <script src="./js/observer.js"></script>
    <script src="./js/compiler.js"></script>
    <script src="./js/vue.js"></script>
    <script>
        let vm = new Vue({
            el: '#app',
            data: {
                msg: 'hello vue',
                count: 100,
                htmlVal: '<p>aaaaaa</p>',
                person: {
                    name: 'tbcold'
                }
            },
            methods: {
                clickHandle() {
                    alert('click me')
                }
            }
        })
        console.log(vm.msg)
        // vm.msg  = { test: 'hello' }
    </script>
</body>
</html>
```





### 3、参考 Snabbdom 提供的电影列表的示例，利用Snabbdom 实现类似的效果，如图：

![img](..\images\Ciqc1F7zUZ-AWP5NAAN0Z_t_hDY449.png)

**回答：**

```
gitee地址：https://gitee.com/tbCold/fed-e-task-03-01-snabbdom-demo.git
yarn install
yarn gulp server
http://localhost:9988/demo.html
```

```javascript
import { init } from '../../build/package/init.js'
import clazz from '../../build/package/modules/class.js'
import style from '../../build/package/modules/style.js'
import listeners from '../../build/package/modules/eventlisteners.js'
import {h} from '../../build/package/h.js'

const patch = init([clazz, style, listeners])

let listVNode = null
let id = 4
let data = [
    { name: '张三', age: 40, top: 0, id: 1 },
    { name: '李四', age: 22, top: 0, id: 2 },
    { name: '王五', age: 35, top: 0, id: 3 },
    { name: '赵六', age: 12, top: 0, id: 4 }
]

const delFn = id => {
    console.log('delFn--->', id)
    data = data.filter(item => item.id != id)
    if(listVNode == null) {
        listVNode = document.querySelector(".list")
    }
    listVNode = patch(listVNode, initList(data))
}

const initList = list => {
    return h("div.list", list.map((item, index) => h("div.list-item", { style: { transform: 'translateY('+(index * 60)+'px)'}}, [
        h("div.name", '姓名：' + item.name),
        h("div.age", '年龄：' + item.age),
        h("div.delete", { on: { click: [delFn, item.id]}}, "X")
    ])))
}

const initBtnGroup = () => {
    return h("div.btn-group", [
        h("button.btn", { on: { click: [addFn, undefined] }}, "新建"),
        h("button.btn", { on: { click: [sortFn, undefined] }}, "排序")
    ])
}

const addFn = () => {
    id++
    data.unshift({
        name: Math.random().toString(36).slice(-6),
        age: parseInt(Math.random() * 100),
        id,
        top: 0
    })
    if(listVNode == null) {
        listVNode = document.querySelector(".list")
    }
    // console.log('addFn--->', data, initList(data))
    let newVNode = initList(data)
    listVNode = patch(listVNode, newVNode)
}

const sortFn = () => {
    console.log('sortFn--->')
    data.sort(function(item1, item2) {
        return item1.age - item2.age
    })
    if(listVNode == null) {
        listVNode = document.querySelector(".list")
    }
    listVNode = patch(listVNode, initList(data))
}

window.addEventListener('DOMContentLoaded', () => {
    listVNode = initList(data)
    const appVNode = h("div#app", [
        initBtnGroup(),
        listVNode
    ])
    const app = document.querySelector("#app")
    patch(app, appVNode)
})
```

