# 概述
大部分配置是loader与plugin
是[[node]]的一个模块，遵循[[CommonJS]]规范
## 重要概念
### module
模块化编程中，**功能**离散的chunk是模块。
webpack中，一切**文件**都是[[模块]]（图片，CSS）
### chunk
根据自定义的规则，由module生成的文件。一个chunk可来自多个module
### bundle
bundle就是对chunk进行处理（压缩打包等）后的产出
### entry
入口模块。构建依赖图的起点
#### 属性
1. 数量
	1. 单文件入口
	2. 多文件入口。几个entry会打包出对应数量的bundle
2. 数据类型
	1. 字符串，数组，对象（打包结果中实际只有一个入口模块）
```javascript
// 单文件入口：封装库时常用。扩展配置时灵活性较低
module.exports = {
entry: 'path/to/my/entry/file.js'
};
// 或者使用对象方式
module.exports = {
entry: {
main: 'path/to/my/entry/file.js'
}
};
// 使用数组：
module.exports = {
mode: 'development',
entry: ['./src/app.js', './src/home.js'],
output: {
filename: 'array.js'
}
};
// 其实都只有一个入口，在打包产出上会有差异
// 单文件时，直接作为入口模块。

// 多入口
// 使用对象语法
module.exports = {
entry: {
home: 'path/to/my/entry/home.js',
search: 'path/to/my/entry/search.js',
list: 'path/to/my/entry/list.js'
}
};
```
|  | 单文件入口 | 多文件入口 |
| --- | --- | --- |
| 类型 | 字符串，对象，数组 | 对象 |
| 场景 | 库,单html页面 | 页面模块分享优化、多页面 |
| 特点 | 不易扩展 | 灵活性 |
| 入口模块 | 入口文件 | 并不是会创建一个多起点的依赖图，而是新建一个入口模块，最后一个作为新建入口模块的module.exports, 其他模块作为新建入口模块的引入（成为依赖图中的一部分） |
#### context
webpack打包项目时，相对路径上下文（相对路径所基于的绝对路径）。设置之后，entry与output设置的相对路径都是相对于它。引入模块也是从context开始。
默认为process.cwd()，当前工作目录。
### output
entry编译打包后输出的bundle。
#### path
存在路径，默认dist
#### filename
bundle名称，默认main。即：默认为dist/main.js
##### 函数
返回字符串作为bundle名
##### 占位符
多个entry可使用**占位符区分bundle来源**：来自哪个entry
1. name：entry中配置的模块名，即key
2. id：模块id
3. hash：模块hash。整个项目共用一个hash。一个改动，bundle中的该字段将重新生成
4. chunkhash：依赖图hash。依赖的内容改动，整个bundle重新生成
5. contenthash：文件hash（应该是具体到依赖图中每个层级）。结合提取css的插件，使用。解决js与依赖的css共用hash的问题
#### publicPath
使用script或link标签引用不同于本地磁盘路径（output.path）的文件路径时，配置
在浏览器中被引用的URL地址：当静态资源部署到CDN或其他服务时，让标签访问该域名及路径。
```javascript
// 实际上线时应如此设置
module.exports = {
	output: {
		path: '/home/git/public/assets',
		publicPath: 'http://cdn.example.com/assets/'
	}
};
```
输出为
```html
<head>
	<link href="http://cdn.example.com/assets/logo.png" />
</head>
```
#### 用webpack封装库用到的属性
1. library：库名称
2. libraryTarget：库打包出来的规范
	1. var（默认）, assign, this, window, commonjs, commonjs2, amd, umd, umd2, jsonp
#### externals
**去除**输出的打包文件（bundle？）中依赖的**第三方模块**（jquery, vue等），减小打包文件的体积。
通常在开发JS库时使用，这些被依赖的模块应该由使用者引入、添加，而不应该包含在这个项目的依赖中。如开发vue扩展，不应把vue本身引入打包内容。

库的使用者应如何提供这些，我们的库所依赖的模块？取决于
	1. 当前库的导出方式
	2. 使用者的引入方式
