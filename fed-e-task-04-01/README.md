## 1. 请简述 React 16 版本中初始渲染的流程

初始渲染分为两个阶段，分别是render阶段和commit阶段

1. render阶段做了以下处理：

- render， 渲染入口
- isValideContainer， 判断 node 是否是符合要求的 DOM 节点
- 初始化 FiberRoot
- 获取 rootFiber.child 实例对象
- updateContainer， 计算任务的过期时间，再根据任务过期时间创建 update 任务
- enqueueUpdate， 将任务存放到任务队列中，创建单向链表解构存放 update, next 用来串联 update
- scheduleUpdateOnFiber， 判断任务是否为同步，调用任务入口
- 构建 Fiber 对象

2. commit阶段做了以下处理：

- finishSyncRender
- commitRoot
- commitRootImpl， 在当前函数里又分了3个子阶段，分别是执行 DOM 操作前，执行 DOM 操作和执行DOM操作后

## 2. 为什么 React 16 版本中 render 阶段放弃了使用递归

因为主流浏览器的刷新频率为60Hz，即每（1000ms /60Hz）16.6ms浏览器刷新一次。JS可以操作DOM，GUI渲染线程与JS线程是互斥的。所以JS脚本执行和浏览器布局、绘制不能同时执行。超过16.6ms就会让用户感知到卡顿。 



## 3. 请简述 React 16 版本中 commit 阶段的三个子阶段分别做了什么事情

- before mutation 阶段（执行 DOM 操作前）
- mutation 阶段（执行 DOM 操作）
- layout 阶段（执行 DOM 操作后）

## 4. 请简述 workInProgress Fiber 树存在的意义是什么

1. 双缓存技术
   - 如果当前帧画面计算量比较大，导致清除上一帧画面到绘制当前帧画面之间有较长间隙，就会出现白屏。为了解决这个问题，我们可以在内存中绘制当前帧动画，绘制完毕后直接用当前帧替换上一帧画面，由于省去了两帧替换间的计算时间，不会出现从白屏到出现画面的闪烁情况。这种在内存中构建并直接替换的技术叫做双缓存 。
2. 双 Fiber 树
   -  在React中最多会同时存在两棵Fiber树。当前屏幕上显示内容对应的Fiber树称为current Fiber树，正在内存中构建的Fiber树称为workInProgress Fiber树，它反映了要刷新到屏幕的未来状态。current Fiber树中的Fiber节点被称为current fiber。workInProgress Fiber树中的Fiber节点被称为workInProgress fiber，它们通过alternate属性连接。 
   -  React应用的根节点通过current指针在不同Fiber树的rootFiber间切换来实现Fiber树的切换。当workInProgress Fiber树构建完成交给Renderer渲染在页面上后，应用根节点的current指针指向workInProgress Fiber树，此时workInProgress Fiber树就变为current Fiber树。每次状态更新都会产生新的workInProgress Fiber树，通过current与workInProgress的替换，完成DOM更新。**由于有两棵fiber树，实现了异步中断时，更新状态的保存，中断回来以后可以拿到之前的状态。并且两者状态可以复用，节约了从头构建的时间。** 
3. 内存构建
   - workInProgress在内存中构建，构建完成才统一替换，这样不会产生不完全的真实dom。