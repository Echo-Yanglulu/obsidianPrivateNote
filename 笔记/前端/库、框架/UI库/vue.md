# 概述
类似[[angular]] ，也是全功能Web应用程序框架。

许多选择它的人因为它的高性能、易组织，同时不过于主观。

# 基本特性
组件通讯
	1. 父子
		1. props 与 this.$emit(事件名，参数)
	2. 全局
	3. 非嵌套
	4. 事件中心
		1. 自定义事件
		2. vue2可以通过 `new Vue()` 创建一个事件中心，vue3不再支持【可自定义或三方库】
	5. $attr
	6. $parent
	7. $refs
	8. provide/inject
	9. [[vuex]] 
data
computed：类似于派生 state，根据 state 生成一个新数据，会被缓存【当 state 改变时*重新计算并缓存数据*】
watch：一个 state 改变后，接收它的新值和旧值，可进行对比后执行变更逻辑【当 state 改变时*重新执行逻辑*】

# 高级特性

# [[vue原理]] 

# [[vue性能优化]] 