#### target
**构建后代码运行的宿主环境**。可能是web应用，node.js服务应用，electron跨平台桌面应用。因宿主环境不同，构建时需要特殊处理。
构建的目标（宿主环境）
1. 接收字符串
	1. web（默认）：类浏览器环境可用
	2. node：类node.js环境可用，使用require加载chunk
	3. async-node：类node.js环境可用，使用fs与vm异步加载chunk
	4. node-webkit：webkit可用，使用jsonp加载chunk，
	5. webworker
2. 接收函数
	1. compiler对象作为参数
#### devtool
如何显示[[sourcemap]]。
### mode
生产环境
	1. 压缩代码
	2. 优化图片
### loader
模块处理器：对语言模块及预处理器**模块**进行处理（ES的语法转换，less的编译）
webpack**处理依赖中的非原生模块，并将其放入bundle中**的工具。
### plugin
loader以外的功能：处理**chunk与bundle**
### resolve
在webpack构建的**查找模块过程**中起作用。
	1. 快速查找
	2. 替换（如开发环境使用dev版本的lib）
#### extensions
默认：['.wasm', '.mjs', '.js', '.json']
通常可以加上.css, .less
#### alias
作用
	1. 在任意模块中，快速访问某个常用文件夹，引入模块。
	2. 给不同环境配置不同的lib库。
		1. 在开发环境使用具有调试功能的dev版本San
```javascript
module.exports = {
	resolve: {
		alias: {
			san: process.env.NODE_ENV === 'production' ? 'san/dist/san.min.js' : 'san/dist/san.dev.js'
		}
	}
};
```
注意
1. 可使用@ ~ ! ，往往只用一种，或者每种类型使用一种。
2. 使用@时注意不要和包名的作用域名冲突
3. 末尾添加$匹配末尾准确导入
```javascript
module.exports = {
	resolve: {
		alias: {
			src: path.resolve(__dirname, 'src'),
			'@lib': path.resolve(__dirname, 'src/lib')
		}
	}
};
// require('@lib/utils') 或者 require('src/lib/utils')。vscode中可能检测不到utils中的内容，根目录新建jsconfig.json文件，
// 可帮助定位
{
"compilerOptions": {
		"baseUrl": "./src",
		"paths": {
			"@lib/": ["src/lib"]
		}
	}
}
module.exports = {
	resolve: {
		alias: {
			react$: '/path/to/react.min.js'
		}
	}
};
import react from 'react'; // 精确匹配， 所以 react.min.js 被解析和导入
import file from 'react/file.js'; // 非精确匹配， 触发普通解析
```
#### mainField
> [!question]+
> 并没有懂这个配置的含义、它的实际工作机制

有些模块会根据不同宿主环境提供不同版本代码。（如浏览器或node.js，ES6或ES6）
默认值：取决于target字段
```javascript
// package.json
{
	"jsnext:main": "es/index.js", //采用ES6语法的代码入口文件
	"main": "lib/index.js", //采用ES5语法的代码入口文件， node
	"browser": "lib/web.js" //这个是专门给浏览器用的版本
}
// target设置为web, mainField对应为
module.exports = {
	resolve: {
		mainFields: ['browser', 'module', 'main']
	}
};
// target为web进行打包时，寻找`browser`版本的模块代码
```
#### 不常用、简单配置
1. mainFiles
2. modules
3. symlinks
4. plugins
5. cachePredicate：是否支持缓存，接收fn({path, require}) => bool或bool,
### module
不同的模块需要不同的loader
#### noParse
#### rules

### 小结
从一个入口模块开始，使用loader与plugin加工处理，根据output设定输出bundle
# 配置
## 其他
### 配置语言
JS, JSX，ts, CoffeeScript
###  导出数据类型
#### 对象
#### 多配置数组
#### 函数
#### Promise
通过JS原生的[[Promise]]进行配置
### 指定配置文件
使用[[webpack-cli]]：webpack --config webpack.config.js
## 配置项
1. devtools：用于开启sourcemap功能。CRA是如何使用它的？生产环境默认不开启
	1. 'sourcemap'很适合生产环境，开启后，webpack会提供==质量好，结果完整==[^1]的源代码映射。但开发环境不适用，因为打包太慢。
	2. 'cheap-module-source-map'适合开发环境，这种sourcemap 的构建速度快，可映射大部分代码行。虽然对某列打断点为有问题，但考虑到构建速度可接受。
