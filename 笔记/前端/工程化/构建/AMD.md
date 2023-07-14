Asyncchronous Module Definition（异步模块定义）规范
加载模块依赖方式：**异步**
本质是个闭包，写起来有点不自然，使用方式也是异步的。

使用
	1. 引入模块：require()
	2. 定义新模块：define()

实现
	1. require.js基于AMD实现