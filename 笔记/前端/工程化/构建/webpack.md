# 概述
把它看作一个“模块化打包工具”，是“温饱”
如果能了解内核机制、利用**强大的plugin系统**，是“小康”（其实不只是打包，还可以做许多提高研发效率的事）
1. 为何是webpack，而不是其他的构建工具？
	1. 从入口开始，经过模块依赖的**加载，分析，打包**三个过程，完成项目构建，在三个过程中可以添加不同问题的解决方案。
	2. 可解决传统构建工具的问题
		1. 模块化打包。一切皆模块，CSS，JS，html, 图片，字段，富媒体等
		2. 语法转换。ES6，TS
		3. 预处理器编译。[[LESS]] 
		4. 项目优化。压缩，[[CDN]] 
	3. 新构建工具的新功能/解决的新问题
		1. 传统构建工具的思路是，遍历源文件，匹配规则，打包。无法做到按需加载。
		2. 解决方案封装。通过loader与plugin机制
2. 其中的概念在webapck的内核与原理上是如何实现的？
3. 除了打包还有什么功能？（全是基础问题）
## 是什么
### 功能
是一个现代JS应用的**静态模块打包工具**。以一个或多个入口模块为**起点**，创建一个**依赖关系图**，将项目所需的每个模块**组合产出**为一个或多个bundle。
### 组成/要素
### 关联
## 为什么
为什么是webpack，不是其它的
webpack为什么这样设计
## 怎么办
如何配置
如何优化
如何发挥作用
工作机制
	1. 在编译过程中，对整个项目进行静态分析，得到每个模块的类型与依赖关系，使用配置的Loader处理。

# 设计思想/原理/流程机制
## Tabable插件体系
定义：一个插件框架，也是webpack的底层依赖
提供了一个hook体系
![[webpack.svg]]
## 工作流程
1. 初始化
主要是**实例化Compiler对象**（以及实例化**多个tapable hook**）
![[Pasted image 20220730200434.png]]
配置
tabable插件体系
2. 准备工作
初始化**plugin**：依次调用每个插件的apply方法的过程
3. resolve源文件，构建module
遍历源文件，从3到最后，都是由plugin以**注册hook回调**的方式参与
1. 生成chunk
2. 构建资源
3. 最终文件生成
	1. bundle文件

## 重要的对象与实现
# 概念
## 事物
### entry
webpack开始这**一个或多个JS文件**开始遍历整个项目的依赖，是分析整个**项目依赖关系**的起点，。
多入口的场景
	1. 如果是多个SPA或MPA，需要为每个入口命名。
	2. 代码分离
具体配置
![[Pasted image 20220730201026.png]]
### output
最终打包结束后，得到的JS bundle 文件放置的**文件夹**
![[Pasted image 20220801225838.png]]![[Pasted image 20220801231703.png]]
filename：支持变量，即文件名作为打包文件名。hash：对文件使用散列算法得出的字符串[^3]
chunkFilename：也是一种bundle，是**非entry模块**打包的结果文件。一般使用==动态加载==技术时会出现这种bundle。
### loader
定义
	1.  一个**函数**，用于转换[^2]==JS/JSON之外==的其他**文件**，得到==JS模块==。（默认只可编译JS、JSON模块）。因为webpack是基于node.js开发的，node天然支持js，如果有高级语法则需要使用babel-loader。

test用正则识别文件类型，use用字符串选择使用loader 处理该格式文件。通过module字段的rules。
### 原理
#### 洋葱模型
![[Pasted image 20220806153852.png]]
执行时，从开始调用每个loader的pitch方法，再反向调用loader函数本身。即：在pitch阶段正序执行loader的pitch方法，在execute阶段倒序执行本身。
#### pitch函数
```javascript
const loaderUtils = require("loader-utils");
module.exports = function(input){
	const {text} = loaderUtils.getOptions(this);
	return input + text;
}
// precedingReq： loader链中，排在当前loader之前的loader及其资源文件组成的链接。
// input：一个对象，挂载各个loader需要共享的数据。
// 如果pitch方法返回一个值，webpack会跳过剩下的loader的pitch和execute（可通过pitch方法返回值阻断后续loader执行）
module.exports.pitch = function (remainingReq, precedingReq, input) {
	console.log(`
		Remaining request: ${remainingReq}
		Preceding request: ${precedingReq}
		Input: ${JSON.stringify(input, null, 2)}
	`);
	return "pitched";
}
```
如style-loader 的伪代码
```JavaScript
loaderApi.pitch = function loader(request){
	const options = loaderUtils.getOptions(this);
	return `
		var content = require(${loaderUtils.stringifyRequest(this, `!!${request}`)});
		var api = require('runtime/injectStylesIntoLinkTag.js');
		var options = ${JSON.stringify(options)};
		var update = api(content, options);
		update(content);
	`
	export default loaderApi;
}
```
### 结构分类
#### 同步loader 
```Javascript
module.exports = input => input + input;
```

