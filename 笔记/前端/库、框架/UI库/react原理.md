# 源码解析
## react源码的组织方式
1. 动态注入。在源码中，react只是进行*声明*，具体*实现*是在react-dom中实现的[^1]。
	1. 为何使用这种方式？为了要抽取公共部分，可认为react-dom是一个render器，native是另一个
2. 嵌套循环。react-dom在渲染html节点时采用这种方式。
	1. 为何使用这种方式？因为html的dom结构本身就是一种嵌套。

看 vscode
# [[函数式编程]] 

# [[JSX]] 本质
本质就是它编译为什么
是react.createElement函数调用的语法糖。

# virtual dom 与 diff
## dom更新过程【整体流程】
1. 调用dom api更新
2. 通过v-dom更新
	1. 产生：一个返回vnode数据结构的*h函数* ，在render阶段调用
	2. 对比：用于对比vnode的*diff算法* ，确定变更
	3. 应用：使用库（如RactDOM）将diff结果更新到DOM中的*patch函数* ，
##  v-dom
1. 定义
	1. 官方：一个编程理念，被保存在内存中的*对UI的映射*，并通过某些库（如[[ReactDOM]]）将该映射同步渲染为真实DOM。
2. 特性
	1. 抽象性【它对UI的抽象。使跨平台使用成为可能，一处学习，随处使用】
		1. V-dom提供了对HTML DOM的抽象，所以在web开发中通常不用调用[[DOM]] api
		2. 也是因为它提供了DOM的抽象，也可用于开发Native
3. 实现：vue 2, vue 3与 react 实现 vdom 的细节都不同，但*核心概念*与*实现思路*相同
	1. react
		1. 15 之前v-dom是一种树结构 
		2. 15 之后会添加一次**转换**，将vdom转换为Fiber：一种单向的链表结构 ![[Pasted image 20230714122310.png]] 
			1. 任何一个位置的 Fiber 节点，都可以非常容易知道它的父 Fiber, 第一个子元素的 Fiber及其它的兄弟节点 Fiber。却不容易知道它前一个 Fiber 节点是谁
			2. 基于这种结构，更新过程变得可中断。即使中断了，在恢复的时候也可快速知道当前的父节点和第一个子节点。
### react中的v-dom
增加一步：将生成的vdom转换成Fiber，一种链表结构。
##  diff【喝过吃】
1. 核心：只比较同级，不跨级比较
	1. 如果tag不同则直接删除重建，不再深度比较
	2. tag 和 key 相同，认为是相同节点，不再深度比较
2. 层次
	1. 组件级别比较
		1. 不检查子组件。一个组件改变，子组件大概率更新，所以默认不进行子组件的比较，整个替换
	2. 元素级别比较
		1. 子节点*增删*：react-dom对元素进行简单的增删
		2. 子节点*移动*：react-dom会进行比较复杂的diff。
			1. 比如。如果开发者把最后一个子节点移动到第一个，react-dom会将前面的节点依次向后移动（如果代码中有这种操作，源码的实现是比较低效的）【日常开发中要避免这种操作】
