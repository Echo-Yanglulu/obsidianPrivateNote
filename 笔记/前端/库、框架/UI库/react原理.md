# 源码解析

# virtual dom
1. v-dom是什么
	1. 官方定义：一个编程概念，被保存在内存中的*对UI的映射*，并通过某些库（如React-DOM）渲染为真实的DOM
2. 特性
	1. 一处学习，随处使用。
		1. V-dom提供了对HTML DOM的抽象，所以在web开发中通常不用调用[[DOM]] api
		2. 也是因为它提供了ＤＯＭ的抽象，也可用于开发Native
3. 过程
	1. 在web开发中，v-dom如何渲染为html元素。
		1. 在class组件中可看到，react通过render方法的
4. 如何进行diff