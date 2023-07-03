# 概述
[DOM 概述 - Web API 接口参考 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model/Introduction?spm=a21iq3.home.0.0.54b42764PcwehE) 
定义：是[[HTML]]与[[XML]]**文档的编程模型**。提供了对**文档的结构化表示**，并定义了一种方式，从程序中对该结构进行**访问**。【生成对文档的结构化的表示，然后提供方式对该表示进行访问】
特性
	1. 树形结构
概要
	1. 介绍 DOM，即文档对象模型，主要是 DOM Level 1 定义的 API。
	2. 简单讨论 XML 及其与 DOM 的关系，
	3. 进而全面探索 DOM 以及如何利用它操作网页。
内容
	1. 理解DOM的构成
	2. 节点类型
	3. 浏览器兼容性
	4. MutationObserver接口
文档对象模型。
	1. 一种标准：定义了JS处理HTML使用的API。是与==语言无关==的HTML处理接口。
	2. 提供了JS处理DOM的方法，与JS无关？

浏览器解析HTML文档时，在内存中将每个元素表示为DOM。树状结构，每个元素都由一个节点表示
DOM对象是[[宿主对象]]。
## 基本概念
节点
# 属性
clientWidth：**content+padding**。
clientHeight：content + padding。不含滚动条（不含滚动部分？？只是展示出来的部分？）
	document.documentElement.clientWidth：页面的宽高
clientLeft：左border宽度
scrollHeight：clientWidth，*含滚动部分*。
	1. 没有滚动：等于clientHeight
	2. 有滚动：==滚动内容高度== + ==padding== 
	3. 如果设置scroll为auto，content高为手动设置的高度
	4. 如果设置scroll为scroll，content高缩小

1. 元素自身有fixed定位，则
scrollY：被滚动的高度
scrollTop：一个内部产生了滚动，它的内容区被滚动的值
	可写：开发者修改卷去的长度
		1. 回到页面某个位置
	1. 兼容
		1. 非safari浏览器可使用document.documentElement.scrollTop读取页面滚动的距离
		2. safari需要用document.body.scrollTop
		3. 兼容代码：var docScroll = document.documentElement.scrollTop || document.body.scrollTop。实现常用的“回到顶部”功能
offsetParent：元素距离<u>定位父元素</u>的顶部偏移量，如果一直没有最多上升到body元素。
	1. 元素自身有fixed定位，则为Null
	2. 无fixed，且上级无定位：body元素
	3. 无fixed，上级有定位：存在定位的上级元素
	4. body元素：null
offsetTop：元素上边框与offsetParent元素的上边框距离
offsetWidth：**content + padding + border**。即clientWidth + clientLeft
offsetHeight：**clientHeight + border**。含滚动条
## 比较
clientWidth：2个
offsetWidth：3个
# 方法
window.scrollTo(x, y)：文档左上角滚动到某个点
当前元素在<u>页面</u>上的偏移量
## DOM节点
### 新增
createElement
### 插入
appendChild
### 删除
removeChild
### 移动
先获取，再插入，节点不是复制，而是移动
### 获取
id
name：伪数组
tagName：伪数组
className：伪数组
querySelector()
querySelectorAll(标签名)
### 关系
1. 父元素：parentNode
2. 子元素列表：childNodes
	1. 含元素节点、文本节点
### 设置属性
两种方式
	都可能引起*DOM重新渲染*。尽量使用property。
1. property
	修改的是JS获取到的元素的**对象的属性**，*不会作用到标签*
	p.style.width = '23px'
	p.className='red' // 因为class是关键字
	p.nodeName
	p.nodeType
1. attribute
	修改HTML**标签的属性**，会作用到标签
	p.setAttribute('date-name', 'mooc')
# 性能
原因：DOM操作非常“昂贵”
方案
	1. 对DOM查询做缓存[^1]
		1. 适用：多次*获取*DOM
	2. 批处理：将频繁操作组合为一次操作
		1. 适用：多次*插入*DOM。应：多次创建，通过createDocumentFragment（）一次插入
# [[DOM扩展]] 
# [[DOM 2]]与[[DOM 3]] 

[^1]: 保存在变量里，不要每次用都获取一次DOM节点