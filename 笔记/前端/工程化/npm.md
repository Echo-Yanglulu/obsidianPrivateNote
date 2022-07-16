node cli
# CLI的原理
从基础API到commander这个库

从[[process]].argv说起
	定义：获取当前进程的命令与参数。
	执行： node processArgs.js one two=three four （文件内部打印process.argv，第一个是node路径，第二个是执行的文件的路径，后续是输入的参数）
CLI关心的核心问题，是**参数处理**。（git merge testBranch）如果能提高参数处理的效率，就能提升开发CLI程序的效率：用于node参数处理的库：[[commander]].
# 编写CLI常用的工具与最佳实践
1. 如何让标准输出带颜色？
2. 复杂交互怎么办？（可能需要一个交互式CLI：[[inquirer]]提供交互式CLI）
	根据提示让用户进行下一步的操作（如git的rebase）
	1. 命令可能太长，难以记忆。
		1. 让用户**一步一步地输入**
	2. 参数太多，容易配置出错
		1. 错误提示（醒目的提示）
		2. 操作成功的给出正面反馈
		3. 对用户搜索的关键词高亮显示（[[chalk]]）
		4. 从当前位置重新输入的机会
		5. 对一些信息，不在命令行的历史信息中留下痕迹
1. 调用其他命令？
	如此就不用重复
4. 只想开发个脚手架？
5. 如何把CLI写得更好？

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