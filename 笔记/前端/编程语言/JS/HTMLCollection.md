特性
	1. 实时更新
	2. 取得元素的*数量*同样可以通过length属性得知
	3. *取得*特定的元素。对HTMLCollection对象，中括号可接收数值索引，也可接收字符串索引[^1]
		1. item([[Number]])。与NodeList对象一样，也可以使用中括号或item([[Number]])方法从HTMLCollection
		2. namedItem([[String]])。取出其中name属性匹配的元素。

[^1]: 在后台，数值索引会调用item()，字符串索引会调用namedItem()