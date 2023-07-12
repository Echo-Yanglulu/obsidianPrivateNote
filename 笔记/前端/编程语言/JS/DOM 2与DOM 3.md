# 概述
## 内容
- DOM2到DOM3的变化
- 操作样式的DOM API
- DOM遍历与范围
## 意义
DOM1（DOM Level 1）主要定义了HTML和XML**文档的底层结构** 
DOM2（DOM Level 2）和DOM3（DOM Level 3）在这些结构之上加入更多**交互能力**，提供了更高级的XML特性

DOM2和DOM3是按照[[模块化]]的思路来*制定标准*的，每个模块之间有一定关联，但分别针对某个*DOM子集*。这些模式如下所示。
- DOM Core：在DOM1核心部分的基础上，为*节点*增加属性和方法。
- DOM Views：定义基于样式信息的不同*视图*。
- DOM HTML：在DOM1 HTML部分的基础上，增加*属性、方法和新接口*。
- DOM Style：定义以编程方式访问和修改*CSS*样式的接口。
- DOM Events：定义通过事件实现DOM文档交互。即[[DOM事件]] 
- DOM Traversal and Range：新增*遍历*DOM文档及*选择*文档内容的接口。
- DOM Mutation Observers：定义基于*DOM变化触发回调*的接口。这个模块是DOM4级模块，用于取代Mutation Events。在[[DOM#MutationObserver接口]]中已介绍过
- 还有XPath模块和Load and Save模块。见[[XML]] 
## 兼容
比较老旧的浏览器（如IE8）对本章内容支持有限。如果你的项目要兼容这些低版本浏览器，在使用本章介绍的API之前先确认浏览器的支持情况。推荐参考Can I Use网站。
# DOM的演进
## XML命名空间
Node的变化
Document的变化
Element的变化
NamedNodeMap的变化
## 其他变化
DocumentType的变化
Document的变化
Node的变化
内嵌窗格的变化
# 样式
## 存取元素样式
## 操作样式表
## 元素尺寸
# 遍历
## NodeIterator
## TreeWalker
# 范围
## DOM范围
## 简单选择
## 复杂选择
## 操作范围
## 范围插入
## 范围折叠
## 范围比较
## 复制范围
## 清理