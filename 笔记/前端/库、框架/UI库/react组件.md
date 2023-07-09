# 创建
1. [[数据类型]]
	1. [[class组件]] 
	2. [[函数组件]] 
2. 创建方式
	1. [[JSX]] 
	2. React.createElement()
# 原理
## 组件批处理
# 属性
透传props：<div {...props} ><\/div>
# 样式
由于react中[[JSX]]的写法，给组件添加样式的方法有很多
	1. 行内
	2. 声明式：把行内样式写成变量，通过style添加
	3. [[CSS模块化]]  
# 返回
1. react元素
2. 数组/fragments：多个元素
3. portals：渲染子节点到不同DOM子树中
4. String/Number：在DOM中被渲染为文本节点
5. Boolean/null：不渲染。
# 通用概念
1. 更新时会导致组件更新
	1. state【数据】
	2. props【传递数据的通道】
	3. [[context]] 【传递数据的通道】
2. 不会更新组件
	1. ref【引用子元素】
		1. 函数：useRef
		2. 类、原生DOM：react.createRef
3. 组件
	1. 受控组件[^1]：由开发者通过绑定onchange事件，手动地管理*表单值的改变*，*表单值的获取*读取对应state即可
	2. 非受控组件：由react管理元素的输入值的改变。不需要定义回调，但表单值的获取需要通过ref属性
## 比较
props与context
	1. 相同
		1. 功能：都是一种传递数据的通道
	2. 不同
		1. 功能的范围：是否能跨层级
# 功能
## 创建节点
createRoot 
	1. react-dom/client提供
## 回调UI
Suspense
## 开发时发现组件错误
由react提供
特点
	1. *开发环境*有特殊行为
		1. 组件*重新渲染*一次，查找渲染之外的原因导致的错误
		2. 组件*重新运行effect*一次，查找缺少effect清理导致的错误
		3. 组件是否使用了*废弃API* 
## 分析组件树性能
```js
<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>
function onRender(id, phase, actualDuration, baseDuration, startTime, commitTime) {
  // Aggregate or log render timings...
}
id: 如果使用了多个分析器，可用于确定分析的是哪个
```
## DOM结构移动
createPortal(children, domNode, key?)
	1. children：React 可以渲染的任何内容、这些内容构成的数组
	2. domNode：某个 DOM 节点，例如由 document.getElementById() 返回的节点。节点必须已经存在。
	3. 返回一个 React 节点，该节点可以包含在 JSX 中或从 React 组件中返回

功能：在DOM结构中，将组件内的模态对话框和提示框等全局展示的组件展示在DOM的外层
特点
	1. 由[[ReactDOM]]提供
	2. 事件传播遵循 React 树而不是 DOM 树。虽然在DOM树中元素被移动了，但事件触发是以定义时的嵌套结构进行的。
## 减少嵌套层级
\<Fragment> 
不可简写
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
## 父组件获取子组件
相关API
	函数组件：forwardRef
	类组件：createRef、findDOMNode[^2]
功能：将子组件暴露父组件
结构
	1. 参数
		1. props：父组件传递过来的参数。
		2. ref：父组件传递的 ref 属性。组件调用时没有传递ref则传入null
	2. 返回值：一个可以在 JSX 中渲染的、**可以接收ref属性**的[[函数组件]] 
使用：`const MyInput = forwardRef(function MyInput(props, ref) {return ()});` 
	1. 包裹函数组件后，组件被调用时会同时传入两个参数
	2. ref转发【DOM节点】给或[[函数组件#useImperativeHandle|useImperativeHandle]] 【DOM节点的**部分**数据】
		1. 获得深层元素，需要多次通过forwardRef下传。
应用：子元素
	1. 整个子元素：滚动到节点、将焦点放在节点上、触发动画
	2. 使用子元素的部分数据
## 强制react同步更新
flushSync(callback)
特性
	1. 由[[ReactDOM]]提供
	2. 严重破坏性能，如果可以，尽量避免使用
## 懒加载
React.lazy引入组件。在需要展示时时候再导入。但此时可能没有组件展示，需要结合Suspense展示fallback组件
# 组件通讯
根据传递方向，可分为3个
1. 父向子
	1. 单层：props
	2. 多层：context
2. 子向父
	1. 手动：父向子通过props下传setState
	2. 自动：
		1. 传递数据：[[函数组件#useImperativeHandle|useImperativeHandle]] 
		2. 传递元素：ref
3. 兄弟组件
	1. 父向子通过props，state传递一个，setState传递另一个
# 逻辑复用
在没有 hook之前，开发逻辑组件通常是使用class组件，但两种常用方式都存在问题。

## 函数组件
```js
import React, { useState } from "react";

export function HooksAvatar() {
  const [name, setName] = useState("云课堂");
  return <>{name}</>;
}
```
有啥区别？不还是套了一层？

[^1]: 受开发者控制的组件
[^2]: 类组件中使用它获取元素，然后focus，但后续维护不方便，比如想给需要find的元素添加一层div，就无法找到了。所以使用函数组件是优先的选择。

## class组件
### HOC
封装了逻辑，
	1. 定义：接收组件，逻辑处理，返回组件
	2. 复用：调用时传入UI组件
问题
	1. 增加嵌套层级
```js
import React, { Component } from "react";

class Avatar extends Component {
  render() {
    return <div>{this.props.name}</div>;
  }
}

// 这是增加了一个层级吗
function HocAvatar(Component) {
  return () => <Component name="云课堂" />;
}
export default HocAvatar(Avatar);
```

### renderProps
class组件内只封装了逻辑部分
	1. 定义：内部接收并调用一个返回UI的函数，将内部逻辑添加到传入的UI上。
	2. 复用：调用时（通过属性或内容）传入UI（一个返回UI的函数）。
问题
	1. 如果嵌套内容复杂，就会使结构看起来很复杂。
	2. props难以梳理
```js
export default function App(){
	return (
		<div className="app">
			<Avatar name="study">
				{name => <User name={name} />}
			</Avatar>
		</div>
	)
}
```

# [[函数组件]]与类组件对比

| 分类 | 功能 | 体积 | 优点 | 副作用的组织/分类维度 |
| --- | --- | --- | --- | --- |
| 类 | 状态管理、生命周期（中引入[[副作用]]） |  |  | 生命周期 |
| 函数 | 状态管理、副作用 | 轻量 | 方便逻辑复用 | 副作用本身 |
函数组件增加了Hooks之后，可在内部拥有自己的状态、可相较于类组件更好地实现逻辑复用
1. class组件存在的问题
	1. *代码组织*方式
		1. 分为渲染和卸载两个阶段。组件按生命周期，挂载与更新阶段代码重复。而useEffect可实现三个时机。
		2. 避免了忘记更新订阅带来的bug
		3. state读写方式、避免非必要render的方式更简洁
			1. 不用解构读取，不用this.setState修改
		4. 事件处理函数不用绑定实例
	2. *逻辑复用*困难【展示组件容易复用，但逻辑组件如何复用？】
		1. [[HOC]]增加嵌套。render-props难以清晰梳理props、增加嵌套。
			1. 复用时需要重写组件结构、他人难以理解。
			2. 使用devtools时嵌套层级深
	3. *热重载*不稳定
	4. 构建时class组件不能被很好地*压缩* 
	5. [[this]]较为复杂

