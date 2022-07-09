``` mermaid 
	erDiagram
	mermaid ||--|| diagramType: has
   diagramType {enum flowchart enum pie enum erDiagram}
	mermaid ||--o| trend: has
	mermaid ||--|{ node: has
```

# 基本概念
## 图表类型(每个mermaid的开头)
1. [[流程图]]flowchart
2. [[交流顺序图]]sequenceDiagram
3. 甘特图gantt
时间与事件
4. [[类图]]
5. git图
6. [[实体关系图]]erDiagram
活动-参与者-心情/结果/过程图   （三个维度）
7. 资质/需求图requirement diagram[^1]
# 图表开展方向
TD/TB, BT, LR, RL
#  子图表
subgraph 内容 end
# 指令：%%{指令对象}%%

# 图表中断
只影响几种图表
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
粗细
虚实
方向：
# 子进程
# 数据库
# 

[^1]: A Requirement diagram provides a visualization for requirements and their connections, to each other and other documented elements.   A requirement is a quality or [qualification](https://www.collinsdictionary.com/zh/dictionary/english/qualification "qualification 的释义") that you [must](https://www.collinsdictionary.com/zh/dictionary/english/must "must 的释义") have in order to be allowed to do something or to be [suitable](https://www.collinsdictionary.com/zh/dictionary/english/suitable "suitable 的释义") for something.1. 做某事，适合某物所需要的资质。2.需求