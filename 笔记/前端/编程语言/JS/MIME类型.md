# 概述
媒体类型（通常称为 Multipurpose Internet Mail Extensions 或 MIME 类型），用来表示**文档、文件或字节流**的*性质*和*格式*的一种**标准**。

# 语法
1. 形式：type/subtype
	1. type：可分为多个子类的**独立类型** 
	2. subtype：**细分类型** 
2. 大小写不敏感

## 独立类型、

| 类型 | 描述 | 示例 |
| ---- | ---- | ---- |
|text	|表明文件是普通文本，理论上是人类可读|	text/plain, text/html, text/css, text/javascript|
|image|	表明是某种图像。不包括视频，但是动态图（比如动态 gif）也使用 image 类型	|image/gif, image/png, image/jpeg, image/bmp, image/webp, image/x-icon, image/vnd.microsoft.icon|
|audio|	表明是某种音频文件|	audio/midi, audio/mpeg, audio/webm, audio/ogg, audio/wav|
|video	|表明是某种视频文件	|video/webm, video/ogg|
|application	表明是某种二进制数据|	application/octet-stream, application/pkcs12, application/vnd.mspowerpoint, application/xhtml+xml, application/xml, application/pdf|