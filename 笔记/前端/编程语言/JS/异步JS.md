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
[[宏任务]] 
[[Promise]] 
[[async]] 
# 有序异步任务
解决方案
	1. 回调嵌套/地狱
	2. [[Promise]] 
	3. [[async]] 
	4. [[生成器]] 
	5. iterable