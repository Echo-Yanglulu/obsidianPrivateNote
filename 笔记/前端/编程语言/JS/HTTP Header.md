# 概述

# Request
- Accept：浏览器可接收的数据格式
- Accept-Encoding：浏览器可接收的压缩算法，如gzip。[^1] 
- Accept-Language：浏览器可接收的语言，如zh-CN
- Connection：[[TCP]]连接
	1. keep-alive 建立一次重复使用。不重复地断开重连
- cookie：每次请求同域的资源时，浏览器都会携带
- Host：请求的域名
- User-Agent：浏览器信息（简称UA）
- Content-type：此次请求所发送的数据【如果有发送】的格式。
	1. application/json

# Response
- Content-type：此次请求所发送的数据【如果有发送】的*格式*。
	- application/json
- content-length：返回数据的*大小*（字节）
- content-encoding：返回数据的*压缩算法*，如gzip
- set-cookie：服务端需要更改cookie时添加的响应头


[^1]: 浏览器会支持某些压缩算法，对响应进行解压