功能：为同类型的所有元素应用某一组样式。
如：一行代码就能改变所有标题的颜色

理解：同一个结构的HTML内容应使用同一组样式，方便修改。

# 基础
## 优先级
1. !important
2. id
3. 类
4. 标签
5. 继承
6. 内置
## 分类
### 属性
[[属性选择器.png]] 
	1. 拥有某个属性
	2. 某个属性为某个取值
	3. 属性值包含、开头、结尾
	4. 属性值包含val，且val与其他值以空格连接。
	5. 属性值等于val或以val-开头
### 伪类
功能：选择处于特定状态的元素
动态伪类
	:hover
	:focus
	:visited
	:active
目标伪类
	:target：当前url中hash值与匹配id属性值的元素
语言伪类
	:lang()
元素状态伪类
	:enabled
	:disabled
	:checked
结构伪类
	:nth-child()
	:nth-last-child()
	:nth-of-type()
	:nth-last-of-type
	:first-child
	:last-child
	:first-of-type
	:last-of-type
	:root
	:only-child
	:only-of-type
	:empty
否定伪类
	:not()
### 伪元素
# 复合
优先级：计算加法即可。
同级
	1. .a+.b：选中.a后面的第一个.b
	2. .a~.b：选中.a后面的所有.b
后代
	1. 所有后代：选择器之间使用*空格* 
	2. 直接后代：选择器之间使用>
交集：必须同时满足。选择器之间*紧邻*
	为了精准选择
并集：选择一个即可。选择器之间*,* 
	为了同时设置多个

# 属性
