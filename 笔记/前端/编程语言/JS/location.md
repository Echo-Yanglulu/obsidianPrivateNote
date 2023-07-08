功能
	1. 当前窗口中加载的**文档信息** 
	2. **URL信息**：把[[URL]]解析为离散片段，保存在属性中 
		1. 查询字符串：URLSearchParams对象，get, set, delete
	3. **导航功能**/操作地址
		1. 导航
		2. 修改浏览器的地址：通过修改location对象
			1. 都会导航并新增历史记录
				1. location.assign, window.location = , **location.href** 
				2. 修改当前URL：hostname, port, pathname, search, hash属性赋值
				3. 页面重新加载新URL：修改hash之外的值
			2. 不增加记录的导航
				1. replace(URL)
			3. location.reload()：无参数，智能使用缓存。传true：强制使用服务器资源
特性
	1. 是window的属性，也是document的属性
URL信息
	1. href：整个网址
	2. protocal：协议
	3. username
	4. password
	5. host：域名+端口
		1. hostname：域名
		2. port
	6. pathname：路径。端口后，查询参数前
	7. search：查询参数。?name=abc&password=admin
	8. hash：哈希。#home

查询参数：?开头，单个键值对内部用=连接，键值对之间用&连接。