[起步 | Axios 中文文档 | Axios 中文网](https://www.axios-http.cn/docs/intro) 
[axios中文文档|axios中文网 | axios](http://axios-js.com/zh-cn/docs/) 
# 概述
定义：一个基于 [[promise]] 的[[网络请求库]]，作用于node.js 和浏览器中。
	1. 在服务端使用原生[[node|node.js]]的http模块
	2. 在客户端则使用[[网络请求#XHR对象|XMLHttpRequests]] 
特性
	1. 基于[[Promise]] 
	2. isomorphic。即同一套代码可以运行在浏览器和node.js中
		2. 从客户端创建[[网络请求#XHR对象|XMLHttpRequests]] 
		3. 从 node.js 创建[[http]]请求
	3. *拦截*请求和响应
	4. *取消*请求
	5. *转换*请求和响应数据
	6. *自动转换*[[JSON]]数据
	7. 客户端支持防御[[XSRF]] 

# 使用
## 配置
axios(options)
## 直接使用模块上的方法