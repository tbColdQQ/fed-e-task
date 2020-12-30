### 一、 Vue 3.0 性能提升主要是通过哪几方面体现的？ 

#### 1、响应式系统升级

Vue3使用Proxy对象重写了响应式系统

- Vuejs 2.x中响应式系统的核心是 ` defineProperty` ，初始化的时候递归遍历所有的属性，转化为getter和setter
- Vuejs 3.x中使用Proxy对象重写响应式系统
  - 可以监听动态新增的属性
  - 可以监听删除的属性
  - 可以监听数组的索引和length属性

#### 2、编译优化

重写了DOM优化性能和提高渲染速度

- Vuejs 2.x 中通过标记静态根节点，优化diff的过程
- Vuejs 3.x 中标记和提升所有的静态根节点，diff的时候只需要对比动态节点内容
  - Fragments（升级Vetur插件）
  - 静态提升
  - Patch flag
  - 缓存事件处理函数

#### 3、源码体积的优化

通过优化源码的体积和更好的 ` TreeShaking ` 的支持，减小打包的体积

- Vuejs 3.x 中移除了一些不常用的API
  - 例如：inline-template、fliter 等
- Tree-Shaking
  - 例如：Vue 3.x 中没有用到的模块不会被打包，但是核心模块会打包。Keep-Alive、transition等都是按需引入的

### 二、 Vue 3.0 所采用的 Composition Api 与 Vue 2.x使用的Options Api 有什么区别？ 

#### 1、Options API

- 包含一个描述组件的选项（data、methods、props等）的对象
- Options API 开发复杂组件，同一个功能逻辑的代码被拆分到不同的区域

#### 2、Composition API

- Vuejs 3.x 新增的一组API
- 一组基于函数的API
- 可以更灵活的组织组件的逻辑
- 更好的类型推导，容易结合TypeScript

### 三、 Proxy 相对于 Object.defineProperty 有哪些优点？ 

- 可以监听动态新增的属性
- 可以监听删除的属性
- 可以监听数组的索引和length属性
- 多层属性嵌套，在访问属性过程中处理下一级属性

### 四、 Vue 3.0 在编译方面有哪些优化？ 

重写了DOM提升性能，提高渲染速度

- Vuejs 2.x 中通过标记静态根节点，优化diff的过程
- Vuejs 3.x 中标记和提升所有的静态根节点，diff的时候只需要对比动态节点内容
  - Fragments（升级Vetur插件）
  - 静态提升
  - Patch flag
  - 缓存事件处理函数

### 五、 Vue.js 3.0 响应式系统的实现原理？ 

Vuejs 3.x响应式系统底层采用Proxy实现对对象属性的建通



在属性的get方法中调用track方法收集依赖，track方法内部先检查是否有正在收集依赖的监听事件activeEffect，没有就直接返回。然后去检查该对象是不是已经在WeakMap中了，如果不在的话，先在WeakMap中创建一个该对象的位置，指向一个存放属性的Map，然后去WeakMap中找到该对象对应的Map，再在这个对象的Map中找到这个属性的监听事件集合Set，如果不存在Set再先创建一个，然后将正在收集依赖的监听事件activeEffect加入到这个属性的事件集合Set中。



在属性的set方法、deleteProperty方法中调用trigger方法触发更新，同上，trigger会先去WeakMap中查找这个对象的存放属性的Map，找不到则直接返回，如果找到了，这个对象的Map，再去Map中找这个属性的监听事件集合Set，如果找不到Set则直接返回，如果找到了，则循环执行该属性的监听事件集合Set里的每一个事件监听函数activeEffect，执行更新。



