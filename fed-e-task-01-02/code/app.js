// -----------------------------------------once
// function once(fn) {
//     let done = false
//     return function() {
//         if(!done) {
//             done = true
//             return fn.apply(this, arguments)
//         }
//     }
// }
// let pay = once(function(money) {
//     console.log('pay:', money)
// })
// pay(5)
// pay(5)
// pay(5)
// pay(5)



// -----------------------------------------
//map
// const map = function(array, fn) {
//     let results = []
//     for(let value of array) {
//         results.push(fn(value))
//     }
//     return results
// }
// let arr = [1, 2, 3, 4]
// console.log(map(arr, v => v * v))

// every
// const every = function(array, fn) {
//     let result = true
//     for(let value of array) {
//         result = fn(value)
//         if(!result) {
//             break
//         }
//     }
//     return result
// }
// console.log(every([9, 12, 14], v => v > 10))

// some
// const some = (array, fn) => {
//     let result = false
//     for(let value of array) {
//         if(fn(value)) {
//             result = true
//             break
//         }
//     }
//     return result
// }
// console.log(some([1, 3, 6, 9], v => v % 2 === 0))

// 闭包案例
// function makePower(power) {
//     return function(number) {
//         return Math.pow(number, power)
//     }
// }
// let power2 = makePower(2)
// let power3 = makePower(3)
// console.log(power2(4))
// console.log(power3(4))

// 纯函数
// let array = [1, 2, 3, 4, 5]
// console.log(array.slice(0, 3))  // [1, 2, 3]
// console.log(array.slice(0, 3))  // [1, 2, 3]
// console.log(array.slice(0, 3))  // [1, 2, 3]

// 不纯函数
// console.log(array.splice(0, 3))  // [1, 2, 3]
// console.log(array.splice(0, 3))  // [4, 5]
// console.log(array.splice(0, 3))  // []

// 记忆函数
// const _ = require('lodash')
// function getArea(r) {
//     console.log(r)
//     return Math.PI * r * r
// }
// let getAreaWithMemory = _.memoize(getArea)
// console.log(getAreaWithMemory(4))
// console.log(getAreaWithMemory(4))
// console.log(getAreaWithMemory(4))
// console.log(getAreaWithMemory(4))
// console.log(getAreaWithMemory(4))

// 模拟memoize
// function memoize(fn) {
//     let cache = {}
//     return function() {
//         let key = JSON.stringify(arguments)
//         cache[key] = cache[key] || fn.apply(fn, arguments)
//         return cache[key]
//     }
// }
// let getAreaWithMemory = memoize(getArea)
// console.log(getAreaWithMemory(4))
// console.log(getAreaWithMemory(4))
// console.log(getAreaWithMemory(4))

// function checkAge(age) {
//     let min = 18
//     return age >= min
// }

// const _ = require('lodash')
// function getSum(a, b, c) {
//     return a + b + c
// }
// const curried = _.curry(getSum)
// console.log(curried(1, 2, 3))
// console.log(curried(1)(2, 3))
// console.log(curried(1, 2)(3))


// const match = _.curry(function (reg, str) {
//     return str.match(reg)
// })

// const haveSpace = match(/\s+/g)
// console.log(haveSpace('hello world'))
// const haveNumber = match(/\d+/g)
// console.log(haveNumber('123abc'))

// const filter = _.curry(function(func, array) {
//     return array.filter(func)
// })
// console.log(filter(haveSpace, ['Hello World', 'Hello_World']))

// const findSpace = filter(haveSpace)
// console.log(findSpace(['Hello World', 'Hello_World']))


// function curry(func) {
//     return function curriedFn(...args) {
//         // 判断实参和形参的个数
//         if(args.length < func.length) {
//             return function() {
//                 return curriedFn(...args.concat(Array.from(arguments)))
//             }
//         }else {
//             return func(...args)
//         }
//     }
// }
// function getSum(a, b, c) {
//     return a + b + c
// }
// const curried = curry(getSum)
// console.log(curried(1, 2, 3))
// console.log(curried(1)(2, 3))
// console.log(curried(1, 2)(3))


// flowright 实现
// function compose(...args) {
//     return function(value) {
//         return args.reverse().reduce(function(acc, fn) {
//             return fn(acc)
//         }, value)
//     }
// }
// const compose = (...args) => value => args.reverse().reduce((acc, fn) => fn(acc), value)

// const reverse = arr => arr.reverse()
// const first = arr => arr[0]
// const toUpper = s => s.toUpperCase()

// const f = compose(toUpper, first, reverse)
// console.log(f(['one', 'two', 'three']))


