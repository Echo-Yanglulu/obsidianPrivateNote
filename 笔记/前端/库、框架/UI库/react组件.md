# 概述
定义：返回需要渲染在页面中的 react 元素。
# 创建
## [[class组件]] 
## [[函数组件]] 
# 原理
关注重点，而不是细节
*使用相关*的原理，如 v-dom, jsx, setState
## 组件批处理
# 属性
透传 props： `<div {...props}></div>` 
# 样式
由于react中[[JSX]]的写法，给组件添加样式的方法有很多
	1. 行内
	2. 声明式：把行内样式写成变量，通过style添加
	3. [[CSS模块化]]  
# 返回
1. react元素
2. portals：渲染子节点到不同 DOM 子树中
3. 数组或fragments：多个元素
4. String 或 Number：在 DOM 中被渲染为文本节点
5. Boolean 或 null：不渲染。
# 通用概念
1. 更新时会导致组件更新
	1. state【数据】
	2. props【传递数据的通道】
	3. [[context]] 【传递数据的通道】
2. 不会更新组件
	1. ref【引用子元素】
		1. 函数：useRef
		2. 类、原生DOM：react.createRef
## 比较
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
	1. 父向子通过 props，state 传递一个，setState 传递另一个
4. 自定义事件
	1. 使用三方库： `events` 
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
  // 或者
  return <Component {...this.props} />
}
export default HocAvatar(Avatar);
```
案例
```js
// 获取鼠标位置
import React from 'react';
const withMouse = (Component) => {
  class HOCMP extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        x: 0,
        y: 0,
      }
    }

    handleMouse = (event) => {
      this.setState({
        x: event.clientX,
        y: event.clientY
      })
    }

    render() {
      return (
        <div onMouseMove={this.handleMouse}>
          <Component {...this.props} mouse={this.state} />
        </div>
      )
    }
  }
  return HOCMP;
};

const App = (props) => {
  const {x, y} = props.mouse
  return <div>
    positions is {x}, {y}
  </div>
}

export default withMouse(APP)
```

### renderProps
class组件内只封装了逻辑部分
	1. 定义：内部接收并调用一个返回UI的函数，将内部逻辑添加到传入的UI上。
	2. 复用：调用时（通过属性或 children）传入一个返回 UI 的函数。
问题
	1. 如果嵌套内容复杂，就会使结构看起来很复杂。
	2. props难以梳理
```js
export default function App(){
	return (
		<div className="app">
		// 在Avatar中处理逻辑与状态，调用接收的函数并传入状态
			<Avatar name="study">
				{name => <User name={name} />}
			</Avatar>
		</div>
	)
}
```

# [[函数组件]]与[[class组件]]对比
函数组件增加了Hooks之后，可在内部拥有自己的状态、可相较于类组件更好地实现逻辑复用
1. 区别
	1. 编程模式
		1. 类组件是基于面向对象编程。本质是类。有 this **实例、生命周期**。
		2. 函数组件是[[函数式编程]]，本质是纯函数。输入 props，输出 JSX ，没有实例、生命周期。核心是不可变值、副作用。
	2. 状态同步
		1. 类组件：生命周期中执行某个函数时，拿到的 state 是最新值
		2. 函数组件的捕获。函数组件中使用闭包，执行某个函数时，拿到的 state 是某次渲染的捕获值。
	3. 逻辑复用
		1. 一个使用 HOC 或 renderProps（mixins 早已废弃），一个使用 hook
2. class组件存在的问题
	1. *逻辑分散* 
		1. 以生命周期为核心组织代码，类似的逻辑需要分散在三个生命周期中。
			1. 忘记更新订阅带来的 bug
		2. state读写方式、避免非必要render的方式更简洁
			1. 不用解构读取，不用this.setState修改
		3. 事件处理函数不用绑定实例
	2. *逻辑复用*【展示组件容易复用，但逻辑组件如何复用？】
		1. [[HOC]]增加嵌套。render-props<u>难以清晰梳理props</u>、增加<u>嵌套</u>。
			1. 复用时需要重写组件结构、他人难以理解。
			2. 使用devtools时嵌套层级深
	3. *热重载*不稳定
	4. [[构建]]时不能被很好地*压缩* 
	5. [[this]]较为复杂