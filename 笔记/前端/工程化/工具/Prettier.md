功能/意义/作用：认为自己是有主见的工程化工具[^1]，停止大家对==代码格式==的那些没有意义的辩论。认为在代码格式上为了可读性，牺牲一些灵活性，可为开发者带来更多收益。

Lint规则分类：
	1. 代码格式: max-len, keyword-spacing, comma-style, no-mixed-space-and-tabs
	2. 代码质量: no-unused-vars, no-extra-bind, no-implicit-globals

Prettier只关注代码格式：不会报错，但会在某个时间[^2]格式化代码，提高代码可读性

![[工程化工具-代码格式-Prettier.png]] 
## 定义

## 使用
方式
	1. CLI
	2. watch changes
		1. 使用onchange第三方库，
		2. ![[watch change方式应用Prettier.png]]
	3. git hook
	4. 与Linter集成
		1. 与eslint集成（安装两个npm包）
			1. ![[Pasted image 20220717164017.png]]
			2. config-prettier会禁止掉eslint中与prettier冲突的规则。一切以preiiter配置为准[^3]
			3. plugin-prettier：让eslint根据prettier的规则检查代码[^4]
			4. ![[Pasted image 20220717164222.png]]




[^1]: 严格控制配置项的数量，对默认格式的选择标准是“可读性第一”
[^2]: save, commit
[^3]: 如果eslint中禁止使用单引号，而prettier配置中使用了单引号，实际使用了单引号则不会报错。
[^4]: 所有格式问题，eslint听从prettier。让专业的人做专业的事