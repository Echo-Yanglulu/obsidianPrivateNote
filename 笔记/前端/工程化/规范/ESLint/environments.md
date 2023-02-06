浏览器，node，[[CommonJS]]，es6，es2017，worker。
环境配置比较简单，了解即可

不同的运行环境有不同的全局变量。 
	如果环境配置为node，全局使用require方法与process对象都不会报错
|  | 浏览器 | node |
| --- | --- | --- |
| 全局变量 | window | process |

![[建立代码规范的全局变量.png]]
比如浏览器中，不希望引入的第三方库echarts被改写。就把echarts设置为只读。