2. node：mock一些node的内置模块与全局变量。因为有时需要为前端项目使用一些node包[^2]。
3. performance：打包性能。CRA默认将基设置为false,因为单独引入了FileSizeReporter这个工具做**性能检查**。没有这个工具则需要开启，来提供性能信息，从而判断是否需要优化构建策略。
	1. 为某些大的依赖进行==分包加载==。
	2. ![[Pasted image 20220806134052.png]]
		1. 警告，错误，关闭
		2. 入口资源大小
		3. 打包结果资源大小
		4. 不统计所有的sourcemap 
4. resolve：webpack**解析模块**依赖的方式。
	1. modules：解析模块时搜索的==目录==及其顺序。![[Pasted image 20220806134408.png]] 希望webpack优先在node_modules文件夹中搜索模块，其次去配置好的modules.additionalModulePaths[^3]中搜索。
		1. 比如引入了一个chalk模块，webpack会优先在node_modules中找chalk。
	2. extensions：模块搜索时的使用的==后缀==及其顺序。一个数组。![[Pasted image 20220806134813.png]]如引入了chalk模块，找到该**目录**后会先匹配chalk.web.mjs[^4]后缀文件，没有再匹配chalk.mjs后缀文件。
	3. alias：模块的别名规则。简化代码中引入其他模块时的书写路径。
		1. 如设置src为@，工程路径较深时使用绝对路径方便。webpack打包时自动将简化路径展开，找到真正路径。![[Pasted image 20220806144231.png]]
	4. plugin：resolve 时使用的插件。
		1. webpack在这里使用了yarn开发的PnpWebpackPlugin[^5]
		2. 使用该插件需要引入resolveLoader![[Pasted image 20220806144527.png]]
	5. optimization：优化[^6]
		1. minize：是否压缩代码。只在生产环境开启
		2. minizer：压缩工具。![[Pasted image 20220806145522.png]]
	6. splitChunks：代码分离
	7. runtimeChunk：使用缓存构建（不全量地重新打包，只对修改过的文件重新打包，没有修改的文件使用缓存（不是）。因为该文件的内容变化，导致hash变化，最终导致引入该文件的另一文件的引入文件名发生变化，但该文件内容并无变化，却仍需要重新构建）
		1. 保存了chunkId的映射关系（引入文件对它的引入路径与它本身的文件名之间的映射关系？），所以下次
		2. 如对某个.vue文件进行动态导入，不使用该配置则会导致该文件及依赖该文件的文件全部重新打包。使用该配置会产生runtimeChunk的js文件保存映射，每次更新改变的文件及映射关系文件。

# 小结
不用记住配置项，而是掌握**原理，功能**。在遇到问题时能更快地在文档中找到即可。

[^1]: 打包后的sourcemap 可以将dist后的结果完全映射到最初的源代码，并可以在映射后的源代码上自由地打断点。如果映射的不是源代码文件，而是loader处理后的文件。或者映射粒度较粗，只能对应第一行的代码建立映射，而不是每个字符，即不能自由地打断点，则sourcemap 质量一般。
[^2]: 这些node包有些已经对环境做了判断。在浏览器环境下不会使用node功能，但仍然存在node环境下的模块与全局变量的引用，如果不处理，这些引用可能报错。利用webpack提供的node包mock，可提供假模块与假变量，这样前端代码就不会报node包引用相关的错误。
[^3]: 模块搜索目录
[^4]: .mjs是es6 module的模块名
[^5]: 即插即用。该插件可利用yarn的全局缓存，提升模块加载速度
[^6]: 主要指代码压缩。从4开始不用手动配置，因为会根据mode自动调整。虽然mode有对应的optimization，但要使用其他策略，则仍要了解所有优化项。