# 概述

# Request
Accept：浏览器可接收的数据格式
Accept-Encoding：浏览器可接收的压缩算法，如gzip。[^1] 
Accept-Language：浏览器可接收的语言，如zh-CN
Connection
	keep-alive 建立一次[[TCP]]连接重复使用。不重复地断开重连
cookie：每次请求同域的资源时，浏览器都会携带
Host：请求的域名
User-Agent：浏览器信息（简称UA）
Content-type：发送数据的格式。
	application/json

# Response


[^1]: 浏览器会支持某些压缩算法，对响应进行解压