定义：是[[node]] 的[[包管理器]]。用于**安装**存放于大型中心仓库上的三方包、**管理**[[node项目]] 中的依赖项。
在npm仓库中发布的包可指定为项目依赖，通过CLI本地安装。包含服务端与客户端JS库

初始化：在需要作为项目文件夹的内部运行npm init -y，得到一个package.json文件，管理项目的详细信息（尤其是依赖的库）

依赖
	1. 分类
		1. 开发依赖
		2. 运行依赖
	2. 操作
		1. 新增
		2. 删除
		3. 修改

# 脚本
npm script
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


常用命令
	npm
		init 初始化工程
		run 运行脚本
		install 安装依赖
		update 升级依赖
		bin 查看bin文件夹
		link 将工程软链接到全局
		publish 发布包
		deprecate 废弃包
		help 查看所有命令

脚本实战
编写一个脚本：输出the package is xxx@x.x.x：包名与版本
答：使用内部变量

脚本第一行为什么是#!usr/bin/env node？
如何在一条script中顺序执行两个命令
如何并行执行两个命令