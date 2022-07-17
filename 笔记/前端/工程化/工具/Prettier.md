
功能/意义/作用：认为自己是有主见的工程化工具[^1]，停止大家对==代码格式==的那些没有意义的辩论。认为在代码格式上为了可读性，牺牲一些灵活性，可为开发者带来更多收益。

Lint规则分类：
	1. 代码格式: max-len, keyword-spacing, comma-style, no-mixed-space-and-tabs
	2. 代码质量: no-unused-vars, no-extra-bind, no-implicit-globals

Prettier只关注代码格式：不会报错，但会在某个时间[^2]格式化代码，提高代码可读性

![[工程化工具-代码格式-Prettier.png]]
## 定义

## 使用
[^1]: 严格控制配置项的数量，对默认格式的选择标准是“可读性第一”
[^2]: save, commit