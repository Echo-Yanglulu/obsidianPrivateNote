# 路由组件
[React Router: Declarative Routing for React.js](https://v5.reactrouter.com/web/api/Switch) 
## 导航【修改 [[URL]]】
1. Link：声明式导航
	1. to
		1. [[String]] 目标地址字符串。含 pathname, search,  hash 
		2. [[Object]] 可多一个 state 属性：目标地址需要保存的 state
		3. [[Function]] 传入当前地址，返回字符串或对象的地址【目标 url 与当前 url 需要传递类似信息】
	2. replace 如果设置，则新记录替换掉当前记录
	3. innerRef：
	4. component：使用自定义的导航组件
	5. query
	6. state
	7. hash
	8. activeStyle
	9. activeClassName
	10. onClick(e)
2. NavLink ：基于 Link 组件，它有一个 `activeClassName` 属性，目的在于如果路由匹配成功，则为当前导航添加选中样式
## 保持 UI 和 URL 的同步：**Router** 【加 er：路由器】
1. history
2. routes：children 的别名，二选一用于配置路由
3. 通常会使用其中一个高阶路由代替
	1. \<BrowserRouter>：使用 H5的[[History]] API保持 URL 与 UI 同步的 Router 组件
		1. basename。所有location的基础URL。如果app在子目录下会需要。有前斜杠没有后斜杠
		2. getUserConfirmation。用于确认导航的函数
		3. forceRefresh。true: 页面导航时将整个页面刷新
	2. \<HashRouter>
	3. \<MemoryRouter>：把 [[URL]]历史保存到内存中，无法读写到地址栏。
		1. 在测试环境或非浏览器环境中使用，如 [[react-native]] 
	4. \<NativeRouter>
	5. \<StaticRouter>：不改变 location 的 Router 组件。[[SSR]] 时很有用
4. 使用该低级组件的场景是，使用一个[[状态管理工具]]来保存自定义历史。react-router 并不强制要求另外使用状态管理工具，除非为了*深度集成*。
## 匹配规则：**Route**
组件的 path 与当前 URL 匹配时，渲染该组件
1. path：需要匹配的URL 中的路径
2. component：该路由对应的路由级别组件。匹配到 URL 时，单个的组件会被渲染
3. exact：用于精确匹配路由
	1. true：location.pathname与当前path*相等*即可匹配成功
	2. false：location.pathname*包含*当前path即可匹配成功
4. strict：斜杠。
	1. 开启：location.pathname有，path中没有，不匹配
5. render：方便在路由组件外面再嵌套 div 之类的组件，或 props 透传/添加路由属性
	1. [React Router: Declarative Routing for React.js](https://v5.reactrouter.com/web/api/Route/render-func) 
6. components
7. `getComponent(location, callback)` 与 component 一样，但是是异步的，对于 code-splitting 很有用
8. Hook：进入和离开的hook。用于跳转的*权限验证*、*存储数据* 
	1. onEnter(nextState, replaceState, callback?)
		1. 从最外层的父路由开始直到最下层子路由结束
		2. 参数
			1. 下一个路由的 state
			2. 一个函数重定向到另一个路径
			3. 第三个参数传入时，这个钩子将是异步执行的，并且*跳转会阻塞*直到 callback 被调用
	2. onLeave
		1. 会在*所有将离开的路由中触发*，从最下层的子路由开始直到最外层父路由结束

## 默认匹配规则：**IndexRoute**
	1. indexRoute与Route组件同级，指定的是默认组件。即，在匹配/时，需要在App组件中展示的组件。
	2. \<IndexLink to="/">Home\</IndexLink>：默认路由渲染后，才链接到它。

## 重定向：**Redirect** 
1. from
2. to。只有to属性：没有任何匹配时的重定向
3. 场景
	1. 当前路由没有定义映射组件关系![[Pasted image 20230529161450.png]] 
	2. 临时维护![[Pasted image 20230529161651.png]] 

## 单一匹配：**Switch** 
渲染*第一个*与 location 匹配的 Route 或 Redirect 组件
1. 使用多个 Route：默认渲染所有匹配。适用于需要同时渲染的多个组件
	1. 如果url是`/about`，则path为`/about`、`/:name`、`/`都会渲染。因为location包含当前配置
2. location。[[Object]] 用于匹配*子元素*，而不是当前浏览器中的[[location]] 
3. children。只能是Route或Redirect元素，匹配当前location的第一个子元素将被渲染
	1. Route使用`path`属性
	2. Redirect使用`from`属性。from只是path的别名
# 方法
1. generatePath ：生成用于route的url
2. history：为不同环境中的JS管理session历史提供了不同的实现
	1. 实现
		1. “browser history” - A DOM-specific implementation, useful in *web browsers* that support the HTML5 history API
		2. “hash history” - A DOM-specific implementation for *legacy web browsers* 
		3. “memory history” - An in-memory history implementation, useful in testing and *non-DOM environments* like React Native
	2. 方法
		1. length - (number) The number of entries in the history stack
		2. action - (string) The current action (PUSH, REPLACE, or POP)
			1. 跳转到当前组件的方式
		3. location - (object) The current location. May have the following properties:
			1. pathname - (string) The path of the URL
			2. search - (string) The URL query string
			3. hash - (string) The URL hash fragment
			4. state - (object) location-specific state that was provided to e.g. push(path, state) when this location was pushed onto the stack. Only available in browser and memory history.
		4. push(path, \[state]) - (function) Pushes a new entry onto the history stack
		5. replace(path, \[state]) - (function) Replaces the current entry on the history stack
		6. go(n) - (function) Moves the pointer in the history stack by n entries
		7. goBack() - (function) Equivalent to go(-1)
		8. goForward() - (function) Equivalent to go(1)
		9. block(prompt) - (function) Prevents navigation (see the history docs 
	3. 特性
		1. 可变。history对象是可变的，所以建议访问时使用`props.location`，而不是`props.history.location`。
3. [[location]] 
	1. 代表web应用现在、曾经、之后想去的位置
	2. 属性
		1. key: 'ac3df4', // not with HashHistory!
		2. pathname: '/somewhere',
		3. search: '?some=search-string',
		4. hash: '#howdy',
		5. state: { \[userDefined]: true }
	3. 特性
		1. 不可变。所以可在生命周期中使用
	4. 场景。可直接使用location对象的地方
		1. 导航：使用location代替[[String]] 。
			1. Link、Redirect组件的to属性。history.push/replace
		2. 组件。Route, Switch
			1. 防止在路由状态中使用实际location。常用于动画、挂起导航，或者需要组件在另一个location下渲染而不是当前所处的Location
4. match
	1. Route组件与url的匹配信息
	2. 属性
		1. url - (string) The matched portion of the URL. Useful for building nested \<Link>s
		2. path - (string) The path pattern used to match. Useful for building nested \<Route>s
		3. params - (object) Key/value pairs parsed from the URL corresponding to the dynamic segments of the path
		4. isExact - (boolean) true if the entire URL was matched (no trailing characters)
	3. 存在场景
		1. `Route component` as this.props.match
		2. `Route render` as ({ match }) => ()
		3. `Route children` as ({ match }) => ()
		4. `withRouter` as this.props.match
		5. `matchPath` as the return value
		6. `useRouteMatch` as the return value
5. matchPath 
6. withRouter。高阶组件，每次组件更新时都传递最新的history, location, match
7. Hooks：16.8以上才能使用！ `react-router-dom` 提供
	1. useLocation：获取代表当前 URL 的*location 对象*。
		1. 场景【不需要在顶层作用域，】
			1. 在加载新页面时，使用Web分析工具触发新的“页面浏览”事件 [React Router: Declarative Routing for React.js](https://v5.reactrouter.com/web/api/Hooks/uselocation) 
	2. useHistory：用于导航的*history 实例* 
	3. useParams：URL*查询参数*对象
	4. useRouteMatch：路由参数/路径。[React Router: Declarative Routing for React.js](https://v5.reactrouter.com/web/api/Hooks/useroutematch) 结果类型 props.location.match
		1. 目的：访问当前 URL 的**匹配数据**，而不实际渲染 Route 组件。以 Route 组件的匹配方式，匹配当前 URL。
		2. 无参数：返回当前 Route 组件匹配的 match 对象。