# 为何
commit分析
	1. 提供更多历史信息，方便快速浏览
		1. git log HEAD --pretty=format:%s
	2. 过滤某些commit（如不重要的文档改动），快速找到某次commit。
		1. git log HEAD -- pretty=format:%s --grep SSR
	3. 可用于直接生成changelog
# 如何
angular规范
	任何类型项目都可使用，不只局限于angular。使用这个规范去提交commit message时，类似release-it的第三方工具就会根据cm内容判断更新内容，决定需要更新的版本号。
![[Pasted image 20220828171333.png]]
1. type
	1. feat
	2. fix
	3. build: 构建系统/外部依赖变化。如build[gulp]
	4. refactor：代码重构
	5. docs：文档变化
	6. perf：性能优化
	7. style：代码格式修改。如缩进整体由2个空格变成4个空格。
	8. test：测试用例新增/修改。
	9. ci：CI配置文件/脚本变化。如ci[travis]
	10. chore：其他修改（构建流程，依赖管理）
2. scope：影响范围
	1. route, component, utils, build
3. subject/description：概述，建议符合50/72 formatting
4. body：具体修改内容，**补充描述**，
	1. 可多行，语法符合上述50/72
	2. 修改的原因与目的
5. footer：备注。通常是用于重大更新提示。
	1. 以BREAKING CHANGE：开头
	2. 修复BUG的链接。

记不住？用CLI工具：[[commitizen]]
