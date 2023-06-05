# 概述
## 定义
1. 是[[node]] 的[[包管理器||包管理器/包管理工具]]。用于
**安装**存放于大型中心仓库上的三方包、**管理**[[node项目]] 中的依赖项。
2. 世界上最大的软件注册表，包含超过60W个包（即package、代码模块）
## 特性
1. 在npm仓库中发布的包可指定为项目依赖，通过CLI本地安装。
2. 包含服务端与客户端JS库
3. 为在*服务器使用*而设计。服务器对依赖大小并不敏感。
4. 安装包时，使用*嵌套依赖树*解析所有项目依赖，每个项目依赖都会安装自己的依赖。
## 组成
由三个独立的部分
1. 网站：开发者**查找包**、**设置参数**、**管理NPM使用体验**的主要途径
2. [[注册表]] ：一个巨大的数据包，保存了每个**包的信息**。
3. [[CLI]] ：可通过命令行或终端运行，开发者通过CLI与npm通信

初始化：在需要作为项目文件夹的内部运行npm init -y，得到一个package.json文件，管理项目的详细信息（尤其是依赖的库）


## 功能
1. 将包添加到应用中，
2. 下载可立即使用的独立工具
3. 通过npx在不下载的情况下运行包（只加载到内存中，不下载）
4. 与npm用户共享代码
5. 将代码限定到特定开发人员
6. 组建虚拟团队/组织
7. 管理多个版本的代码及其依赖
8. 当底层代码更新时，轻松地更新应用
9. 发现解决同一问题多种方法
10. 查找正在解决相似问题的其他开发

依赖
	1. 分
		1. [[开发依赖]] 
		2. [[运行依赖]] 
	2. 操作
		1. 新增
		2. 删除
		3. 修改
# 脚本
npm script：运行在[[package.json]]文件中写入的脚本
	1. 内部变量(在npm run 的脚本中存在)
		$npm_package_[name/version/config_var1]  package.json文件中name字段的值
	2. 参数传递（--）
		如何向npm二次包装过的命令传参？答：通过--透传参数
	3. 脚本钩子（事件触发时，定义的钩子逻辑触发）
		git hook（在向gitlab提交代码时，它会触发一个构建的流程）
		web hook
		npm内置的脚本钩子
			preinstall  先该脚本，再install
			postinstall  install后执行该脚本
			preunistall  卸载一个模块前执行
			postunistall  卸载模块后 
			prelink link模块前
			postlink link模块后
			pretest  运行npm test命令前执行
			posttest
		自定义钩子
			案例：
				自动化发版（自动增加版本号）


npm
	init 初始化工程（一个npm项目？）
		在文件夹中生成一个[[package.json]]文件
	run 运行脚本
	install 安装依赖
		1. 包名 --save-dev：安装并加入devDependencies
		2. 包名 --save：安装并加入dependencies
		3. 包名 无参数：只安装，不修改package.json【可以自己安装好用的一些小工具，不会上传到项目文件夹中，因为*这样操作只修改node_modules文件夹*，而该文件夹一般被git忽略】
		4. 无参数。即`npm i`：安装package.json中所有的开发依赖和运行依赖
		5. `npm i --production`：仅安装运行依赖
	update 升级依赖
	set 设置环境变量，如：npm set init-author-name 'Your name'
	info 查看某个包的信息，如：npm info lodash
	search 查找npm仓库，如：npm search webpack
	list 当前项目的依赖
	bin 查看bin文件夹
	link 将工程软链接到全局
	publish 发布包
	deprecate 废弃包
	help 查看所有命令
# 设置
1. 镜像
	1. npm config set registry https://registry.npm.taobao.org
脚本实战
编写一个脚本：输出the package is xxx@x.x.x：包名与版本
答：使用内部变量

脚本第一行为什么是#!usr/bin/env node？
如何在一条script中顺序执行两个命令
如何并行执行两个命令