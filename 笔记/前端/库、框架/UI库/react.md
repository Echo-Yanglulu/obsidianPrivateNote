# 概述
UI框架：搭建数据驱动的web和移动端UI
特性
	1. 专注于[[MVC]] 模型中的view（将数据转化为UI）
	2. 使用单向数据流，是声明性的，基于组件的，
	3. 提供了在JS中书写HTML标记的JSX语法，
# 基础
[[组件]] 
[[JSX]]：创建react组件的方式之一。
[[props]] 
[[state]] 
effect
ref
# 特性
1. fragments：减少嵌套
2. portals
3. StrictMode
# 策略
组合而非继承
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
1. react应用[^1]的创建【脚手架】[^3]
	1. umi
	2. [[create-react-app]] 
2. UI框架[^2]
	1. [[antd]] 
3. 状态管理工具
	1. [[mobx]] 
	2. [[redux]] 
4. [[路由]]管理工具：[[react-router]] 
5. React的补充框架：[[Flux]] 

[^1]: 使用react这个UI框架作为项目UI的生成工具的应用。
[^2]: 快速生成项目所需UI。一般不会让用JSX一点一点地创建组件。
[^3]: 不同脚手架创建出来的react有什么区别？目录结构不同？