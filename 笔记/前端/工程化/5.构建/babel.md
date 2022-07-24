插件化的语法转义工具


# 功能
一种特殊的[[编译器]]，因为==源语言与目标语言都是JS==：把高版本的JS转换为低版本的JS[^1]

![[Pasted image 20220724175108.png]]
对转义ES标准语法，及JSX等非标准语法都有灵活的支持。

为何nodejs中很少使用该parser？因为新版本的node自动提供一些
# 基本概念
syntax
feature
plugin
preset
env
# 原理
概述：将代码转换成token流，转换成AST。
输入：较高版本的ES代码，输出符合要求的低版本ES代码。如ES7转换成ES5
过程：不严格对应于[[编译器]]中的5步
	1. 解析parsing：生成AST
	2. 转换transformation：操作AST（修改AST的内容）
	3. 生成code generation：根据AST生成新的代码

# 使用
为何配置了这里，那里却失效了。因为对babel的基本概念没有整体的了解，看babel完全是看黑盒

[^1]: 随时享受新语法带来的便利。【proxy不是不能编译？】