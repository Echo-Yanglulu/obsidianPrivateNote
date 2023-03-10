# 方案
JS模块化方案
## [[CommonJS]] 
服务端
node.js对它的实现依赖了node.js本身的功能（**浏览器环境不可用**），但随着[[打包工具]]的出现，通过处理的CommonJS代码也可在浏览器中使用
## [[AMD]] 
node环境
CommonJS 规范之后推出的一个解决 web 页面**动态异步加载 JavaScript** 的规范
特点
	1. 浏览器支持
	2. 实现简单
	3. 可异步加载
虽然适合浏览器端开发，但随着npm包管理机制流行，这种方式可能逐步被淘汰。
## [[ES Module]] 
AMD与CommonJS都没有**统一浏览器与客户端的模块化规范**
1. node.js可通过在.mjs文件中node --experimental-modules some-esm-file.mjs添加-experimental-modules：true启用该语法。
2. 可通过[[babel]]或[[TS]]提前体验（为啥，因为都有编译器？）
## UMD
兼容CommonJS与AMD规范。即要在node.js环境运行，又要在浏览器环境运行，一般使用该规范对项目进行模块化。
## CMD
node环境
