# 概述 
组件的上下文
在组件树中==深层传递==数据时避免使用冗长的props
## 16.3之前的context api
不要/不需要使用
	1. 大部分应用
	2. 如果想要应用稳定
	3. 还在学习react
## 新context api
台前工作的context api
# 功能
==深层传递==数据
	1. 主题
	2. 支付
	3. 用户信息
# 原理
context的传递：在渲染过程中执行
	1. 如果当前class组件没有更新，会导致接收失败[^1] 
		1. shouldComponentUpdate返回false，或pureComponent，或其他自定义优化避免了更新
# 使用
1. 定义
	1. 在需要共享数据的最小公约数父组件
	2. 在一个单独的context.js文件中定义
子组件中
	1. class组件
	2. 函数组件
		1. 要添加contextTypes属性

# 注意

[^1]: 子组件无法获取最新的context