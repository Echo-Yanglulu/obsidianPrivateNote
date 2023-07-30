# 概述
1. 意义：是BOM的*核心*，表示浏览器的实例
2. 在浏览器中有两个*身份* 
	1. ES中的[[Global]]对象的代理，作为全局作用域
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
	1. Date	Date的构造函数
	2. [[RegExp]]	RegExp的构造函数
	3. Boolean	Boolean的构造函数
	4. Number	Number的构造函数
	5. String	String的构造函数
	6. Symbol	Symbol的伪构造函数
	7. Object	Object的构造函数
	8. Array	Array的构造函数
	9. Function	Function的构造函数
	10. [[Error]]	Error的构造函数【范围，引用，语法，拼写，URI，eval】
		1. RangeError	RangeError的构造函数
		2. ReferenceError	ReferenceError的构造函数
		3. SyntaxError	SyntaxError的构造函数
		4. TypeError	TypeError的构造函数
		5. URIError	URIError 的构造函数【刚好是 Math 对象上的两组属性/方法】
		6. EvalError	EvalError的构造函数
3. 不属于任何对象的属性或方法
	1. [[DOM]] 对象：[[DOM|document]] 
	2. [[BOM]] 对象
	3. [[Math]] 对象
	4. [[URL]] 编码
## 事件
onload：页面的全部资源[^1]加载已结束，
# 作为浏览器窗口的JS接口。窗口：位置，大小，关系，新增。视口：位置，大小
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

## 窗口大小
### 读取
不同浏览器中确定**浏览器窗口大小**没有想象中那么容易。所有现代浏览器都支持4个属性
1. outerWidth：浏览器应用窗口大小
	1. 整个浏览器应用的宽高
	2. 即使存在缩放，也等于屏幕的物理像素
2. innerWidth：视口大小
窗口大小的调整与窗口位置的调整一样：可能因为浏览器的不同而被禁用、调整方法只能应用到最上层的window对象。
### 调整
调整：resize()， resizeTo(), resizeBy()

## 窗口关系
可通过三个属性，把多个窗口的window对象串联起来[^2]。
	1. 最上层窗口（浏览器窗口本身）：top
	2. 当前窗口的父窗口：parent对象
		如果当前窗口就是最上层窗口，parent为top
	3. 终极window属性，始终指向window：self对象
		实际上self和window对象是同一个对象，暴露self只是为了和top, parent保持一致
最上层的window如果不是通过window.open打开，则name属性没有值。

## 窗口新建
window.open()
1. 参数
	1. 目标[[URL]] 
	2. 目标窗口/[[iframe]]名字 （相当于a元素的target属性）
		1. 打开的窗口已有该名字，打开一个新窗口/标签页。
		2. 特殊窗口名
			1. \_slef
			2. \_parent
			3. \_top
			4. \_blank
	3. 特性字符串：新窗口的配置
		1. 不是新窗口：忽略该参数
		2. 没有传则所有浏览器特性为默认（地址栏，状态栏，工具栏等）
	4. 是否在历史记录中替换当前页面：replace
		1. 在使用当前窗口导航时，才可能使用
2. 导航处理
	1. 通过浏览器有弹窗屏蔽程序
		1. 浏览器内置的弹窗屏蔽程序：使用window.open返回值为Null
		2. 浏览器扩展屏蔽的弹窗：报错
		3. 同时使用try/catch和返回值进行校验，看是否正确打开弹窗。
特性字符串，Key/value使用=连接，字符串之间使用,连接

| 键                                            | 值                    | 说明                                                                                                 |
| --------------------------------------------- | --------------------- | ---------------------------------------------------------------------------------------------------- |
| fullscreen|	"yes"或"no"	表示新窗口是否最大化。 | 仅限IE支持                                                                                                               |
| height                                        | 数值新窗口高度。      | 这个值不能小于100                                                                                    |
| left                                          | 数值新窗口的x轴坐标。 | 这个值不能是负值                                                                                     |
| location                                      | "yes"或"no"           | 表示是否显示地址栏。不同浏览器的默认值也不一样。在设置为"no"时，地址栏可能隐藏或禁用（取决于浏览器） |
| Menubar                                       | "yes"或"no"           | 表示是否显示菜单栏。默认为"no"                                                                       |
| resizable                                     | "yes"或"no"           | 表示是否可以拖动改变新窗口大小。默认为"no"                                                           |
| scrollbars                                    | "yes"或"no"           | 表示是否可以在内容过长时滚动。默认为"no"                                                             |
| status                                        | "yes"或"no"           | 表示是否显示状态栏。不同浏览器的默认值也不一样                                                       |
| toolbar                                       | "yes"或"no"           | 表示是否显示工具栏。默认为"no"                                                                       |
| top                                           | 数值新窗口的y轴坐标。 | 这个值不能是负值                                                                                     |
| width                                         | 数值新窗口的宽度。    | 这个值不能小于100                                                                                    |
### 修改
```js
let wroxWin = window.open("http://www.wrox.com/","wroxWindow","height=400,width=400,top=10,left=10,resizable=yes");
// 位置移动
wroxWin.moveTo(100, 100);
// 大小缩放
wroxWin.resizeTo(500, 500);
// 关闭
wroxWin.close();
top.close()
```
## 视口位置
### 读取
背景：浏览器窗口尺寸通常无法满足完整显示整个页面，为此用户可以通过滚动在*有限的视口*中查看文档
	1. 文档相对于视口**滚动距离** 
		1. window.pageXoffset === window.scrollX
		2. window.pageYoffset === window.scrollY
### 调整
1. 滚动文档：scroll()、scrollTo()和scrollBy()
	1. 正常滚动与平滑滚动
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
## 视口大小
1. innerWidth
	1. 视口：包含滚动条
	2. 缩放系数不为100%（存在缩放）时，等于逻辑像素
```js
// 窗口大小不好确定，但可确定视口大小
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
2. document.documentElement.clientWidth：视口大小

## 定时器
JS是单线程，每次只能执行一段代码，为了调度不同代码的执行，JS维护了一个任务队列。
1. 要执行的任务代码
	1. 函数
	2. 包含JS代码的字符串
2. 向队列添加该任务之前等待的时间。
	1. 在多少秒之后，把该任务添加到任务队列。（而不是执行之前等待的时间，也不是执行过程的耗时）
3. 返回值：用于取消等待中的排期任务。
4. 分类
	1. setTimeout()
		1. 不一定要记录超时ID，因为它会在条件满足时自动停止，否则会自动设置另一个超时任务
		2. 因为一个任务结束和下一个任务开始之间的*时间间隔无法保证*，所以有些循环定时任务可能会因此而被跳过
	2. setInterval()
		1. 适合执行时间短、非阻塞的任务。
		2. 一般来说，**即使时循环任务也最好不要使用**，而是使用timeout
## 系统对话框
功能：调用*浏览器的系统对话框*，向用户展示消息。
特性
	1. 结构：与正在展示的网页无关、不包含 HTML
	2. 样式：由浏览器决定，无法使用CSS设置
	3. JS：展示时后续 JS 代码停止，消失时才会继续执行。
### alert（提醒）
功能：用户无法控制的消息，如报错
接收：一个[[String]]。如果不是[[String]]则会自动调用toString。
特点：只有一个OK按钮
### confirm（交互）
特点：两个按钮。
功能：想确定用户点击了什么值，可使用调用的返回值（boolean）
	true: 确定
	false: 取消或关闭
### prompt（进一步交互）
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