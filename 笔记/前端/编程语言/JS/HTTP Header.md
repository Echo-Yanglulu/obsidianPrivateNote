# 概述

# Request
- Accept：浏览器可接收的数据*格式*
- Accept-Language：浏览器可接收的*语言*，如zh-CN
- Accept-Encoding：浏览器可接收的*压缩算法*，如gzip。[^1] 
- Authorization：
- Accept-Charset
- Content-type：此次请求所发送的数据【如果有发送】的*格式*。
	- application/json
- Connection：[[TCP]]连接
	1. keep-alive 建立一次重复使用。不重复地断开重连
- cookie：每次请求*同域*的资源时，浏览器都会携带
- Host：请求的域名
- User-Agent：浏览器信息（简称UA）
- if-modified-since
- if-none-match

# Response
- Content-type：此次请求所发送的数据【如果有发送】的*格式*。
	- application/json
- content-length：返回数据的*大小*（字节）
- content-encoding：返回数据的*压缩算法*，如gzip
- set-cookie：服务端需要更改cookie时添加的响应头
- last-modified
- etag
# 自定义Header
原因：有些API、接口，希望你在头部加一些他们的密钥/某个值
方法：![[Pasted image 20230702155044.png]] 

[^1]: 浏览器会支持某些压缩算法，对响应进行解压