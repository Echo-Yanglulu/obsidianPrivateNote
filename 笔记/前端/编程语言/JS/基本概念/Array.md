# 概述
定义
	1. 使用==整数==作为元素索引的[[类列表对象]]，一种[[Object]]。
		1. 使用<u>字符串</u>作为索引的叫[[关联数组]]。
		2. 通过方括号或点语法，通过==非整数==索引读写数组时，读写的实际上是**数组对象**的**属性集合**[^1]上的变量。
	2. 值的有序集合。值叫做“元素”，元素的位置是[[Number]]，叫做“索引”
原型中提供了操作方法
## 特性
1. 数组
	1. 动态：数组的长度，元素的[[数据类型]]不固定。
	2. 稀疏：数据在内存中可以不连续：JS数组不一定是密集型的。
2. 值
	1. 无类型限制：元素可以是任何类型
3. 索引
	1. 基于0，使用32位数值。最大可能索引：2\^32 -1
4. 

如果以上特性不适合使用场景，可使用[[TypedArray]] 
# 创建
## 字面量
## 构造器
new Array()
# 访问
## 方式
### []
不能arr.2，因为[[Number]]类型开头的键必须使用[]访问
执行arr[2]时，[[JS解释器]]会调用toString方法隐式转换成字符串
	1. arr['2']与arr['02']可能是不同位置的元素【？？？不是肯定吗。说】
## 结果
访问的索引不存在：不会报错，而是返回undefined
	1. 无法分辨本来就是undefined，还是索引不存在
# [[属性]]
## [[静态属性]]

## 实例属性
1. length
	1. 返回一个数组实例中元素的个数
	2. 永远大于最大的下标
	3. [[JS解释器]]会动态修改length的值
2. 
# 方法
## 静态方法
Array.from
Array.of
Array.isArray
## 实例方法
### 遍历
some：是否某个符合条件
every：是否所有符合条件
filter：找到符合条件的元素
map：对每个元素进行批处理
forEach
reduce
```js
// 应用场景：每个元素的操作，与前面元素有关
// 1. 统计：每个/某个元素出现的次数；
let names = ['小猪课堂', '张三', '李四', '王五', '小猪课堂']
let countedNames = names.reduce(function (allNames, name) {
  // 判断当前数组元素是否出现过
  if (name in allNames) {
    allNames[name]++
  } else {
    allNames[name] = 1
  }
  return allNames
}, {})
console.log(countedNames); // {小猪课堂: 2, 张三: 1, 李四: 1, 王五: 1}
// 2. 把二维数组打平，成为一维
// 3. 求和，字符串累加，数值累乘
```
reduceRight
### 转换
把其他类型转换为数组
1. from：[[类数组对象]] 
2. of：参数列表
转为其他类型
1. toString（默认以逗号为连接符号）
2. toLocaleString
3. join（自定义连接符号）
### 增删
push：尾增，返回增加后长度
pop：尾删，返回删除元素
unshift：头增，返回增加后长度
shift：头删，返回删除元素
splice(索引，删除个数，增加的元素)：
	1. 从某个索引开始，同时增删元素
	2. 返回值：被删除元素组成的数组
fill：新值填充
copyWithin：旧值填充
slice：截取。浅拷贝部分元素，组成新数组
concat：融合。数组后追加**数组/值**，返回新数组
### 修改
flat
flatMap
sort。升序return a-b
reverse
entries
values
### 查找
find：查找符合条件的第一个元素
findIndex
findLast
findLastIndex
at
indexOf

### 问题
1. 哪些会修改原数组？7个
	1. push, pop, shift, unshift，splice，sort，reverse，
2. 哪些是[[纯函数]]？

[^1]: 数组对象上一组属性的集合