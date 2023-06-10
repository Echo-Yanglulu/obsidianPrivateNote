块状格式化上下文
定义：一个块状的独立渲染区域，内部元素的渲染不会影响border之外的元素

形成
	1. float不是none
	2. position是absolute或fixed
	3. display是flex, inline-block等
	4. overflow不是visible

应用
	1. 清除[[浮动]]。一个元素清除浮动后，内部浮动的元素会纳入文档流。浮动在内部的两侧。