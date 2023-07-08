# 概述
1. 意义：是BOM的*核心*，表示浏览器的实例
2. 在浏览器中有两个*身份* 
	1. ES中的[[Global]]对象
		1. 很多浏览器API和构造函数都以window对象的属性的形式暴露。
			1. 网页中定义的所有变量都以window作为其Global对象，都可访问其上定义的parseInt()等全局方法
		2. 由于浏览器实现不同，不同浏览器的window对象的属性可能差异很大
	2. 浏览器窗口的**JS接口** 
# 作为全局作用域
影响：所有通过var、function声明的变量与函数，都会成为window对象的属性与方法，被定义在[[作用域#全局作用域|全局作用域]]中。
```js
// 抛出错误，因为oldValue没有声明
var newValue = oldValue;
// 抛出错误，因为这里是属性查询。
var newValue = window.oldValue;
// 对象属性读取和变量读取是机制不同
```
[[笔记/前端/编程语言/JS/JS|JS]]中有许多对象暴露在全局作用域中。
1. 特殊值
	1. undefined	特殊值undefined
	2. NaN	特殊值NaN
	3. Infinity	特殊值Infinity
2. 原生引用类型的构造函数
	1. Boolean	Boolean的构造函数
	2. String	String的构造函数
	3. Number	Number的构造函数
	4. Symbol	Symbol的伪构造函数
	5. Array	Array的构造函数
	6. Object	Object的构造函数
	7. Function	Function的构造函数
	8. Date	Date的构造函数
	9. [[RegExp]]	RegExp的构造函数
	10. [[Error]]	Error的构造函数
		1. EvalError	EvalError的构造函数
		2. RangeError	RangeError的构造函数
		3. ReferenceError	ReferenceError的构造函数
		4. SyntaxError	SyntaxError的构造函数
		5. TypeError	TypeError的构造函数
		6. URIError	URIError的构造函数
3. [[DOM|document]] 
4. [[navigator]] 
5. [[screen]] 
6. [[location]] 
7. [[History]] 
## 事件
onload：页面的全部资源[^1]加载已结束，
# 作为JS接口
## 窗口大小
不同浏览器中确定**浏览器窗口大小**没有想象中那么容易。所有现代浏览器都支持4个属性
outerWidth：浏览器应用窗口大小
innerWidth：视口大小
### 页面视口的大小
innerWidth
	1. 视口：包含滚动条
	2. 缩放系数不为100%（存在缩放）时，等于逻辑像素
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
### 浏览器应用的大小
outerWidth
	1. 整个浏览器应用的宽高
	2. 即使存在缩放，也等于屏幕的物理像素
	3. 调整：resize()， resizeTo(), resizeBy()
窗口大小的调整与窗口位置的调整一样：可能因为浏览器的不同而被禁用、调整方法只能应用到最上层的window对象。
### yi
## 窗口位置
window对象的位置
### 读取
1. screenLeft, screenTop：浏览器窗口相对屏幕左侧和顶部的位置。返回css像素
### 修改
1. moveTo(x, y)：移动到的绝对位置
2. moveBy(x, y)：希望移动的相对像素数
根据浏览器，两个方法可能被部分/全部禁用
### 像素比
物理分辨率：屏幕实际的分辨率
CSS像素：浏览器报告的虚拟分辨率
window.devicePixelRatio：物理分辨率/逻辑分辨率。物理像素/逻辑像素
	1. 与*每英寸像素数*（DPI，dots per inch）是对应的。单位像素密度

背景：提出了**CSS像素**：即使在不同分辨率的屏幕中，相同像素大小的字体**应该肉眼看起来有同样大小**。
	1. 问题：不同屏幕的**像素密度**不同，则**缩放系数**不同才能把物理分辨率/像素转换为逻辑分辨率/像素。
		1. 屏幕很小，但分辨率很高，浏览器需要降低分辨率为逻辑分辨率。
		2. 如果一个手机屏幕的物理像素是1920，像素密度是3，逻辑像素就是640【图像会被缩小三倍】。为了展示出同样大小的效果，12CSS像素的文字就需要使用36物理像素展示（等比缩放）
	2. 如果不希望在不同分辨率的屏幕中展示同样大小，就不要用CSS像素了！！！小屏根本放不下！！
## 窗口关系
可通过三个属性，把多个窗口的window对象串联起来[^2]。
	1. 最上层窗口（浏览器窗口本身）：top
	2. 当前窗口的父窗口：parent对象
		如果当前窗口就是最上层窗口，parent为top
	3. 终极window属性，始终指向window：self对象
		实际上self和window对象是同一个对象，暴露self只是为了和top, parent保持一致
最上层的window如果不是通过window.open打开，则name属性没有值。
## 窗口导航与打开
window.open()
1. 参数
	1. 目标URL
	2. 目标窗口名
		1. 如果不是已有窗口的名字，会打开一个新窗口/标签页。
		2. \_slef
		3. \_parent
		4. \_top
		5. \_blank
	3. 是否在历史记录中替换当前页面
2. 特性
	1. 新窗口的配置。没有传则所有浏览器特性为默认（地址栏，状态栏，工具栏等）
	2. 不是新窗口：忽略该参数
3. 导航处理
	1. 通过浏览器有弹窗屏蔽程序
		1. 浏览器内置的弹窗屏蔽程序：使用window.open返回值为Null
		2. 浏览器扩展屏蔽的弹窗：报错
		3. 同时使用try/catch和返回值进行校验，看是否正确打开弹窗。
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
	2. 样式：由浏览器决定，无法使用CSS设置
	3. 同步：展示时后续JS代码停止，消失时才会继续执行。
### alert
接收一个字符串。如果不是则会自动调用toString。
用途
	1. 无法控制的消息，如报错
### confirm
两个按钮。
想确定用户点击了什么值，可使用调用的返回值（boolean）
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

[^1]: 包括图片、视频等
[^2]: 为啥没有子窗口？只有相对上层和绝对最上层？*不需要向下或向旁边*？