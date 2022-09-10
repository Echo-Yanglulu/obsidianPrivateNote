#  概述
cascading style sheet：层叠样式表
将特定样式应用到特定元素
特点
	1. 不是编程语言，却要求抽象思维，不是设计工具，却要求创造力。提供了看似简单的声明式语法，却能写得极其复杂
	2. 最好的解决办法通常取决于具体场景，以及你希望以多大粒度处理边缘情况
# 引入
1. style标签
2. 行内
3. @import(css文件内)
4. HTTP
[[特指度，优先级]] 
层叠：以任意方式（[[选择器]]）选中了**同一个元素**后，声明冲突时，最先定义的样式会被层叠掉。
优先级
继承
特殊值
属性简写
[[值与单位]] 
[[字体]] 
[[文本]] 
[[视觉格式化基础]] 
[[盒模型]] 
[[浮动]] 
[[定位]] 
[[布局]] 
[[变形]] 
[[过渡]] 
[[动画]] 
[[滤镜]] 
[[混合]] 
[[裁剪]] 
[[遮罩]] 

# 大型应用程序中的CSS
[[模块化CSS]]
模式库
[[CSS预处理器]]


颜色
	1. 格式
		1. 16进制
		2. hsl
			1. 色相（0-360度）
			2. 饱和度（0-100%）
			3. 亮度（0-100%）【亮度到100是白色，50是纯色】
			4. hsl(60， 100%，50%)
		3. hsla
		4. rgb
		5. rgba
1. overflow（内容超出）
	1. auto：自动滚动条（默认）：超出则有，否则没有
	2. scroll：有滚动条(win)，（mac下auto与scroll效果相同）
	3. hidden：无滚动条，超出隐藏
	4. visible：无滚动条，超出展示
2. background（盒子的底层，不会影响正文布局）
	1. 颜色
		1. 单一色
		2. 渐变色
			1. linear-gardient 默认从上到下
				1. background : linear-gardient(45deg, red, green)  从45度开始
				2. background : linear-gardient(45deg, red 0, green 10%, yellow 50%, blue 100%) 光栅
				3. background: linear-gradient(135deg, transparent 0, transparent 49.5%, green 49.5%, green 50.5%, transparent 50.5%, transparent 100%), linear-gradient(45deg, transparent 0, transparent 49.5%, red 49.5%, red 50.5%, transparent 50.5%, transparent 100%);    background-size: 30px 30px;
	2. 图片(**图片在颜色之上**。即如果图片是不透明的，则颜色看不到)
		1. 背景图，雪碧图(通过调整盒子宽高与背景图位置)【宽高等于需要的图片的宽高，位置对上即可】
		2. 图片展示
			1. background-repeat（平铺）
				1. repeat（重复多次填满盒子背景）
				2. no-repeat（只展示一次设置的图片。此时如果有背景色，可看到图片外剩余部分的颜色）
				3. repeat-x：只在水平方向平铺
			2. background-position（背景图在盒子的位置）
				1. center center
			3. background-size（适配移动端时需要，移动端分辨率较高）
				1. 100px 50px
	3. 多背景
	4. base64与性能优化
	5. 多分辨率适配
针对特定媒体的样式