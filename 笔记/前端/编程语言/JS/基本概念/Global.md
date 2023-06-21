ECMAScript中*最特别*的对象，因为代码不会显式地访问它。ECMA-262规定Global对象为一种*兜底对象*，*针对*的是不属于任何对象的属性和方法。
事实上，不存在全局变量或全局函数这种东西：全局作用域中定义的变量和函数都会变成Global对象的属性 。
# 方法
isNaN()
isFinite()
parseInt()
parseFloat()
## [[URL]]编码方法

## eval


## [[window]] 

# 属性
1. 特殊值
	1. undefined	特殊值undefined
	2. NaN	特殊值NaN
	3. Infinity	特殊值Infinity
2. 原生引用类型构造函数
Function	Function的构造函数
Boolean	Boolean的构造函数
String	String的构造函数
Number	Number的构造函数
Symbol	Symbol的伪构造函数
Array	Array的构造函数
Object	Object的构造函数
Date	Date的构造函数
RegExp	RegExp的构造函数
Error	Error的构造函数
EvalError	EvalError的构造函数
RangeError	RangeError的构造函数
ReferenceError	ReferenceError的构造函数
SyntaxError	SyntaxError的构造函数
TypeError	TypeError的构造函数
URIError	URIError的构造函数