# 概述
大部分配置是loader与plugin
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


[^1]: 打包后的sourcemap 可以将dist后的结果完全映射到最初的源代码，并可以在映射后的源代码上自由地打断点。如果映射的不是源代码文件，而是loader处理后的文件。或者映射粒度较粗，只能对应第一行的代码建立映射，而不是每个字符，即不能自由地打断点，则sourcemap 质量一般。
[^2]: 这些node包有些已经对环境做了判断。在浏览器环境下不会使用node功能，但仍然存在node环境下的模块与全局变量的引用，如果不处理，这些引用可能报错。利用webpack提供的node包mock，可提供假模块与假变量，这样前端代码就不会报node包引用相关的错误。
[^3]: 模块搜索目录
[^4]: .mjs是es6 module的模块名