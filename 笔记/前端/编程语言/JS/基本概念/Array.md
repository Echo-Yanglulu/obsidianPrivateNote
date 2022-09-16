# 概述
定义
	1. 使用==整数==作为元素索引的[[类列表对象]]，一种[[Object]]。
		1. 使用<u>字符串</u>作为索引的叫[[关联数组]]。
		2. 通过方括号或点语法，通过==非整数==索引读写数组时，读写的实际上是**数组对象**的**属性集合**[^1]上的变量。
原型中提供了操作方法
特性
	1. 动态：数组的长度，元素的[[数据类型]]不固定。
	2. 数据在内存中可以不连续：JS数组不一定是密集型的。
如果以上特性不适合使用场景，可使用[[TypedArray]] 
# 创建
## 字面量
## new Array()
# 访问
## 方式
### []
不能arr.2，因为[[Number]]类型开头的键必须使用[]访问
执行arr[2]时，[[JS解释器]]会调用toString方法隐式转换成字符串
	1. arr['2']与arr['02']可能是不同位置的元素【？？？不是肯定吗。说】
## 结果
访问的索引不存在：不会报错，而是返回undefined
	1. 无法分辨本来就是undefined，还是索引不存在
# 属性
实例属性（什么意思？跟原型属性区分？只有实例才有这个属性？）
1. length
	1. 返回一个数组实例中元素的个数
	2. 永远大于最大的下标
	3. [[JS解释器]]会动态修改length的值
2. 
# 方法
35个

forEach
some
every
filter
map

push尾增，返回长度
unshift
pop删尾，返回删除元素
shift删头，返回删除元素
slice复制
splice增删

from
of
isArray
flat
copyWithin
sort
reverse

join
flat
flatMap
concat
fill
reduce
reduceRight

entries
values

toString
toLocaleString

find
findIndex
findLast
findLastIndex
at
indexOf

[^1]: 数组对象上一组属性的集合