# 概述
是[[Promise]]的一个语法糖

# 应用
使用[[Promise]]定义一个pending任务并定义好resolve与reject
await该promise创建的任务

在async函数内，每次await，语句下方都是一次回调的包裹
	1. 到此，当前的async函数已经执行完毕，剩下的都是回调，应该放在后面再执行。
返回值被包裹为一个Promise对象

await该promise

![[Pasted image 20230611145956.png]]
因为await只解包状态为resolved的promise对象，所以声明p4的后面都不会执行【直接报错】。