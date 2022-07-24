定义：一种==可遍历的，描述代码的树状结构==。利用AST可方便地分析==代码的结构与内容==。
![[Pasted image 20220724161227.png]]
可通过[AST explorer](https://astexplorer.net/)查看JS代码解析为AST后，AST的结构与内容。

规范：一开始JS有各种==解析器==，解析得到的==AST格式==各不相同，为了统一约定了==ESTree规范==，统一了各种解析器处理后产出的AST结构的规范。（所以ESLint的parser有很多，却可以随意更换，因为产出的结构类似）
![[AST的结构.png]]