// Point Free
// const fp = require('lodash/fp')
// const f = fp.flowRight(fp.replace(/\s+/g, '_'), fp.toLower)
// console.log(f('Hello     World'))

// const firstLetterToUpper = fp.flowRight(fp.join('. '), fp.map(fp.first), fp.map(fp.toUpper), fp.split(' '))
// const firstLetterToUpper = fp.flowRight(fp.join('. '), fp.map(fp.flowRight(fp.first, fp.toUpper)), fp.split(' '))
// console.log(firstLetterToUpper('world wild web'))

// 函子
// class Container {
//     static of(value) {
//         return new Container(value)
//     }
//     constructor(value) {
//         this._value = value
//     }
//     map(fn) {
//         return Container.of(fn(this._value))
//     }
// }
// let r = new Container(5)
//     .map(x => x + 1)
//     .map(x => x * x)
// console.log(r)

// let r1 = Container.of(5)
//     .map(x => x + 2)
//     .map(x => x * x)
// console.log(r1)

// let r = Container.of(null)
//     .map(x => x.toUpperCase())


// MayBe 函子
// class MayBe {
//     constructor(value) {
//         this._value = value
//     }

//     static of(value) {
//         return new MayBe(value)
//     }

//     map(fn) {
//         return this.isNothing() ? MayBe.of(null) : MayBe.of(fn(this._value))
//     }

//     isNothing() {
//         return this._value === null || this._value === undefined
//     }
// }
// let r = MayBe.of('Hello World')
//     .map(x => x.toUpperCase())
// let r = MayBe.of(null)
//     .map(x => x.toUpperCase())
// let r = MayBe.of('Hello World')
//     .map(x => x.toUpperCase())
//     .map(x => null)
//     .map(x => x.split(' '))
// console.log(r)


// Either函子
// class Left {
//     constructor(value) {
//         this._value = value
//     }

//     static of(value) {
//         return new Left(value)
//     }

//     map(fn) {
//         return this
//     }
// }

// class Right {
//     constructor(value) {
//         this._value = value
//     }

//     static of(value) {
//         return new Right(value)
//     }

//     map(fn) {
//         return Right.of(fn(this._value))
//     }
// }

// // let r1 = Right.of(12).map(x => x + 2)
// // let r2 = Left.of(12).map(x => x + 2)
// // console.log(r1)
// // console.log(r2)

// function parseJSON(str) {
//     try {
//         return Right.of(JSON.parse(str))
//     } catch(e) {
//         return Left.of({error: e.message})
//     }
// }
// // let r = parseJSON('{name: zhangsan}')
// let r = parseJSON('{"name": "zhangsan"}')
//             .map(x => x.name.toUpperCase())
// console.log(r)



// IO函子
// const fp = require('lodash/fp')
// class IO {
//     constructor(fn) {
//         this._value = fn
//     }

//     static of(value) {
//         return new IO(function() {
//             return value
//         })
//     }

//     map(fn) {
//         return new IO(fp.flowRight(fn, this._value))
//     }
// }
// let r = IO.of(process).map(p => p.execPath)
// console.log(r._value())

// Task函子
// const fs = require('fs')
// const { task } = require('folktale/concurrency/task')
// const { split, find } = require('lodash/fp')
// function readFile(filename) {
//     return task(resolver => {
//         fs.readFile(filename, 'utf-8', (err, data) => {
//             if(err) resolver.reject(err)
//             resolver.resolve(data)
//         })
//     })
// }
// readFile('package.json')
//     .map(split('\n'))
//     .map(find(x => x.includes('nodemon')))
//     .run()
//     .listen({
//         onRejected: err => {
//             console.log(err)
//         },
//         onResolved: value => {
//             console.log(value)
//         }
//     })

// IO Monad函子
// const fs = require('fs')
// const fp = require('lodash/fp')

// class IO {
//     constructor(fn) {
//         this._value = fn
//     }

//     static of(value) {
//         return new IO(function() {
//             return value
//         })
//     }

//     map(fn) {
//         return new IO(fp.flowRight(fn, this._value))
//     }

//     join() {
//         return this._value()
//     }

//     flatMap(fn) {
//         return this.map(fn).join()
//     }
// }

// let readFile = function(filename) {
//     return new IO(function() {
//         return fs.readFileSync(filename, 'utf-8')
//     })
// }
// let print = function(x) {
//     return new IO(function() {
//         return x
//     })
// }
// let r = readFile('package.json')
//             // .map(x => x.toUpperCase())
//             // .map(fp.toUpper)
//             .flatMap(print)
//             .join()
// console.log(r)
