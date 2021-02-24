### 1、`typescript` 比 `JavaScript` 的优势在哪

1、`TypeScript` 是 `Javascript` 的超集
2、`Typescript` 包含了 `Javascript` 、类型系统和对 `ES6+` 的支持
3、`Typescript` 最终会被编译为 `Javascript`
4、任何 `Javascript` 运行环境都能被 `Typescript` 支持
5、生态更加健全和完善
6、微软的开发工具对 `TS` 的支持非常友好
7、属于强类型语言
8、`TypeScript` 是渐进式编程语言
9、更高的可读性和可维护性



### 2、支付流程

1、传递 订单标题 订单金额 订单描述 产品信息 收货地址和当前创建人参数，获取支付地址
2、拿到收货地址后使用 `window.location.href` 进行跳转
3、输入支付宝用户名密码登录后输入支付密码支付，支付成功后跳转到设置好的支付成功页面



###  3、`react-redux` 的主要作用是什么，常用的 `api` 有哪些，什么作用

- `react-redux` 作用：
  - 连接 `react` 和 `redux`，就是通过 `react-redux` 提供的高阶组件获取 `redux` 里的 `store`，通过 `props` 传递给 `react` 编写的其他子组件
  - 将所有组件分成两大类，`UI` 组件和容器组件，`UI` 组件负责 `UI` 呈现，容器组件负责管理数据和逻辑
- 常用的 `api`：
  - 使用 `Provider` 组件接收 `store` 对象，并将 `store` 传递到每个组件中
  - `connect` 函数将 `store` 对象作为 `props`绑定到特定的组件
  - `connect` 函数的第一个参数 `mapStateToProps`，用来订阅 `store`的更新
  - `connec` t函数的第二个参数 `mapDispatchToProps`，用来改变 `store`



### 4、 `redux`中的异步如何处理

1. 通过 `redux` 的 `createStore` 函数创建 `store` 对象
2. `createStore` 函数的第二个参数是接收 `redux` 插件如异步插件 `redux-saga`
3. 使用 `redux` 中的 `applyMiddleware` 函数，将 `redux-saga` 插件和其他插件传入到 `applyMiddleware` 函数中当做参数
   1. 调用 `redux-saga` 插件的默认函数，创建 `sagaMiddleware` 对象
   2. 创建 `generator` 函数，执行 `redux-saga/effects` 中的 `takeEvery` 函数
   3. 将触发的 `action` 和异步代码传递给 `takeEvery` ，其中异步代码也使用 `generator` 函数
   4. 将创建的 `generator` 函数传递给 `redux-saga/effects` 中的 `all` 函数 `rootSaga` 
   5. 调用 `sagaMiddleware` 的 `run` 函数执行 `rootSaga` 