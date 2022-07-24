插件化的语法转义工具

对转义ES标准语法，及JSX等非标准语法都有灵活的支持

# 原理
概述：将代码转换成token流，转换成AST。
输入：较高版本的ES代码，输出符合要求的低版本ES代码。如ES7转换成ES5
过程：不严格对应于[[编译器]]中的5步
	1. 解析parsing：生成AST
	2. 转换transformation：操作AST（修改AST的内容）
	3. 生成code generation：根据AST生成新的代码