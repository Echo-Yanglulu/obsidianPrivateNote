# 概述
状态
	1. 三种状态pending, resolved, rejected
	2. 调用resolved改变状态为resolved。调用rejected改变状态为rejected
		1. 状态的改变不可逆的
		2. 状态变为resolved时，执行then内代码
		3. 状态变为rejected时，执行then或catch内码

# API

# 手写
```js
```
# 应用
1. 加载图片