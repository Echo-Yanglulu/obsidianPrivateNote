# 概述
JS对象简谱
	1. 一种轻量的**数据交换格式**，用于数据的存储与传输。是 [[XML]] 的替换[^1]。
	2. 出现之后就迅速成为了**Web服务的事实序列化标准** 
背景：ECMAScript 5增加了JSON全局对象，正式引入解析JSON的能力
## 内容
作为 XML 替代的 JSON 数据格式，还讨论了浏览器原生解析和序列化 JSON，以及使用 JSON 时要注意的安全问题
## 规范
1. 键值对：数组或对象最后一个成员的后面，不能加逗号。
2. 键名
	1. [[String]] 必须是双引号
3. 值
	1. 值类型： boolean，[[String]], [[Number]]（十进制）, null
		1. [[Number]]不能使用 NaN, Infinity, -Infinity
	2. 引用类型。不能有变量或方法调用，不能有regexp, function, set, map等。[[数据类型]]
		1. [[Object]] 
		2. [[Array]] 
		3. [[TypedArray]] 
		4. [[Date]] 

## 特点
1. 可以直接被解析成可用的JavaScript对象。JavaScript语法的子集
	1. 与解析为DOM文档的XML相比，这个优势非常明显。使用数据非常方便：![[Pasted image 20230716201607.png]] 

## 与JS对象区别
1. JSON中没有变量、分号、属性名使用双引号
# 解析与序列化
## JSON.stringfy()
功能
	1. 将JavaScript值序列化为JSON字符串
		1. **删除**空格或缩进
		2. **省略**函数和原型成员
		3. **跳过**值为undefined的属性
	2. 传入无效JSON字符串：抛出错误

## JSON.parse()
1. 作用：将JSON解析为原生JavaScript值
2. 参数
	1. 要序列化的 [[Object]] 
	2. 过滤器，可以是数组或函数
	3. 结果JSON字符串的缩进
# toJSON方法
调用JSON.stringfy时，内部会先尝试调用对象内容的toJSON方法，对该方法的返回值进行序列化。

[[Date]]类定义了自己的toJSON方法。

[^1]: AJAX是XMLHttpRequest