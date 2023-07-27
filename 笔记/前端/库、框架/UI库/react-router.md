# 概述
定义：是完整的 React 路由解决方案
特点
	1. 保持 UI 与 URL 同步
	2. 简单的 API 与强大的功能。
		1. 代码缓冲加载、动态路由匹配、以及建立正确的位置过渡处理
功能
	1. 基于 React 的强大路由库，它可以让你向应用中快速地添加*视图和数据流*，同时保持页面与 URL 间的同步
		1. 如果不使用它，需要监听hashchange事件
	2. 保持 UI 与 URL 同步。拥有简单的 API 与强大的功能例如代码缓冲加载、动态路由匹配、以及建立正确的位置过渡处理。你第一个念头想到的应该是 URL，而不是事后再想起。
## 相关
[Introduction | React Router 中文文档](https://react-guide.github.io/react-router-cn/) 
[React Router v6 官方文档翻译 （一） ---- Installation && Quick Start - 掘金](https://juejin.cn/post/7100479939694034952?searchId=202307131615023EF2ADD9ABAC267EDEB1#heading-2) 
[React路由鉴权 - 掘金](https://juejin.cn/post/6844903924441284615#heading-0) 
## 环境
支持所有的浏览器和环境中运行 React
## 模式
1. hash 模式（默认）。如 http://abc.com/#user/10
2. H5 [[History]] 模式。如 http://abc.com/user/20
B 端应用可选择hash模式，C 端应用可选择History模式
## 使用
Router组件,包裹Route组件，最终匹配，输出结果为一个组件。
# 安装与导入
[[react]]本身只负责构建UI，并没有路由功能。需要安装react-router-dom来实现此功能。
## react-router库与react-router-dom的区别？
前者只提供了路由的核心功能，后者基于前者（不含？）提供了在**浏览器环境下使用路由所需的功能**。
后者依赖于前者，所以只需安装后者即可。

前者提供的组件：Route
后者提供的组件：![[Pasted image 20230529150508.png]] 
1. 后者提供的两个Router组件有什么区别？
	1. BrowserRouter是基于[[History]] API，格式与通常使用的URL保持一致。![[Pasted image 20230529150852.png]] 
	2. HashRouter是基于URL中的锚点技术。在URL中加#锚点作为路由。![[Pasted image 20230529150904.png]] 
	3. 如何选择路由模式？
		1. hash是最简单的。不需要服务器作额外的判断。如果使用的是静态路径服务，可用该模式，因为#*后面的内容不会被服务器端所解析*，所以这段URL会传到前端路由。
		2. 如果有一个专用于响应请求的服务器，更推荐使用browserRouter。将约定好的URL返回给前端页面。可与后端商定，将域名后面的所有都（或其他部分）都返回给前端。
	4. 区别：是否需要后端判断向前端返回哪个部分作为前端路由。
## 导入
导入，并使用该路由模式组件包裹整个应用。
![[Pasted image 20230529151509.png]] 
在应用中，定义URL与组件的映射关系。
![[Pasted image 20230529151754.png]] 
# 路由导航
### 声明式导航
方式
	1. `a标签`。除了渲染组件，也会*刷新页面*【不是[[SPA]]】。
		1. 重新发送请求，获取整个页面，
		2. 所有组件重新触发 `didMount` 生命周期
	2. `Link组件`。以局部更新的方式渲染所需组件
		1. 功能
			1. 不会重新发送请求
			2. 完成了一个由前端控制路由的SPA
		2. 属性
			1. to：字符串，要**跳转的路由参数** 
			2. 
	3. `NavLink组件`。
### 编程式导航
1. history路由属性
	1. push
	2. replace
		1. 场景
			1. 登录之后，点击浏览器的返回按钮不应再返回登录页面
			2. 填写表单并跳转后不应返回到表单填写页面，重新填写
2. 库中的 useHistory API [[useHistory API.png]] 
# 路由配置
一组指令，告诉router如何匹配url与组件。
## 配置方式
### Router组件的JSX嵌套
```js
import { Redirect } from 'react-router'

React.render((
  <Router>
    <Route path="/" component={App}>
      <IndexRoute component={Dashboard} />
      <Route path="about" component={About} />
      <Route path="inbox" component={Inbox}>
        <Route path="/messages/:id" component={Message} />

        {/* 跳转 /inbox/messages/:id 到 /messages/:id */}
        <Redirect from="messages/:id" to="/messages/:id" />
      </Route>
    </Route>
  </Router>
), document.body)
```
### Router组件的routes属性
```js
const routeConfig = [
  { path: '/',
    component: App,
    indexRoute: { component: Dashboard },
    childRoutes: [
      { path: 'about', component: About },
      { path: 'inbox',
        component: Inbox,
        childRoutes: [
          { path: '/messages/:id', component: Message },
          { path: 'messages/:id',
            onEnter: function (nextState, replaceState) {
              replaceState(null, '/messages/' + nextState.params.id)
            }
          }
        ]
      }
    ]
  }
]

React.render(<Router routes={routeConfig} />, document.body)
```
## 组件
1. 首页路由：IndexRoute
	1. indexRoute与Route组件同级，指定的是默认组件。即，在/时，需要在App组件中展示的组件。
2. 路由：Route
	1. path：需要匹配的路由参数
	2. component：该路由对应的路由级别组件
	3. Hook：进入和离开的hook。用于跳转的*权限验证*、*存储数据* 
		1. onEnter
			1. 从最外层的父路由开始直到最下层子路由结束
		2. onLeave
			1. 会在*所有将离开的路由中触发*，从最下层的子路由开始直到最外层父路由结束
3. 重定向：Redirect 
	1. from
	2. to。只有to属性：没有任何匹配时的重定向

## 组件与path匹配规则
1. 渲染条件
	1. 模糊：默认值。只要路由部分的左侧出现了path，就会渲染对应组件【会同时渲染多个】
	2. 单个：Switch包裹Route/Redirect。
		1. 不使用switch：渲染全部模糊匹配到的组件
		2. 使用：只渲染第一个与当前路由匹配的组件。
	3. 精确：Route添加exact属性。路由与path属性精确匹配时才渲染该组件
2. 属性
	1. path：需要匹配的路由参数
	2. component：该路由对应的路由级别组件
	3. render属性
使用时react会自动为绑定的*路由级别*组件注入三个属性
## 路由属性
### 注入
通过Route组件绑定的路由级别组件，会自动注入
其他叶子组件，需要传入withRouter。
### 访问
通过props访问
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
## 子路由
Route组件嵌套
```js
React.render((
  <Router>
    <Route path="/" component={App}>
      <Route path="about" component={About} />
      <Route path="inbox" component={Inbox} />
    </Route>
  </Router>
), document.body)
```
内部，router 会将你树级嵌套格式的\<Route> 转变成路由配置
## [[URL]] 参数
### 路由参数
【实际最好不要用】：查询参数最好与路由参数分开？路由参数就用用于映射对应组件，不要用于传参
传递
	1. 单个：[[Pasted image 20230529155559.png]] 
	2. 多个
		1. 准确 ![[Pasted image 20230529155825.png]] 
		2. 模糊。接收时未传递的是undefined ![[Pasted image 20230529160359.png]]
	3. 顺序：接收路由查询参数的组件需要放在上面。从具体到抽象
接收
	1. props.match.params
	2. react-router-dom库中的 useParams [[Pasted image 20230710222733.png]] 
### 查询参数
实际中更多地是使用URL的查询参数，结合queryString进行解析。参见[[location]]。
	1. location.search，结果建议使用三方库query-string处理【应该是非常智能】
	2. react-router-dom的useSearchParams
		1. `const [searchParams] = useSearchParams()`
		2. `const currentType = searchParams.get('type');` 
### 小结
路由级别组件[^1] 
	1. 传递属性：为避免三个路由属性被覆盖，需传入参数。 ![[Pasted image 20230529155319.png]] 
	2. 传递查询参数【因为是路由级别】。
## 调整：Redirect
场景
	1. 当前路由没有定义映射组件关系![[Pasted image 20230529161450.png]] 
	2. 临时维护![[Pasted image 20230529161651.png]] 

# 原理
## 路由匹配原理
三个属性来决定是否“匹配“一个 URL
	1. 嵌套关系
### 嵌套关系
*通过路由的嵌套，定义view的嵌套*
	1. 一个给定的 URL 被调用时，整个集合中的组件都会被渲染
	2. 嵌套路由是一种树形结构
	3. *深度优先*地遍历整个[[#路由配置]]来寻找一个与给定的 URL 相匹配的路由
### 路径语法
`:paramName`  匹配一段位于 /、? 或 # 之后的 URL。命中的部分将被作为一个参数
`()`   在它内部的内容被认为是可选的
`*`  匹配任意字符（非贪婪的）直到命中下一个字符或者整个 URL 的末尾，并创建一个 splat 参数
```js
<Route path="/hello/:name">         // 匹配 /hello/michael 和 /hello/ryan
<Route path="/hello(/:name)">       // 匹配 /hello, /hello/michael 和 /hello/ryan
<Route path="/files/*.*">           // 匹配 /files/hello.jpg 和 /files/path/to/hello.jpg
```
### 优先级
# 路由鉴权
## 背景
[React路由鉴权 - 掘金](https://juejin.cn/post/6844903924441284615#heading-0) 
项目中是希望*根据登录人*来看下这个人是不是有权限进入*当前页面*。虽然服务端做了进行接口的权限，但是每一个路由加载的时候都要去请求这个接口太浪费了。有时候后端是通过SESSIONID来校验登陆权限的。
页面分类
	1. 首页
	2. 登录页
	3. 404
	4. 管理员管理页
	5. 业务内容页

# 总结
基本的路由
	1. 组成
		1. 映射关系【静态】
			2. Route, Redirect
		2. 导航工具【动态】
			1. Link, NavLink


[^1]: 类似于条件渲染，只是条件是路由参数

# 相关
## 库
react-router-config：避免了原有的“平铺式”写法，有利于后期维护
