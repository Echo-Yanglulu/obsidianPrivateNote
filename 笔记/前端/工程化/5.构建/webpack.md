# 设计思想
## Tabable插件体系
定义：一个插件框架，也是webpack的底层依赖
提供了一个hook体系
![[webpack.svg]]
# 工作流程
1. 初始化
主要是实例化Compiler对象（以及实例化多个tapable hook）
![[Pasted image 20220730200434.png]]
配置
tabable插件体系
2. 准备工作
初始化plugin：依次调用每个插件的apply方法的过程
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
使用**加载器**处理[^2]JS/JSON之外的其他**文件**。因为webpack是基于node.js开发的，node天然支持js。
test用正则识别文件类型，use用字符串选择使用loader 处理该格式文件。通过module字段的rules【说明loader处理得到JS模块】
![[Pasted image 20220731000757.png]]
## plugin 
更高级的**构建、打包**功能（这两个不是一个意思？）。
如：使用htmlWebpackPlugin为项目/应用程序生成html文件，并自动注入所有通过loader生成的JS bundle。(基本的loader无法做到一系列的功能)
![[Pasted image 20220731001033.png]]
## mode
指定当前**构建任务所处环境**，webpack会根据环境使用一些优化项
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
	1. 想把CSS抽离出来，成为单独的文件，而不是通过JS插入HTML![[Pasted image 20220801233153.png]]
	2. 处理HTML资源。如果要操作HTML，一般使用HtmlWebpackPlugin 插件
		1. 不用Loader，直接实例化一个该插件即可。可使用EJS语法定制HTML内容
	3. 处理JS资源
		1. 使用了ES高级语法，用babel-loader加载JS文件。不单独配置，这个loader会使用项目的.babelrc.json配置
	4. 开发中的静态资源
		1. 图片，字体图标，音视频：url-loader与file-loader。![[Pasted image 20220801233644.png]]
		2. file-loader ：处理这些静态资源的引入，并输出到output目录
		3. url-loader ：有limit限制，如果小于，则将文件直接打包成BASE 64放到JS Bundle中，而不是作为单独文件进行加载。
# 特点
1. 也是**插件化**[^1]的
2. 相对gulp等传统工具，对构建的流程与资源有了更高级的抽象
3. 将所有不同类型的资源进行统一管理，进行整体的分析与优化

# 小结
从入口文件开始，加载并处理各种格式的文件，最终生成bundle 文件。
| 概念 | 过程 | 功能 |
| --- | --- | --- |
| entry |  | JS文件，依赖起点 |
| output |  | 文件夹：打包文件存放点 |
| loader |  | 处理：打包过程中的非JS格式文件 |
| plugin |  | 打包、构建：生成其他格式文件？ |

# 用途
开发UI库

[^1]: 几乎所有功能都由插件提供
[^2]: 将所有格式的文件转换成JS模块：以便webpack分析依赖关系，并在浏览器中加载。
[^3]: 如果在两次构建中entry依赖的内容不同，最终的bundle就会两个hash值，也就是产生了两个不同的打包结果。源文件只修改了一个字符，hash就会变化。hash加到文件名的好处：文件改动直接产生不同的bundle文件，不同的文件名浏览器就不会使用上次的缓存。（部分浏览器会因为文件同名而使用缓存）因为HTML文件不会缓存，只要JS文件不同，就能加载最新代码。