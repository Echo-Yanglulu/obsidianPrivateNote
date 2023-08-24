# 概述
UI框架：搭建数据驱动的web和移动端UI
特性
	1. 专注于 view 视图层（将数据转化为 UI）
	2. 使用单向数据流，是*声明性*的，基于组件的，
	3. 提供了在JS中书写HTML标记的JSX语法，
# 原则
## 保持组件的纯净
[Keeping Components Pure – React](https://react.dev/learn/keeping-components-pure#) 
1. 相同返回值。react 是围绕[[纯函数]]这个概念设计的。它假设你创建的每个组件都是纯函数，即 react 组件在相同输入时必须返回相同的 [[JSX]]。
2. [[副作用]]
	1. 虽然[[函数式编程]]很大程度依赖于*函数的纯粹性*：[[纯函数]]，但有时也必须改变一些事物，这些更改称为[[副作用]]。
		1. 将外部变量通过 Props 传递【相同输入】，而不是去创造副作用，产生**突变**【组件在渲染时修改了*预先创建*的变量】。[[Pasted image 20230811151830.png]]。组件在渲染时修改*渲染时创建*的变量则是完全可以的。
	2. 在 react 中<u>副作用通常属于</u>事件处理程序
3. 尽可能只通过渲染来表达页面，这能让项目走得很远
## 状态
react 中，**特定于组件内的内存**称为状态。
	1. 当前输入值，购物车，当前图像。
	2. 特性
		1. 与其说是变量，不如说是一次渲染中的“*快照*”。
			1. 只读的
				1. 应通过替换而不是 Mutation，来触发重渲染。
			2. 是可交互的快照。
			3. 对应整个组件（JSX）及其内部的事件处理函数、props、内部变量都是快照。
			4. 一个 state 变量的值永远不会在一次渲染的内部发生变化，
				1. state 的值始终”固定“在一次渲染的各个事件处理函数内部。即使其事件处理函数的代码是异步的。[[Pasted image 20230811161809.png]] 
		2. *批处理*：更新逻辑
			1. 如何在重新渲染之前读取最新的 state ？
			2. 如何在下次渲染前多次更新同一个 state？ `setNumber(n => n + 1)` 
				1. 原理：
					1. React 会将此函数*加入队列*，以便在事件处理函数中的所有其他代码运行后进行处理
					2. 下次渲染期间调用 useState 时，React 会*遍历队列*并给你更新之后的最终 state。
					3. React 会将最终结果*从 useState 中返回*。
			3. 所有更新 state 的操作会被添加到队列中。不论传递的是函数还是其他值。
				1. 如果传递的是函数，则会把*队列中上次计算的返回值*传入。
				2. 更新函数必须是 纯函数 并且只 返回 结果

mutation：改变对象中的内容
如果 state *存在多层嵌套*，可通过 [[use-immer]] 库，使用声明式的语法修改 state

更新 state
	1. 数组：
		1. 添加元素： `concat` ， `[...arr] ` 
		2. 删除元素：filter，slice
		3. 替换元素：map
		4. 排序：先复制一份
### 结构设计
1. 合并关联
2. 避免深度嵌套
3. 避免冗余：可通过其他 state 计算得出
4. 避免耦合
	1. 一个引用类型同时在多个 state 中出现。
5. 避免矛盾
	1. “正在发送”与“已发送”声明两个 state？每次都要修改两个。使用一个 state 表示发送状态即可。
## 渲染与提交
组件显示在屏幕上之前，它们必须由 React 渲染。
请求与提供 UI 分为三步
	1. 触发渲染
		1. 初始化
		2. 状态更新
	2. 渲染组件
		1. *调用组件*，计算出需要展示在屏幕上的内容。
			1. 这个过程是递归的。如果调用的组件返回其他组件，则会渲染/调用该组件。直到不再有嵌套组件，并 react 确切知道屏幕上应该展示什么。
		2. 计算与上次渲染相比，哪些属性发生了改变。
	3. 将改变提交到 [[DOM]] 
		1. 
## 声明式 UI 与命令式 UI
[[命令式编程]]：告诉计算机/[[浏览器]]如何去更新 UI 的编程方式
	1. 需要操作原生 [[DOM]]。
[[声明式编程]]：你只需要声明你想要显示的内容， React 就会通过计算得出该如何去更新 UI
# 策略
不可变值
组合而非继承
状态提升
[[React-SSR]] 
# 基础
[[React元素]] 
[[JSX]] 
## [[组件]] 
1. 受控组件：由开发者通过state和 onchange 事件，手动地管理*表单值*的获取与更新
	1. 使用value属性：input, textarea, select
	2. 使用checked属性：checkbox, radio
2. 非受控组件: 由 react 管理元素的输入值的改变。不需要定义回调，但表单值的获取需要通过 ref 属性
	1. ref
	2. defaultValue/ defaultCechked
	3. 手动操作 DOM
3. ref 使用场景
		1. *优先使用受控组件*，符合 [[react]] 设计原则
		2. 必须操作 DOM 时，再使用非受控
			1. 文件上传
			2. 富文本编辑器
			3. 手动操作 [[DOM]] 
### 通讯
1. 普通
	1. props
2. 非嵌套关系
	1. [[context]] 
	2. [[redux]] 
	3. 事件中心
		1. 自定义事件
		2. 三方库： `events` , `event-emitter`
## 属性
### 调整
className代替class
htmlFor代替label标签的for属性
事件名：驼峰
### 默认值
```js
Greeting.defaultProps = {
  name: 'Stranger'
};
```
### 类型检查
prop-types库
```js
import PropTypes from 'prop-types'
List.propTypes = {
	// 必填：后缀
	optionalProps: PropTypes.number.isRequired,
	// 单类型
	optionalProps: PropTypes.bool,
	optionalProps: PropTypes.number,
	optionalProps: PropTypes.string,
	optionalProps: PropTypes.symbol,
	optionalProps: PropTypes.object,
	optionalProps: PropTypes.array,
	optionalProps: PropTypes.func, // typeof返回8种，这里只需7种
	optionalProps: PropTypes.node, // 可被渲染的节点。包括数字，字符串，react 元素，数组，fragment
	optionalProps: PropTypes.element, // （只允许）一个react 元素
	optionalProps: PropTypes.objectOf(PropTypes.number), // 属性为某个类型的对象
	optionalProps: PropTypes.arrayOf(PropTypes.number), // 元素为某个类型的数组
	optionalProps: PropTypes.instanceOf(Message), // 某个类的实例
	optionalProps: PropTypes.exact({ // 精确属性
	  optionalProperty: PropTypes.string,
	  requiredProperty: PropTypes.number.isRequired
	}),
	// 多值选一
	optionalProps: PropTypes.oneOf(['News', 'Photos']),
	// 多类型选一
	optionalProps: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
		PropTypes.instanceOf(Message)
	]),
	// 自定义验证器
	customProp: function(props, propName, componentName) {
	  if (!/matchme/.test(props[propName])) {
	    return new Error(
	      'Invalid prop `' + propName + '` supplied to' +
	      ' `' + componentName + '`. Validation failed.'
	    );
	  }
	},
	//你也可以提供一个自定义的验证器 arrayOf和objectOf。如果验证失败，它应该返回一个Error对象。
	//验证器用来验证数组或对象的每个值。验证器的前两个参数是数组或对象本身，还有对应的key。
	customArrayProp: PropTypes.arrayOf(function(propValue, key, componentName, location, propFullName) {
	  if (!/matchme/.test(propValue[key])) {
		return new Error(
		  'Invalid prop `' + propFullName + '` supplied to' +
		  ' `' + componentName + '`. Validation failed.'
		);
	  }
	}),
```

## state
特性
	1. react17
		1. **state是不可变值** 
			1. 修改state时。
				1. 如果是原始类型，即使先修改，再setState可以生效，也有性能问题。
				2. 如果是引用类型， 不可修改原值或内部属性/元素。而是**创建一个新值**再赋值。
		2. **多次调用合并（批处理）**：只有传入函数时不会合并调用
			1. 合并。每次都传入对象时，类似Object.assign。
			2. 不合并。多次传递函数时，可获取上次函数修改的结果
		3. **state修改逻辑**[^5]：只在两种情况下是同步修改
			1. 异步更新。在setState后读取state，是原值
				1. 可通过this.setState({},fn)的第二个参数拿到最新
			2. 同步更新。在定时器、[[DOM事件]]中，是同步的【别忘了取消DOM事件的订阅】
	2. react18
		1. 自动批处理
			1. 在组件事件中，默认异步更新、合并调用
			2. 在DOM事件、定时器中，也是异步更新、合并调用
## [[react合成事件]] 
因为使用了[[严格模式]]，react中的[[this]]默认是undefined，而不是组件实例。
## 条件渲染
二元与、或
三元
## 列表渲染
方式
	1. 组件为元素的数组。
		1. map方法：每个元素需要key
## 表单

## [[class组件#生命周期|生命周期]]  
## 机制
1. 父组件更新，子组件默认也更新
	1. class 组件可使用 scu 或 pu。
	2. [[函数组件]] 使用监听，可使用 React.memo【对 props 进行浅层比较，阻止渲染】
# API
## 基本特性
### 父组件获取子组件
功能
	1. 将子组件暴露给父组件
		1. 整个子元素：滚动到视口、将焦点放在表单、触发动画、文本选择、媒体控制、集成第三方 DOM 库
		2. 子元素的部分数据
	2. 访问在 render 中创建的 react 元素
相关 API
	1. 函数组件：React.forwardRef
		1. 背景：函数组件没有实例，无法接收 ref，通过该 API 可将函数组件接收到的 ref 转发给内部的 DOM 元素
		2. 参数
			1. props：父组件传递过来的参数。
			2. ref：父组件传递的 ref 属性。组件调用时没有传递 ref 则传入 null
		3. 返回值：一个可以在 JSX 中渲染的、**可以接收 ref 属性**的[[函数组件]] 
		4. 使用： `const MyInput = forwardRef(function MyInput(props, ref) {return ()});` 
			1. 包裹函数组件后，组件被调用时会同时传入两个参数
			2. ref 转发【DOM 节点】给或[[函数组件#useImperativeHandle|useImperativeHandle]] 【DOM 节点的**部分**数据】
				1. 获得深层元素，需要多次通过 forwardRef 下传。
	1. 类组件：createRef、findDOMNode（已废弃）[^2] 

2. dangerouslySetInnerHTML属性：渲染传入的HTML字符串
	1. 否则会被作为字符串渲染。<等被用于渲染，而不是解析为标签。
3. fragments：减少嵌套。或返回语义化列表时使用组件作为元素的数组。
4. StrictMode：提示有潜在问题的组件【建议在老项目中使用，有助于形成规范】
	1. 功能：检测
		1. 是否使用过时的 `string ref` 、 `context api` 、*不安全的生命周期*函数和废弃的 `findDOMNode` ；
		2. 是否存在*不可预测的副作用*。运行两次组件渲染，确定多次执行的返回相同，即可确定是纯函数（暂时只考虑相同输入有相同输出，而不考虑纯函数的另外一个条件：副作用）。
	2. 特点
		1. 会让 render 多运行一次。【生产环境不会】
5. [[concurrent mode]]【同时，并行】：让react应用更好地*响应交互*、根据用户的*硬件设备*与*网络性能*进行部分调节。
	1. 可中断渲染。该模式下，渲染更新是可以被中断的[^4]。（这里说的是否就是commit阶段？）中断特别耗时的渲染过程来响应用户行为，提升体验。
		1. 如在一个页面上同时存在复杂动画和输入框。该模式会优先响应用户的输入
## 高级特性
### 创建节点
createRoot 
	1. react-dom/client 提供
### 非受控组件
1. 场景：文件上传，富文本编辑器，必须手动操作 [[DOM]] 
### 异步组件
1. const ContextDemo = React. lazy (()=>import ('./ContextDemo')))
2. Suspense
### 减少嵌套层级
`<Fragment>` 
列表渲染时不可简写
```js
function Blog() {
  return posts.map(post =>
    <Fragment key={post.id}>
      <PostTitle title={post.title} />
      <PostBody body={post.body} />
    </Fragment>
  );
}
```
### 懒加载
React.lazy 引入组件。在需要展示时时候再导入。但此时可能没有组件展示，需要结合 Suspense 展示 fallback 组件
### 移动组件的DOM 结构
功能：在 DOM 结构中，将组件内的模态对话框和提示框等*全局展示的组件*展示在 DOM 的外层
API：createPortal(children, domNode, key?)
	1. children：需要转移的元素。React 可以渲染的任何内容、这些内容构成的数组
	2. domNode：目标容器元素。一个 DOM 节点，例如由 document.getElementById() 返回的节点。节点必须已经存在。
	3. 返回：一个 React 节点，该节点可以包含在 JSX 中或从 React 组件中返回
特点
	1. 由[[ReactDOM]]提供
	2. 组件的事件流不会改变。事件传播遵循 React 树而不是 DOM 树。虽然在 DOM 树中元素被移动了，但事件触发是以定义时的嵌套结构进行的。
	3. 场景：兼容性、父组件是 [[BFC]] 、父组件的 z-index
	4. 适用：对话框、全局的消息提示等全局展示的组件。
### [[context]] 
### [[性能优化]] 
1. SCU
2. PureComponent
3. React.memo(Component, (prevProps, nextProps) => {  自定义的对比逻辑 // return true 则不重新渲染  // return false 重新渲染 }), 
	1. 两种组件皆可用
4. immutable. js：拥抱不可变值
5. useMemo, useCallback
### 逻辑复用
高阶组件、HOC、hooks，见[[react组件#逻辑复用|逻辑复用]] 
### 强制 react 同步更新
flushSync(callback)
特性
	1. 由[[ReactDOM]]提供
	2. 严重破坏性能，如果可以，尽量避免使用
### [[异常捕获]]/[[错误处理]] 
通常使用try/catch在*可能出错*的地方。或使用window.onerror绑定
react 本身的[[react原理#react中的Fiber协调【染新，乌鸡布局】|fiber协调]]带来了一个异常捕获的优化【组件错误、全局异常】
![[Pasted image 20230530144452.png]] 
```js
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    logErrorToMyService(error, info);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

<ErrorBoundary>
  <MyWidget />
</ErrorBoundary>
```

### 分析组件树性能
```js
<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>
function onRender(id, phase, actualDuration, baseDuration, startTime, commitTime) {
  // Aggregate or log render timings...
}
id: 如果使用了多个分析器，可用于确定分析的是哪个
```
## 总结
Fiber让应用更好地更新，concurrentMode让应用在体验上更好
# 原理
[[react原理]] 
# 实战
[[react实战]] 
# [[React性能优化]] 
# 相关
1. react应用[^1] 
	1. 创建【脚手架】[^3]
		1. umi
		2. [[create-react-app]] 
	2. 构建
2. DOM管理
	1. [[ReactDOM]] 
3. UI框架[^2] 
	1. [[antd]] 
4. 状态管理工具
	1. [[mobx]]：响应式状态管理工具
	2. [[redux]]：
	3. [[状态管理工具比较|比较]] 
		1. 如何知道状态改变
			1. redux通过对比。mobx可观察
		2. 流程
			1. 
5. [[路由]]管理工具：[[react-router]] 
6. React 的补充框架：[[Flux]] 
7. 对比
	1. [[React与Vue的比较]] 

[^1]: 使用react这个UI框架作为项目UI的生成工具的应用。
[^2]: 快速生成项目所需UI。一般不会让用JSX一点一点地创建组件。
[^3]: 不同脚手架创建出来的react有什么区别？目录结构不同？
[^4]: fiber协调下，render阶段可中断，但commit阶段不可中断。
[^5]: 在 this.setState 之后，能否直接获取到 state 的值？
[^6]: 是在组件内部定义的，即：渲染期间也不会运行。所以事件处理程序不需要是纯函数