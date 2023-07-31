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
# 分类
## 属性
[[属性选择器.png]] 
	1. 拥有某个属性
	2. 某个属性为某个取值
	3. 属性值包含、开头、结尾
	4. 属性值包含val，且val与其他值以空格连接。
	5. 属性值等于val或以val-开头
## 伪类[^1] 
目的：选中处于*特定状态*的元素
动态伪类
	:link：未访问的链接
	:visited 已访问的链接
	:focus 
	:hover 必须放在上面两个之后才能生效
	:active。点击了，但没有松手。必须放在hover后才生效
	如果需要同时写5个，按照这样的顺序
目标伪类
	:target：当前url中hash值与匹配id属性值的元素
语言伪类
	:lang()
元素状态伪类
	:enabled
	:disabled
	:checked
结构伪类
	:first-child
	:last-child
	:nth-child()
	:nth-last-child()
	:first-of-type
	:last-of-type
	:nth-of-type()
	:nth-last-of-type
	:only-of-type
	:root
	:empty
	:only-child
否定伪类
	:not()
## 伪元素
功能：为*所选元素的特定部分*设置样式
::selection 以用户选择的文本部分为目标
```css
::selection {
  background-color: yellow;
  color: red;
}
用户在页面上选择文本时，它将以黄色背景和红色文本颜色突出显示
```
::first-letter 块级元素的第一个字母
```css
p::first-letter {
  font-size: 2em;
  color: red;
}
每个段落的第一个字母将以更大的字体显示并显示为红色
```

::first-line  文本或块级元素的第一行
```css
p::first-line {
  font-weight: bold;
  text-decoration: underline;
}
每个段落的第一行将以粗体显示并带有下划线
```
::marker 列表项的标记
```css
li::marker {
  color: blue;
  font-weight: bold;
}
```
::placeholder 输入字段和文本区域中设置占位符文本的样式
```css
input::placeholder {
  color: #999;
  font-style: italic;
}
占位符文本将以浅灰色和斜体字体样式显示
```
::cue `<audio>` 或 `<video>` 元素的提示文本
```css
提示文本通常用于多媒体内容中的字幕或副标题
video::cue {
  color: white;
  background-color: black;
}
```
::grammar-error 和::spelling-error 标记为语法或拼写错误的文本部分
```css
p::grammar-error {
  text-decoration: line-through;
  color: red;
}

p::spelling-error {
  text-decoration: underline;
  color: blue;
}
段落中的语法错误将以划线文本修饰和红色显示，而拼写错误将以下划线和蓝色显示
```
::backdrop 与全屏 API 结合使用，以在全屏模式下自定义*元素背后的背景*。默认的黑色背景更改为自定义颜色或样式
```css
video::backdrop {
  background-color: gray;
}
当一个视频元素处于全屏模式时，它后面的背景将有一个灰色的背景色
```
::target-text 滚动到的文本（如果浏览器支持文本片段）
```css

::target-text {
  background-color: rebeccapurple;
  color: white;
}
此 API 目前处于试验阶段。
```
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

[^1]: 小杨想学习法语，*目标语言*具有*动态结构*，部分*否定*了之前学习过的*元素状态*。