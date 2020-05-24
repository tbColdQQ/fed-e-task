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
let array = [1, 2, 3, 4, 5]
console.log(array.slice(0, 3))  // [1, 2, 3]
console.log(array.slice(0, 3))  // [1, 2, 3]
console.log(array.slice(0, 3))  // [1, 2, 3]

// 不纯函数
console.log(array.splice(0, 3))  // [1, 2, 3]
console.log(array.splice(0, 3))  // [4, 5]
console.log(array.splice(0, 3))  // []