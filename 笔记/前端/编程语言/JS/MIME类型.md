# 概述
[[媒体类型]]（通常称为 Multipurpose Internet Mail Extensions 或 MIME 类型），用来表示**文档、文件或字节流**的*性质*和*格式*的一种**标准**。
# 语法
1. 形式：type/subtype
	1. type：可分为多个子类的**独立类型** 
	2. subtype：**细分类型** 
2. 大小写不敏感
## 独立类型

| 类型        | 描述                                                                    | 示例                                                                                                                                |
| ----------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| text        | 普通文本，理论上是人类可读                                    | text/plain, text/html, text/css, text/javascript                                                                                    |
| image       | 图像。动态图（如gif）也使用 | image/gif, image/png, image/jpeg, image/bmp, image/webp, image/x-icon, image/vnd.microsoft.icon                                     |
| audio       | 音频文件                                                      | audio/midi, audio/mpeg, audio/webm, audio/ogg, audio/wav                                                                            |
| video       | 视频文件                                                      | video/webm, video/ogg                                                                                                               |
| application | [[二进制数据]]                                                    | application/octet-stream, application/pkcs12, application/vnd.mspowerpoint, application/xhtml+xml, application/xml, application/pdf |
## Multipart 类型
表示*细分领域的文件类型*的种类，经常对应不同的 MIME 类型
是复合文件的一种表现方式
1. multipart/form-data
	1. 可用于联系 HTML Forms 和 POST 方法
2. multipart/byteranges
	1. 使用状态码206 Partial Content来发送整个文件的子集，而 HTTP 对不能处理的复合文件使用特殊的方式：将信息直接传送给浏览器
# 重要的 MIME 类型
application/octet-stream
text/plain
text/html
text/css
text/javascript
图片类型
音频与视频类型
# 设置正确的 MIME 类型的重要性
背景
	1. 很多 web 服务器使用默认的 `application/octet-stream` 来发送未知类型。
# MIME 嗅探

# 其他传送文件类型的方法
