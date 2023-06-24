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
==深层传递==数据
	1. 主题
	2. 支付
	3. 用户信息
# 原理
context的传递：在渲染过程中执行
	1. 如果当前class组件没有更新，会导致接收失败[^1] 
		1. shouldComponentUpdate返回false，或pureComponent，或其他自定义优化避免了更新
# 使用
1. 定义
	1. 在需要共享数据的最小公约数父组件
	2. 在一个单独的context.js文件中定义
		1. `import { createContext } from 'react';` 
		2. `export const LevelContext = createContext(1);` 
2. 使用组件
	1. class组件
	2. 函数组件
		1. 使用
			1. 引入定义：`import { LevelContext } from './LevelContext.js';` 
			2. 引入使用api：`import { useContext } from 'react';` 
			3. 取出：`const level = useContext(LevelContext);` 
				1. 不需解构，取出的就是值
		2. 提供
			1. 引入定义：`import { LevelContext } from './LevelContext.js';` 
			2. 提供：`<LevelContext.Provider value={level}>{children}</LevelContext.Provider>`
		3. 要添加contextTypes属性
# 应用
## 业务
在封装组件内使用context提供的值，修改主题
多次复用时，都可收到该值
### 主题
## 技术
### 子组件多次复用，需要同时接收某个值
一个Tab切换组件中的所有Button组件
如果多次嵌套的
# 注意

[^1]: 子组件无法获取最新的context