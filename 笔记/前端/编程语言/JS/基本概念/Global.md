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
ECMA-262没有规定直接访问Global对象的方式，但浏览器将window对象*实现*为**Global对象的代理**。
	1. 所有全局作用域中声明的变量和函数都变成了window的属性