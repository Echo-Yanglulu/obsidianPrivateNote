# 概述
遍历器。
1. 定义：一种接口，为各种不同的数据结构提供统一的访问机制
	1. 任何数据结构只要部署 Iterator 接口，就可以完成遍历操作（即*依次*处理该数据结构的所有成员）
2. 作用
	1. 为各种数据结构，提供一个统一的、简便的*访问*接口
	2. 使得数据结构的成员能够按某种次序*排列* 
	3. ES6 创造了一种新的遍历命令for...of*循环*，Iterator 接口主要供for...of消费
3. 遍历过程
	1. 创建一个指针对象，指向当前数据结构的起始位置。也就是说，遍历器对象本质上，就是一个指针对象。
	2. 第一次调用指针对象的next方法，可以将指针指向数据结构的第一个成员。
	3. 第二次调用指针对象的next方法，指针就指向数据结构的第二个成员。
	4. 不断调用指针对象的next方法，直到它指向数据结构的结束位置。
4. 机制
	1. 每一次调用next方法，都会返回数据结构的当前成员的信息。具体来说，就是返回一个包含value和done两个属性的对象。
		1. value属性是当前成员的值，done属性是一个布尔值，表示遍历是否结束

## 案例
```js
var it = makeIterator(['a', 'b']);

it.next() // { value: "a", done: false }
it.next() // { value: "b", done: false }
it.next() // { value: undefined, done: true }

function makeIterator(array) {
  var nextIndex = 0;
  return {
    next: function() {
      return nextIndex < array.length ?
        {value: array[nextIndex++], done: false} :
        {value: undefined, done: true};
    }
  };
}
```
# Iterator接口
该接口的目的，就是为不同的数据结构提供统一的访问机制（即for/of循环）
	使用for...of循环遍历某种数据结构时，该循环会自动去寻找 Iterator 接口
意义
	1. 可遍历。只要一种数据结构存在Iterator接口，就具备了“可遍历”的特性

## 默认Iterator接口
默认的 Iterator 接口部署在数据结构的`Symbol.iterator`属性
	1. 本身是一个函数，就是当前数据结构默认的遍历器生成函数

## 字符串的Iterator接口
字符串是一个类似数组的对象，也原生具有 Iterator 接口。

可以覆盖原生的Symbol.iterator方法，达到修改遍历器行为的目的
# 调用Iterator接口的场景
## [[解构赋值]] 
## 扩展操作符
## yield \*

## 其它
for...of
Array.from()
Map(), Set(), WeakMap(), WeakSet()（比如new Map(\[\['a',1],\['b',2]])）
Promise.all()
Promise.race()