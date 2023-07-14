# 概述
定义：是一个*现代JS应用*的*静态模块*打包工具。
	1. 以一个或多个入口模块为起点，创建一个依赖关系图；
	2. 将项目所需的每个模块组合产出为一个或多个bundle。
功能
	1. 把它看作一个“模块化打包工具”，是“温饱”
	2. 如果能了解内核机制、利用**强大的plugin系统**，是“小康”（其实不只是打包，还可以做许多提高研发效率的事）
对比：为何是webpack，而不是其他的构建工具？【webpack与其他打包工具的对比】
	1. 从入口开始，经过模块依赖的**加载，分析，打包**三个过程，完成项目构建，在三个过程中可以添加不同问题的解决方案。
	2. 可解决传统构建工具的问题
		1. 模块化打包。一切皆模块，CSS，JS，html, 图片，字段，富媒体等
		2. 语法转换。ES6，TS；
		3. 预处理器编译。[[LESS]]；
		4. 项目优化。压缩，[[CDN]]；
	3. 新构建工具的新功能/解决的新问题
		1. 传统构建工具的思路是，遍历源文件，匹配规则，打包。无法做到*按需加载*。
		2. *解决方案封装*。通过loader与plugin机制
2. 其中的概念在webapck的内核与原理上是如何实现的？
意义：
	1. [[开发依赖]] 
## 组成
webpack
webpack-cli：通过脚本传参打包
## 特点
1. 也是**插件化**[^1]的
2. 相对gulp等传统工具，对构建的流程与资源有了更高级的抽象
3. 将所有不同类型的资源进行统一管理，进行整体的分析与优化
## 操作
配置
	1. 使用自定义的html文件作为首页的模板[^21]
		1. 不再自动生成html模板文件
		2. 后续打包内容会自动插入到模板文件中
优化
	前端代码不像后端，还需要浏览器下载，所以需要合并、压缩
	如果配置合理，可提高缓存命中率
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
	1. chunk文件
## 重要的对象与实现
# 基本概念
## chunk
定义：是**多个模块的封装单元**。
产生来源
	1. 入口：从一个入口，根据依赖关系图将所有模块打包，最后生成一个chunk。几个入口对应生成几个chunk
	2. 异步模块
	3. 代码分割

chunk是个集合概念。包含多个文件。
	1. 如果没有配置代码分割、没有异步加载模块，则有每个入口文件所构成的依赖图会形成一个chunk
	2. 每个chunk下的文件统称为bundle
## bundle
入口模块及所有依赖模块综合处理后得到的JS文件【预编译，合并，压缩后的文件？】
#### chunk与bundle的区别
chunk真包含bundle。bundle是个体
	1. chunk是个抽象概念、*集合概念*。作为打包结果，**一个chunk可能包含一个或多个bundle**[^20] 
	2. bundle是具体概念、*普遍概念*：chunk内的每个文件，都是一个bundle。
## entry
webpack是静态模块打包工具，需要一个或多个入口文件[^19]，作为项目依赖关系分析的起点。
### 单入口
```js
// 标准
module.exports = {
  entry: {
    main: './path/to/my/entry/file.js',
  },
};
// 简写
module.exports = {
  entry: './path/to/my/entry/file.js',
  // 当前目录
  entry: path.join(__dirname,'src','index.js' )
};

// 想要一次注入多个依赖文件，并且将它们的依赖关系绘制在一个 "chunk" 中时
module.exports = {
  entry: ['./src/file_1.js', './src/file_2.js'],
  output: {
    filename: 'bundle.js',
  },
};
```
### 多入口
```js
// 比较繁琐，却是定义入口时可扩展性最高的方式
module.exports = {
  entry: {
    app: './src/app.js',
    adminApp: './src/adminApp.js',
  },
};
console.log(module)
```
多入口的场景
	1. 多个SPA或一个MPA，需要为每个入口命名。
	2. 代码分离