#### 异步loader 
```JavaScript
module.exports = function (input) {
	const callback = this.async();
	callback(null, input + input);
}
```
与同步的区别：返回值用callback传递出去。
### 使用
![[Pasted image 20220731000757.png]]
![[Pasted image 20220804222709.png]]
### 执行顺序
反向：所以期望最后执行的放在最前。如style-loader。
### 常用loader 
postcss-loader：转译sass, less之类的样式语法为CSS。同sass-loader 。
css-loader ：处理如import的样式引入语法。将代码插入到style标签中。或使用插件将部分代码导出为css文件后通过link标签引入页面。
style-loader ：将最终的样式内容，包裹为JS，让JS在运行过程中把样式插入页面的style标签。
### plugin
本质：==一个实现了apply方法的类==，在运行时得到compiler[^12]和compilation[^13]两个实例。plugin的工作就是操作这两个实例[^14]
```JavaScript
module.exports = class DemoPlugin {
	constructor(options){
		this.options = options
	}
	apply(compiler){
		compiler.plugin("emit", (compilation, cb) => {
			console.plugin(compilation);
			cb()
		})
	}
}
```
更高级的**构建、打包**功能，资源处理（这两个不是一个意思？）。
如：使用htmlWebpackPlugin为项目/应用程序生成html文件，并自动注入所有通过loader生成的JS bundle。(基本的loader无法做到一系列的功能)
![[Pasted image 20220731001033.png]]
### 常用plugin
#### 
### mode
指定当前**构建任务所处环境**/**webpack运行环境**，webpack会根据环境使用一些优化项
环境
	1. 开发环境
	2. 生产环境
	3. 不指定环境
优化项
	1.添加一些针对环境的优化plugin
	2. 配置一些优化项的默认值。

![[Pasted image 20220731001611.png]]
### hook
各个插件注册在hook上，由webpack在相应时机调用
### bundle
从入口文件开始，将它依赖的所有相关模块综合处理后得到的JS文件
### chunk
从非入口文件开始，将它依赖的所有相关文件综合处理后得到的JS文件。一般由于代码分割、动态加载。
### 注释
```javascript
import('./lazy').then(lazy => {
	console.log(lazy);
})
// 构建结果：会单独生成一个0.js
import(
/*
webpackChunkName: 'lazy-name'
*/
'./lazy'
).then(lazy => {
	console.log(lazy);
});
// 单独生成一个lazy-name.js文件。
```
支持的注释
	1. webpackInclude ： 如果是 import 的一个目录， 则可以指定需要引入的文件特性， 例如只加载 json 文件： /\.json$/ ；
	2. webpackExclude ： 如果是 import 的一个目录， 则可以指定需要过滤的文件， 例如 /\.noimport\.json$/
	3. webpackChunkName ： 这是 chunk 文件（**打包的结果叫chunk，那bundle是什么？**）的名称， 例如 lazy-name ；
	4. webpackPrefetch : 是否预取模块， 及其优先级， 可选值 true 、 或者整数优先级别， 0 相当于 true， webpack4.6+支持；
	5. webpackPreload : 是否预加载模块， 及其优先级， 可选值 true 、 或者整数优先级别， 0 相当于 true， webpack4.6+支持；
	6. webpackMode : 可选值 lazy / lazy-once / eager / weak 
		1. lazy ： 是默认的模式， 为每个 import() 导入的模块， 生成一个可延迟加载 chunk；
		2. lazy-once ： 生成一个可以满足所有 import() 调用的单个可延迟加载 chunk， 此 chunk 将在第一次 import() 调用时获取， 随后的 import() 调用将使用相同的网络响应； 注意， 这种模式仅在部分动态语句中有意义， 例如import( ./locales/${language}.json )， 其中可能含有多个被请求的模块路径
		3. eager ： 不会生成额外的 chunk， 所有模块都被当前 chunk 引入， 并且没有额外的网络请求。 仍然会返回Promise， 但是是 resolved 状态。 和静态导入相对比， 在调用 import() 完成之前， 该模块不会被执行。
		4. weak ： 尝试加载模块， 如果该模块函数已经以其他方式加载（即， 另一个 chunk 导入过此模块， 或包含模块的脚本被加载） 。 仍然会返回 Promise， 但是只有在客户端上已经有该 chunk 时才成功解析。 如果该模块不可用， Promise 将会是 rejected 状态， 并且网络请求永远不会执行。 当需要的 chunks 始终在（嵌入在页面中的）初始请求中手动提供， 而不是在应用程序导航在最初没有提供的模块导入的情况触发， 这对于 Server 端渲染（[[SSR]]， Server-Side Render） 是非常有用的。
通过上面的神奇注释， import() 不再是简单的 JavaScript 异步加载器， 还是任意模块资源的加载器， 举例说明：如果我们页面用到的图片都放在 src/assets/img 文件夹下， 你们可以通过下面方式将用到的图片打包到一起：
```javascript
import(/* webpackChunkName: "image", webpackInclude: /\.(png|jpg|gif)/ */ './assets/img');
```
prefetch 优先级低于 preload。preload 会并行或者**加载完主文件之后立即加载**； prefetch 则会在**主文件之后、 空闲时在加载**。 prefetch 和 preload 可以用于提前加载图片、 样式等资源的功能
# 配置
[[webpack.config.js]] 
## 基础配置
### 资源加载
任何非JS,[[JSON]]资源都应使用loader加载
	1. 加载css应使用css-loader与style-loader。使用这个loader就能在css中使用@import语法引用其他CSS。style-loader可把JS文件中导入的CSS代码打包到JS bundle中，在JS Bundle运行时自动地把样式插入页面的style标签中。
		1. loader反向执行：把sass-loader放在css-loader 之后，才能将处理后的css交给css-loader ，否则依赖倒置会导致出错。
### 资源处理
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
## 高级配置
### devServer
背景：不能每次修改代码，就==全量打包编译==一次。所以在调试状态下，可利用webpack提供的开发工具，
在代码发生变化后需要自动编译，三种方式：
	1. webpack watch mode[^5]
		1. 监听：如果文件更新，就重新编译
	2. webapck-dev-server[^6]
		1. 编译后刷新浏览器。
	3. webpack-dev-middleware[^7]

![[Pasted image 20220805222427.png]]
### HMR
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
### 代码分离
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

## 配置实战
React官方脚手架：create-react-app
它生成的react配置。
[[webpack实战]]
### CRA配置提取
### CRA源码分析
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

## 工程化实践
可以通过 import('path/to/module') 的方式引入一个模块， import() 返回的是一个 Promise 对象

# 工具开发
## loader（理解原理即可，社区loader已经足够丰富）
使用[loaderUtils ](https://www.npmjs.com/package/loader-utils)[^11]，如：将源码中所有的world字符串，替换为配置中name字段的值。
	1. 获取配置：可使用loaderUtils的getOptions方法
![[Pasted image 20220806153129.png]]
如果是使用角度，配置在前的loader后执行。但如果是开发loader，则是洋葱模型。
## plugin（自定义plugin相对loader更常见）

plugin需要的上下文信息太多，没有模拟环境，plugin需要在真实环境中开发与调试（如一个react app）。
需求[^16]：编写一个webpack plugin，统计打包结果中各个文件的大小，以JSON形式输出统计结果。
分析：需要注册在一个打包结果相关的hook，需要输出JSON所以hook调用需要文件被输出到硬盘之前
实战：在webpack文档中找到对应的**compiler钩子**：emit钩子。
```typescript
import { Plugin, Compiler, compilation } from 'webpack';
import { RawSource } from 'webpack-sources';

