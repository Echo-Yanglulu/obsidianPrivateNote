是一种[[CSS预处理器]]。
1. 选择预处理器转译时使用的[[编译器]] 
	1. [[LibSass]] 可通过使用[[npm]]安装node-sass包添加，保存到[[开发依赖]]（写入package.json）
2. 选择使用的语法
	1. Sass：去掉所有大括号与分号，严格使用缩进表示代码结构
	2. SCSS：使用大括号与分号，看起来更像常规CSS
# 安装
node版本
	1. npm install scss-loader node-sass -D
		1. 安装node-sass时需要先安装二进制包，可能卡顿
		2. 在项目目录的.npmrc文件下修改![[Pasted image 20230607223258.png]]

在[[webpack]]中使用![[Pasted image 20230607223442.png]]
# 使用
## 混入
提取声明
```scss
// 变量形式的定义与使用
@mixin flex{
  display: flex;
  justify-content: center;
  align-items: center;
}
.center{
  @include flex; 
}

// 函数形式的定义与使用
@mixin flex($position){
  display: flex;
  justify-content: $position;
  align-items: $position;
}
.center{
  @include flex(start); 
}
```
