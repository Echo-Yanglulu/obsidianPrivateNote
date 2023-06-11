# 概述
状态
	1. 三种状态pending, resolved, rejected
	2. 调用resolved改变状态为resolved并传参。调用rejected改变状态为rejected并传参 
		1. 状态的改变不可逆的
		2. 状态变为resolved时，执行then内代码
			1. 后续then中正常返回，则得到一个resolved状态的promise
			1. 后续then中返回异常，则得到一个rejected状态的promise
		3. 状态变为rejected时，执行then第二个函数或catch内代码【在错误处理中，如果返回正常，则得到一个解决的promise 】
			4. 执行时无报错 ，则返回resolved状态的promise
			5. 执行时报错，则返回rejected状态的promise
	3. 可直接创建一个落定的Promise对象
		1. Promise.resolve()创建解决
		1. Promise.reject()创建拒绝 
# API

# 手写
```js
```
# 应用
1. 加载图片
2. 利用抛出异常，连续处理多个任务。