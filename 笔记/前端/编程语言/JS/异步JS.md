浏览器与node中的API默认都是异步的
	1. 浏览器
		1. 事件
		2. 定时器
		3. 网络请求
	2. node
		1. 文件读写
		2. 网络请求
		3. 发送接收数据

[[event-loop]] 

# 有序异步任务
解决方案
	1. 回调嵌套/地狱
	2. [[Promise]] 
	3. [[async]] 
		1. promise也是基于回调函数，它是用看起来同步的方式写异步。只是个语法糖
	4. [[生成器]] 
	5. iterable

使用async与promise的区别
	1. 都需要定义promise，不同的是Promise状态改变之后的处理逻辑换了一种书写方式
	2. 前者
		1. await相当于then。
			2. 后面是promise对象，会解包，拿出解决值。
			3. 后面是普通值，拿出该值
		2. 返回值会被包装为一个解决的promise对象， 
		3. 捕获异常需要使用try...catch... 

# 异步中API的分类
## 宏任务
定义：
组成：定时器，ajax，DOM事件，promise中的主任务
## 微任务
定义：
组成：promise.then()
## event-loop与dom渲染

## 执行顺序
1. 所有宏任务
2. 此次宏任务执行时添加的微任务