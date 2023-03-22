# 概述
ES认为BOM是JS的核心，其实BOM是使用JS开发WEB应用的核心。
功能：与*网页无关*的**浏览器功能**对象
标准： 
	1. BOM在缺乏规范的背景下发展起来，最终浏览器之间共通的部分成为了事实标准，为web开发提供了浏览器之间互操作的基础。
	2. [[HTML5规范]]中有一部分包含了BOM主要内容，因为W3C希望将JS在浏览器中最基础的部分标准化。

## 内容
1. BOM的核心：window对象
2. 控制窗口与弹窗
3. 通过location对象获取**页面信息**
4. 通过navigator对象了解**浏览器（客户端？）**
5. 通过history对象操作**浏览器历史**
# [[screen]] 
客户端能力信息、浏览器窗口外的客户端显示器的信息
# [[navigator]] 
用途：客户端标识浏览器的标准（？）
前提：客户端启用JS，即存在该对象。
# [[window]] 
window对象
	1. 是BOM的*核心*：浏览器的实例
	2. 在浏览器中有两个*身份*
		1. ES中的**Global对象**
			1. 很多浏览器API和构造函数都以window对象的属性的形式暴露。
			2. 由于浏览器实现不同，不同浏览器的window对象的属性可能差异很大
		2. 浏览器窗口的**JS接口**
		3. 即：网页中定义的所有变量都以window作为其Global对象，都可访问其上定义的parseInt()等全局方法
## Global作用域
影响：所有通过var声明的变量与函数，都会成为window对象的属性与方法，被定义在**全局作用域**中。
```js
// 抛出错误，因为oldValue没有声明
var newValue = oldValue;
// 这不会抛出错误，因为这里是属性查询。
var newValue = window.oldValue;
```
[[笔记/前端/编程语言/JS/JS|JS]]中有许多对象暴露在全局作用域中。
> 以下是第二个身份
## 窗口关系
top对象：最上层窗口（浏览器窗口本身）
parent对象：当前窗口的父窗口。
	如果当前窗口就是最上层窗口，parent为top
self对象：终极window属性，始终指向window。
	实际上self和window对象是同一个对象，暴露它只是为了和top, parent保持一致
可通过以上三个属性，把多个窗口的window对象串联起来。
	1. 为啥没有子窗口？只有相对的上层和绝对的最上层？

最上层的window如果不是通过window.open打开，则name属性没有值。
## 窗口位置
### window对象的位置
1. screenLeft, screenTop：窗口相对屏幕左侧和顶部的位置。返回css像素
### 窗口位置的方法
1. moveTo(x, y)：移动到的绝对位置
2. moveBy(x, y)：希望移动的相对像素数
根据浏览器，两个方法可能被部分/全部禁用

像素比
CSS像素：低分辨率屏幕与高分辨率屏幕下12CSS像素的字体应该有同样大小。
	1. 可能带来的问题：较小的分辨率时字体放不下。
所以不同**像素密度**的屏幕存在不同的**缩放系数**，把物理分辨率/像素转换为逻辑分辨率/像素。
	1. 如果一个手机屏幕的物理像素是1920，像素密度是3，逻辑像素就是640。12CSS像素的文字就会使用36物理像素展示（等比缩放）

## 窗口大小
不同浏览器中确定浏览器窗口大小没有想象中那么容易。（到底窗口指的是哪部分？）
innerWidth
	1. 浏览器窗口的**页面视口的大小**（视口区域、展示页面的区域的宽高）
	2. 视口：包含滚动条
	3. 缩放系数不为100%（存在缩放）时，等于逻辑像素
```js
let pageWidth = window.innerWidth,  // 可见视口
    pageHeight = window.innerHeight;
// 窗口大小总比outerHeight返回的要小一些
// 视口大小可通过三种场景判断
if (typeof pageWidth != "number") {
  if (document.compatMode == "CSS1Compat"){
    pageWidth = document.documentElement.clientWidth;  // 布局视口：渲染页面的实际大小
    pageHeight = document.documentElement.clientHeight;
  } else {
    pageWidth = document.body.clientWidth;  
    pageHeight = document.body.clientHeight;
  }
}
```
outerWidth
	1. **浏览器窗口自身的大小**（整个浏览器应用的宽高）
	2. 即使存在缩放，也等于屏幕的物理像素
调整：resize()， resizeTo(), resizeBy()

窗口大小的调整与窗口位置的调整一样：可能因为浏览器的不同而被禁用、调整方法只能应用到最上层的window对象。
## 视口位置
文档相对于视口的滚动距离
window.pageXoffset === window.scrollX
window.pageYoffset === window.scrollY
滚动页面/调整文档在视口中的位置
scroll()
scrollTo()
scrollBy()
```js
// 正常滚动
window.scrollTo({
  left: 100,
  top: 100,
  behavior: 'auto'
});
// 平滑滚动
window.scrollTo({
  left: 100,
  top: 100,
  behavior: 'smooth'
});
```
## 导航与打开窗口
window.open()
	1. 导航到指定URL
	2. 打开新浏览器窗口

1. URL
2. 目标窗口名
	1. 如果不是已有窗口的名字，会打开一个新窗口/标签页。
	2. \_slef
	3. \_parent
	4. \_top
	5. \_blank
3. 特性
	1. 新窗口的配置。没有传则所有浏览器特性为默认（地址栏，状态栏，工具栏等）
	2. 不是新窗口：忽略该参数
4. 是否在历史记录中替换当前页面

处理
	1. 通过浏览器有弹窗屏蔽程序
		1. 浏览器内置的弹窗屏蔽程序：使用window.open返回值为Null
		2. 浏览器扩展屏蔽的弹窗：报错
		3. 同时使用try/catch和返回值进行校验，看是否正确打开弹窗。
## 定时器
JS是单线程，每次只能执行一段代码，为了调度不同代码的执行，JS维护了一个任务队列。
1. 要执行的代码
	1. 函数
	2. 包含JS代码的字符串
2. 执行代码前等待的时间。
	1. 在多少秒之后，把该任务添加到任务队列。（而不是执行之前等待的时间，也不是执行过程的耗时）
3. 返回值：用于取消等待中的排期任务。

setInterval()
	1. 适合执行时间短、非阻塞的任务。
	2. 一般来说，最好不要使用，而是使用timeout代替
## 系统对话框
使用浏览器的系统对话框，向用户展示消息。
	1. 对话框与网页无关、不包含HTML
	2. 外观由浏览器决定，无法使用CSS设置
	3. 都是同步的模态对话框：展示时代码停止执行，消失时才会继续执行。
### alert
接收一个字符串。如果不是则会自动调用toString。
用途
	1. 无法控制的消息，如报错
### confirm
两个按钮。
想确定用户点击了什么值，可直接使用调用的返回值（boolean）
	true: 确定
	false: 取消或关闭
### prompt
参数
	1. 要展示的文案（提问句）
	2. 表单的默认值
返回值
	1. null ：用户取消或关闭了对话框
	2. 输入值
### 查找
find()
### 打印
print()
# [[location]] 


# [[history]] 
# 总结