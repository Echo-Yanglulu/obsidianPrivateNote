1. position：元素的位置
	1. relative：相对于自身
	2. absolute：相对于存在定位属性（值可是三种之一）的上级元素，直到body
	3. fixed
2. display：显示
	1. block
	2. inline
	3. inline-block
	4. table
	5. table-cell

background-clip

line-height
	1. 取值规则
		1. 固定值
		2. 比例：相对于自身font-size的比例【会被继承】
		3. 百分比：相对于自身font-size的比例【不被继承】
	2. 继承规则
		1. 值或比例：直接向下继承[^1]该值或比例
		2. 百分比：先乘以font-size，再将值向下继承[^2]

[^1]: 如30px，或2，会直接继承给子元素
[^2]: 如200%，则先乘以自身的font-size，再向下继承