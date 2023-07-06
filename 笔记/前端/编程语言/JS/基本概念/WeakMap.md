# 概述
与[[WeakSet]]相同点
	1. 弱引用，防止内存泄漏
		1. 因为是弱费用，没有forEach和size，只能用add, delete, has
	2. 两者都只能使用对象作为key/value