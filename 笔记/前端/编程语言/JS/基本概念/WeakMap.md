# 概述
与[[WeakSet]]相同点
	1. **弱引用**，防止内存泄漏
		1. 因为是弱费用，没有 forEach 和 size，只能用 add, delete, has
		2. 如果一个数据只被 weakmap 引用，则会被清理。
	2. 两者都**只能使用引用类型作为 key** 