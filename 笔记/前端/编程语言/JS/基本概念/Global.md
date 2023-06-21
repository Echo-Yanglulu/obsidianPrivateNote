ECMAScript中*最特别*的对象，因为代码不会显式地访问它。ECMA-262规定Global对象为一种*兜底对象*，*针对*的是不属于任何对象的属性和方法。
事实上，不存在全局变量或全局函数这种东西：全局作用域中定义的变量和函数都会变成Global对象的属性 。
# 方法
isNaN()
isFinite()
parseInt()
parseFloat()
## [[URL]]编码
encodeURI()和encodeURIComponent()方法用于编码统一资源标识符（URI），以便传给浏览器。
目的：使用URI编码方法来*编码*URI可以让*浏览器能够理解*它们，同时又以特殊的UTF-8编码*替换*掉所有无效字符
	1. 有效的URI：不能包含某些字符，比如空格
### ecnodeURI()
对整个URI进行编码
### encodeURIComponent()
对编码URI中单独的组件
## eval()
最后一个方法，也是整个ECMAScript语言中最强大的方法
本质：一个完整的ECMAScript解释器，它接收一个参数，一个要执行的ECMAScript（JavaScript）字符串。
机制
	1. 将参数解释为实际的ECMAScript[[语句]]，然后将其插入到该位置
	2. 通过eval()执行的代码属于该调用所在上下文，被执行的代码与上下文拥有*相同的作用域链*。这意味着定义在包含上下文中的变量可以在eval()调用内部被引用，`let msg = "hello world";eval("console.log(msg)");  // "hello world"`【**eval不形成新的作用域链**】
		1. 在eval中声明了一个变量，可在下方使用
# 属性
Global对象有很多属性
	1. 特殊值
	2. 原生引用类型的构造函数
## [[window]] 对象
ECMA-262没有规定直接访问Global对象的方式，但浏览器将window对象*实现*为**Global对象的代理**。
	1. 所有全局作用域中声明的变量和函数都变成了window的属性