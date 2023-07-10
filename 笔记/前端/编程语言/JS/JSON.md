# 概述
JS对象简谱
	一种轻量的**数据交换格式**，用于数据的存储与传输。是[[XML]]的替换[^1]。
## 内容
作为 XML 替代的 JSON 数据格式，还讨论了浏览器原生解析和序列化 JSON，以及使用 JSON 时要注意的安全问题
## 标准
1. 字符串：必须是双引号
2. 键值对：数组或对象最后一个成员的后面，不能加逗号。
3. 键名
	1. [[String]] 
4. 值
	1. 原始类型的值只有4种：[[String]], [[Number]]（十进制）, boolean, null。
		1. 不能使用 NaN, Infinity, -Infinity 和 undefined
	2. 引用类型的值只能是 [[Array]] 或 [[Object]] 
# JSON.stringfy()
功能：转换成JSON字符串

# JSON.parse()

# toJSON方法
调用JSON.stringfy时，内部会先尝试调用对象内容的toJSON方法，对该方法的返回值进行序列化。

[[Date]]类定义了自己的toJSON方法。

[^1]: AJAX是XMLHttpRequest