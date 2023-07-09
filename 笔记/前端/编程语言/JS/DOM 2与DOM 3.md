# 概述
## 内容
- DOM2到DOM3的变化
- 操作样式的DOM API
- DOM遍历与范围
## 意义
DOM1（DOM Level 1）主要定义了HTML和XML**文档的底层结构** 
DOM2（DOM Level 2）和DOM3（DOM Level 3）在这些结构之上加入更多**交互能力**，提供了更高级的XML特性

DOM2和DOM3是按照模块化的思路来制定标准的，每个模块之间有一定关联，但分别针对某个DOM子集。这些模式如下所示。
- DOM Core：在DOM1核心部分的基础上，为节点增加方法和属性。
- DOM Views：定义基于样式信息的不同视图。
- DOM Events：定义通过事件实现DOM文档交互。即[[DOM事件]] 
- DOM Style：定义以编程方式访问和修改CSS样式的接口。
- DOM Traversal and Range：新增遍历DOM文档及选择文档内容的接口。
- DOM HTML：在DOM1 HTML部分的基础上，增加属性、方法和新接口。
- DOM Mutation Observers：定义基于DOM变化触发回调的接口。这个模块是DOM4级模块，用于取代Mutation Events。