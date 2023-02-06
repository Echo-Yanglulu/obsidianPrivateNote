# 概述
大部分配置是loader与plugin
是[[node]]的一个模块，遵循[[CommonJS]]规范
# 配置
1. devtools：用于开启sourcemap功能。CRA是如何使用它的？生产环境默认不开启
	1. 'sourcemap'很适合生产环境，开启后，webpack会提供==质量好，结果完整==[^1]的源代码映射。但开发环境不适用，因为打包太慢。
	2. 'cheap-module-source-map'适合开发环境，这种sourcemap 的构建速度快，可映射大部分代码行。虽然对某列打断点为有问题，但考虑到构建速度可接受。
2. node：mock一些node的内置模块与全局变量。因为有时需要为前端项目使用一些node包[^2]。
3. performance：打包性能。CRA默认将基设置为false,因为单独引入了FileSizeReporter这个工具做性能检查。没有这个工具则需要开启，来提供性能信息，从而判断是否需要优化构建策略。
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