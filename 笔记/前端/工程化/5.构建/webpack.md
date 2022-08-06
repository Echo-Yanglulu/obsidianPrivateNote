# 设计思想
## Tabable插件体系
定义：一个插件框架，也是webpack的底层依赖
提供了一个hook体系
![[webpack.svg]]
# 工作流程
1. 初始化
主要是**实例化Compiler对象**（以及实例化**多个tapable hook**）
![[Pasted image 20220730200434.png]]
配置
tabable插件体系
2. 准备工作
初始化**plugin**：依次调用每个插件的apply方法的过程
3. resolve源文件，构建module
遍历源文件，从3到最后，都是由plugin以**注册hook回调**的方式参与
4. 生成chunk
5. 构建资源
6. 最终文件生成
	1. bundle文件
# 基本概念
## entry
webpack开始这**一个或多个JS文件**开始遍历整个项目的依赖，是分析整个**项目依赖关系**的起点，。
多入口的场景
	1. 如果是多个SPA或MPA，需要为每个入口命名。
	2. 代码分离
具体配置
![[Pasted image 20220730201026.png]]
## output
最终打包结束后，得到的JS bundle 文件放置的**文件夹**
![[Pasted image 20220801225838.png]]![[Pasted image 20220801231703.png]]
filename：支持变量，即文件名作为打包文件名。hash：对文件使用散列算法得出的字符串[^3]
chunkFilename：也是一种bundle，是**非entry模块**打包的结果文件。一般使用==动态加载==技术时会出现这种bundle。
## loader
使用**加载器**处理[^2]JS/JSON之外的其他**文件**，得到JS模块。是一个接受输入，返回输入的**函数**。因为webpack是基于node.js开发的，node天然支持js，如果有高级语法则使用babel-loader，否则JS不用loader。
test用正则识别文件类型，use用字符串选择使用loader 处理该格式文件。通过module字段的rules。
### 结构分类
#### 同步loader 
![[Pasted image 20220806152824.png]]
#### 异步loader 
![[Pasted image 20220806152751.png]]
返回值用callback传递出去。
### 使用
![[Pasted image 20220731000757.png]]
![[Pasted image 20220804222709.png]]
### 执行顺序
反向：所以期望最后执行的放在最前。如style-loader。
## plugin
更高级的**构建、打包**功能，资源处理（这两个不是一个意思？）。
如：使用htmlWebpackPlugin为项目/应用程序生成html文件，并自动注入所有通过loader生成的JS bundle。(基本的loader无法做到一系列的功能)
![[Pasted image 20220731001033.png]]
## mode
指定当前**构建任务所处环境**/**webpack运行环境**，webpack会根据环境使用一些优化项
环境
	1. 开发环境
	2. 生产环境
	3. 不指定环境
优化项
	1.添加一些针对环境的优化plugin
	2. 配置一些优化项的默认值。

![[Pasted image 20220731001611.png]]
## hook
各个插件注册在hook上，由webpack在相应时机调用
## 文件概念
### bundle
从入口文件开始，将它依赖的所有相关文件综合处理后得到的JS文件
### chunk
从非入口文件开始，将它依赖的所有相关文件综合处理后得到的JS文件。一般由于代码分割、动态加载。
# 配置
## 资源加载
任何非JS资源都应使用loader加载
	1. 加载css应使用css-loader与style-loader。使用这个loader就能在css中使用@import语法引用其他CSS。style-loader可把JS文件中导入的CSS代码打包到JS bundle中，在JS Bundle运行时自动地把样式插入页面的style标签中。
		1. loader反向执行：把sass-loader放在css-loader 之后，才能将处理后的css交给css-loader ，否则依赖倒置会出错。
## 资源处理
使用plugin
	1. 想把**CSS**抽离出来，成为单独的文件，而不是通过JS插入HTML![[Pasted image 20220801233153.png]]
		1. 它还提供了一个loader用于CSS文件的提取。webpack 的plugin与loader非常丰富。
	2. 处理**HTML**资源。如果要操作HTML，一般使用HtmlWebpackPlugin 插件
		1. 不用Loader，直接实例化一个该插件即可。可使用EJS语法定制HTML内容。比如不用手动去写标签的属性值。
	3. 处理**JS**资源
		1. 使用了ES高级语法→用babel-loader加载JS文件。如果不单独配置，这个loader会使用项目的.babelrc.json作为默认配置![[Pasted image 20220805192120.png]]
	4. 开发中的**静态资源**
		1. 图片，字体图标，音视频：url-loader与file-loader。![[Pasted image 20220801233644.png]]
		2. file-loader ：**处理**JS文件中对这些静态资源的引入，并**输出**到output目录[^4]
		3. url-loader ：与file-loader 很像，但有limit配置，如果小于该**字节数**，则将文件直接打包成**BASE 64**形式放到JS **Bundle**中，而不是作为**单独文件**进行加载。
# 高级配置
## devServer
背景：不能每次修改代码，就==全量打包编译==一次。所以在调试状态下，可利用webpack提供的开发工具，
在代码发生变化后需要自动编译，三种方式：
	1. webpack watch mode[^5]
		1. 监听：如果文件更新，就重新编译
	2. webapck-dev-server[^6]
		1. 编译后刷新浏览器。
	3. webpack-dev-middleware[^7]

![[Pasted image 20220805222427.png]]
## HMR
背景：每次都==全量刷新页面==，在大型应用中体验不好（速度慢，打开的弹窗消失）。
方式：HMR（模块热替换）
方法：在webpack4中只需开启devServer的hot
目的：根据文件变化，动态地刷新页面的局部状态。
![[Pasted image 20220805222909.png]]
原理：
	1. 通过module.hot暴露HMR接口。
	2. accept接收发生变化的文件。
	3. 由应用自己做出局部的判断。
	4. ![[Pasted image 20220805223240.png]]
## 代码分离
原因：
目的：得到多个bundle，灵活定制加载策略（按需加载，并行加载），从而提升整个应用的加载速度。
方式：
	1. 入口起点：使用entry 配置手动分离
		1. 多个入口可分离成多个bundle
		2. 缺点
			1. 资源重复引入（如两个入口文件都引入了lodash，它就会被打包两遍）
			2. 人工手动维护入口的增删。
	2. 防止重复：使用splitChunksPlugin去重与分离chunk（防止对某个资源进行重复打包）
		1. 曾经是插件，在webpack4中成了官方的优化项。
		2. 这个bundle就是上面两个入口生成的两个bundle的公共依赖（多入口与防止重复结合使用）![[Pasted image 20220806075243.png]]
		3. 更多插件特性需要查看该插件文档
	3. 动态导入[^10]：在代码中使用动态加载模块的语法。
		1. import()[^8]
			1. 可利用注释为分离出来的chunk命名。这样就能在chunkFilename 中使用[lodash]方式来定义这个**chunk**名对应的**规则**![[Pasted image 20220806080410.png]]
		2. require.ensure[^9]
# 开发
## loader
使用loader-utils[^11]，
## plugin

# 特点
1. 也是**插件化**[^1]的
2. 相对gulp等传统工具，对构建的流程与资源有了更高级的抽象
3. 将所有不同类型的资源进行统一管理，进行整体的分析与优化
# 配置实战
React官方脚手架：create-react-app
它生成的react配置。
## CRA配置提取
## CRA源码分析
除了loader与plugin配置，还需关注
1. Resolve：webpack如何分析模块之间的依赖关系 
2. Node runtime mock：有时需要使用webpack去**mock一些node的内置模块和全局变量**。因为需要对模块测试？
3. Performance：性能配置项
4. optimization：打包的优化项
5. SourceMap ：如何正确地开启它、选择它的类型。
6. WebpackDevServer：用法

eject之后的脚本分析：
1. start.js
	1. 使用configFactory取开发模式下的配置，这个函数就是[[webpack.config.js]]文件输出的配置函数。返回值就是webpack最终构建时使用的配置
	2. serverConfig：是WebpackDevServer 本身的配置，这个函数就是[[WebpackDevServer.js]]文件输出的配置函数。有了serverConfig 和环境配置后，即可实例化一个WebpackDevServer 的服务。

关于注释：
	1. 解释了如此配置的原因及作用。
# 小结
从入口文件开始，加载并处理各种格式的文件，最终生成bundle 文件。
所有配置都是为了JS，CSS，HTML，静态资源

| 概念 | 过程 | 功能 |
| --- | --- | --- |
| entry |  | JS文件，依赖起点 |
| output |  | 文件夹：打包文件存放点 |
| loader |  | 处理：打包过程中的非JS格式文件 |
| plugin |  | 打包、构建：生成其他格式文件？ |
了解webpack的功能，原理足够。

# 用途
开发UI库

[^1]: 几乎所有功能都由插件提供
[^2]: 将所有格式的文件转换成JS模块：以便webpack分析依赖关系，并在浏览器中加载。
[^3]: 如果在两次构建中entry依赖的内容不同，最终的bundle就会两个hash值，也就是产生了两个不同的打包结果。源文件只修改了一个字符，hash就会变化。hash加到文件名的好处：文件改动直接产生不同的bundle文件，不同的文件名浏览器就不会使用上次的缓存。（部分浏览器会因为文件同名而使用缓存）因为HTML文件不会缓存，只要JS文件不同，就能加载最新代码。
[^4]: 这样最后的dist中的文件就能正常加载。
[^5]: webpack的一种运行模式，这种模式下一个文件被更新，代码就会重新编译。不用手动构建，但为了看到最新效果还要刷新浏览器。
[^6]: 可自动刷新浏览器。
[^7]: 一个中间件，用来定制watch与刷新的过程。实现watch mode与dev-server无法满足的需求。
[^8]: ES 模块化中规定的，语言级别的动态导入语法
[^9]: ES Module之前，webpack自己hack的动态导入语法
[^10]: 动态导入是异步的，会返回一个Promise
[^11]: 编写webpack-loader的官方工具库，提供了许多常用方法