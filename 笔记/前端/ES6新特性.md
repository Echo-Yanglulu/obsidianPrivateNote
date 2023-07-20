# 概述
## 相关
[ES6 入门教程](https://es6.ruanyifeng.com/#docs/promise) 
# 对象维度
## 变量
globalThis
## [[数据类型]] 
[[BigInt]] 
## [[Symbol]] 
Symbol.prototype.description
## [[String]] 
String.prototype.padStart()
String.prototype.{trimStart, trimEnd}
String.prototype.matchAll()
String.prototype.replaceAll()
## 对象
Object.entries
Object.values
Object.fromEntries
Object.getOwnPropertyDescriptors
Trailing commas
## 数组
includes()
[[Array]].prototype.{flat, flatMap}
Array.prototype.sort() is now required to be stable
## 迭代
Async iterators 异步迭代器
## 函数
箭头函数
异步函数
修订 Function.prototype.toString()
## [[Promise]] 
Promise.prototype.finally
Promise.allSettled
Promise.any
## [[JSON]] 
JSON.stringify() 的增强力
## [[操作符]] 
1. Exponentiation Operator：相当于[[Math]].pow
2. 可选链 Optional chaining
3. 空值合并运算符（Nullish coalescing Operator）
4. 逻辑运算符和赋值表达式（&&=，||=，??=）
5. 数字分隔符
6. 剩余属性与扩展属性
## [[模块]] 
Dynamic import（按需 import）
# 版本维度
## ES2016（ES7）
1. Array.prototype.includes
2. Exponentiation Operator
## ES2017（ES8）
1. Async functions
2. Object.entries
3. Object.values
4. Object.getOwnPropertyDescriptors
5. Trailing commas
6. String.prototype.padStart()
## ES2018（ES9）
1. Async iterators 异步迭代器
2. Object rest properties 剩余属性
3. Object spread properties 扩展属性
4. Promise.prototype.finally
## ES2019（ES10）
1. Array.prototype.{flat, flatMap}扁平化嵌套数组
6. Array.prototype.sort() is now required to be stable
3. String.prototype.{trimStart, trimEnd}
4. Symbol.prototype.description
2. Object.fromEntries
5. Optional catch binding
7. JSON.stringify() 的增强力
8. 修订 Function.prototype.toString()
## ES2020（ES11）
1. 空值合并运算符（Nullish coalescing Operator）
2. 可选链 Optional chaining
3. globalThis
4. BigInt
5. String.prototype.matchAll()
6. Promise.allSettled()
7. Dynamic import（按需 import）
## ES 2021（ES12）
1. 逻辑运算符和赋值表达式（&&=，||=，??=）
2. String.prototype.replaceAll()
3. 数字分隔符
4. Promise.any

# 相关
[微信公众平台](https://mp.weixin.qq.com/s/GbSNPeDhllfsSP6y1LIdNg) 