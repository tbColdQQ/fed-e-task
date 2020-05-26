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
const fp = require('lodash/fp')
// const f = fp.flowRight(fp.replace(/\s+/g, '_'), fp.toLower)
// console.log(f('Hello     World'))

// const firstLetterToUpper = fp.flowRight(fp.join('. '), fp.map(fp.first), fp.map(fp.toUpper), fp.split(' '))
const firstLetterToUpper = fp.flowRight(fp.join('. '), fp.map(fp.flowRight(fp.first, fp.toUpper)), fp.split(' '))
console.log(firstLetterToUpper('world wild web'))