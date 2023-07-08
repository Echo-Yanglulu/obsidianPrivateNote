# 概述
媒体类型（通常称为 Multipurpose Internet Mail Extensions 或 MIME 类型），用来表示**文档、文件或字节流**的*性质*和*格式*的一种**标准**。

# 语法
1. 形式：type/subtype
	1. type：可分为多个子类的**独立类型** 
	2. subtype：**细分类型** 
2. 大小写不敏感

## 独立类型

| 类型        | 描述                                                                    | 示例                                                                                                                                |
| ----------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| text        | 表明文件是普通文本，理论上是人类可读                                    | text/plain, text/html, text/css, text/javascript                                                                                    |
| image       | 表明是某种图像。不包括视频，但是动态图（比如动态 gif）也使用 image 类型 | image/gif, image/png, image/jpeg, image/bmp, image/webp, image/x-icon, image/vnd.microsoft.icon                                     |
| audio       | 表明是某种音频文件                                                      | audio/midi, audio/mpeg, audio/webm, audio/ogg, audio/wav                                                                            |
| video       | 表明是某种视频文件                                                      | video/webm, video/ogg                                                                                                               |
| application | 表明是某种二进制数据                                                    | application/octet-stream, application/pkcs12, application/vnd.mspowerpoint, application/xhtml+xml, application/xml, application/pdf |

## Multipart 类型
表示细分领域的文件类型的种类，经常对应不同的 MIME 类型
是复合文件的一种表现方式
1. multipart/form-data
	1. 可用于联系 HTML Forms 和 POST 方法
2. multipart/byteranges
	1. 使用状态码206 Partial Content来发送整个文件的子集，而 HTTP 对不能处理的复合文件使用特殊的方式：将信息直接传送给浏览器
# 重要的 MIME 类型
application/octet-stream
text/plain
text/css
text/html
text/javascript