### React的diff算法
[为什么 React 的 Diff 算法不采用 Vue 的双端对比算法？ - 掘金](https://juejin.cn/post/7116141318853623839?searchId=202307141158349CED69EF08AAC21580CD#heading-4) 
机制：**深度优先**，有子节点，就遍历子节点，然后是 兄弟节点 || 上级节点的同级节点 || 就继续往上找。如果一直没找到，就代表所有的更新任务都更新完毕了。
#### stack的diff
核心：递归遍历对比新旧vdom，将变化渲染到DOM
#### fiber的diff
核心：所以diff时需要**两次遍历** 
diff过程：遍历新vdom
	1. 如果当前节点与旧fiber对应位置的节点*相同*，则打上“更新”标记。继续遍历
	2. 如果不能复用。*暂停*遍历。
		1. 把旧fiber中*剩余节点放入* [[Map]] 中，
		2. 恢复遍历
			1. 当前节点在Map中存在，打上“更新”
			2. 当前节点在Map中不存在，打上“新增”
			3. [[Map]] 中剩余没有标签的节点，打上“删除”
diff结果
	1. 同时存在于新vdom和旧fiber中的节点：更新
	2. 仅存在于新vdom中：新增
	3. 仅存在于旧fiber中：删除
### vue 2的diff算法
### vue 3的diff算法
## 协调
定义：在更新过程中，将 [[react原理#virtual dom|virtual dom]] 同步渲染为真实 [[DOM]] 的过程。是react中最重要、最核心的部分。
背景：组件足够复杂时，更新时的计算、渲染的压力都比较大。如果同时再有DOM操作需要（动画，鼠标拖拽），可能卡顿
解决方案
	1. Stack协调：react v15使用的协调方式。v-dom是对象
	2. Fiber：将协调阶段拆分（commit阶段无法拆分）
		1. DOM需要渲染时，先暂停协调阶段的计算。空间时恢复计算
		2. 什么时候是DOM需要渲染的时候？如何确定？通过一个API，window.requestIdleCallback
### Fiber协调【染新，乌鸡布局】
参考
	1. [React Fiber 初探 - 掘金](https://juejin.cn/post/6844903622388482061) 
v16的 [[react]] 使用的协调方式
	1. 是一次重大的创新，解决了Stack协调中遇到的一些问题。【渲染阻断，更新卡顿，任务优先级，错误处理，布局更新】
		1. *渲染*过程不可阻断
			1. *适时重启*渲染
		2. *更新*过程如果耗时较长，会难以响应用户行为【造成卡顿】
		3. 没有区分*任务优先级*。不会重点关注一些用户希望及时反应的行为：时间分片
			1. 多次输入后，像PPT一样瞬间展示已输入内容
		4. 更清晰的*错误*处理
		5. 父子组件间切换时布局更新：双缓冲
	2. 使用Fiber节点进行UI映射。v-dom是链表
#### Fiber的数据结构
![[Pasted image 20230530115739.png]] 
15的版本中v-dom是*对象*，16中是使用**Fiber节点**对html的dom结构进行映射【v-dom是Fiber节点，本质是*链表*】
#### 协调过程【两个阶段】
1. render阶段
	1. 执行组件的返回UI[^2]，确定需要更新的内容。此过程**可阻断**【在v15中此阶段不可阻断】
2. commit阶段
	1. 提交更新并调用对应渲染模块（ReactDOM）渲染为真实DOM。为防止页面抖动，此阶段为同步且不可阻断[^3]。
#### 时间分片
解决v15中任务没有优先级的问题，使用时间分片进行**任务拆分**。
![[Pasted image 20230530121223.png]] 
任务拆分前后/采用**时间分片前后的react的协调过程** 
![[Pasted image 20230530122112.png]]
人：浏览器的主线程
1. 前者是stack。任务一直执行
2. 后者是fiber。
	1. 因为fiber协调过程的render阶段*可阻断*。所以可在阻断时进行**任务切换**：执行其他优先级更高的任务
	2. 任务执行完毕，或任务设置的*超时*时间达到时，去**执行另一个**任务。

像动画，可设置任务优先级。设置超时时间![[Pasted image 20230530121401.png]] 
react也使用了这种方式进行任务间的切换。 ![[Pasted image 20230530121713.png]] 
断点完如何恢复？在组件中如何来回切换？-**双缓冲**技术
![[Pasted image 20230530122950.png]] 






[^1]: 如setState
[^2]: class组件是render，函数组件是return
[^3]: 此阶段用户可感知到
[^4]: 组件的事件不是同步的，是原生的DOM事件
# [[react合成事件]] 
# setState 与 batchUpdate原理
##  现象
1. 同步
	1. 17之前，有时同步，有时异步
	2. 17之后，定时器与DOM事件中也是同步[^4]
2. 合并
	1. 传入对象时合并，传入函数时不合并。
##  [[this]].setState原理
1. setState主流程。核心：是否处于处于batchUpdate机制 ![[Pasted image 20230711154720.png]] 
	1. 如果命中了**异步**的setState，即处于batchUpdate，走左边分支
		1. 将状态改变的组件*保存*在dirtyComponents中
		2. 对其中的组件进行*更新与渲染* 
	2. 哪些能命中batchUpdate机制？react可以“管理”的**入口**。因为isBatchingUpdates变量是在入口处设置的
			1. 生命周期
			2. react中注册的事件处理函数
	3. 哪些不能命中bU机制？react管理不到的入口
		1. 定时器，自定义的DOM事件
##  batchUpdate机制
是否批量更新state
核心：isBatchingUpdates ![[Pasted image 20230711155421.png]] 
	1. 在执行事件处理函数前，初始化 `isBatchingUpdates = true`
	2. 执行函数（生命周期函数、组件注册的事件回调）
	3. 设置 `isBatchingUpdates = false` 
	4. 当异步的定时器、DOM事件回调被执行时，同步代码已经将isBatchingUpdates赋值为false，所以这两种场景下state的更新是同步的
## transaction事务机制 
![[Pasted image 20230711161656.png]] 
	1. 过程
		1. 组件创建时注入初始化逻辑、结束逻辑
		2. 调用时执行初始化逻辑、目标函数、结束逻辑
	2. 应用
		1. batchUpdate的流程也属于transaction事务机制。在初始化、结束时修改isBatchingUpdates变量
# 组件渲染和更新过程
1. [[JSX]] 如何渲染为页面
	1. 执行render生成vnode
	2. patch（elem, vnode）和patch（vnode, newVnode）
2. 组件渲染过程
	1. *接收*props, state
	2. render*生成vnode* 
	3. *更新*：patch (elem, vnode)
3. 组件更新过程
	1. setState (newState)，生成dirtyCompoentns（可能有子组件）
	2. 接收新props, state
	3. render生成newVnode
	4. 更新：patch (vnode, newVnode)【可分为两个阶段】
		1.  reconcin 协调阶段 - 执行diff算法，纯JS计算
		2. commit阶段 - 将diff结果渲染为DOM
4. setState后如何更新页面。更新的两个阶段
5. 面试会考察全流程
# Shadow DOM
定义：是一种浏览器技术，可用于限制web components中的变量和CSS。
