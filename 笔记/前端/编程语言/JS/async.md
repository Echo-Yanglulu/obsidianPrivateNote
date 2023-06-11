

使用[[Promise]]定义一个pending任务并定义好resolve与reject，

await该promise

![[Pasted image 20230611145956.png]]
因为await只解包状态为resolved的promise对象，所以后面不会执行。