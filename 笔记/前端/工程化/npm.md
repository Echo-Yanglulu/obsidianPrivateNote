# 概述
## 定义
1. 是[[node]]的[[包管理器||包管理器/包管理工具]]。
	1. 存放[[模块]]以便node找到，智能地管理[[node项目]]依赖冲突
	2. 具有极高的可配置性以支持各种用例。通常用于查找、安装、开发[[node]]程序。
## 组成
三个独立的部分
1. 网站：开发者**查找包**、**设置参数**、**管理其他NPM体验**的主要途径
	1. 比如可以建立一个组织，来管理一个公开包或私有包的访问权限
2. [[注册表]] ：一个**大型数据库**，保存JS软件和相关信息。
	1. 世界上最大的软件注册表，包含超过60W个包（即package、代码模块）。开源的开发者使用它共享开源包，组织也使用它来管理私有包。
3. [[CLI]] ：通过终端运行一些cli工具包，开发者可**与npm交互** 
	1. 安装htmllint后，创建node htmllint_test.js，在这个文件中引入该模块，读取html文件内容，通过[[node]]运行该文件。
## 特性
1. 【内容分类】分为服务端与客户端 JS 库
2. 【设计目的】为在*服务器使用*而设计。服务器对依赖大小并不敏感。
3. 【作用】在 npm 仓库中发布的包可指定为*项目依赖*，通过 npm CLI 本地安装。
4. 【解析】安装包时，使用*嵌套依赖树*解析所有项目依赖，每个项目依赖都会安装自己的依赖【如果存在重复依赖则会导致重复下载】
## 功能【极乐迪斯科-当铺门口】
1. 通过组织创建虚拟*团队* -团队
2. 创建*组织*来协调包维护、编码和开发人员-蜘蛛
3. 与npm用户*共享*代码-公象
4. 将代码*限定*到特定开发人员- 陷腚
5. *管理*多个版本的代码及其依赖-管里
6. *调整*应用中的包，或者原样合并-条子
7. 通过 npx 在不下载的情况下*运行*包-【星云】
8. 下载可立即*使用*的独立工具-屎用
9. 当底层代码更新时，轻松地*更新*应用-心梗
10. 发现解决*同一问题*的多种方法-方法【横截面是方形的头发】
11. 发现正在解决*相似问题*的其他开发者-似问，【斯文】
# 配置
# 工作流程
1. 初始化[^1]：在需要作为项目文件夹的内部运行npm init -y，得到一个[[package.json]]文件，管理项目的详细信息（尤其是依赖的库）
2. 添加依赖：在项目第一次下载某个包时，会生成[[package-lock.json]]文件
	1. [[开发依赖]] 
	2. [[运行依赖]] 
项目相关信息文件的工作机制
	1. `npm i`时，如果存在[[package-lock.json]]文件，则根据该文件下载该版本的依赖
	2. 否则使用[[package.json]]中的规定版本（如果规定的是版本范围，则下载符合用户定义范围内的最新版本）
# 脚本
## 组成
npm script：运行在[[package.json]]中定义的脚本
	1. 内部变量(在npm run 的脚本中存在)
		$npm_package_[name/version/config_var1]  package.json中name字段的值
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
## 命令
npm
	init 初始化工程（一个npm项目？）
		在文件夹中生成一个[[package.json]]文件
	run 运行脚本
	install 安装依赖
		1. 包名 --save-dev：安装为devDependencies
			1. 简写 -D
		2. 包名 --save：安装为dependencies
		3. 包名无参数：将作为运行依赖，添加到dependencies.
		4. 无参数。即`npm i` 
			1. 如果有[[package-lock.json]]文件，安装该文件规定的版本
			2. 否则安装[[package.json]]中所有的开发依赖和运行依赖
			3. 配置开发环境？？【知乎看到的，没懂】
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

# 总结
[About npm | npm Docs](https://docs.npmjs.com/about-npm) 
1. 谈谈你对npm的理解

[^1]: 将一个项目初始化为npm项目。【就是一个包项目？】