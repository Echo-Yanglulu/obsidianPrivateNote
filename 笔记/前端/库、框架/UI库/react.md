# 概述
UI框架：搭建数据驱动的web和移动端UI
特性
	1. 专注于[[MVC]] 模型中的view（将数据转化为UI）
	2. 使用单向数据流，是声明性的，基于组件的，
	3. 提供了在JS中书写HTML标记的JSX语法，
# 策略
组合而非继承
状态提升
# 基础
[[React元素]] 

ref
## [[组件]] 
1. 受控组件：由开发者通过绑定 onchange 事件，手动地管理*表单值的改变*，*表单值的获取*读取对应 state 即可
	1. 使用value属性：input, textarea, select
	2. 使用checked属性：checkbox, radio
2. 非受控组件: 由 react 管理元素的输入值的改变。不需要定义回调，但表单值的获取需要通过 ref 属性
	1. ref
	2. defaultValue/ defaultCechked
	3. 手动操作 DOM
3. 使用
		1. 优先使用受控组件，符合 [[react]] 设计原则
		2. 必须操作 DOM 时，再使用非受控
			1. 文件上传
			2. 富文本编辑器
			3. 手动操作 [[DOM]] 
[[JSX]] 

## 属性
### 调整
className代替class
htmlFor代替label标签的for属性
事件名：驼峰
### 类型检查
prop-types库
```js
import PropTypes from 'prop-types'
List.propTypes = {
	list: PropTypes.arrayOf(PropTypes.object).isRequiesd
}
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

## [[合成事件]] 

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
	2. [[函数组件]] 使用监听
# API
## 基本特性
1. dangerouslySetInnerHTML属性：渲染传入的HTML字符串
	1. 否则会被作为字符串渲染。<等被用于渲染，而不是解析为标签。
2. fragments：减少嵌套。或返回语义化列表时使用组件作为元素的数组。
4. StrictMode：提示有潜在问题的组件【建议在老项目中使用，有助于形成规范】
	1. 功能
		1. 检测是否存在*即将废弃*的生命周期函数；
		2. 检测是否使用*string ref*和findDOMNode、老版context api；
		3. 检测是否*多次调用不可预测的副作用*。
	2. 特点
		1. 会让render多运行一次。【实际开发中不用奇怪】
5. [[concurrent mode]]【同时，并行】：让react应用更好地*响应交互*、根据用户的*硬件设备*与*网络性能*进行部分调节。
	1. 可中断渲染。该模式下，渲染更新是可以被中断的[^4]。（这里说的是否就是commit阶段？）中断特别耗时的渲染过程来响应用户行为，提升体验。
		1. 如在一个页面上同时存在复杂动画和输入框。该模式会优先响应用户的输入，
	2. 使用
## 高级特性
1. 非受控组件
	1. 场景：文件上传，富文本编辑器，必须手动操作 [[DOM]] 
2. 异步组件
	1. const ContextDemo = React. lazy (()=>import ('./ContextDemo')))
	2. Suspense
3. [[ReactDOM#^73f348|portal]]：移动组件在 DOM 结构中的位置
	1. 事件流的机制不会改变
	2. 场景：兼容性、父组件是 [[BFC]] 、父组件的 z-index
4. [[context]] 
5. [[性能优化]] 
	1. SCU
	2. React. memo, PureComponent
	3. immutable. js：拥抱不可变值
6. 逻辑复用：高阶组件、HOC
## 总结
Fiber让应用更好地更新，concurrentMode让应用在体验上更好
# 原理
[[react原理]] 
# 实战
[[react实战]] 
# 异常捕获
通常使用try/catch在*可能出错*的地方。或使用window.onerror绑定。
但react本身的[[react原理#Fiber协调|fiber协调]]带来了一个异常捕获的优化【组件错误、全局异常】
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
6. React的补充框架：[[Flux]] 

[^1]: 使用react这个UI框架作为项目UI的生成工具的应用。
[^2]: 快速生成项目所需UI。一般不会让用JSX一点一点地创建组件。
[^3]: 不同脚手架创建出来的react有什么区别？目录结构不同？
[^4]: fiber协调下，render阶段可中断，但commit阶段不可中断。
[^5]: 在this.setState之后，能否直接获取到state的值？