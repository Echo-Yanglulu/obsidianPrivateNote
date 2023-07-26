1. *列表渲染*时使用key
2. 自定义*事件*、DOM事件及时销毁
3. *组件*
	1. 合理使用异步加载
4. 彻底拥抱不可变值： [[immutable.js]] 
5. 类组件
	1. 减少bind [[this]] 的次数
	2. SCU
		1. 必须配合不可变值使用。传入新值
		2. 一定要每次都用吗？只要不会导致卡顿，不必每次都用
	3. pureComponent
6. [[函数组件]] 
	1. useMemo, useCallback, React. memo
	2. React. memo