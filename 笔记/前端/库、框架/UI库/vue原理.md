# 组件的渲染与更新
![[Pasted image 20230711180808.png]] 
理解vue渲染原理的三个关键
	1. 响应式的监听：紫色
	2. 模板编译：黄色部分，将模板变为render函数
	3. 虚拟DOM：如何渲染到页面上，如何更新

渲染过程中，同时touch data，触发Data中的getter，收集为watcher的依赖

更新过程中，修改data会触发setter，setter会notify watcher。如果watcher有处理，再进行re-render