### 入口描述对象
1. dependOn: 当前入口所依赖的入口[^18]。
2. filename: 指定要输出的文件名称。
3. import: *启动时*需加载的模块。
4. library: 指定 library 选项，为当前 entry 构建一个 library。
5. runtime: 运行时 chunk 的名字。
	1. 如果设置了，就会创建一个新的运行时 chunk。在 webpack 5.43.0 之后可将其设为 false 以避免一个新的运行时 chunk。
6. publicPath: 由入口生成的输出文件在浏览器中被引用时，为它们指定一个*公共 URL 地址*。请查看 output.publicPath。
注意
	1. `runtime` 和 `dependOn` 不应在同一个入口上同时使用，所以如下配置无效，并且会抛出错误
	2. runtime 不能指向已存在的入口名称，例如下面配置会抛出一个错误
	3. dependOn 不能是循环引用的，下面的例子也会出现错误
### 应用场景
为何需要多个入口/依赖图？
1. 分离应用（app）和三方库（vendor）的入口。
	1. 在小于4的版本中拆分入口
	2. 在＞4的版本中
		1. 不要使用*非执行起点*作为entry
		2. 应使用`optimization.splitChunks` 将vendor与app分开。
2. MPA
	1. 在MPA中，server会重新拉取一个[[HTML]]文档，所有依赖的资源重新下载
	2. 使用`optimization.splitChunks`为多个页面之间共享的app代码创建bundle，复用多个入口之间的大量代码。
### 配置

## output
最终打包结束后，打包结果的JS bundle 文件放置的**文件夹** 
![[Pasted image 20220801225838.png]]![[Pasted image 20220801231703.png]]
1. path: 输出文件的保存目录
	1. `path: path.join(__dirname, 'dist')`：打包结果放入dist文件夹
2. filename：支持变量，即文件名作为打包文件名。hash：对文件使用散列算法得出的字符串[^3] 
	1. 如果使用了hash【尽量使用contenthash】，应避免作为模板文件的html页面被缓存
	2. 如果白屏。可能是代理服务器的缓存，或浏览器的缓存。
		1. 客户端禁止缓存html：![[Pasted image 20230702160830.png]] 
chunkFilename：也是一种bundle，是**非entry模块**打包的结果文件。一般使用==动态加载==技术时会出现这种bundle。
## loader【模块加载及其内容处理】
==一想到loader这个概念，马上想起它的定义、原理、分类、配置== 
1.定义：
	1. 一个**函数**，用于在 `import` 或 `load` ==JS/JSON之外==的其他模块时加载模块，并将源码转换[^2]为JS [[模块]]，添加到依赖图中（默认只可编译JS、JSON模块）
	2. 自己：处理依赖关系时，可**非JS/[[JSON]]模块**的**加载与内容处理**。
		1. 加载
			1. cson/ts/CoffeeScript/[[HTML]] 
		2. 处理内容
			1. 编译：less，sass，stylus，vue组件，markdown
			2. 语法转换：es6
			3. 从不同语言转换为JS,或将内联图像转换为data URL
			4. 在js文件中`import`css。

