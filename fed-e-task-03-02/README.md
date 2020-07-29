## 一、简答题

### 1、请简述 Vue 首次渲染的过程。

**回答：**

![image-20200729104313781](..\images\image-20200729104313781.png)

```
1、Vue初始化，并初始化Vue的实例成员和静态成员
2、初始化结束后调用构造函数，在构造函数中调用了this._init()，相当于整个Vue的入口
3、在this._init()中调用this.$mount()，共有两个this.$mount()
	3.1、第一个this.$mount()是entry-runtime-with-compiler.js入口文件，这个$mount()的核心作用是帮我们把模板编译成render函数，但它首先会判断一下当前是否传入了render选项，如果没有传入的话，它会去获取我们的template选项，如果template选项也没有的话，他会把el中的内容作为我们的模板，然后把模板编译成render函数，它是通过compileToFunctions()函数，帮我们把模板编译成render函数的,当把render函数编译好之后，它会把render函数存在我们的options.render中
	3.2、第二个this.$mount()是runtime/index.js中的this.$mount()方法。这个方法首先会重新获取el，因为如果是运行时版本的话，是不会走entry-runtime-with-compiler.js这个入口中获取的el，所以如果是运行时版本的话，会在runtime/index.js的$mount()中重新获取el
4、调用mountComponent()，mountComponent()是在src/core/instance/lifecycle.js中定义的。在mountComponent()中，首先会判断render选项，如果没有render，但是传入了模板，并且当前是开发环境的话会发送警告，警告运行时版本不支持编译器。接下来会触发beforeMount这个生命周期中的钩子函数，也就是开始挂载之前
5、然后定义了updateComponent()，在这个方法中，定义了_render和_update，_render的作用是生成虚拟DOM，_update的作用是将虚拟DOM转换成真实DOM，并且挂载到页面上来
6、再接下来就是创建Watcher对象，在创建Watcher时，传递了updateComponent这个函数，这个函数最终是在Watcher内部调用的。在Watcher创建完之后还调用了get方法，在get方法中，会调用updateComponent()
7、然后触发了生命周期的钩子函数mounted,挂载结束，最终返回Vue实例
```



### 2、请简述 Vue 响应式原理。

**回答：**

![image-20200729104313781](..\images\vue响应式原理.png)



### 3、请简述虚拟 DOM 中 Key 的作用和好处。

**回答：**

```
1、当没有设置key的时候：
	在 updateChildren 中比较子节点的时候，每一个子节点都会进行比较并更新DOM
	
2、设置key的时候：
	在 updateChildren 中比较子节点的时候，会把 oldVnode 的子节点和 newVnode 的子节点的key进行比较，如果相同就没有更新 DOM 的操作，如果有不同的key，只对不同的key做更新 DOM 的操作
```



### 4、请简述 Vue 中模板编译的过程。

**回答：**

![image-20200729152531156](..\images\image-20200729152531156.png)

```
此过程可以分成两个步骤：先将模板解析成AST（abstract syntax tree,抽象语法树），然后使用AST生成渲染函数。
由于静态节点不需要总是重新渲染，所以生成AST之后，生成渲染函数之前这个阶段，需要做一个优化操作：遍历一遍AST，给所有静态节点做一个标记，这样在虚拟DOM中更新节点时，如果发现这个节点有这个标记，就不会重新渲染它。
所以，在大体逻辑上，模板编译分三部分内容：
1、将模板解析成AST
2、遍历AST标记静态节点
3、使用AST生成渲染函数
这三部分内容在模板编译中分别抽象出三个模块实现各自的功能：解析器、优化器和代码生成器。
```

![image-20200729152804846](..\images\image-20200729152804846.png)