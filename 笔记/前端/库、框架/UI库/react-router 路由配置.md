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
	1. location：当前应用的地址
		1. pathname
	2. history：会自动使用浏览器的history对象，实现在历史记录中导航。
		1. go
		2. goBack
		3. goForward
		4. length：历史记录的长度
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
	1. 单个：![[Pasted image 20230529155559.png]] 
	2. 多个
		1. **必须**。![[Pasted image 20230529155825.png]] 
		2. **可选**。接收时未传递则为 undefined ![[Pasted image 20230529160359.png]]
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

