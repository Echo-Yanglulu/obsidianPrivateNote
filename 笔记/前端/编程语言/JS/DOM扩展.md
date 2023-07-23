# 概述【标准与专有扩展】
## 背景
为了支持更多功能[^1]，不断有*标准*或*专有扩展*出现。
	1. 2008年以前，大部分浏览器对DOM的扩展是专有的。
	2. 此后，W3C开始着手将这些已成为事实标准的*专有扩展*编制成*正式规范* 
## 内容
1. *描述DOM扩展*的两个**标准**：Selectors API与HTML5。
	1. 这两个标准体现了社区*需求*和标准化某些手段及API的*愿景*。
	2. 专有扩展虽然还有，但这两个规范（特别是HTML5）已经涵盖其中大部分
2. 较小的Element Traversal规范，增加了一些DOM属性。
# Selectors API标准
DOM元素查找
## querySelector()
## querySelectorAll()
## matches()
接收一个CSS选择符参数，如果元素匹配则该选择符返回true，否则返回false
目的：检测某个元素会不会被querySelector()或querySelectorAll()方法返回
# DOM元素遍历
## 背景
IE9之前的版本不会把**元素间的空格**当成空白节点，而其他浏览器则会。这样就导致了childNodes和firstChild等属性上的差异。
为了弥补这个差异，同时不影响DOM规范，W3C通过新的Element Traversal规范定义了一组新属性。

Element Traversal API为DOM元素添加了5个属性
- childElementCount，返回*子元素数量*（不包含文本节点和注释）；
- firstElementChild，指向*第一个Element类型的子元素*（Element版firstChild）；
- lastElementChild，指向*最后一个Element类型的子元素*（Element版lastChild）；
- previousElementSibling，指向*前一个Element类型的同胞元素*（Element版previousSibling）；
- nextElementSibling，指向*后一个Element类型的同胞元素*（Element版nextSibling）。
## 兼容
IE9及以上版本及现代浏览器支持。所有DOM元素都会有这些属性。开发者就不用担心空白文本节点的问题
# HTML5 DOM标准
标记相关的JS API
## 背景
HTML5代表着与以前的HTML截然不同的方向
	1. 所有以前的HTML规范中，从未出现过*描述JavaScript接口*的情形，HTML就是一个纯标记语言
	2. HTML5规范却包含了与*标记相关*的大量JavaScript API定义
		1. 有的API与DOM重合，定义了浏览器应该提供的DOM扩展
## CSS类扩展
getElementsByClassName()
classList属性
## 焦点管理
## HTMLDocument扩展
## 字符集属性
## 自定义数据属性
## 插入标记
### innerHTML属性
### 旧IE中的innerHTML
### outerHTML属性
### insertAdjacentHTML()与insertAdjacentText()
### 内存与性能问题
### 跨站点脚本
## scrollIntoView()
# 专有扩展
## children属性
## contains()方法
## 插入标记
### innerText属性
### outerText属性
## 滚动
scrollIntoView()是唯一一个所有浏览器都支持的方法，所以只用它就可以了。

[^1]: 不只是提供文档的结构化表示、访问接口