# 概述
是[[Promise]]的一个语法糖
# 形式
1. 使用promise创建一个耗时任务
2. 使用async创建一个异步任务，await该耗时任务
3. 返回值：被包裹为一个Promise对象
	1. 可在另一个异步函数中await执行该async函数
4. 错误捕获时，在async函数内，进行await时进行try/catch
# 应用
使用[[Promise]]定义一个pending任务并定义好resolve与reject
在async函数内，await该使用promise创建的任务

在async函数内，每次await，语句下方都是一次回调的包裹
	1. 到此，当前的async函数已经执行完毕，剩下的都是回调，应该放在后面再执行。

![[Pasted image 20230611145956.png]]
因为await只解包状态为resolved的promise对象，所以声明p4的后面都不会执行【直接报错】。