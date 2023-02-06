[[node项目]]中的一个文件，用于定义**项目的相关信息**。
# name
项目名称
发布到npmjs.com为以该字段命名
另一种格式（作用域包）：@scope/name。如@babel/core就是babel作用域下的用于转换ES6语法的core包
# author
作者
# version
版本号
[[]]
# dependencies:
离开该依赖项则项目无法正常**运行**（运行依赖）
## 版本号

# devDependencies:
开发依赖：对项目进行**开发**或修改时必须用到的包
# license
版权许可

存在于所有node程序、node库