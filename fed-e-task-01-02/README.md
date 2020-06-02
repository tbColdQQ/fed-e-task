## 简答题

### 1、描述引用计数的工作原理和优缺点

**原理：**

通过设置引用计数器维护当前对象的引用数，从而判断该对象的引用数值是否为0。当引用数为0时回收对象

**优点：**

- 发现垃圾时立即回收
- 最大限度减少程序的暂停

**缺点：**

- 无法回收循环引用的对象
- 时间开销大
- 资源消耗较大



### 2、描述标记整理算法的工作流程

标记整理算法可以看作标记清除算法的增强。

1.  遍历所有对象并标记活动的对象
2. 整理移动对象位置，减少空间碎片化
3. 遍历所有对象清除没有标记的对象
4. 回收相应的空间



### 3、描述V8中新生代存储区垃圾回收的流程

1. 回收过程采用复制算法+标记整理算法
2. 新生代内存区分为两个等大小的空间
3. 使用空间为From，空闲空间为To
4. 活动对象存储在From空间
5. 回收时，From空间的活动对象标记整理后拷贝到To空间
6. From与To交换空间并完成释放





### 4、描述增量标记算法在何时使用，及工作原理

**何时使用：**将新生代区域内的对象移动至老生代区域时，而且老生代区域的可用空间不足以存放新生代中将要移动的对象时采用增量标记算法。

**工作原理：**

![image-20200602223239071](..\images\image-20200602223239071.png)

将一整段的垃圾回收操作切成多段，这样程序运行和垃圾回收将会交替进行

1. 遍历对象并进行标记
2. 停止标记，执行程序
3. 继续对对象进行标记
4. 停止标记，继续执行程序
5. 如此往复，直至标记完成、程序执行完毕
6. 最后清除标记的对象



## 代码题1

### 基于以下代码完成下面四个练习

```javascript
const fp = require('lodash/fp')
// 数据
// horsepower 马力， dollar_value 价格， in_stock 库存
const cars = [
    {
        name: 'Ferrari FF',
        horsepower: 660,
        dollar_value: 700000,
        in_stock: true
    },
    {
        name: 'Spyker C12 Zagato',
        horsepower: 650,
        dollar_value: 648000,
        in_stock: false
    },
    {
        name: 'Jaguar XKR-S',
        horsepower: 550,
        dollar_value: 132000,
        in_stock: false
    },
    {
        name: 'Audi R8',
        horsepower: 525,
        dollar_value: 114200,
        in_stock: false
    },
    {
        name: 'Aston Martin One-77',
        horsepower: 750,
        dollar_value: 1850000,
        in_stock: true
    },
    {
        name: 'Pagani Huayra',
        horsepower: 700,
        dollar_value: 1300000,
        in_stock: false
    }
]
```

#### 练习1：使用函数组合fp.flowRight()重新实现下面这个函数

```javascript
let isLastInStock = function(cars) {
	let last_car = fp.last(cars)
	return fp.prop('in_stock', last_car)
}
```

**回答：**

```javascript
let isLastInStock2 = fp.flowRight(fp.prop('in_stock'), fp.last)
console.log(isLastInStock2(cars))
```



#### 练习2：使用fp.flowRight()、fp.prop()和fp.first()获取第一个car的name

**回答：**

```javascript
let getFirstCarName = fp.flowRight(fp.prop('name'), fp.first)
console.log(getFirstCarName(cars))
```



#### 练习3：使用帮助函数_average重构averageDollarValue，使用函数组合的方式实现

```javascript
let _average = function(xs) {
	return fp.reduce(fp.add, 0, xs) / xs.length
}
let averageDollarValue = function(cars) {
    let dollar_values = fp.map(function(car) {
        return car.dollar_value
    }, cars)
    return _average(dollar_values)
}
```

**回答：**

```javascript
let averageDollarValue2 = fp.flowRight(_average, fp.map(fp.prop('dollar_value')))
console.log(averageDollarValue2(cars))
```



#### 练习4：使用flowRight写一个撒尼提则Names()函数，返回一个下划线连接的小写字符串，把数组中的name转换为这种形式：例如：sanitizeNames(['Hello World']) => ['hello_world']

```javascript
let underscore = fp.replace(/\W+/g, '_')
```

**回答：**

```javascript
let sanitizeNames = fp.flowRight(fp.map(fp.flowRight(underscore, fp.toLower, fp.prop('name'))))
console.log(sanitizeNames(cars))
```



## 代码题2

### 基于下面提供的代码，完成后续的四个练习

```javascript
// support.js
class Container {
    static of (value) {
        return new Container(value)
    }
    constructor(value) {
        this._value = value
    }
    map(fn) {
        return Container.of(fn(this._value))
    }
}

class Maybe {
    static of (x) {
        return new Maybe(x)
    }
    isNothing() {
        return this._value === null || this._value === undefined
    }
    constructor(x) {
        this._value = x
    }
    map(fn) {
        return this.isNothing() ? this : Maybe.of(fn(this._value))
    }
}
module.exports = {
    Maybe,
    Container
}
```



#### 练习1：使用fp.add(x, y)和fp.map(f, x)创建一个能让functor里的值增加的函数ex1

```javascript
const fp = require('lodash/fp')
const { Maybe, Container } = require('./support')
let maybe = Maybe.of([5, 6, 1])
```

**回答：**

```javascript
let ex1 = maybe.map(x => fp.map(fp.add(1), x))
console.log(ex1)
```



#### 练习2：实现一个函数ex2，能够使用fp.first获取列表的第一个元素

```javascript
const fp = require('lodash/fp')
const { Maybe, Container } = require('./support')
let xs = Container.of(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do'])
```

**回答：**

```javascript
let ex2 = xs.map(x => fp.first(x))
console.log(ex2)
```



#### 练习3：实现一个函数ex3，使用safeProp和fp.first找到user的名字的首字母

```javascript
const fp = require('lodash/fp')
const { Maybe, Container } = require('./support')
let safeProp = fp.curry(function(x, o) {
	return Maybe.of(o[x])
})
let user = {id: 2, name: 'Albert'}
```

**回答：**

```javascript
let ex3 = safeProp('name', user).map(x => fp.first(x.split('')))
console.log(ex3)
```



#### 练习4：使用Maybe重写ex4，不要有if语句

```javascript
const fp = require('lodash/fp')
const { Maybe, Container } = require('./support')
let ex4 = function(n) {
	if(n) {
		return parseInt(n)
	}
}
```

**回答：**

```javascript
let ex4 = test => Maybe.of(test).map(x => parseInt(x))
console.log(ex4(undefined))
```

