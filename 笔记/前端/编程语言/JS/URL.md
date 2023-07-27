# 概述
含义：统一资源定位符。俗称网络地址
格式
	1. 相对路径
	2. 绝对路径
## 分类
###  Data URL
1. 定义：前缀为 `data:` 协议的 URL。
2. 背景
	1. 之前被称作“data URI”，直到这个名字被 [[WHATWG]] 弃用
	2. 现代浏览器将 Data URL 视作*唯一的不透明来源*，而不是可以用于导航的 URL。
3. 相关
	1. [Data URL - HTTP | MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/Data_URLs) 
4. 作用
	1. 允许内容创建者*向文档中嵌入小文件*。
5. 组成：`data:[<mediatype>][;base64],<data>` 
	1. 前缀`data:` 
	2. 指示数据类型的 [[MIME类型]] 
		1. 如果被省略，则默认值为 text/plain;charset=US-ASCII
	3. 如果非文本则为可选的 [[base64]] 标记
	4. 数据
		1. 如果数据包含 RFC 3986 中定义为*保留字符*的字符或包含空格符、换行符或者其他*非打印字符*，这些字符必须进行百分号编码（又名“URL 编码”）。
		2. 如果数据是文本类型，你可以直接将文本嵌入（根据文档类型，使用合适的实体字符或转义字符）。
		3. 否则，你可以指定 base64 来嵌入 [[base64]] 编码的[[二进制数据]] 
6. 机制
	1. 每一个 Base64 字符代表着 6 比特位
		1. 编码尺寸增加。3 字节的字符串/二进制文件可以转换成 4 个 Base64 字符

查询参数
	1. location.search
	2. URLSearchParams API
		1. `const params = new URLSearchParams(location.search)` 
		2. `params.get(key)` 