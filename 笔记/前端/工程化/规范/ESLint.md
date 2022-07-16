高度可配置的JS静态代码检查工具，已成为JS代码检查的事实标准。

# 特性
1. 完全可插拔，一切行为通过配置产生
2. rule之间相互独立

# 原理

> 为何有这些强大的特性？
通过解析器（parser）将JS代码解析为抽象语法树（[[AST]]），再调用规则（rule）对AST进行检查。
ESLint的规则就是一个检查AST的函数


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
 1. parser：eslilnt使用哪种解析器