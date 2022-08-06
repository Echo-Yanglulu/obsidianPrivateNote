# 概述
大部分配置是loader与plugin
# 配置
1. devtools：用于开启sourcemap功能。CRA是如何使用它的？生产环境默认不开启
	'sourcemap'很适合生产环境，开启后，webpack会提供质量最好，质量最完整[^1]的源代码映射。

[^1]: 打包后的sourcemap 可以将dist后的结果完全映射到最初的源代码，并可以在映射后的源代码上 