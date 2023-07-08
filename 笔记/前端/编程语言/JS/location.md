功能
	1. 当前窗口中加载的**文档信息** 
	2. **URL信息**：把[[URL]]解析为离散片段，保存在属性中 
		2. href：整个网址
		2. protocal：协议
		3. username
		4. password
		5. host：域名+端口
			1. hostname：域名
			2. port
		6. pathname：路径。端口后，查询参数前
		7. search：查询参数。?name=abc&password=admin
			1. URLSearchParams对象，get, set, delete
		8. hash：哈希。#home
	3. **导航功能** 
		1. 导航
			2. replace(URL)
		2. 导航并新增历史记录
			3. location.assign, location.href=，window.location = ,
			4. 修改当前URL：hostname, port, pathname, search, hash属性赋值
			5. 修改hash之外的值：页面重新加载新URL
		3. location.reload()：无参数，智能使用缓存。传true：强制使用服务器资源
特性
	1. 是window的属性，也是document的属性
URL信息


查询参数：?开头，单个键值对内部用=连接，键值对之间用&连接。