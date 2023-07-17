# 概述
格式
	1. 相对路径
	2. 绝对路径
## 分类
1. Data URL：前缀为 `data:` 协议的 URL。
	1. 允许内容创建者*向文档中嵌入小文件*。
	2. 之前被称作“data URI”，直到这个名字被 [[WHATWG]] 弃用

查询参数
	1. location.search
	2. URLSearchParams API
		1. `const params = new URLSearchParams(location.search)` 
		2. `params.get(key)` 