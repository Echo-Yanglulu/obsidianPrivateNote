# 概述
特点
	1. 值的[[数据类型]]。只能是 Object 或者继承自 Object 的类型，尝试使用非对象设置值会抛出 TypeError
	2. 弱引用。这些值不是正式的引用，对值的引用不会阻止垃圾回收
	3. 不可迭代。WeakSet中的值任何时候都可能被销毁，所以没必要提供迭代其值的能力
API
1. add
	1. 返回弱集合实例，因此可以把多个操作连缀起来
2. delete
3. has
# 应用[^1]：自动清空的垃圾桶
## 给对象打标签
如果使用set。当DOM元素被删除时，set中还保留着引用，所以垃圾回收程序不能回收。
```js
const disabledElements = new Set();
const loginButton = document.querySelector('#login');
// 通过加入对应集合，给这个节点打上“禁用”标签
disabledElements.add(loginButton);
```
为了回收被**删除元素**的内存，可使用该引用类型
```js
const disabledElements = new WeakSet();

const loginButton = document.querySelector('#login');

// 通过加入对应集合，给这个节点打上“禁用”标签
disabledElements.add(loginButton);
```
当其中元素从DOM中删除，垃圾回收程序就能立即释放其内存

[^1]: 相比于WeakMap实例，WeakSet实例的用处没有那么大