# 概述
## 内容
- 理解Selectors API
- 使用HTML5 DOM扩展
## 意义
为了支持更多功能，不断有标准或专有扩展出现。
	1. 2008年以前，大部分浏览器对DOM的扩展是专有的。
	2. 此后，W3C开始着手将这些已成为事实标准的*专有扩展*编制成*正式规范* 
## 规范
1. *描述DOM扩展*的两个**标准**：Selectors API与HTML5。
	1. 这两个标准体现了社区需求和标准化某些手段及API的愿景。
	2. 专有扩展虽然还有，但这两个规范（特别是HTML5）已经涵盖其中大部分
2. 较小的Element Traversal规范，增加了一些DOM属性。
# Selectors API
## querySelector()
## querySelectorAll()
## matches()
接收一个CSS选择符参数，如果元素匹配则该选择符返回true，否则返回false
目的：检测某个元素会不会被querySelector()或querySelectorAll()方法返回
# 元素遍历
## 背景
IE9之前的版本不会*把元素间的空格当成空白节点*，而其他浏览器则会。这样就导致了childNodes和firstChild等属性上的差异。
为了弥补这个差异，同时不影响DOM规范，W3C通过新的Element Traversal规范定义了一组新属性。

Element Traversal API为DOM元素添加了5个属性
- childElementCount，返回*子元素数量*（不包含文本节点和注释）；
- firstElementChild，指向*第一个Element类型的子元素*（Element版firstChild）；
- lastElementChild，指向*最后一个Element类型的子元素*（Element版lastChild）；
- previousElementSibling，指向前一个Element类型的同胞元素（Element版previousSibling）；
- nextElementSibling，指向后一个Element类型的同胞元素（Element版nextSibling）。
# HTML5

# 专有扩展

