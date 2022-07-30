插件化的语法转义工具
# 原理
概述：将代码转换成token流，转换成AST。
输入：较高版本的ES代码，输出符合要求的低版本ES代码。如ES7转换成ES5
## 工作过程
不严格对应于[[编译器]]中的5步
	1. 解析parsing：生成AST
	2. 转换transformation：操作AST（修改AST的内容）
	3. 生成code generation：根据AST生成新代码
不用关注解析与生成，babel实现，开发者只需关注转换（读写AST）。

# 使用
为何babel配置了这里，那里却失效了？因为对babel的基本概念没有整体的了解，看babel完全是看黑盒。

本质是一组NPM包（使用方式）
	1. 如果只需要部分功能，可**直接require**某个包（如require(@babel/core)
	2. 通过**babel cli**进行语法转换，使用babel-node去启动一个应用（先按配置进行转换再执行）
		1. ![[Pasted image 20220730103129.png]]
	3. 结合[[打包工具]]
		1. ![[Pasted image 20220730103504.png]]
# 配置
## 方式/途径
1. 项目根目录的**.babelrc.json**[^3]
2. 对monorepo的统一配置可使用**babel.config.json**[^4]
3. **package.json**的babel字段，相当于1。差别不大
## 内容
将配置传入插件的方式
![[Pasted image 20220727223048.png]]


# 功能
一种特殊的[[编译器]]，因为==源语言与目标语言都是JS==：把高版本的JS转换为低版本的JS[^1]
![[Pasted image 20220724175108.png]]
对转义ES标准语法，及JSX等非标准语法都有灵活的支持。

本质、形式、质料是==一组NPM包==，目的是编译

为何nodejs中很少使用该parser？因为新版本的node自动提供对ES新特性的支持，但浏览器没有单独对新版ES做支持，所以babel作为一种parser是短期内无法忽视的工具。
## 语法转换
目的：把浏览器完全不支持的语法转换为浏览器支持的==语法==
转为语义一致的，低版本浏览器可理解的ES代码。
如
	箭头函数转为匿名函数
## polyfill[^2]
目的：==让老环境支持新的API，feature==，

和语法转换有什么区别？
理解：
	1. 语法转换是*原来就有*这个API/功能但新版本中出现了*新写法*，是支持*原来没有*的API。
	2. 语法转换是针对语法，polyfill是针对API。

如
	promise API，可以在低版本的浏览器中使用ES5实现
	proxy无法使用ES5实现
### 使用
1. 7.4之前只需引入@babel/polyfill[^10]
2. 7.4之后需要引入两个包: core-js/stable[^11]，regenerator-runtime/runtime[^12]。
3. 通过preset-env的useBuiltlns 与targets智能配置。
4. 一般是==core-js 与useBuiltlns 结合使用==

两种方式等价，但方式2利于babel进行进一步优化。
需要注意：因为polyfill 的代码会进入运行时，所以要以运行依赖安装二者。建议core-js/stable包与3的useBuiltlns同时使用(为啥要用两次polyfill 配置？)

## 修改源码
# 基本概念
## syntax
原子级别，最基础的概念，无法通过其他概念实现
## feature
特性，一般是对象或方法，可通过基础语法实现。如includes方法，Promise对象。
ES新特性的诞生过程（TC39委员会，经历5个阶段后正式宣布）：
	1. stage-0：发出提案，仅仅是个想法
	2. state-1：已确认，是个值得实现的想法
	3. stage-2：已产生初步文档
	4. stage-3：已形成完整文档与初步浏览器实现
	5. stage-4：已结束，大约在次年正式发布
babel会为前4个阶段提供专门的preset。但babel 7已不再添加这些不稳定的preset，而是单独引入plugin。
## plugin（最基础的工具）
作为前端**工程化构建工具**之一，也是**插件化**的。本身不提供功能，由插件提供。
在配置时，plugin的==名称可缩写==，所以如果发现某个插件找不到依赖，可能是插件名被缩写
### 本质
将代码转换成AST，然后处理AST（对AST 进行语法转换与polyfill ？不是），最后根据AST生成新代码。
解析时使用的[[parser]] 不同，但得到的AST都符合ESTree规范
### 遍历
AST的遍历都是深度优先。
开发babel插件一般会使用访问者模式这种设计模式，因为遍历AST的过程就是不断访问各个节点的过程，于是babel插件就使用这个模式。

