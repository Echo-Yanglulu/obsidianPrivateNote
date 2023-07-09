# apply(this, Array)

# bind(this, p1, p2)
手写
```js
	Function.prototype.bind1 = function () {
    // 将参数拆解为数组
    const args = Array.prototype.slice.call(arguments)
    // 获取 this（数组第一项）
    const t = args.shift()
    // fn1.bind(...) 中的 fn1
    const self = this
    // 返回一个函数
    return function () {
        return self.apply(t, args)
    }
}
```
# call(this, params1, params2, ...)
参数列表