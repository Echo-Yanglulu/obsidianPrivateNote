# 概述
本质：是一种新的API设计方法/理念/方式。
	1. 传统[[API]]设计：把每个[[URL]]当成一个**功能** 
		- 传统的methods。
			- 传统网站只有两个：get获取和post提交，增删改可通过post模拟
	1. RESTful API：把每个URL当成一个**资源标识** 
		- 现在的methods。
			- post 新增
			- delete删除
			- patch、put更新
			- get获取
那么，如何设计成一个资源？/特性
	1. 尽量不用*查询参数* 
		1. 传统API设计：/api/list?pageIndex=2[^1] 
		2. RESTful API设计：/api/list/2[^2] 
	2. *操作类型* 
		1. 传统：用路径表示操作类型
			1. 创建博客。使用post请求，访问/api/create-blog
			2. 更新博客。使用post请求，访问/api/update-blog?id=100
			3. 获取博客。使用get请求，访问/api/get-blog?id=100
		2. RESTful API：用method表示操作类型
			1. 创建。/api/blog
			2. 更新。/api/blog/100
			3. 获取。/api/blog/100

# 相关
[[HTTP Method]] 


[^1]: 像一个函数，传查询参数
[^2]: 是一个资源表示