class WebpackSizePlugin implements Plugin {

    options: any;
    PLUGIN_NAME: string = 'WebpackSizePlugin';

    constructor(options: any) {
        this.options = options;
    }

    apply(compiler: Compiler) {
        const outputOptions = compiler.options.output;
        compiler.hooks.emit.tap(
            this.PLUGIN_NAME,
            compilation => {
                const assets = compilation.assets;
                // 创建buildSize保存编译信息
                const buildSize = {} as any;
                // asset是编译结果对象。key是文件名，value是文件内容
                const files = Object.keys(assets);
                let total = 0;
                for (let file of files) {
	                // file的每个值都是一个RawSource对象，存在size方法，统计文件内容包含的字符数[^15]
                    const size = assets[file].size();
                    buildSize[file] = size;
                    total += size;
                }
                console.log('Build Size: ', buildSize);
                console.log('Total Size: ', total);
                buildSize.total = total;
                // 让webpack新增文件，只需增加键值对。通过publicPath拿到output指定的目录。 
                // 让用户自己指定统计文件的名称，可通过fileName拿到
                assets[
                    outputOptions.publicPath + '/' + (this.options.fileName || 'build-size.json')
                ] = new RawSource(JSON.stringify(buildSize, null, 4));
            }
        )
    }
}

