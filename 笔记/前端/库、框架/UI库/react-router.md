# 安装与导入
[[react]]本身只负责构建UI，并没有路由功能。需要安装react-router-dom来实现此功能。
## react-router库与react-router-dom的区别是什么？
前者只提供了路由的核心功能，后者基于前者（不含？）提供了在**浏览器环境下使用路由所需的功能**。
后者依赖于前者，所以只需安装后者即可。

基于浏览器做路由管理的话，也只需要安装一个后者即可。
前者提供的组件：Route
后者提供的组件：![[Pasted image 20230529150508.png]] 
1. 后者提供的两个Router组件有什么区别？
	1. BrowserRouter是基于[[History]] API，格式与通常使用的URL保持一致。![[Pasted image 20230529150852.png]] 
	2. HashRouter是基于URL中的锚点技术。在URL中加#锚点作为路由。![[Pasted image 20230529150904.png]] 
	3. 如何选择路由模式？
		1. hash是最简单的。不需要服务器作额外的判断。如果使用的是静态路径服务，可用该模式，因为#*后面的内容不会被服务器端所解析*，所以这段URL会传到前端路由。
		2. 如果有一个响应请求的服务器，更推荐使用browserRouter。将约定好的URL返回给前端页面。可与后端商定，将域名后面的所有都（或其他部分）都返回给前端。
	4. 区别：是否需要后端判断向前端返回哪个部分作为前端路由。
## 导入
导入，并使用该路由模式组件包裹整个应用。
![[Pasted image 20230529151509.png]] 
在应用中，定义URL与组件的映射关系。
![[Pasted image 20230529151754.png]] 
## 路由切换：Link
### 声明式导航
方式
	1. 使用a标签。除了渲染组件，也会刷新页面【不是[[SPA]]】。
		1. 重新发送请求，获取整个页面，
	2. 使用Link组件。以局部更新的方式渲染所需组件
		1. 不会重新发送请求
		2. 完成了一个由前端控制路由的SPA
### 编程式导航
路由属性中的history
	1. push
	2. replace
		1. 场景
			1. 登录之后，点击浏览器的返回按钮不应再返回登录页面
			2. 填写表单并跳转后不应返回到表单填写页面，重新填写
## 路由匹配：Route
### 匹配规则
1. 默认：模糊匹配。只要路由部分的左侧出现了path，就会渲染对应组件【会同时渲染多个组件】
2. 单个：Switch包裹Route。
	1. 不使用switch：渲染全部模糊匹配到的组件
	2. 使用：只渲染第一个与当前路由匹配的组件。
3. 精确：Route添加exact属性。路由与path属性精确匹配时才渲染该组件
使用时react会自动为绑定的*路由级别*组件注入三个属性
### 路由属性
1. history：会自动使用浏览器的history对象，实现在历史记录中导航。
	1. go
	2. goBack
	3. goForward
	4. length：历史记录的长度
2. location：当前应用的地址
	1. pathname
3. match：如何匹配URL
	1. path
	2. URL
	3. params
	4. isExact：当前组件是否由精确匹配展示
### 查询参数
#### *路由参数*的形式
【实际最好不用】：查询参数最好与路由参数分开？路由参数就用用于映射对应组件
单个：![[Pasted image 20230529155559.png]] 
多个：
	1. 准确![[Pasted image 20230529155825.png]] 
	2. 模糊。接收时未传递的是undefined![[Pasted image 20230529160359.png]] 
顺序：接收路由查询参数的组件需要放在上面。从具体到抽象
接收：props.match.params

#### URL*查询参数*形式
实际中更多地是使用URL的查询参数，结合queryString进行解析。参见[[location]]。
通过location.search获取，结果建议使用三方库query-string处理【应该是非常智能】
### 总结
路由级别组件
	1. 类似于条件渲染，只是条件是路由参数
	2. 传递属性 ![[Pasted image 20230529155319.png]] 
		1. render属性。为避免三个路由属性被覆盖，需传入参数
	3. 传递查询参数【因为是路由级别】。

## 路由匹配调整：Redirect
场景
	1. 当前路由没有定义映射组件关系![[Pasted image 20230529161450.png]] 
	2. 临时维护![[Pasted image 20230529161651.png]] 

# 路由鉴权
## 背景
[React路由鉴权 - 掘金](https://juejin.cn/post/6844903924441284615#heading-0) 
项目中是希望*根据登录人*来看下这个人是不是有权限进入*当前页面*。虽然服务端做了进行接口的权限，但是每一个路由加载的时候都要去请求这个接口太浪费了。有时候后端是通过SESSIONID来校验登陆权限的。

# 总结
基本的路由
	1. 组成
		1. 映射关系【静态】
		2. 导航工具【动态】

# 相关链接
[Site Unreachable](https://react-router.docschina.org/web/example/basic) 
[Introduction | React Router 中文文档](https://react-guide.github.io/react-router-cn/) 
