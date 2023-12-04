# apply(this, Array)
手写时
	核心：如何在绑定 [[this]] 时，调用函数。查看 this 的隐式绑定方式
```js
Function.prototype.customApply = function (context, args) {
    if (context == null) context = globalThis 
    // globalThis关键字在不同运行时对应全局变量，兼容性较好（在caniuse中看） 
    // 因为绑定null或undefined时，this会指向全局变量
    if (typeof context !== 'object') context = new Object(context) // 值类型，变为对象
    const fnKey = Symbol() // 不会出现属性名称的覆盖
    context[fnKey] = this // this 就是当前的函数
    const res = context[fnKey](...args) // 执行时，隐式绑定了 this
    delete context[fnKey] // 清理掉 fn ，防止污染
    return res
}

```
# bind(this, p1, p2)

```js
	Function.prototype.bind1 = function () {
    // 将参数拆解为数组
    const args = Array.prototype.slice.call(arguments)
    // 获取 this（数组第一项）【取第一项，绑定对象】
    const t = args.shift()
    // fn1.bind(...) 中的 fn1【保留this】
    const self = this
    // 返回一个函数
    return function () {
        return self.apply(t, args)
    }
}
// 版本2

Function.prototype.customBind = function (context, ...bindArgs) {
    const self = this // 当前的函数本身
    return function (...args) {
        const newArgs = bindArgs.concat(args)
        return self.apply(context, newArgs)
    }
}


```
# call(this, params1, params2, ...)
参数列表
```js
Function.prototype.customCall = function (context, ...args) {
    if (context == null) context = globalThis
    if (typeof context !== 'object') context = new Object(context) // 值类型，变为对象
    const fnKey = Symbol() // 不会出现属性名称的覆盖
    context[fnKey] = this // this 就是当前的函数
    const res = context[fnKey](...args) // 绑定了 this
    delete context[fnKey] // 清理掉 fn ，防止污染
    return res
}
```