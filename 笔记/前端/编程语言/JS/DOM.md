[DOM 概述 - Web API 接口参考 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model/Introduction?spm=a21iq3.home.0.0.54b42764PcwehE) 
文档对象模型。一种标准：定义了JS处理HTML使用的API。是与==语言无关==的HTML处理接口。
	1. 提供了JS处理DOM的方法，与JS无关？

浏览器解析HTML文档时，在内存中将每个元素表示为DOM。树状结构，每个元素都由一个节点表示
# 属性
clientWidth：元素的**content+padding**。
clientHeight：某个元素的content + padding。不含滚动条（不含滚动部分？？只是展示出来的部分？）
	document.documentElement.clientWidth：页面的宽高
clientLeft：元素左border宽度
scrollHeight：元素的content + padding，包含滚动部分。
	1. 超出内容没有滚动：等于clientHeight
	2. 超出内容有滚动：==滚动内容高度== + ==padding==
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
offsetWidth：某个元素的**content + padding + border**。即clientWidth + clientLeft
offsetHeight：某个元素的clientHeight + border。含滚动条
offsetTop：元素上边框与offsetParent元素的上边框距离

# 方法
window.scrollTo(x, y)：文档左上角滚动到某个点


当前元素在<u>页面</u>上的偏移量