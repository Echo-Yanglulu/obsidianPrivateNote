# 概述
[[HTTP Method]] 
背景
	1. 传统的methods。传统网站只有两个：get获取和post提交，增删改可通过post模拟
	2. 现在的methods。
		- post 新增
		- delete删除
		- patch、put更新
		- get获取
本质：是一种新的API设计方法/理念/方式。
	- 传统API设计：把每个[[URL]]当成一个**功能** 
	- RESTful API：把每个URL当成一个唯一的**资源标识** 
那么，如何设计成一个资源？
	1. 尽量不用查询参数
		1. 传统API设计：/api/list?pageIndex=2[^1]
		2. RESTful API设计：/api/list/2[^2]
	2. 用method表示操作类型

[^1]: 像一个函数，传查询参数
[^2]: 是一个资源表示