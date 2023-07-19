# 概述
相关：[[DOM事件]] 
问题
1. 为什么需要bind [[this]]。因为默认是undefined
2. event参数
3. 传递自定义参数
本质：是个构造函数，不是原生的事件对象。

1. 目的：监管内存
	1. 更好的*兼容性*和跨平台
	2. 全部挂载到目标节点，减少内存消耗，避免频繁解绑
	3. 方便事件的*统一管理*（如[[事务机制]]）
2. 组成
	1. 事件对象 
		1. 是*合成*的，但实现了 DOM 事件的所有能力
			1. 阻止冒泡、阻止默认行为 
			2. 除了event.currentTarget 并不指向绑定元素
		2. *原生*事件对象：event.nativeEvent
			1. event.nativeEvent.target：触发事件的元素
			2. event.nativeEvent.currentTarget[^1]：绑定事件的元素
		3. *传递*：处理函数最后添加event，即可传递。
	2. 事件绑定 
		1. react17之前，事件全部绑定**document节点** 
		2. react 17之后，事件全部绑定在**root 组件** 
			1. document 只有一个，root 组件可有多个。
			2. 有利于多个 react 版本共存，如[[微前端]]。
	3. 与 [[vue]] 事件不同，与 [[DOM]]事件也不同
3. 机制
	1. react事件*统一绑定*在目标节点上，冒泡到该元素之后，
	2. 目标节点会*实例化*一个统一的react event（即合成事件对象）
	3. 触发后根据event. target找到触发元素，*派发*事件
	4. 事件处理函数执行完毕后，重置。如果想要异步访问合成事件对象，可使用变量保存。
## 机制
### 17之前
![[Pasted image 20230711152133.png]] 

### 17 之后
绑定到root组件上
	1. 有利于多个react版本并存，如[[微前端]] 

## 绑定
![[Pasted image 20230708221039.png]]




[^1]: event.target是触发事件的元素，event.currentTarget是事件绑定的元素