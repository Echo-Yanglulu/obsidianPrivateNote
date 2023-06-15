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
	6. 第三方配置
		1. eslintConfig
		2. [[babel]] 
		3. unpkg：使用该字段可以让 npm 上所有的文件都开启 cdn 服务，该 CND 服务由 unpkg 提供
		4. lint-staged：一个在 Git 暂存文件上运行 linters 的工具，配置后每次修改一个文件即可给所有文件执行一次 lint 检查，通常配合 gitHooks 一起使用。
		5. gitHooks：用来定义一个钩子，在提交（commit）之前执行 ESlint 检查。在执行 lint 命令后，会自动修复暂存区的文件。修复之后的文件并不会存储在暂存区，所以需要用 git add 命令将修复后的文件重新加入暂存区。在执行 pre-commit 命令之后，如果没有错误，就会执行 git commit 命令
		6. browserslist。告知支持哪些浏览器及版本。Babel、Autoprefixer 和其他工具会用到它，以将所需的 polyfill 和 fallback 添加到目标浏览器
	7. 许可
# name
项目名称
发布到npmjs.com为以该字段命名
另一种格式（作用域包）：@scope/name。如@babel/core就是babel作用域下的用于转换ES6语法的core包
# author
作者
# version
版本号

# dependencies
离开该依赖项则项目无法正常**运行**（运行依赖）
## 版本号

# devDependencies:
开发依赖：对项目进行**开发**或修改时必须用到的包
# license
1. 版权许可
2. 软件的开源协议，开源协议表述了其他人获得代码后拥有的权利，可以对代码进行何种操作，何种操作又是被禁止的
## MIT 
只要用户在项目副本中包含了版权声明和许可声明，他们就可以拿你的代码做任何想做的事情，你也无需承担任何责任。
## Apache 
类似于 MIT ，同时还包含了贡献者向用户提供专利授权相关的条款。
## GPL 
修改项目代码的用户再次分发源码或二进制代码时，必须公布他的相关修改。
# 参考
1. [package.json 最全详解\_HURRICANE\_FAST的博客-CSDN博客](https://blog.csdn.net/qq_34703156/article/details/121401990) 