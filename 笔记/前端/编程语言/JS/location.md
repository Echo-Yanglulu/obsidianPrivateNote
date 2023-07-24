定义：当前窗口中加载的**文档信息** 
功能
	1. **URL信息**：把[[URL]]解析为离散片段，保存在属性中 
		2. href：整个网址
		3. protocal：协议
		4. username
		5. password
		6. host
			1. hostname
			2. port
		7. pathname：路径。端口后，查询参数前
		8. search：查询参数。?name=abc&password=admin
			1. URLSearchParams对象，get, set, delete
		9. hash：哈希。#home。
		10. origin：源。https://www.rox.com。**只读** 
	2. **导航功能** 
		1. 无记录导航。replace(URL)
		2. 加记录导航
			1. 整体：location.assign(), 直接为**location.href**[^1]，window.location两个属性赋值（本质也是以新URL调用assign）
			2. 部分：hostname, port, pathname, search, hash属性赋值。只有修改hash不会导致重新加载
		3. 重载。location.reload()
			1. 无参数，智能使用缓存。
			2. 传true：强制使用服务器资源
特点
	1. 是window的属性，也是document的属性

查询参数：?开头，单个键值对内部用=连接，键值对之间用&连接。

[^1]: 最常见