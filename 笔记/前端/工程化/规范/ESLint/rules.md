---
时间: 20220827
---
ESLint没有**默认开启**的规则，只是**推荐开启**一些规则。
	1. "extends": "eslint:recommended"

ESLint 内置规则


使用方法：添加--fix可自动修复该eslint报错，显示为🔧

![[ESLint rules配置.png]]
错误级别：三级，使用字符串或数字。
其他配置

规则：\[错误级别， 其他配置]

有时会把一个以上的规则抽取出来，成为[[plugins]]