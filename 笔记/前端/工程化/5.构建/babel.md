插件化的语法转义工具

# 功能
一种特殊的[[编译器]]，因为==源语言与目标语言都是JS==：把高版本的JS转换为低版本的JS[^1]
![[Pasted image 20220724175108.png]]
对转义ES标准语法，及JSX等非标准语法都有灵活的支持。

为何nodejs中很少使用该parser？因为新版本的node自动提供对ES新特性的支持，但浏览器没有单独对新版ES做支持，所以babel作为一种parser是短期内无法忽视的工具。
## 语法转换
目的：把浏览器完全不支持的语法转换为支持的语法
转为语义一致的，低版本浏览器可理解的ES代码。
如
	箭头函数转为匿名函数
## polyfill[^2]
目的：==让老环境支持新的API==，

和语法转换有什么区别？
理解：
	1. 语法转换是*原来就有*这个API/功能但新版本中出现了*新写法*，是支持*原来没有*的API。
	2. 语法转换是针对语法，polyfill是针对API。

如
	promise API，可以在低版本的浏览器中使用ES5实现
	proxy无法使用ES5实现
## 修改源码
# 基本概念
## syntax
原子级别，最基础的概念，无能通过其他概念实现
## feature
特性，一般是对象或方法，可通过基础语法实现。如includes方法，Promise对象。
ES新特性的诞生过程（TC39委员会，经历5个阶段后正式宣布）：
	1. stage-0：发出提案，仅仅是个想法
	2. state-1：已确认，是个值得实现的想法
	3. stage-2：已产生初步文档
	4. stage-3：已形成完整文档与初步浏览器实现
	5. stage-4：已结束，大约在次年正式发布
babel会为前4个阶段提供专门的preset。但babel 7已不再添加这些不稳定的preset，而是单独引入plugin。
## plugin
作为前端**工程化构建工具**之一，也是**插件化**的。本身不提供功能，由插件提供。
## preset
一组插件的集合（难道不是内置的插件？）
可使用对应的preset插件，一键配置对应项目的babel
## env
虽然有preset，但还是要关心用户的浏览器能否支持某个feature 。于是出现了env，@babel/preset-env是一种**更智能的preset**，可根据目标环境快速配置babel，
配置例子![[Pasted image 20220727015704.png]]
[browserslist](https://github.com/browserslist/browserslist)及[compat-table](https://github.com/kangax/compat-table)是干嘛用的？统计数据？
## 小结
![[babel基本概念.svg]]
# 原理
概述：将代码转换成token流，转换成AST。
输入：较高版本的ES代码，输出符合要求的低版本ES代码。如ES7转换成ES5
过程：不严格对应于[[编译器]]中的5步
	1. 解析parsing：生成AST
	2. 转换transformation：操作AST（修改AST的内容）
	3. 生成code generation：根据AST生成新的代码

# 使用
为何babel配置了这里，那里却失效了？因为对babel的基本概念没有整体的了解，看babel完全是看黑盒。

本质是一组NPM包（使用方式）
	1. 如果只需要部分功能，可直接require某个包（如require(@babel/core)）
	2. 使用babel cli进行语法转换，使用babel-node去启动一个应用（先转换）
	3. 结合打包工具（webpack, rollup）使用
# 配置
1. 使用项目根目录的.babelrc.json[^3]
2. 对monorepo的统一配置可使用babel.config.json[^4]
3. package.json的babel字段，相当于1中的 

[^1]: 随时享受新语法带来的便利。【proxy不是不能编译？】
[^2]: 装修时，用来抹平墙面的腻子。抹平浏览器高低版本的差异
[^3]: 对整个项目生效，不能跨项目。最常见的配置
[^4]: 对整个工程生产，可跨项目