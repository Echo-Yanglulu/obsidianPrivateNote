# 概述
[DOM 概述 - Web API 接口参考 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model/Introduction?spm=a21iq3.home.0.0.54b42764PcwehE) 
定义：DOM是 [[HTML]] 与 [[XML]] 文档的**编程模型**。提供了对**文档的结构化表示**，并定义了一种方式，从程序中对该结构进行**访问**。
功能
	1. 表示由多层节点构成的文档，通过它开发者可以添加、删除和修改页面的各个部分
	3. DOM Level 1：提供了基本*文档结构*和*查询*的接口
意义
	1. DOM现在是真正*跨平台*、*语言无关*的**表示和操作网页的方式** 
	2. 之所以介绍DOM，是因为它与浏览器中的HTML文档有关，并在JS中提供了DOM API
特性
	1. 树形结构
概要
	1. 介绍 DOM，即文档对象模型，主要是 DOM Level 1 定义的 API。
	2. 简单讨论 XML 及其与 DOM 的关系，
	3. 进而全面探索 DOM 以及如何利用它操作网页。
## 内容
浏览器解析HTML文档时，在内存中将每个元素表示为DOM。
DOM对象是[[宿主对象]]。

要理解DOM，最关键的一点是知道影响其性能的问题所在。
	1. *DOM操作*在JavaScript代码中是代价比较高的，NodeList对象尤其需要注意
		1. NodeList对象**实时更新**，这意味着每次访问它都会执行一次新的查询
# 节点层级
背景：DOM可以将HTML或XML文档*表示*为一个由**节点**构成的**层级**结构[^3]
	1. 节点**类型** 
		1. 含义：*对应*文档中不同的信息或标记
		2. 属性：*拥有*自己不同的特性、数据和方法
		3. 与其他类型存在某种*关系* 
			1. 这些关系构成了*层级*，让**标记表示为一个以特定节点为根的树形结构**。【具体是什么层级结构？】
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
用DOM，表示为一个由节点表示的层级结构，则为 ![[Pasted image 20230709233103.png]]
> 文档根节点>子节点（文档元素）
> document节点>在html中是html元素，在xml中不定

1. 每个**文档根节点**：使用document节点表示
2. 根节点的*唯一*子节点，我们称之为*文档元素*或*根元素*：documentElement。
	1. 层级：文档最外层的元素，所有其他元素都存在于这个元素之内
	2. 数量：每个文档只能有一个
	3. 实现
		1. HTML页面中，文档元素始终是html元素。
		2. XML文档中，则没有这样预定义的元素，任何元素都可能成为文档元素
HTML中的每段标记都可以表示为这个树形结构中的一个节点。
	HTML元素表示为元素节点
	属性表示为属性节点
## Node类型
背景：DOM Level 1描述了名为`Node`的接口
	1. 必要：所有DOM节点类型都必须实现
	2. 访问：在JavaScript中被实现为 `Node类型`，在除IE之外的所有浏览器中都可以**直接访问**这个类型
	3. 子类：JavaScript中，所有节点类型都继承Node类型，因此所有类型都共享相同的基本属性和方法
分类：文档、元素、属性、文本、2 C、2 D
### 节点类型
每个节点都有`nodeType`属性，表示该节点的**节点类型** 。由定义在Node类型上的12个数值常量表示
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
### 节点信息
nodeName与nodeValue
值完全取决于节点类型。使用之前先检测类型
	1. 元素：nodeName是标签名，nodeValue是null
### 节点关系
文档中的所有节点都与其他节点有关系
每个节点都有
	1.  `childNodes` 属性，其中包含一个 [[NodeList]] 的实例。列表中的每个节点都是同一列表中其他节点的同胞节点
		1. previousSibling和nextSibling可以在这个列表的节点间*导航*
		2. 列表中第一个节点的`previousSibling`属性、最后一个节点的`nextSibling`属性是null
		3. 只有一个节点，则它的previousSibling和nextSibling属性都是null
	2. `firstChild`、`lastChild`。
		1. 只有一个子节点：指向该子节点
		2. 没有子节点：指向null
		3. 等同：someNode.childNodes\[0]
	3. `parentNode` 属性： 其DOM树中的父元素
### 节点操纵
### 其他方法
## Document类型
意义：JavaScript中表示文档节点的类型。浏览器中，文档对象document是HTMLDocument的实例（HTMLDocument继承Document），表示整个HTML页面。document是window对象的属性，因此是一个全局对象。
特征
	1. nodeType等于9；
	2. nodeName值为" document "；
	3. nodeValue值为null；
	4. parentNode值为null；
	5. ownerDocument值为null；
	6. 子节点可以是DocumentType（最多一个）、Element（最多一个）、ProcessingInstruction或Comment类型。
应用：可以表示HTML页面或其他XML文档，但最常用的还是通过HTMLDocument的实例取得document对象。document对象可用于获取关于页面的信息以及操纵其外观和底层结构。
文档子节点
文档信息
定位元素
特殊集合
DOM兼容性检测
## Element类型
背景：除了Document类型，Web开发中最常用的类型。
功能：Element表示XML或HTML元素，对外暴露出访问元素标签名、子节点和属性的能力
特征
	1. nodeType等于1；
	2. nodeName值为元素的标签名；
	3. nodeValue值为null；
	4. parentNode值为Document或Element对象；
	5. 子节点可以是Element、Text、Comment、ProcessingInstruction、CDATASection、EntityReference类型。

HTML元素
取得属性
设置属性
attributes 属性
创建元素
元素后代

## Attr类型
元素数据在DOM中通过Attr类型表示
Attr类型构造函数和原型在所有浏览器中都可以直接访问。技术上讲，属性是存在于元素attributes属性中的节点
特征
	1. nodeType等于2；
	2. nodeName值为属性名；
	3. nodeValue值为属性值；
	4. parentNode值为null；
	5. 在HTML中不支持子节点；
	6. 在XML中子节点可以是Text或EntityReference。

属性节点尽管是节点，却不被认为是DOM文档树的一部分。Attr节点很少直接被引用，通常开发者更喜欢使用getAttribute ()、removeAttribute ()和setAttribute ()方法操作属性。
Attr对象上有3个属性
## Text类型
Text节点由Text类型表示，包含按字面解释的纯文本，也可能包含转义后的HTML字符，但不含HTML代码。
特征
	1. nodeType等于3；
	2. nodeName值为" #text "；
	3. nodeValue值为节点中包含的文本；
	4. parentNode值为Element对象；
	5. 不支持子节点。

创建
规范化
拆分
## Comment类型

## CDATASection类型

## DocumentType类型

## DocumentFragment类型

# DOM编程
很多时候，操作DOM是很*直观*的。通过HTML代码能实现的，也一样能通过JavaScript实现。但有时候，DOM也*没有看起来那么简单*。浏览器能力的参差不齐和各种问题，也会导致DOM的某些方面会复杂一些。
## 动态脚本

## 动态样式

## 操作表格

## 使用NodeList

# MutationObserver接口
背景：为代替性能不好的MutationEvent而问世，
功能：可以有效精准地**监控DOM变化**，而且API也相对简单

## 基本用法
observe ()方法
回调与MutationRecord
disconnect ()方法
复用MutationObserver
重用MutationObserver
## MutationObserverInit与观察范围
观察属性
观察字符数据
观察子节点
观察子树
## 异步回调与记录队列
记录队列
takeRecords ()方法
## 性能、内存与垃圾回收
MutationObserver的引用
MutationRecord的引用
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
[^3]: 一切都是节点