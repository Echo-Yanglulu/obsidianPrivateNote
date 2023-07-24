# 概述
表示错误的异常类型
背景
	1. 使用该类的主要原因是可提示栈信息，显示该错误对象被创建的地方。

throw new Error。将throw语句与新建对象写在一起即可。
## 属性
message：创建时的传参
name：始终是'Error'
toString(): 
# 子类
TypeError

ReferrenceError

SyntaxError

RangeError

URIError

EvalError

# 自定义子类 
封装自己程序的错误信息