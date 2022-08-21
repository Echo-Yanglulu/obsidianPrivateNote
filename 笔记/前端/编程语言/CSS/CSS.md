# 引入
1. style标签
2. 行内
3. @import(css文件内)
4. HTTP
[[选择符，选择器]]
[[特指度，优先级]]
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
	2. scroll：有滚动条(win)，mac下没有超出设置scroll也不会有（mac下auto与scroll效果相同）
	3. hidden：无滚动条，超出隐藏
	4. visible：无滚动条，超出展示
2. background（盒子的底层，不会影响正文布局）
	1. 颜色
		1. 单一色
		2. 渐变色
			1. background : linear-gardient(45deg, red, green)  从45度开始
			1. background : linear-gardient(45deg, red 0, green 10%, yellow 50%, blue 100%) 光栅
			2. background: linear-gradient(135deg, transparent 0, transparent 49.5%, green 49.5%, green 50.5%, transparent 50.5%, transparent 100%), linear-gradient(45deg, transparent 0, transparent 49.5%, red 49.5%, red 50.5%, transparent 50.5%, transparent 100%);    background-size: 30px 30px;
	2. 图片(**图片在颜色之上**。即如果图片是不透明的，则颜色看不到)
		2. 背景图，雪碧图
	3. 图片展示
		1. background-repeat（平铺）
			1. repeat（重复多次填满盒子背景）
			2. no-repeat（只展示一次设置的图片。此时如果有背景色，可看到图片外剩余部分的颜色）
			3. repeat-x：只在水平方向平铺
		2. background-position（背景图在盒子的位置）
			1. center center
		3. background-size
			1. 100px 50px
	4. 多背景
	5. base64与性能优化
	6. 多分辨率适配
针对特定媒体的样式