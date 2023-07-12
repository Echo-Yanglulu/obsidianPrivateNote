# 概述
## 实例方法
1.  [[this]].setState(nextState, callback?)
2.  [[this]].forceUpdate(callback?)
3. this. [[context]]。需要先将创建好的context赋值给静态属性 `static contextType` 
## [[静态属性]] 
1. `static propTypes`：配置属性数据类型。[[类组件属性的数据类型.png]] 
2. `static defaultProps` ：配置属性默认值，如果传入是undefined则使用。[[类组件默认属性值.png]] 
3. `static contextType` ：context值配置到实例上。[[类组件中context用法.png]] 
4. `static getDerivedStateFromError(error)`：子组件在渲染期间抛出错误时调用
5. `static getDerivedStateFromProps(props, state)` 
	1. 场景：state始终依赖于props的场景
# 生命周期
旧有生命周期![[Pasted image 20230530125123.png]]

新生命周期![[Pasted image 20230530125007.png]] 

为何要换生命周期函数？
	1. 旧有生命周期函数的部分被滥用
	2. 适配fiber协调中对更新前的处理

## 挂载阶段
1. construstor
	1. 作用
		1. 初始化state
		2. 为事件处理函数绑定实例
	2. 禁止
		1. 调用setState()
		2. 添加副作用/订阅
2. getDefivedStateFromProps
	1. 返回一个新state 或null（代表不更新）
3. render
	1. 渲染UI的纯函数
	2. 此时
		1. 数据存在，视图没有
	3. 为何此时禁止操作DOM。因为DOM还不存在，获取不到？
4. componentDidMount：挂载成功【DOM已存在，且数据已更新到DOM中】
	1. 操作
		1. 请求，修改数据
			1. 触发一个额外渲染
		2. 操作DOM
		3. 计时器、订阅
## 更新阶段
进入条件
	1. props、state、context改变
	2. 调用forceUpdate
内部执行
	1. getDefivedStateFromProps：派生state
	2. shouldComponentUpdate(nextProps, nextState, nextContext)：组件是否进行更新
	3. render：组件渲染模板
	4. getSnapshotBeforeUpdate(prevProps, prevState)：返回一个DOM更新之前的快照
		1. 获取更新前的UI
	5. componentDidUpdate(prevProps, prevState, snapshot)：DOM更新后调用
## 卸载阶段
componentWillUnmount
	1. 清除一些订阅、真实DOM事件、定时器
## 始终存在
componentDidCatch (error, info)
# 父子组件生命周期执行顺序
## 父子组件初始化
父组件 constructor
父组件 getDerivedStateFromProps
父组件 render
子组件 constructor
子组件 getDerivedStateFromProps
子组件 render
子组件 componentDidMount
父组件 componentDidMount

## 子组件修改自身state
子组件 getDerivedStateFromProps
子组件 shouldComponentUpdate
子组件 render
子组件 getSnapShotBeforeUpdate
子组件 componentDidUpdate
## 父组件修改props
父组件 getDerivedStateFromProps
父组件 shouldComponentUpdate
父组件 render
子组件 getDerivedStateFromProps
子组件 shouldComponentUpdate
子组件 render
子组件 getSnapShotBeforeUpdate
父组件 getSnapShotBeforeUpdate
子组件 componentDidUpdate
父组件 componentDidUpdate
## 卸载子组件
父组件 getDerivedStateFromProps
父组件 shouldComponentUpdate
父组件 render
父组件 getSnapShotBeforeUpdate
子组件 componentWillUnmount
父组件 componentDidUpdate
# 错误捕获
## ErrorBoundary 
定义：一个组件，当渲染出错时，不展示崩溃页面，展示该组件。
意义：是页面崩溃后的展示UI。
作用：捕获渲染期间的错误，进行记录日志等，并展示替代UI
[[类组件错误边界.png]] 
# 相关
[详解react生命周期和在父子组件中的执行顺序 - 掘金](https://juejin.cn/post/7138999568166830088#heading-16) 