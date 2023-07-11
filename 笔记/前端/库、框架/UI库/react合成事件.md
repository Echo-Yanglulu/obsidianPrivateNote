# 概述
相关：[[DOM事件]] 
问题
1. 为什么需要bind [[this]]。因为默认是undefined
2. event参数
3. 传递自定义参数
本质：是个构造函数，不是原生的事件对象。
特性
	1. 事件*对象*
		1. 是*合成*的，但实现了 DOM 事件的所有能力
				1. 阻止冒泡、阻止默认行为 
				2. 除了event.currentTarget 并不指向绑定元素
		2. *原生*事件对象：event.nativeEvent
			1. event.nativeEvent.target：触发事件的元素
			2. event.nativeEvent.currentTarget[^1]：绑定事件的元素
	2. 事件*绑定* 
		1. react17之前，事件全部绑定**document 元素** 
		2. react 17之后，事件全部绑定在**root 组件** 
			1. document 只有一个，root 组件可有多个。
			2. 有利于多个 react 版本共存，如[[微前端]]。
	3. 与 [[vue]] 事件不同，与 DOM事件也不同
	4. 兼容性
## 目的
为何要开发“合成事件机制”？
1. 更好的兼容性和跨平台
2. 全部挂载到document，减少内存消耗，避免频繁解绑
3. 方便事件的*统一管理*（如[[事务机制]]）
## 机制
### 17之前
![[Pasted image 20230711152133.png]] 
react节点统一绑定在document上，冒泡到该元素之后，
[[document]] 会生成一个统一的react event（即合成事件对象）
触发后，根据event. target找到触发元素，派发事件
### 17 之后
绑定到root组件上
	1. 有利于多个react版本并存，如[[微前端]] 

## 绑定
![[Pasted image 20230708221039.png]]

# 传参
1. 传递事件对象：处理函数**最后添加event**，即可传递合成的事件对象。


[^1]: event.target是触发事件的元素，event.currentTarget是事件绑定的元素