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
		1. 在class组件中可看到，react通过render方法生成v-dom，从而绘制出真实的dom
4. 如何进行diff
	1. 修改state，调用render方法调用产生一个v-dom
	2. 通过对比新旧v-dom确定需要更新的内容

## dom更新过程
1. 调用dom api更新
	1. 
2. 通过v-dom更新
	1. 每次render生成一个新的v-dom
	2. diff新旧v-dom，确定变更
	3. 调用dom api更新

表面上看起来好像v-dom更新dom的过程多了几步。
频繁操作dom会引起页面重绘