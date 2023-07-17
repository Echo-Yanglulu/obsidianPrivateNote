# 概述
格式
	1. 相对路径
	2. 绝对路径
## 分类
###  Data URL
1. 定义：前缀为 `data:` 协议的 URL。
2. 背景：之前被称作“data URI”，直到这个名字被 [[WHATWG]] 弃用
3. 作用
	1. 允许内容创建者*向文档中嵌入小文件*。
4. 组成：`data:[<mediatype>][;base64],<data>` 
	1. 前缀`data:` 
	2. 指示数据类型的 [[MIME类型]] 
		1. 如果被省略，则默认值为 text/plain;charset=US-ASCII
	3. 如果非文本则为可选的 base64 标记
	4. 数据
		1. 如果数据包含 RFC 3986 中定义为*保留字符*的字符或包含空格符、换行符或者其他*非打印字符*，这些字符必须进行百分号编码（又名“URL 编码”）。
		2. 如果数据是文本类型，你可以直接将文本嵌入（根据文档类型，使用合适的实体字符或转义字符）。
		3. 否则，你可以指定 base64 来嵌入 base64 编码的二进制数据

查询参数
	1. location.search
	2. URLSearchParams API
		1. `const params = new URLSearchParams(location.search)` 
		2. `params.get(key)` 