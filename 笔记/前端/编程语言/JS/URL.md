# 概述
含义：统一资源定位符。俗称网络地址
格式
	1. 相对路径
	2. 绝对路径
## 分类
###  Data URL
1. 定义：前缀为 `data:` 协议的 URL。
2. 背景
	1. 之前被称作“data [[URI]]”，直到这个名字被 [[WHATWG]] 弃用
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
	2. [[URLSearchParams]] API
# [[单例内置对象]] 
用于处理 URL 的内置对象
```js
// 获取
const url = new URL('https://www.example.com/path/file?query=value#fragment')
console.log(url.protocol) // 输出：https:
console.log(url.host) // 输出：www.example.com
console.log(url.pathname) // 输出：/path/file
console.log(url.search) // 输出：?query=value
console.log(url.hash) // 输出：#fragment

```
## 属性与方法
1. toString() 方法可以将 URL 对象转换为字符串
2. searchParams 属性可以访问查询字符串参数
	1. get()
3. keys()    返回 iterator，此对象包含所有搜索的键名
4. values()   返回 iterator,此对象包含所有的 value
5. entries()    返回一个 iterator，可以遍历所有的键值对的对象
6. set()     设置一个搜索参数新值，原来有多个值将删除其他所有值
7. get()     获取指定搜索参数的值
8. has()   判断是否有指定的搜索参数
9. getAll()   获取指定搜索参数的所有值，返回一个数组
10. delete()   从搜索参数列表里删除指定的键和值
11. append()  插入一个指定的键/值
12. toString()   返回搜索参数组成的字符串
13. sort()  按键名排序
