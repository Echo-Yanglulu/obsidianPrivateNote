一个控制器对象，允许你根据需要中止一个或多个 Web 请求。

# [[构造函数]] 
AbortController.AbortController():创建一个新的 AbortController 对象实例。
# 属性
1. AbortController.signal：返回一个 AbortSignal 对象实例，它可以用来 with/abort 一个 Web（网络）请求。只读
2. AbortController.abort()：中止一个尚未完成的 Web（网络）请求。
	1. 这能够中止 fetch 请求及任何响应体的消费和流。