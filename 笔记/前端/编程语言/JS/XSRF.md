跨站请求伪造（Cross site request forgery）

机制
	1. 一个用户看上了一个商品，付费接口是xxx.com/pay?id=100，设置了小额不需要验证。
	2. 我看上了一个商品，id=200。
	3. 我向用户发送邮件，正文隐藏