module.exports = WebpackSizePlugin;

// webpack.config.js
plugins: [
	new WebpackSizePlugin({fileName: 'size.json'})
]
```
# 特点
1. 也是**插件化**[^1]的
2. 相对gulp等传统工具，对构建的流程与资源有了更高级的抽象
3. 将所有不同类型的资源进行统一管理，进行整体的分析与优化
# 小工具
## webpack-cli
### 为何
在命令行中**运行**webpack（配置文件或命令行是用来**传参**的）。
还有其他方式用来运行webpack吗？GUI？
	不能，一种运行方式，两种传参方式。
### 功能
1. 构建过程添加进度条：webpack --progress --colors
2. 平时只有简单的错误提示，查看错误详情：webpack --display-error-details；
3. 缓存未改变的编译内容（未改动的模块，会被放入内存，不再每次编译），开启监听模式：webpack --watch；
4. webpack -d开发环境打包 -p生产环境打包
5. -config 指定一个路径，存放webpack的配置文件
6. -mode 指定打包环境
7. -json 输出打包结果到json文件
8. -progress 打包时显示进度
9. -watch 监听文件变化，重新开始打包（没有变动的会被缓存到内存中）
10. -color
11. -hot 开启[[HMR]] 
12. -profile： 详细输出每个环节的用时
13. [命令行接口（CLI） | webpack 中文文档](https://webpack.docschina.org/api/cli/)
# 小结
从入口文件开始，加载并处理各种格式的文件，最终生成bundle 文件。
所有配置都是为了JS，CSS，HTML，静态资源

| 概念 | 过程 | 功能 |
| --- | --- | --- |
| entry |  | JS文件，依赖起点 |
| output |  | 文件夹：打包文件存放点 |
| loader |  | 处理：打包过程中的非JS格式文件 |
| plugin |  | 打包、构建：生成其他格式文件？ |
了解webpack的功能，原理足够，不用记配置项。

# 用途
开发UI库

[^1]: 几乎所有功能都由插件提供
[^2]: 将所有格式的文件转换成JS模块：webpack对转换后的JS模块去==分析依赖关系==，并在浏览器中==加载==。
[^3]: 如果在两次构建中entry依赖的内容不同，最终的bundle就会两个hash值，也就是产生了两个不同的打包结果。源文件只修改了一个字符，hash就会变化。hash加到文件名的好处：文件改动直接产生不同的bundle文件，不同的文件名浏览器就不会使用上次的缓存。（部分浏览器会因为文件同名而使用缓存）因为HTML文件不会缓存，只要JS文件不同，就能加载最新代码。
[^4]: 这样最后的dist中的文件就能正常加载。
[^5]: webpack的一种运行模式，这种模式下一个文件被更新，代码就会重新编译。不用手动构建，但为了看到最新效果还要刷新浏览器。
[^6]: 可自动刷新浏览器。
[^7]: 一个中间件，用来定制watch与刷新的过程。实现watch mode与dev-server无法满足的需求。
[^8]: ES 模块化中规定的，语言级别的动态导入语法
[^9]: ES Module之前，webpack自己hack的动态导入语法
[^10]: 动态导入是异步的，会返回一个Promise
[^11]: 编写webpack-loader的官方工具库，提供了许多常用方法
[^12]: **编译器**实例（即webpack的实例）
[^13]: 每次的**编译过程**实例
[^14]: 在这两个实例上的多个hook上注册逻辑，webpack在相应时机触发hook，调用注册的逻辑
[^15]: 在UTF-8中，字符数就是字节数
[^16]: 构建与打包相关需求：统计打包大小。