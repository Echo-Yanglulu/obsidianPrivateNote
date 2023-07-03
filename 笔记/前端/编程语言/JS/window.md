# 概述
1. 意义是BOM的*核心*：浏览器的实例
2. 在浏览器中有两个*身份*
	1. ES中的**[[Global]]对象** 
		1. 很多浏览器API和构造函数都以window对象的属性的形式暴露。
			1. 网页中定义的所有变量都以window作为其Global对象，都可访问其上定义的parseInt()等全局方法
		2. 由于浏览器实现不同，不同浏览器的window对象的属性可能差异很大
	2. 浏览器窗口的**JS接口** 
# 属性
1. 特殊值
	1. undefined	特殊值undefined
	2. NaN	特殊值NaN
	3. Infinity	特殊值Infinity
2. 原生引用类型的构造函数
	1. Function	Function的构造函数
	2. Boolean	Boolean的构造函数
	3. String	String的构造函数
	4. Number	Number的构造函数
	5. Symbol	Symbol的伪构造函数
	6. Array	Array的构造函数
	7. Object	Object的构造函数
	8. Date	Date的构造函数
	9. RegExp	RegExp的构造函数
	10. Error	Error的构造函数
	11. EvalError	EvalError的构造函数
	12. RangeError	RangeError的构造函数
	13. ReferenceError	ReferenceError的构造函数
	14. SyntaxError	SyntaxError的构造函数
	15. TypeError	TypeError的构造函数
	16. URIError	URIError的构造函数
3. [[DOM|document]] 
4. [[navigator]] 
6. [[screen]] 
5. [[location]] 
7. [[History]] 




[^1]: 某个元素的content+padding