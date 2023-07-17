一种**二进制到文本**的编码规则。使得二进制数据在解释成 radix-64 的表现形式后能够用 ASCII 字符串的格式表示出来


该编码方案通常用于需要对二进制数据进行编码的情况

每一个 Base64 字符实际上代表着 6[[比特]] 

应用
	1. 在一些软件应用、XML中储存复杂数据

JavaScript 中，有两个函数被分别用来处理解码和编码 Base64 字符串
	1. btoa()：从*二进制数据字符串*创建一个Base64编码的[[ASCII]]字符串（“btoa”应读作“binary to ASCII”）
	2. atob()：解码通过 Base-64 编码的字符串数据（“atob”应读作“ASCII to binary”）

# Unicode 问题
JavaScript 字符串是 16 位编码的字符串，在大多数浏览器中，在 Unicode 字符串上调用 window.btoa，如果一个字符超过了 8 位 ASCII 编码字符的范围，就会引起 Character Out Of Range 异常。