### 特性
1. 支持链式调用
3. 运行在 [[node]] 中，可执行任何操作
4. 可通过options对象配置
2. 可同步或异步
5. [[babel#plugin（最基础的工具）|插件]]能为loader带来更多特性【插件可对loader进行扩展】
6. 会产生额外的意外文件
###  功能
【语法，文件，模板，样式，框架】【语文模样框】
1. 文件预处理
	1. val-loader 将代码作为模块执行，并将其导出为 JS 代码
	2. ref-loader 用于手动建立文件之间的依赖关系
	3. cson-loader 加载并转换 CSON 文件【为JSON文件？】
3. 语法转换
	1. `babel-loader` 使用 Babel 加载 ES2015+ 代码并将其转换为 ES5
	2. `esbuild-loader` 加载 ES2015+ 代码并使用 esbuild 转译到 ES6+
	3. `buble-loader` 使用 Bublé 加载 ES2015+ 代码并将其转换为 ES5
	4. `traceur-loader` 使用 Traceur 加载 ES2015+ 代码并将其转换为 ES5
	5. `ts-loader` 像加载 JavaScript 一样加载 TypeScript 2.0+
	6. `coffee-loader` 像加载 JavaScript 一样加载 CoffeeScript
	7. `fengari-loader` 使用 fengari 加载 Lua 代码
	8. `elm-webpack-loader` 像加载 JavaScript 一样加载 Elm
4. 模板
	1. `html-loader` 将 *HTML* 导出为字符串，需要传入静态资源的引用路径
	2. `pug-loader` 加载 Pug 和 Jade 模板并返回一个函数
	3. `markdown-loader` 将 *Markdown* 编译为 HTML
	4. `react-markdown-loader` 使用 markdown-parse 解析器将 Markdown 编译为 React 组件
	5. `posthtml-loader` 使用 PostHTML 加载并转换 HTML 文件
	6. `handlebars-loader` 将 Handlebars 文件编译为 HTML
	7. `markup-inline-loader` 将 SVG/MathML 文件内嵌到 HTML 中。在将图标字体或 CSS 动画应用于 SVG 时，此功能非常实用。
	8. `twig-loader` 编译 Twig 模板并返回一个函数
	9. `remark-loader` 通过 remark 加载 markdown，且支持解析内容中的图片
5. 样式
	1. `style-loader` 将模块导出的内容作为样式并添加到 DOM 中
	2. `css-loader` 加载 CSS 文件并解析 import 的 CSS 文件，最终返回 CSS 代码
	3. `less-loader` 加载并编译 LESS 文件
	4. `sass-loader` 加载并编译 SASS/SCSS 文件
	5. `postcss-loader` 使用 PostCSS 加载并转换 CSS/SSS 文件
	6. `stylus-loader` 加载并编译 Stylus 文件
6. 框架
	1. `vue-loader` 加载并编译 Vue 组件
	2. `angular2-template-loader` 加载并编译 Angular 组件
### 原理
#### 洋葱模型
![[Pasted image 20220806153852.png]]
执行时，从开始调用每个loader的pitch方法，再反向调用loader函数本身。即：在pitch阶段*正序*执行loader的pitch方法，在execute阶段**倒序**执行loader本身。
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
### 分类
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
### 配置
#### 配置文件
因为是*模块*的*处理规则*，所以配置字段又嵌套了一层：module.rules字段
	1. test：选择需要处理的文件类型
	2. use：对应loader
	3. exclude：匹配时排除某些文件夹
执行顺序：反向。
![[Pasted image 20220731000757.png]]
![[Pasted image 20220804222709.png]]
#### 内联配置
在使用import语句建立模块依赖时指定loader
1. 使用`!`分开多个Loader：`import Styles from 'style-loader!css-loader?modules!./styles.css';`
	1. 这里css-loader使用了[[CSS Module]]。
2. 使用 **! 前缀**：禁用所有已配置的 *loader*(普通 loader)
	1. `import Styles from '!style-loader!css-loader?modules!./styles.css';` 
3. 使用 **!! 前缀**：禁用所有已配置的 *loader*（preLoader, loader, postLoader）【集合名词】
	1. `import Styles from '!!style-loader!css-loader?modules!./styles.css';` 
4. 使用 **-! 前缀**：禁用所有已配置的 *preLoader 和 loader*，但是不禁用 postLoaders
	1. `import Styles from '-!style-loader!css-loader?modules!./styles.css';` 
### 常用loader 
1. postcss-loader：sass, less之类的语法编译为CSS。同sass-loader 。
2. css-loader ：处理如import的样式引入语法。
	1. 将代码插入style标签中。
	2. 或使用插件将部分代码导出为css文件后通过link标签引入页面。
3. style-loader ：将最终的样式内容，包裹为JS，让JS在运行过程中把样式插入页面的style标签。
4. css-loader :允许将 css 文件通过 require 的方式引入，并返回 css 代码
5. less-loader: 处理 [[LESS]] 
6. sass-loader: 处理 [[Sass]]
7. postcss-loader: 用 postcss 来处理 CSS
8. file-loader: 分发文件到 output 目录并返回相对路径，wepakck5 asset/resource 内置支持
9. url-loader: 和 file-loader 类似，但是当文件小于设定的 limit 时可以返回一个 Data Url，wepakck5 asset/inline 内置支持
10. babel-loader:  ES6 文件到 ES

作者：晓得迷路了
链接：https://juejin.cn/post/7244174211957211196
来源：稀土掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
## plugin【loader无法解决的其他事】
本质：==一个实现了apply方法的JS类==，在运行时得到compiler[^12]和compilation[^13]两个实例。plugin的工作就是操作这两个实例[^14]
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
如：
	1. htmlWebpackPlugin
		1. 为项目/应用程序生成html文件
		2. 将所有通过loader生成的JS bundle自动注入。(基本的loader无法做到一系列的功能)
![[Pasted image 20220731001033.png]]
### 常用plugin
#### [[SplitChunksPlugin]] 

## mode
指定**构建任务所处环境**/**webpack运行环境**，webpack会根据环境使用一些优化项
环境
	1. 开发环境
	2. 生产环境
	3. 不指定环境
优化项
	1.添加一些*针对环境的优化*plugin
	2. 配置一些优化项的默认值。

![[Pasted image 20220731001611.png]]
## hook
各个插件注册在hook上，由webpack在相应时机调用
## 注释
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
通过上面的注释， import() 不再是简单的 JavaScript 异步加载器， 还是任意模块资源的加载器， 举例说明：如果我们页面用到的图片都放在 src/assets/img 文件夹下， 可以通过下面方式将用到的图片打包到一起：
```javascript
import(/* webpackChunkName: "image", webpackInclude: /\.(png|jpg|gif)/ */ './assets/img');
```
prefetch 和 preload 可以用于提前加载资源[^17]的功能
	1. preload 会并行，或**主文件加载完后，立即加载**；
	2. prefetch：**主文件加载完后，进行闲时加载**。 
	3. prefetch 优先级低于 preload。
# 配置
[[webpack.config.js]] 
## 基础配置
### 资源加载
任何非JS,[[JSON]]资源都应使用loader加载
	1. 加载css应使用css-loader与style-loader。使用这个loader就能在css中使用@import语法引用其他CSS。style-loader可把JS文件中导入的CSS代码打包到JS bundle中，在JS Bundle运行时自动地把样式插入页面的style标签中。
		1. loader反向执行：把sass-loader放在css-loader 之后，才能将处理后的css交给css-loader ，否则依赖倒置会导致出错。
### 资源处理
使用plugin
	1. 处理**HTML**资源。如果要操作HTML，一般使用HtmlWebpackPlugin 插件![[Pasted image 20230703154317.png]] 
		1. 使用自定义的html文件作为模板
			1. 打包结果将被自动插入
			2. 自定义添加一些标签，全局loading等
		2. 不用Loader，直接实例化一个该插件即可。可使用EJS语法定制HTML内容。比如不用手动去写标签的属性值。
	2. 想把**CSS**抽离出来，成为单独的文件，而不是通过JS插入HTML![[Pasted image 20220801233153.png]]
		1. 它还提供了一个loader用于CSS文件的提取。webpack 的plugin与loader非常丰富。
	3. 处理**JS**资源
		1. 使用了ES高级语法→用babel-loader加载JS文件。如果不单独配置，这个loader会使用项目的.babelrc.json作为默认配置![[Pasted image 20220805192120.png]]
	4. 开发中的**静态资源**
		1. 图片，字体图标，音视频：url-loader与file-loader。![[Pasted image 20220801233644.png]]
		2. file-loader ：**处理**JS文件中对这些静态资源的引入，并**输出**到output目录[^4]
		3. url-loader ：与file-loader 很像，但有limit配置，如果小于该**字节数**，则将文件直接打包成**BASE 64**形式放到JS **Bundle**中，而不是作为**单独文件**进行加载。
## 高级配置
### devServer
背景：不能每次修改代码，就==全量打包编译==一次。所以在调试状态下，可利用webpack提供的开发工具，
功能：指定一个文件夹，本地运行其中的代码。【一般是用于存储项目打包结果的文件夹】
在代码发生变化后需要自动编译，三种方式：
	1. webpack watch mode[^5] 
		1. 监听：如果文件更新，就重新编译
	2. webapck-dev-server[^6] 
		1. 编译后刷新浏览器。
	3. webpack-dev-middleware[^7] 
![[Pasted image 20220805222427.png]]
既然可以自动运行打包结果。那**如何配置每次修改项目，保存后自动本地构建**？
	1. 已经自动构建，文件保存在内存中，不会在dist目录下
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
			1. 可利用注释，为分离出来的chunk命名。这样就能在chunkFilename 中使用[[lodash]]方式来定义这个**chunk**名对应的**规则**![[Pasted image 20220806080410.png]]
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
# 优化：13种

## [[babel]]打包优化
```js
import { Rol, Col } from 'react-bootstrap';
// 两个组件的导入，babel在打包时进行处理，会处理为
var reactBootstrap = require('react-bootstrap')
var Rol = reactBootstrap.Rol;
var Col = reactBootstrap.Col;
// 关于模块的导入，babel在转换源码时，会转换为：引入所有的组件
// 使用插件修改babel在转换模块引入时的规则
```
`babel-plugin-transform-imports`插件后，代码转换
```js
import Rol from 'react-bootstrap/lib/Rol'
```

## 缩小文件查找范围
优化loader，resolve.modules, resolve.alias, resolve.mainFields, resolve.extensions, module.noPease
## 使用DllPlugin
将基础模块抽离，打包到**动态链接库**。如果需要使用基础模块，到动态链接库中查找。
## 使用HappyPack
单线程变多线程
## 多进程代码压缩
ParallelUglifyPlugin
## [[静态资源]]使用CDN
## 缓存
打包结果使用contenthash
## 使用prepack
编译代码时提前计算结果，放到编译后的结果中，而不是在代码运行时才求值。
## code splitting
提取公共代码
把各个模块的重复部分打包为一份公共代码，各个模块的不同部分有自己独有的代码
	1. 首行加载公共代码，再按需加载访问的页面所需代码。
## 减少bundle大小
压缩
![[Pasted image 20230609162616.png]] 
使用各种loader、插件时注意：去除代码中的空格、换行符、制表符
## tree-shaking
针对：在一个模块中被导出，却没有被使用（引入+调用）
必须使用[[JS模块化#ES Module|es module]]的语法才能去除
## 优化三方依赖
### lodash
babel-plugin-lodash插件：减少无用的Lodash内容
```js
// 源码
import _ from 'lodash';
import {add} from 'lodash/fp';
const addOne = add(1)
_.map([1,2,3], addOne)

// 使用插件的babel编译后
import _map from 'lodash/map';
import _add from 'lodash/fp/add';
const addOne = _add(1)
_map([1,2,3], addOne)
```
## 作用域提升
![[Pasted image 20230609164802.png]] 

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
# webpack-cli
[命令行接口（CLI） | webpack 中文文档](https://webpack.docschina.org/api/cli/) 
## 为何
在命令行中**运行**webpack（配置文件或命令行是用来**传参**的）。
还有其他方式用来运行webpack吗？GUI？
	不能，一种运行方式，两种传参方式。
## 功能
1. 构建过程添加进度条：webpack --progress --colors
2. 平时只有简单的错误提示，查看错误详情：webpack --display-error-details；
3. 缓存未改变的编译内容（未改动的模块，会被放入内存，不再每次编译），开启监听模式：webpack --watch；
4. 打包：webpack -d开发环境打包 -p生产环境打包
5. -config 指定一个路径，存放webpack的配置文件
6. -mode 指定打包环境
7. -json 输出打包结果到json文件
8. -progress 打包时显示进度
9. -watch 监听文件变化，重新开始打包（没有变动的会被缓存到内存中）
10. -color
11. -hot 开启[[HMR]] 
12. -profile： 详细输出每个环节的用时
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
# 问题
配置结束，webpack如何判断生产环境还是开发环境的？

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
[^17]: 图片、 样式等
[^18]: 它们必须在该入口被加载前被加载。
[^19]: JS文件
[^20]: 如把devtool配置成'source-map'，在根据不同来源生成的bundle之外，还会生成用于调试的map文件也属于bundle。
[^21]: 通过html-webpack