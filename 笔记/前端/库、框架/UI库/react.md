# 概述
UI框架：搭建数据驱动的web和移动端UI
特性
	1. 专注于[[MVC]] 模型中的view（将数据转化为UI）
	2. 使用单向数据流，是声明性的，基于组件的，
	3. 提供了在JS中书写HTML标记的JSX语法，
# 策略
组合而非继承
# 基础
[[React元素]] 
[[组件]] 
	[[JSX]] 
[[context]] 
ref
## 条件渲染
二元与、或
三元
## 列表渲染
方式
	1. 组件为元素的数组。
		1. map方法：每个元素需要key
## 事件
相关：[[浏览器事件]] 
1. 为什么需要bind [[this]]。因为默认是undefined
2. event参数
3. 传递自定义参数
本质：是个构造函数，不是原生的事件对象。
特性
	1. **event.nativeEvent**：访问原生事件对象
		1. event.nativeEvent.target：绑定在原生的DOM元素上
		2. event.nativeEvent.currentTarget
			1. react17之前是绑定在document元素上
	2. event.currentTarget并不指向绑定元素

# API
## 基本特性
1. dangerouslySetInnerHTML属性：渲染传入的HTML字符串
	1. 否则会被作为字符串渲染。<等被用于渲染，而不是解析为标签。
2. fragments：减少嵌套。或返回语义化列表时使用组件作为元素的数组。
3. [[ReactDOM#^73f348|protal]]：移动组件在DOM结构中的位置
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