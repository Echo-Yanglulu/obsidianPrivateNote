

使用[[Promise]]定义一个pending任务并定义好resolve与reject，

返回值被包裹为一个Promise对象

await该promise

![[Pasted image 20230611145956.png]]
因为await只解包状态为resolved的promise对象，所以声明p4的后面都不会执行【直接报错】。