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
	3. refactor：代码重构
	4. docs：文档修改
	5. style：如缩进整体由2个空格变成4个空格。
	6. test：
	7. chore：其他修改（构建流程，依赖管理）
2. body
3. footer
