高度可配置的JS代码静态检查工具，已成为==JS代码检查==的事实标准。
# 特性
1. 完全可插拔，一切行为通过配置产生
2. rule之间相互独立
# 原理

> 为何有这些强大的特性？
通过解析器（[[parser]]）将JS代码解析为抽象语法树（AST），再调用规则（rule）对AST进行分析检查以发现语法问题。
ESLint的规则（rule）就是一个检查AST的函数
# 使用
## eslint cli
## 编辑器集成
在写代码的同时进行代码检查
vscode/atom/vim/sublime text
## 构建工具集成
在构建过程中进行代码检查
webpack/rollup/gulp/grunt/vite ，
## 配置
使用很简单，但配置的方式和方法较多
配置文件格式：JS, JSON, YAML, package.json中的eslintConfig字段。
配置内容：
 1. [[parser]]：希望eslilnt使用哪种解析器
 2. [[environments]]：当前需要被规范化的代码的[[environments|运行环境]]，就是预先配置好的全局变量的集合（不同环境默认的内置全局变量）
 3. [[globals]]：ENV之外，其他需要自定义的全局变量（自定义的全局变量）
 4. [[rules]]：很多rules可能组成plugin
 5. [[plugins]]：一组以上的配置项和processor（处理非JS文件）的集合，往往用于特定类型文件的代码检查。如.md文件
	 1. 先用processor 把md文件中的所有JS代码提取，进行后面的代码检查
 6. [[extends]]：一组配置项的封装，可以被用户继承

# 编写自己的ESLint规范
![[编写自己的ESLint规范.png]]
meta对象：信息
create方法：接收context对象，返回包含遍历规则的对象。
demo解析：
	1. MemberExpression[^1]：一种[[检查时机]]接收的是[[AST]] 中的节点（需要了解它的规范）。在eslint遍历AST时，如果遇到MemberExpression ，将调用这个方法[^2]
	2. 如果遇到该类型节点，就调用eslint上下文提供的report方法提示报错信息。
==总结==：在使用表达式访问对象属性时，对象名是arguments，且使用的是点语法，且属性名存在，且属性名是caller/callee。则报错
## demo：创建一个规则，检查class是否含有constructor方法
## 定义
1. 借助[AST explorer](https://astexplorer.net/)查看AST结构。
2. 对照文档书写meta部分
3. create：
## 使用
![[eslint自定义规则使用.png]]
在package.json中定义一个脚本，执行eslint，传参定义后的JS文件 
[^1]: 属性访问表达式
[^2]: if判断是方法的核心。必须是静态访问属性，且属性名是caller或callee，如果成立，说明使用了arguments.caller。context是eslint的上下文，这里使用了报告问题的方法。data中的props与messsageId组合成为提示信息