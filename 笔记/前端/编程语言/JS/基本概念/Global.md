ECMAScript中*最特别*的对象，因为代码不会显式地访问它。ECMA-262规定Global对象为一种*兜底对象*，*针对*的是不属于任何对象的属性和方法。
事实上，不存在全局变量或全局函数这种东西：全局作用域中定义的变量和函数都会变成Global对象的属性 。
# 方法
isNaN()
isFinite()
parseInt()
parseFloat()
## [[URL]]编码方法

## eval


## [[window]] 对象
ECMA-262没有规定直接访问Global对象的方式，但浏览器将window对象实现为**Global对象的代理**。
	1. 所有全局作用域中声明的变量和函数都变成了window的属性
# 属性
1. 特殊值
	1. undefined	特殊值undefined
	2. NaN	特殊值NaN
	3. Infinity	特殊值Infinity
2. 原生引用类型构造函数
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