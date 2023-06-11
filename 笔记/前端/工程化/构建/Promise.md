# 概述
状态
	1. 三种状态pending, resolved, rejected
	2. 调用resolved改变状态为resolved并传参。调用rejected改变状态为rejected并传参 
		1. 状态的改变不可逆的
		2. 状态变为resolved时，执行then内代码
		3. 状态变为rejected时，执行then或catch内码
	3. 可直接创建一个落定的Promise对象
		1. Promise.resolve()创建解决
		1. Promise.reject()创建拒绝 
# API

# 手写
```js
```
# 应用
1. 加载图片