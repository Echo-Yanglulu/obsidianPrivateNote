有些任务比较耗时，但JS是单线程的，不能借助多线程完成该任务，所以作为异步任务：在主线程空间时执行。
浏览器与node中的API默认都是异步的
	1. 浏览器
		1. 事件
		2. 定时器
		3. 网络请求
	2. node
		1. 文件读写
		2. 网络请求
		3. 发送接收数据
# 原理
异步的基础原理：[[event-loop]] 
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
宏任务是浏览器规定的，微任务是ES6语法规定的。
## 宏任务
定义：
包含：同步脚本，定时器，ajax，DOM事件，promise中的主任务，setImmediate(node 独有)，requestAnimationFrame(浏览器独有)，IO，UI render（浏览器独有）
## 微任务
定义：有一个专门的微任务队列。
包含：process.nextTick(node 独有)、Promise.then()、Object.observe、MutationObserver
## [[event-loop]]与dom渲染
微任务的执行先于宏任务。为什么？

执行一段添加DOM的JS操作后（调用栈清空后），浏览器开始渲染DOM，然后再开始轮询任务队列
	1. 调用栈清空
	2. 微任务执行【存在专用的微任务队列】
	3. 尝试[[DOM]]渲染
	4. 触发event-loop。轮询回调队列【专用于对宏任务排队】
因为，**微任务在DOM渲染前执行，宏任务在DOM渲染后执行**，所以，微任务的执行先于宏任务。为何先微任务？
	1. 从[[event-loop]]出发，理解为何微任务先执行
## 执行顺序
1. 所有宏任务
2. 此次宏任务执行时添加的微任务