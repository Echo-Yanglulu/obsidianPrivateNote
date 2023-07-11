# 概述
[DOM 概述 - Web API 接口参考 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model/Introduction?spm=a21iq3.home.0.0.54b42764PcwehE) 
定义：DOM是 [[HTML]] 与 [[XML]] 文档的**编程模型**。提供了对**文档的结构化表示**，并定义了一种方式，从程序中对该结构进行**访问**。
功能
	1. 表示由多层节点构成的文档，通过它开发者可以添加、删除和修改页面的各个部分
	3. DOM Level 1：提供了基本*文档结构*和*查询*的接口
意义
	1. DOM与浏览器中的HTML网页相关，并且在JavaScript中提供了DOM API
	2. DOM现在是真正*跨平台*、*语言无关*的表示和操作网页的方式
特性
	1. 树形结构
概要
	1. 介绍 DOM，即文档对象模型，主要是 DOM Level 1 定义的 API。
	2. 简单讨论 XML 及其与 DOM 的关系，
	3. 进而全面探索 DOM 以及如何利用它操作网页。
## 内容
1. DOM的构成
2. 节点类型
3. 浏览器兼容性
4. MutationObserver接口

浏览器解析HTML文档时，在内存中将每个元素表示为DOM。树状结构，每个元素都由一个节点表示
DOM对象是[[宿主对象]]。

要理解DOM，最关键的一点是知道影响其性能的问题所在。
	1. DOM操作在JavaScript代码中是代价比较高的，NodeList对象尤其需要注意
		1. NodeList对象**实时更新**，这意味着每次访问它都会执行一次新的查询
# 节点层级
背景：任何HTML或XML文档都可以用DOM*表示*为一个由**节点**构成的**层级结构** 
	1. 节点有很多**类型** 
		1. *对应*着文档中不同的信息和（或）标记
		2. 都*拥有*自己不同的特性、数据和方法
		3. 与其他类型有某种*关系* 
			1. 这些关系构成了层级，让标记可以表示为一个以特定节点为根的树形结构。
	2. DOM中有12种节点类型
		1. 都继承自一种基础类型
## 实例
```html
<html>
  <head>
    <title>Sample Page</title>
  </head>
  <body>
    <p>Hello World!</p>
  </body>
</html>
```
表示为层级结构，则为![[Pasted image 20230709233103.png]]
> 文档根节点>子节点（文档元素）
> document节点>在html中是html元素，在xml中不定

document节点表示每个**文档的根节点** 
	根节点的唯一**子节点**是html元素，我们称之为文档元素：documentElement
文档元素
	1. 文档最外层的元素，所有其他元素都存在于这个元素之内
	2. 每个文档只能有一个
	3. 实现
		1. HTML页面中，文档元素始终是html元素。
		2. XML文档中，则没有这样预定义的元素，任何元素都可能成为文档元素
HTML中的每段标记都可以表示为这个树形结构中的一个节点。
	HTML元素表示为元素节点
	属性表示为属性节点
## Node类型
背景：DOM Level 1描述了名为`Node`的接口
	1. 所有DOM节点类型都必须实现
	2. 访问：在JavaScript中被实现为 `Node类型`，在除IE之外的所有浏览器中都可以**直接访问**这个类型
	3. 子类：JavaScript中，所有节点类型都继承Node类型，因此所有类型都共享相同的基本属性和方法
### nodeType
每个节点都有nodeType属性，表示该节点的**节点类型** 。由定义在Node类型上的12个数值常量表示
- Node.ELEMENT_NODE（1）
- Node.ATTRIBUTE_NODE（2）
- Node.TEXT_NODE（3）
- Node.CDATA_SECTION_NODE（4）
- Node.ENTITY_REFERENCE_NODE（5）
- Node.ENTITY_NODE（6）
- Node.PROCESSING_INSTRUCTION_NODE（7）
- Node.COMMENT_NODE（8）
- Node.DOCUMENT_NODE（9）
- Node.DOCUMENT_TYPE_NODE（10）
- Node.DOCUMENT_FRAGMENT_NODE（11）
- Node.NOTATION_NODE（12）
通过与这些常量比较来**确定节点类型** 
```js
if (someNode.nodeType == Node.ELEMENT_NODE){
  alert("Node is an element.");
}
```
浏览器并不支持所有节点类型。开发者最常用到的是元素节点和文本节点。
### nodeName与nodeValue
值完全取决于节点类型。使用之前先检测类型
	1. 元素节点：name是标签名，value是null
### 节点关系
### 操纵节点
### 其他方法
## Document类型

## Element类型

## Text类型

## Comment类型

## CDATASection类型

## DocumentType类型

## DocumentFragment类型

## Attr类型

# DOM编程

## 动态脚本

## 动态样式

## 操作表格

## 使用NodeList

# MutationObserver接口
背景：为代替性能不好的MutationEvent而问世，
功能：可以有效精准地监控DOM变化，而且API也相对简单

## 基本用法
## MutationObserverInit与观察范围
## 异步回调与记录队列
## 性能、内存与垃圾回收
# 基本概念
节点
# 属性
screen.height：显示器高度
window.outerHeight：浏览器软件高度【全屏时等于显示器高度】
window.innerHeight：浏览器可视区高度
	与document.documentElement.clientHeight[^2]有什么区别？
document.body.clientHeight：body高度

clientHeight、clientLeft 、scrollHeight、scrollY：元素内content+padding
offsetHeight 、offsetTop：元素边框content+padding+border
clientWidth：**content+padding**。
clientHeight：content + padding。不含滚动条
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
tagName：伪数组
name：伪数组
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
1. property：修改的是JS获取到的元素的对象的属性，不会作用到标签
	p.style.width = '23px'
	p.className='red' // 因为class是关键字
	p.nodeName
	p.nodeType
1. attribute：修改HTML标签的属性，会作用到标签
	p.setAttribute('date-name', 'mooc')
# 性能
原因：DOM操作非常“昂贵”
方案
	1. 对DOM查询做缓存[^1] 
		1. 多次*获取*DOM
	2. 批处理：将频繁操作组合为一次操作
		1. 多次*插入*DOM。应：多次创建，通过`createDocumentFragment()`一次插入
# [[DOM扩展]] 
# [[DOM 2与DOM 3]] 

[^1]: 保存在变量里，不要每次用都获取一次DOM节点
[^2]: 某个元素的content+padding