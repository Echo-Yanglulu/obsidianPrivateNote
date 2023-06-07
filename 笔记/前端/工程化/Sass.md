1. 选择预处理器转译时使用的[[编译器]] 
	1. [[LibSass]] 可通过使用[[npm]]安装node-sass包添加，保存到[[开发依赖]]（写入package.json）
2. 选择使用的语法
	1. Sass：去掉所有大括号与分号，严格使用缩进表示代码结构
	2. SCSS：使用大括号与分号，看起来更像常规CSS
## 安装
[[CSS预处理器]] 
node版本
	1. npm install scss-loader node-sass -D
		1. 安装node-sass时需要先安装二进制包，可能卡顿
		2. 在项目目录的.npmrc文件下修改![[Pasted image 20230607223258.png]]

在[[webpack]]中使用![[Pasted image 20230607223442.png]]
