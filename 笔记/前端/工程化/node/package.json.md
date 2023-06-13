[[node项目]]中的一个文件，用于定义**项目的相关信息**。
	1. 必须属性
		1. 名称
		2. 版本
			1. [[版本规范]] 
	2. 描述信息
		1. description
		2. 关键词
		3. 作者
		4. 贡献者
		5. 主页
		6. 仓库
		7. bugs：项目的bug提交地址
	3. 依赖配置
		1. [[开发依赖]] 
		2. [[运行依赖]] 
		3. optionalDependencies
		4. bundledDependencies
		5. engines
	4. 脚本配置
		1. [[脚本]] 
		2. config：脚本运行时的配置参数
	5. 文件与目录
		1. 
	6. 许可
# name
项目名称
发布到npmjs.com为以该字段命名
另一种格式（作用域包）：@scope/name。如@babel/core就是babel作用域下的用于转换ES6语法的core包
# author
作者
# version
版本号
[[]]
# dependencies
离开该依赖项则项目无法正常**运行**（运行依赖）
## 版本号

# devDependencies:
开发依赖：对项目进行**开发**或修改时必须用到的包
# license
版权许可

存在于所有node程序、node库

# 参考
1. [Fetching Title#6aqu](https://blog.csdn.net/qq_34703156/article/details/121401990)