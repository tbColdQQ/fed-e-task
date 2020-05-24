## 1、请说出下列最终的执行结果，并解释为什么？

```javascript
var a = []
for(var i = 0;i < 10; i++) {
    a[i] = function() {
        console.log(i)
    }
}
a[6]()
```

### 回答：

```
输出 10
说明：var 声明的变量属于全局作用域。在调用`a[6]()`之前for循环执行完毕，且i已经累加到10.所以a数组里面的每项，执行后结构都是10 
```





## 2、请说出下列最终的执行结果，并解释为什么？

```
var tmp = 123
if(true) {
	console.log(tmp)
	let tmp
}
```

### 回答：

```
输出 报ReferenceError错误，提示tmp未定义
说明：ECMAScript为了处理var带来的变量提升的问题，约定必须要先声明变量再使用变量，否则会提示ReferenceError错误
```



## 3、结合ES6新语法，用最简单的方式找出数组中的最小值？

```
var arr = [12, 34, 32, 89, 4]
```

### 回答：

```javascript
方式1：
var min = arr.reduce((total, item) => {return total - item > 0 ? item : total}, arr[0])

方式2：
var min = Math.min.apply(null, arr)

方式3：
var min = Math.min.call(null, ...arr)

方式4：
var min = arr.sort((a, b) => a - b >= 0)[0]
```



## 4、请详细说明var、let、const三种声明变量的方式之间的具体差别？

### 回答：

```
var
1、在函数中声明，作用去是函数体的全部。即函数体的任何地方都可以调用
2、存在变量提升问题，在使用var声明的变量之前调用此变量会提示undefined，而不会报错
3、var在全局声明的变量是全局的属性
4、使用var重复定义变量不会提示错误

let
1、let是更完美的var，不存在变量提升问题
2、let声明的变量有块级作用域
3、let声明的变量不是全局的属性
4、使用let重复定义变量会提示语法SyntaxError错误

const
1、const在定义常量时必须给常量赋值
2、const定义的常量不可修改
3、const不能重复定义相同的常量
```



## 5、请说出下列代码最终输出的结果，并解释为什么？

```javascript
var a = 10
var obj = {
	a: 20,
	fn() {
		setTimeout(() => {
			console.log(this.a)
		})
	}
}
obj.fn()
```

### 回答：

```
输出 20
说明：箭头函数不影响this的作用域，所以this的指向是obj，所以this.a即obj.a
```



## 6、简述 Symbol 类型的用途？

### 回答：

```
1、Symbol可以作为对象的属性，防止在扩展对象属性时出现重复定义属性的情况
	const obj = {}
	obj[Symbol()] = 123
	obj[Symbol()] = 456
2、实现对象的私有成员
	const name = Symbol()
	const person = {
		[name] = 'niujie'
		getProp() {
			console.log(this[name])
		}
	}
3、重新定义对象的属性标签
	const obj = {
		[Symbol.toStringTag]: 'XObject'
	}
	console.log(obj.toString())	// [object, XObject]
```



## 7、说说什么是浅拷贝，什么是深拷贝？

### 回答：

```
深拷贝和浅拷贝都是针对的引用数据类型

浅拷贝
1、只复制指向对象的指针，而不是复制对象本身，所以浅拷贝的两个对象的指针是不同的指针，但指针指向的都是同一块内存
2、浅拷贝只复制对象的第一级属性
3、使用 Object.assign 可以实现浅拷贝
let obj = {
    a: 1,
    b: 2,
    c: {
        d: 3
    }
}
let obj1 = Object.assign({}, obj)
obj1.a = 11
obj1.c.d = 33
console.log(obj)	// { a: 1, b: 2, c: { d: 33 } }
console.log(obj1)	// { a: 11, b: 2, c: { d: 33 } }

深拷贝
1、会完全复制对象，两个对象的指针和所指向的内存都不同
2、实现深拷贝的方式有
	（1）结合JSON.stringify() 和 JSON.parse()使用
	（2）使用函数库lodash的cloneDeep
	（3）使用Jquery的extend
```



## 8、谈谈你是如何理解JS异步编程的，EventLoop是做什么的，什么是宏任务，什么是微任务？

### 回答：

```
JS本身是单线程的，JS的异步模式依靠消息队列和事件循环机制

EventLoop即是事件循环。JS在运行的时候会产生堆和栈。当栈内的代码执行完毕后会从任务队列中读取任务或者任务的回调，将任务或任务回调放入栈中继续执行，如此不断循环。

宏任务
在任务队列中存在的任务为宏任务，包括script中的代码、setTimeout、setInterval、I/O、UI渲染

微任务
产生新的微任务会在执行栈中最后执行，包括Promise、Object.observe、MutationObserver

在执行栈中的微任务执行完成之后才会执行任务队列中的宏任务
```



## 9、将下面异步代码使用Promise改进？

```
setTimeout(function() {
	var a = 'hello'
	setTimeout(function() {
		var b = 'lagou'
		setTimeout(function() {
			var c = 'I ♥ U'
			console.log(a + b + c)
		}, 10)
	}, 10)
}, 10)
```

### 回答：

```
Promise.resolve('hello')
    .then(res => {
        return res + 'lagou'
    }).then(res => {
        let str = res + 'I ♥ U'
        console.log(str)
    })
```



## 10、请简述TypeScript与Javascript之间的关系？

### 回答：

```
1、TypeScript是Javascript的超集
2、Typescript包含了Javascript、类型系统和对ES6+的支持
3、Typescript最终会被编译为Javascript
4、任何Javascript运行环境都能被Typescript支持
```



## 11、请谈谈你所认为的TypeScript的优缺点？

### 回答：

```
优点：
1、生态更加健全和完善
2、微软的开发工具对TS的支持非常友好
3、属于强类型语言
4、TypeScript是渐进式编程语言

缺点：
1、TS多了很多Javascript没有的概念，比如泛型等，提高了学习成本
2、针对周期短的项目，使用TypeScript会增加一定的成本
```

