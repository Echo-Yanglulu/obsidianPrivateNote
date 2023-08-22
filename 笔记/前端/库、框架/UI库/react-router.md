# 概述
定义：是完整的 [[React]] 路由解决方案
特点
	1. 保持 UI 与 [[URL]] 同步
	2. 简单的 API 与强大的功能。
		1. 代码*缓冲加载*、*动态路由*匹配、以及建立正确的*位置过渡*处理
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
1. hashHistory。hash 模式（默认），如 http://abc.com/#user/10
2. browserHistory。H5 [[History]] 模式。如 http://abc.com/user/20
3. createMemoryHistory
	1. 特点
		1. 不会发生 url 的变化
4. 也可自定义history
B 端应用可选择hash模式，C 端应用可选择History模式
## 使用
Router组件,包裹Route组件，最终匹配，输出结果为一个组件。
# 安装与导入
[[react]]本身只负责构建UI，并没有路由功能。需要安装react-router-dom来实现此功能。
## react-router库与react-router-dom的区别？
前者只提供了**路由的核心功能**，后者基于前者提供了在**浏览器环境下使用路由所需的功能**。
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
使用路由模式组件包裹应用。
![[Pasted image 20230529151509.png]] 
在应用中，定义 URL 与 UI的映射关系。
![[Pasted image 20230529151754.png]] 
# 管理历史记录的模式
一个 history 知道如何去
	1. *监听*浏览器地址栏的变化，
	2. 解析这个 URL *转化*为 location 对象，
	3. 然后 router 使用location 对象*匹配*到路由，
	4. 最后正确地*渲染*对应的组件
## 分类
1. browserHistory
	1. 使用浏览器中的 [[History]] API 用于处理 URL，创建一个像`example.com/some/path`这样真实的 URL 
2. hashHistory
	1. 使用 URL 中的 hash（#）部分去创建形如 `example.com/\#/some/path` 的路由
	2. 不需要服务器任何配置就可以运行，如果刚刚入门，那就使用它。但是不推荐在实际线上环境中用到它，因为每一个 web 应用都应该渴望使用 browserHistory
3. createMemoryHistory
	1. Memory history 不会在地址栏被操作或读取。这就解释了我们是如何实现服务器渲染的。同时它也非常适合测试和其他的渲染环境（像 React Native ）
	2. 和另外两种history的一点不同是你必须创建它，这种方式便于测试
## 使用
```js
// JavaScript 模块导入（译者注：ES6 形式）
import { browserHistory } from 'react-router'
render(
  <Router history={browserHistory} routes={routes} />,
  document.getElementById('app')
)
```
# 路由导航
### 声明式导航
方式
	1. `a标签`。除了渲染组件，也会*刷新页面*【不是[[SPA]]】
		1. 重新发送请求，获取整个页面，
		2. 所有组件重新触发 `didMount` 生命周期
	2. `Link组件`。以局部更新的方式渲染所需组件
		1. 功能
			1. 不会重新发送请求
			2. 可完成一个由前端控制路由的SPA
	3. `NavLink组件`。
### 编程式导航
1. history路由属性
	1. push
	2. replace
		1. 场景
			1. 登录之后，点击浏览器的返回按钮不应再返回登录页面
			2. 填写表单并跳转后不应返回到表单填写页面，重新填写
# [[react-router API|API]] 
# [[react-router 路由配置]] 

# 高级配置

## 组件外导航
场景：比如在redux中导航
```js
// somewhere like a redux/flux action file:
import { browserHistory } from 'react-router'
browserHistory.push('/some/path')
```

## 动态路由
背景：对于大型应用来说，一个首当其冲的问题就是所需加载的 JavaScript 的大小。程序应当只加载当前渲染页所需的 JavaScript。
	路由是个非常适于做代码分拆的地方：它的责任就是配置好每个 view
## 跳转确认
React Router 提供一个 routerWillLeave 生命周期钩子，React 组件可以
	1. return false *取消*此次跳转
	2. return 返回提示信息，在离开 route 前*提示*用户进行确认
### 路由级别组件中使用
```js
// 引入 Lifecycle mixin 来安装这个钩子
import { Lifecycle } from 'react-router'

const Home = React.createClass({
  // 假设 Home 是一个 route 组件，它可能会使用
  // Lifecycle mixin 去获得一个 routerWillLeave 方法。
  mixins: [ Lifecycle ],
  routerWillLeave(nextLocation) {
    if (!this.state.isSaved)
      return 'Your work is not saved! Are you sure you want to leave?'
  },
  // ...
})
```
### 深层组件中使用
```js
import { Lifecycle, RouteContext } from 'react-router'

const Home = React.createClass({
  // route 会被放到 Home 和它子组件及孙子组件的 context 中，
  // 这样在层级树中 Home 及其所有子组件都可以拿到 route。
  mixins: [ RouteContext ],
  render() {
    return <NestedForm />
  }

})
const NestedForm = React.createClass({
  // 后代组件使用 Lifecycle mixin 获得一个 routerWillLeave 的方法。
  mixins: [ Lifecycle ],
  routerWillLeave(nextLocation) {
	  // 判断当前组件中某个state，进行操作
    if (!this.state.isSaved)
      return 'Your work is not saved! Are you sure you want to leave?'
  },
  // ...
})
```
# 原理
在最后的渲染结果中，Switch，Router,Route等react-router提供的组件都会消失，只剩下经历匹配后应当被渲染的组件。
```js
ReactDOM.render(
  <Router>
    <div>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/news">
        <NewsFeed />
      </Route>
    </div>
  </Router>,
  node
);
// 如果location是 / ，UI层级将会展示为
<div>
  <Home />
  <!-- react-empty: 2 -->
</div>
```
## 路由匹配原理
路由三个属性来决定是否“匹配“一个 URL
### 嵌套关系
*通过路由的嵌套，定义view的嵌套*
	1. 嵌套路由是一种树形结构
		1. 一个给定URL 被调用时，整个集合中的组件都会被渲染
	2. *深度优先*地遍历整个[[#路由配置]]来寻找一个与给定的 URL 相匹配的路由
### 路径语法
路由路径
	1. 是*匹配整体（或部分）URL 的一个字符串模式*
	2. 大部分的路由路径都可以直接按照字面量理解，除了以下几个特殊的符号
		1. `:paramName`  ：匹配一段位于 /、? 或 # 之后的 URL。命中的部分将被作为一个参数
		2. `()`   ：可选内容
		3. `*`  ：匹配任意字符（非贪婪的）直到命中下一个字符或整个 URL 的末尾，并创建一个 splat 参数
```js
<Route path="/hello/:name">         // 匹配 /hello/michael 和 /hello/ryan
<Route path="/hello(/:name)">       // 匹配 /hello, /hello/michael 和 /hello/ryan
<Route path="/files/*.*">           // 匹配 /files/hello.jpg 和 /files/path/to/hello.jpg
```
### 优先级
路由算法会*根据定义的顺序自顶向下匹配路由*，多个兄弟路由节点配置时，你必须确认前一个路由不会匹配后一个路由中的路径
```js
// 禁止
<Route path="/comments" ... />
<Redirect from="/comments" ... />
```
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
