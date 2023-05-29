# 安装与导入
[[react]]本身只负责构建UI，并没有路由功能。需要安装react-router-dom来实现此功能。
## react-router库与react-router-dom的区别是什么？
前者只提供了路由的核心功能，后者基于前者（不含？）提供了在浏览器环境下运行所需的一些功能。
后者依赖于前者，所以只需安装后者即可。

基于浏览器做路由管理的话，也只需要安装一个后者即可。
前者提供的组件：
Route组件
后者提供的组件：![[Pasted image 20230529150508.png]] 
1. 后者提供的两个Router组件有什么区别？
	1. BrowserRouter是基于[[History]] API，格式与通常使用的URL保持一致。![[Pasted image 20230529150852.png]] 
	2. HashRouter使用的是锚点技术。在URL中加#锚点作为路由。![[Pasted image 20230529150904.png]] 
	3. 如何选择路由模式？
		1. hash是最简单的。不需要服务器作额外的判断。如果使用的是静态路径服务，可用该模式，因为#*后面的内容不会被服务器端所解析*，所以这段URL会传到前端路由。
		2. 如果有一个响应请求的服务器，更推荐使用browserRouter。将约定好的URL返回给前端页面。可与后端商定，将域名后面的所有都（或其他部分）都返回给前端。
	4. 区别：是否需要后端判断向前端返回哪个部分作为前端路由。
## 导入
导入，并使用该路由模式组件包裹整个应用。
![[Pasted image 20230529151509.png]] 
在应用中，定义URL与组件的映射关系。
![[Pasted image 20230529151754.png]] 
## 匹配规则
1. 默认：模糊匹配。只要路由部分的左侧出现了path，就会渲染对应组件【会同时渲染多个组件】
2. 单个：Switch包裹Route。
	1. 不使用switch：渲染全部模糊匹配到的组件
	2. 使用：只渲染第一个与当前路由匹配的组件。
3. 精确：Route添加exact属性。路由与path属性精确匹配时才渲染该组件
## 路由切换/导航
方式
	1. 使用a标签。除了渲染组件，也会刷新页面【不是[[SPA]]】。
		1. 重新发送请求，获取整个页面，
	2. 使用Link组件。以局部更新的方式渲染所需组件
		1. 不会重新发送请求
		2. 完成了一个由前端控制路由的SPA
## Route
使用时react会自动为绑定的*路由级别*组件注入三个属性
### history
会自动使用浏览器的history对象，实现在历史记录中导航。
go
goBack
goForward
length：历史记录的长度
### location
当前应用的地址
pathname
### match
如何匹配URL
path
URL
params
isExact
### 查询参数
单个：![[Pasted image 20230529155559.png]] 
多个：![[Pasted image 20230529155825.png]] 
顺序：接收路由查询参数的组件需要放在上面。从具体到抽象
接收：props.match.params
### 总结
路由级别组件
	1. 类似于条件渲染，只是条件是路由参数
	2. 传递属性：![[Pasted image 20230529155319.png]] 
		1. 使用render属性。为避免三个路由属性被覆盖，需传入参数




# 总结
基本的路由
	1. 组成
		1. 映射关系【静态】
		2. 导航工具【动态】

# 相关链接
[Site Unreachable](https://react-router.docschina.org/web/example/basic) 
[Introduction | React Router 中文文档](https://react-guide.github.io/react-router-cn/) 
[React路由鉴权 - 掘金](https://juejin.cn/post/6844903924441284615#heading-0) 