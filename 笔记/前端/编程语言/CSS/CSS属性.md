# 概述
# 字体
# 文本
1. text
	1. decoration
	2. indent
# [[盒模型]] 
# 定位

1. position：元素的位置
	1. relative：相对于自身
	2. absolute：相对于存在定位属性（值可是三种之一）的上级元素，直到body
	3. fixed
2. display：显示
	1. block
	2. flex
	3. grid
	4. table
	5. inline
	6. inline-block
	7. inline-flex
	8. inline-gird
	9. inline-table
	10. table-caption
	11. table-row
	12. table-cell
	13. table-column

background-clip
![[Pasted image 20230616150834.png]] 

line-height
	1. 取值规则
		1. 值：px
		2. 比值：相对于自身font-size的比例【会被继承】
		3. 百分比：相对于自身font-size的比例【不被继承】
	2. 继承规则
		1. 值或比值：直接向下继承[^1]该值或比例
		2. 百分比：先乘以自身的font-size，再将值向下继承[^2] 

# 顺序
1. 定位与布局。位置，偏移，z-index，float, clear, flexbox
2. 展示与可见: display, opacity, visibility
3. [[盒模型]] :
4. 背景: background
5. 字体、文本: color, 
6. 其他属性:overflow, clip, cursor, transform, animation, white-space


[^1]: 如30px，或2，会直接继承给子元素
[^2]: 如200%，则先乘以自身的font-size，再向下继承