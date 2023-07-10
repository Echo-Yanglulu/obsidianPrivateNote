# 概述 
组件的上下文
在组件树中==深层传递==数据时避免使用冗长的props
## 16.3之前的context api
不要/不需要使用
	1. 大部分应用
	2. 如果想要应用稳定
	3. 还在学习react
## 新context api
台前工作的context api
# 功能
==深层传递==数据/数据的修改
	1. 数据
		1. 主题
		2. 路由
		3. 用户信息、支付
	2. 修改数据的方法
		1. 通过组件，在项目任意地方修改以上数据
# 原理
context的传递：在渲染过程中执行
	1. 如果当前class组件没有更新，会导致接收失败[^1] 
		1. shouldComponentUpdate返回false，或pureComponent，或其他自定义优化避免了更新
获取
	1. **多次嵌套**：使用某个 context，覆盖：从*最近父级*获取
	2. 如果没有找到provider，则使用*默认值* 
	3. 所有使用该值的组件都将重新渲染
# 使用
1. 定义
	1. 在需要共享数据的最小公约数父组件
	2. 在一个单独的context.js文件中定义
		1. `import { createContext } from 'react';` 
		2. `export const LevelContext = createContext(1);` 
2. 使用组件
	1. class组件
		1. 提供
			1. 引入定义
			2. 绑定 this 属性
				1. `ThemeButton.contextType = ThemeContext` 
				2.  `static contextType = ThemeContext` 
		2. 使用
			1. `const theme = this.context`
	2. 函数组件
		1. 提供
			1. 引入定义：`import { LevelContext } from './LevelContext.js';` 
			2. 提供：`<LevelContext.Provider value={level}>{children}</LevelContext.Provider>` 
		2. 使用
			1. 引入定义：`import { LevelContext } from './LevelContext.js';` 
			2. 使用
				1.  hook
					1. `import { useContext } from 'react';` 
					2. `const level = useContext(LevelContext);` 
						1. 不需解构，取出的就是值
				2.  Consumer
					1. \<LevelContext. Consumer>{value => (\<p></p>)}</LevelContext. Consumer>
# 应用：适应周围环境的组件
## 场景
这些场景，使用 props 太繁琐，使用 [[redux]] 又小题大做（没有那么复杂）
### 主题、语言
在需要根据主题调整外观的组件中使用context
### 路由
大多数路由解决方案在其内部使用 context 来保存当前路由。这就是每个链接“知道”它是否处于活动状态的方式。如果你创建自己的路由库，你可能也会这么做。
### 用户信息
许多组件可能需要知道当前登录的用户信息。
	表单组件内使用context，可在输入时不用输入用户名，地址等信息。

某些应用还允许你同时操作多个账户（例如，以不同用户的身份发表评论）。在这些情况下，将 UI 的一部分包裹到具有不同账户数据的 provider 中会很方便。
### 状态管理
## 技术
### 子组件复用时同时接收某个值【\*】
场景：一个Tab切换组件中的所有Button组件
优化
	1. 如果Provider多次嵌套[^2]且==value存在依赖关系==，在传递value属性时可直接添加，这样每次向下传递都会根据依赖关系计算一次：`<LevelContext.Provider value={level + 1}>` 
# 注意
都是用于在组件间传递数据，与props的不同
	1. 跨层级
		1. 状态下传。
		2. 状态提升：把provider放最外层，将数据、修改数据的方法通过provider下传，于是可在任意地方使用修改数据的组件[^3] 
	2. 使用时机：组件定义时
		2. 组件多次复用时，希望同时传递数据。不必像props对每个调用都添加一个props
		3. 更新时对应组件会批量更新
	3. 嵌套覆盖

[^1]: 子组件无法获取最新的context
[^2]: 使用该provider的组件多次嵌套
[^3]: 通过定义组件，可在全局任意地方修改主题、用户登录信息、路由