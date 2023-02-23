调用上下文，是一个对象
非严格模式下总有值（全局对象或其他调用对象）
严格模式下Undefined

不是变量，不会有作用域规则：不会使用包含函数的this。
JS语法不允许给this赋值


# 绑定方式
## 隐式绑定

```javascript
let o = {
  m: function(){
    // 在嵌套函数中访问外层函数调用上下文的常见方式。ES6使用箭头函数定义内部的嵌套函数
    let self = this 
    console.log(this) // 调用上下文是o对象
    fn()
    function fn() {
      console.log( this) // 全局对象。因为是被压入调用栈？
    }
  }
}
o.m() 
```
## 显式绑定
