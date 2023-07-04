# 概述
JS对象简谱，一种轻量的**数据交换格式**，用于数据的存储与传输。是[[XML]]的替换。
## 内容
作为 XML 替代的JSON数据格式，还讨论了浏览器原生解析和序列化 JSON，以及使用 JSON 时要注意的安全问题
# JSON.stringfy()

# JSON.parse()

# toJSON方法
调用JSON.stringfy时，内部会先尝试调用对象内容的toJSON方法，对该方法的返回值进行序列化。

[[Date]]类定义了自己的toJSON方法。