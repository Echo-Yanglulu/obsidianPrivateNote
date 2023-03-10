Node.js使用的模块化方案（不完全正确，[[node]] 使用了轻微修改版本的该规范）
# 导入
# 导出
```JavaScript
Node是CommonJS 的一种实现。
是node.js使用的一种模块化规范，加载依赖模块方式：**同步**加载。
// 整体导出
let a = {
	c: 1,
	fn: () => {}
}
module.exports = a
```