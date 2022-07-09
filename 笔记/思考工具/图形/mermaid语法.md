``` mermaid 
	erDiagram
	mermaid ||--|| diagramType: has
   diagramType {enum flowchart enum pie enum erDiagram}
	mermaid ||--o| trend: has
	mermaid ||--|{ node: has
```

# 基本概念
# 图表类型(每个mermaid的开头)
	1. [[流程图]]flowchart
	2. [[交流顺序图]]sequenceDiagram
	3. 甘特图
		1. 时间与事件
	4. [[类图]]
	5. git图
	6. [[实体关系图]]erDiagram
	7. 活动-参与者-心情/结果/过程图   （三个维度）
# 图表开展方向
#  子图表
	1. subgraph 内容 end
#  指令：%%{指令对象}%%
	1. 
# 图表中断
	1. 只影响几种图表
# 节点
文本
类型
形状
	1. round edge
	2. stadium
	3. subroutine
	4. cylindrical
	7. asymmetric
	8. rhombus
	9. parallelogram
	10. trapzoid
	11. hexagon
	5. circle
	6. double circle
# 链接
	1. 粗细
	2. 虚实
		1. -- >
		2. ` mermaid flowchart LR a-->b `
	3. 方向
		1. TD/TB, BT, LR, RL, 
# 子进程
# 数据库
# 