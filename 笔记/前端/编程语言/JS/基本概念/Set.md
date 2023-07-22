定义：一组值的集合
特点
	1. **无序** 
		1. 操作数据比有序少许多
	2. 不能**重复** 
	3. 可遍历
		1. set.forEach
# 创建
```js
const set = new Set([10, 20, 30]) 
```
# 方法
set.add()。返回集合的实例，所以可以将多个添加操作连缀起来
set.delete
set.clear
set.has
size

没有get方法。只能查询，无法取出？
# 迭代
Set会维护值插入时的顺序,支持按顺序迭代
使用set.values()
```js
const s = new Set(["val1", "val2", "val3"]);

alert(s.values === s[Symbol.iterator]); // true
alert(s.keys === s[Symbol.iterator]);   // true

for (let value of s.values()) {
  alert(value);
}
```

与[[Array]]的区别？
	1. 无序
	2. 不能重复
	3. API不同