# 概述

## 属性分类
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
3. [[document]] 
4. [[navigator]] 
5. [[location]] 
6. [[screen]] 
7. [[History]] 

# 属性
innerHeight: 见面文档显示区
与document.documentElement.clientHeight[^1]有什么区别？


显示器高度：screen.height
浏览器软件高度：window.outerHeight【全屏时等于显示器高度】
浏览器可视区高度：window.innerHeight
[[DOM]]部分
body高度：document.body.clientHeight
元素内content+padding：clientHeight、clientLeft 、scrollHeight、scrollY
元素边框content+padding+border：offsetHeight 、offsetTop

[^1]: 某个元素的content+padding