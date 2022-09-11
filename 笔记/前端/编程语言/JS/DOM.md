文档对象模型。一种标准：定义了JS处理HTML使用的API。是与==语言无关==的HTML处理接口。
	1. 提供了JS处理DOM的方法，与JS无关？

clientWidth：元素的**content+padding**。
clientHeight：某个元素的content + padding。不含滚动条（不含滚动部分？？只是展示出来的部分？）
	document.documentElement.clientWidth：页面的宽高
clientLeft：元素左border宽度
scrollHeight：元素的content + padding，包含滚动部分。
	1. 超出内容没有滚动：等于clientHeight
	2. 超出内容且滚动：所有子元素的高度之和
	3. 如果设置scroll为auto，content高为手动设置的高度，clientHeight不含border
	4. 如果设置scroll为scroll，content高缩小
offsetWidth：某个元素的**content + padding + border**。即clientWidth + clientLeft
offsetHeight：某个元素的clientHeight + border。含滚动条
	1. 元素自身有fixed定位，则
scrollY：被滚动的高度
offsetParent：元素距离<u>定位父元素</u>的顶部偏移量，如果一直没有最多上升到body元素。
	1. 元素自身有fixed定位，则为Null
	2. 无fixed，且上级无定位：body元素
	3. 无fixed，上级有定位：存在定位的上级元素
	4. body元素：null
offsetTop：元素上边框与offsetParent元素的上边框距离

当前元素在<u>页面</u>上的偏移量