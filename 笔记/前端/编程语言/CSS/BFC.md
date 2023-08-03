名：块状格式化上下文
定义：一个**块级独立渲染区域**，内部的渲染不会影响**border**之外的元素

形成条件：PDFO
	1. position是absolute或fixed
	2. display
		1. inline-block, table, table-row, table-cell 等
		2. flex、grid 的直接子元素
	3. float不是none
	4. overflow不是visible

应用
	1. 清除浮动。一个元素清除浮动后，浮动的子元素会纳入当前元素内文档流，即实现了浮动，又清除了浮动的“脱离文档流”效果。
		1. 因为形成了一个块状的独立渲染区域，强制内部元素不影响外部元素，所以内部浮动出来的元素被限制在了BFC内？