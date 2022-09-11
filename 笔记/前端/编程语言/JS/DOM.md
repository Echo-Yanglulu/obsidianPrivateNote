文档对象模型。一种标准：定义了JS处理HTML使用的API。是与==语言无关==的HTML处理接口。
	1. 提供了JS处理DOM的方法，与JS无关？

clientWidth：
clientHeight：某个元素的content + padding。不含滚动条
offsetWidth：某个元素的content + padding + border。
offsetHeight：某个元素的clientHeight + border。含滚动条
	1. 元素自身有fixed定位，则
scrollY：被滚动的高度
offsetTop：元素距离<u>定位父元素</u>的顶部偏移量
offsetParent：元素距离<u>定位父元素</u>的顶部偏移量，如果一直没有最多上升到body元素。
	1. 元素自身有fixed定位，则为Null
	2. 无fixed，且上级无定位：body元素
	3. 无fixed，上级有定位：存在定位的上级元素
	4. body元素：null
