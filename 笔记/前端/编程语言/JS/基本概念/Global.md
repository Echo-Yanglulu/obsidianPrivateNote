# 概述
1. 目的：ECMA-262规定 Global 对象为一种*兜底对象*，*针对*的是不属于任何对象的值和方法。
	1. [[作用域]]：事实上，也不存在全局变量或全局函数。全局作用域中定义的变量和函数都会变成Global对象的属性。
2. 访问：ECMA-262没有规定直接**访问Global**对象的方式[^2]，在大多数*ECMAScript实现*中都无法直接访问。
	1. [[浏览器]]将[[window]]对象*实现*为**Global对象的代理**。
		1. 所有全局作用域中声明的变量和函数都变成了window的属性
# 属性
Global对象有很多属性
	1. 特殊值
	2. 原生引用类型的构造函数
# 方法
isNaN()、isFinite()、parseInt()、parseFloat()
## [[URL]]编码
[[计算机编码]] 
目的：为了得到浏览器能够理解的**有效URI**[^1]，需要
	1. 对URI进行编码
	2. 同时以特殊的UTF-8编码替换掉所有*无效字符* 
### ecnodeURI()
编码URI
	1. 假定任何*保留字符*都有特殊意义，所有不会编码属于*URL 组件*的特殊字符（11个），比如冒号、斜杠、问号、&、井号
```js
let uri = "http://www.wrox.com/illegal value.js#start";
console.log(encodeURI(uri));  
// "http://www.wrox.com/illegal%20value.js#start"         只有空格被替换为%20

// 解码
let uri = "http%3A%2F%2Fwww.wrox.com%2Fillegal%20value.js%23start";
decodeURI(uri)   
// http%3A%2F%2Fwww.wrox.com%2Fillegal value.js%23start    只有空格被还原
```
### encodeURIComponent()
字面意思：编码URI的组件
	1. 假定任何*保留字符*都代表普通文本，所以必须编码它们
	2. 会编码它发现的所有**非标准字符**【包括URL组件】
```js
let uri = "http://www.wrox.com/illegal value.js#start";
console.log(encodeURIComponent(uri));   
// "http%3A%2F%2Fwww.wrox.com%2Fillegal%20value.js%23start"
// 所有非字母字符都替换成了相应的编码形式。
let uri = "http%3A%2F%2Fwww.wrox.com%2Fillegal%20value.js%23start";
decodeURIComponent(uri)   
// http:// www.wrox.com/illegal value.js#start
// 输出了没有包含任何转义的字符串。（这个字符串不是有效的URL。）
```
*何时需要编码 URL 组件*？何时不需要？两种方式如何选择？
![[Pasted image 20230710091228.png]]
## eval()
意义：整个ECMAScript语言中最强大的方法
本质：**一个完整的ECMAScript解释器**，它接收一个参数，一个要执行的ECMAScript（JavaScript）字符串。
机制
	1. 解释并插入，不形成新的作用域链。
		1. 将参数解释为实际的ECMAScript[[语句]]，然后插入到该位置
		2. 通过eval()执行的代码属于该调用所在上下文，被执行的代码与上下文拥有*相同的作用域链*。这意味着定义在包含上下文中的变量可以在eval()调用内部被引用，`let msg = "hello world";eval("console.log(msg)");  // "hello world"` 
		3. 在eval中声明了一个变量，可在下方使用

[^1]: 不能包含某些字符，比如空格
[^2]: ECMAScript中*最特别*的对象，因为代码不会显式地访问它。