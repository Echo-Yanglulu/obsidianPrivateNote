高度可配置的JS静态代码检查工具，已成为JS代码检查的事实标准。

# 特性
1. 完全可插拔，一切行为通过配置产生
2. rule之间相互独立

# 原理

> 为何有这些强大的特性？
通过解析器（parser）将JS代码解析为抽象语法树（[[AST]]），再调用规则（rule）对AST进行检查。
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
 1. [[parser]]：eslilnt使用哪种解析器
 2. [[environments]]：代码的[[运行环境]]，就是预先配置好的全局变量的集合（不同环境默认的内置全局变量）
 3. [[globals]]：ENV之外，其他需要自定义的全局变量（自定义的全局变量）
 4. [[rules]]：很多rules可能组成plugin
 5. [[plugin]]：一组以上的配置项和processor（处理非JS文件）的集合，往往用于特定类型文件的代码检查。如.md文件
	 1. 先用processor 把md文件中的所有JS代码提取，进行后面的代码检查
 6. [[extends]]：一组配置项的封装，可以被用户继承