对于一个访问者，有两次机会来访问同一个节点。
### 配置方式
配置数组元素的形式: 
	1.  '名称' 
	2. \['名称']
	3. \['名称', 配置对象]
即：![[Pasted image 20220730104132.png]]
### 执行顺序
1. 整体plugin 在preset之前执行[^5]
2. 多个插件**从前向后**执行[^6]

### 开发（重点）
> 标识符反转插件
> 把所有变量名反转

==为何babel与[[ESLint]] 很多地方很像==（原理，配置，插件的开发）？

## preset
一组插件的集合（难道不是内置的插件？）
可使用对应的preset插件，一键配置对应项目的babel
### 使用
配置方式与plugin相似。preset本质就是一组plugin的集合。==可依赖其他preset==。
### 执行顺序
1. 在plugin之后执行
2. preset之间**从后向前**执行。

plugin执行后执行preset能保证先转换新特性，preset就只需关心比较稳定的语法。（不会覆盖？）

### 常用preset
#### preset-env 
大多情况只用这个preset即可，主要是两个配置（引入polyfill 代码）
	1. useBuiltlns配置**polyfill代码注入条件** [^9]
		1. false：不自动注入[^13]
		2. usage：实际使用[^14]![[Pasted image 20220728232655.png]]
		3. entry：环境配置![[Pasted image 20220728232437.png]]
	2. targets希望preset-env 选择的**插件**[^7]
		1. 可以是描述浏览器版本的对象
		2. 符合browserslist 语法的字符串。写出条件[^8]筛选出对应的浏览器列表，然后根据结果决定引用的插件。
		3. 在根目录的.browserslistrc文件中写browserslist 语法字符串
![[Pasted image 20220727224323.png]]
preset-env 如此使用存在的问题：
	1. ![[Pasted image 20220727235051.png]]如果有*一个类语法*，就会**内联地写入大量的polyfill代码**[^15] ，如果*有大量的类语法*，使打包后的dist文件会有大量重复的polyfill代码。
		1. 解决方案：使用一个plugin和包![[Pasted image 20220728232929.png]]
		2. 然后可以让polyfill 代码从这个包中**引入**，而不是**内联地写入**polyfill 代码，即：![[Pasted image 20220728233132.png]]如果项目是个三方包，那么这种不影响他人环境的方式很重要。

### 小结
preset 与plugin混用的目的，往往是希望在成熟语法之外使用一些新特性
如果想写一个性能最好，体积最小，侵入性最小的babel/polyfill ，应配置为：![[Pasted image 20220728233405.png]]
## env
虽然有preset，但还是要关心**用户的浏览器能否支持某个feature** 。于是出现了env，@babel/preset-env是一种**更智能的preset**，可根据目标环境快速配置babel，
配置例子![[Pasted image 20220727015704.png]]
[browserslist](https://github.com/browserslist/browserslist)及[compat-table](https://github.com/kangax/compat-table)是干嘛用的？统计数据？
## 小结
如何使用语法转换功能？如何使用polyfill 功能？如何使用修改源码功能（感觉这个功能是babel实现功能的核心）？
用插件转换语法，用poly转换API：使用preset-env可同时设置语法转换（targets ）与API转换（useBuiltlns ）
![[babel基本概念.svg]]



[^1]: 随时享受新语法带来的便利。【proxy不是不能编译？】
[^2]: 装修时，用来抹平墙面的腻子。抹平浏览器高低版本的差异
[^3]: 对整个==项目==生效，不能**跨项目**。最常见的配置
[^4]: 对整个==工程==生效，可**跨项目**。即：一个工程可包括多个项目（monorepo?）
[^5]: preset往往配置了比较成熟的语法。二者同时使用时往往是希望在成熟的语法之外使用一些feature。先执行plugin就能保证feature是先被转换的，让preset只关心那些比较稳定的语法。
[^6]: 历史原因导致，记住规则即可。
[^7]: 只需描述我们最关心的**物料平台**是什么，然后preset-env 根据描述自动选择插件
[^8]: 市场占有率，是否是最新的几个版本。
[^9]: 希望polyfill 被自动引入的条件
[^10]: 不建议，因为太大，无法做优化
[^11]: 用于对大部分新feature进行polyfill
[^12]: 用于转换generator函数
[^13]: 默认值：完全由用户决定如何进行polyfill。
[^14]: 最常用：根据对新feature的使用情况，智能地为每个JS文件引入最小化的polyfill代码。问题：各种polyfill被内联地写入文件
[^15]: 用于转换API的函数