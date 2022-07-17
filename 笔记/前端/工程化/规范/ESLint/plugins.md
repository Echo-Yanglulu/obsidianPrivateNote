plugins是对environments,globals, rules, processor等配置的封装
以eslint-plugin-vue[^1]为例：
	1. 一系列规则
	2. 集成好的配置

用户如果有需要可直接继承它，不需要额外配置。
![[eslint-plugin.png]]

插件使用方式：
	1. 单独引用rules，把这个插件的规则引入到自己的rules中
	2. 直接继承它的configs，（最简单的使用方式）
	3. 如果要vue文件进行lint，就使用这个插件中的预处理器

使用默认配置 VS. DIY
![[ESLint使用插件.png]]
引入了vue的eslint插件，但又手动地定义了每个规则（不是覆盖vue的默认配置？）

[^1]: vue的eslint插件。规范vue代码。processor 这么配置说明vue文件需要经过这个插件处理之后，再经过eslint处理。