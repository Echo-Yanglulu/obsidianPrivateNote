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
some
every
filter
map：返回新数组
forEach
reduce
reduceRight

### 增删
push：尾增，返回增加后长度
pop：尾删，返回删除元素
unshift：头增，返回增加后长度
shift：头删，返回删除元素
slice：复制。浅拷贝部分元素，组成新数组
splice(索引，删除个数，增加的元素)：从某个索引开始，增删元素
fill
concat：数组后追加数组，返回新数组【数组融合】

from
of
copyWithin

### 修改
flat
flatMap
sort
reverse
toString（默认以逗号为连接符号）
toLocaleString
join（自定义连接符号）

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
1. 哪些会修改原数组？
	1. push, pop, shift, unshift
2. 哪些是[[纯函数]]？

[^1]: 数组对象上一组属性的集合