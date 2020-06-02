
// const fp = require('lodash/fp')
// const cars = [
//     {
//         name: 'Ferrari FF',
//         horsepower: 660,
//         dollar_value: 700000,
//         in_stock: true
//     },
//     {
//         name: 'Spyker C12 Zagato',
//         horsepower: 650,
//         dollar_value: 648000,
//         in_stock: false
//     },
//     {
//         name: 'Jaguar XKR-S',
//         horsepower: 550,
//         dollar_value: 132000,
//         in_stock: false
//     },
//     {
//         name: 'Audi R8',
//         horsepower: 525,
//         dollar_value: 114200,
//         in_stock: false
//     },
//     {
//         name: 'Aston Martin One-77',
//         horsepower: 750,
//         dollar_value: 1850000,
//         in_stock: true
//     },
//     {
//         name: 'Pagani Huayra',
//         horsepower: 700,
//         dollar_value: 1300000,
//         in_stock: false
//     }
// ]
// let isLastInStock = function(cars) {
// 	let last_car = fp.last(cars)
// 	return fp.prop('in_stock', last_car)
// }
// let isLastInStock2 = fp.flowRight(fp.prop('in_stock'), fp.last)
// console.log(isLastInStock2(cars))

// let getFirstCarName = fp.flowRight(fp.prop('name'), fp.first)
// console.log(getFirstCarName(cars))

// let _average = function(xs) {
// 	return fp.reduce(fp.add, 0, xs) / xs.length
// }
// let averageDollarValue = function(cars) {
//     let dollar_values = fp.map(function(car) {
//         return car.dollar_value
//     }, cars)
//     return _average(dollar_values)
// }
// let averageDollarValue2 = fp.flowRight(_average, fp.map(fp.prop('dollar_value')))
// console.log(averageDollarValue(cars))
// console.log(averageDollarValue2(cars))
// let underscore = fp.replace(/\W+/g, '_')
// console.log(underscore('Hello World'))
// let sanitizeNames = fp.flowRight(fp.map(fp.flowRight(underscore, fp.toLower, fp.prop('name'))))
// console.log(sanitizeNames(cars))


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
const fp = require('lodash/fp')
// let maybe = Maybe.of([5, 6, 1])
// let ex1 = maybe.map(x => fp.map(fp.add(1), x))
// console.log(ex1)

// let xs = Container.of(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do'])
// let ex2 = xs.map(x => fp.first(x))
// console.log(ex2)

// let safeProp = fp.curry(function(x, o) {
// 	return Maybe.of(o[x])
// })
// let user = {id: 2, name: 'Albert'}
// let ex3 = safeProp('name', user).map(x => fp.first(x.split('')))
// console.log(ex3)

// let ex4 = function(n) {
// 	if(n) {
// 		return parseInt(n)
// 	}
// }
let ex4 = test => Maybe.of(test).map(x => parseInt(x))
console.log(ex4(undefined))