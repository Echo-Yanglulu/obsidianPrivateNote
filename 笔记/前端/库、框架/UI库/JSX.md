JavaScript [[XML]] ，通过[[babel]] 转换为JS的函数调用表达式，返回一个React 元素
本质
	1. vue 模板不是 html, JSX 也不是 JS

一个组件的属性较多：定义一个对象，在标签填写属性的地方对该对象进行解构即可。

在属性或内容中嵌入变量：样式、事件

# 原理
编译为 React. createElement ()的调用。
	1. [[String]] ：标签名
	2. null 或[[Object]] ：属性对象
	3. \[子元素]或子元素列表