名：块状格式化上下文
定义：一个块级的独立渲染区域
	1. 内部元素的渲染不会影响border之外的元素

形成条件
	1. position是absolute或fixed
	2. display是flex, inline-block等
	3. float不是none
	4. overflow不是visible

应用
	1. 清除[[浮动]]。一个元素清除浮动后，内部浮动的元素会纳入文档流。浮动在内部的两侧。
		1. 因为形成了一个块状的独立渲染区域，强制内部元素不影响外部元素，所以内部浮动出来的元素被限制在了BFC内？