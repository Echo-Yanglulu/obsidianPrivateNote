# 概述
本质：一个构造函数，传参接收一个函数，生成Promise实例
	1. resolve：*改变状态*为fulfilled，并传递给*负责处理成功情况*的异步任务
	2. reject：改变状态为rejected，并传递给*负责处理失败情况*的异步任务
作用
	1. 在主任务成功或失败后，添加异步任务。
		1. 图片加载完毕后替换，大量计算完毕后修改，网络请求结束后修改Loading。
状态
	1. 三种状态pending, fulfilled, rejected
	2. 调用resolved：改变状态为resolved并传参。调用rejected：改变状态为rejected并传参 
		1. 状态改变是不可逆的
		2. 状态变为resolved时，执行then内代码
			1. 后续then中正常返回，则得到一个resolved状态的promise
			1. 后续then中*抛出异常*，则得到一个rejected状态的promise
		3. 状态变为rejected时，执行then第二个函数或catch内代码【在错误处理中，如果返回正常，则新得到一个解决的promise 】
			4. 执行时无报错 ，则返回resolved状态的promise
			5. 执行时*抛出异常*，则返回rejected状态的promise
	3. 可直接创建一个落定的Promise对象
		1. Promise.resolve()创建解决
		1. Promise.reject()创建拒绝 
特性
	1. 状态
		1. 不受外部影响
		2. 改变不可逆
	2. 进度：处于pending状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）
	3. 取消：无法取消，一旦新建Promise就会立即执行
	4. 错误：如果不设置回调函数，Promise内部抛出的错误[^1]不会反应到外部
		1. 提示报错信息，代码不会停止执行。`window.onunhandledrejection` 
使用
	1. 链式调用
		1. 串行异步。后一个回调等待该Promise对象的状态发生变化，才会被调用
		2. 任何一个抛出的错误，都会被最后一个catch()捕获
			1. 一般不要在中间定义错误处理函数，而是最后作用catch。因为会一路向后抛出。
		3. 返回落定的promise实例
			1. **有异常**则返回rejected状态的promise对象。
			2. 否则返回fulfilled状态的promise对象

如果某些事件不断地反复发生，一般来说，使用 [Stream](https://nodejs.org/api/stream.html) 模式是比部署Promise更好的选择。
# API
## Promise.resolve
## Promise.reject
## promise.prototype.then
## promise.prototype.catch
## promise.prototype.finally
## Promise.all
将多个promise实例包装为一个promise实例
	1. 参数
		1. 参数可以不是数组，但需要具备Iterator接口，且返回的每个成员都是Promise实例
		2. 元素如果不是promise实例，先调用Promise.resolve转为实例
	2. 返回值
		1. 全部状态变为解决，变为解决，解决值是数组
		2. 一个拒绝，变为拒绝。
## Promise.allSettled
## Promise.any
## Promise.race
## Promise.try
# 手写
```js
class MyPromise {
    state = 'pending' // 状态，'pending' 'fulfilled' 'rejected'
    value = undefined // 成功后的值
    reason = undefined // 失败后的原因

    resolveCallbacks = [] // pending 状态下，存储成功的回调
    rejectCallbacks = [] // pending 状态下，存储失败的回调

    constructor(fn) {
        const resolveHandler = (value) => {
            // 加 setTimeout ，参考 https://coding.imooc.com/learn/questiondetail/257287.html (2022.01.21)
            setTimeout(() => {
                if (this.state === 'pending') {
                    this.state = 'fulfilled'
                    this.value = value
                    this.resolveCallbacks.forEach(fn => fn(value))
                }
            })
        }

        const rejectHandler = (reason) => {
            // 加 setTimeout ，参考 https://coding.imooc.com/learn/questiondetail/257287.html (2022.01.21)
            setTimeout(() => {
                if (this.state === 'pending') {
                    this.state = 'rejected'
                    this.reason = reason
                    this.rejectCallbacks.forEach(fn => fn(reason))
                }
            })
        }

        try {
            fn(resolveHandler, rejectHandler)
        } catch (err) {
            rejectHandler(err)
        }
    }

    then(fn1, fn2) {
        fn1 = typeof fn1 === 'function' ? fn1 : (v) => v
        fn2 = typeof fn2 === 'function' ? fn2 : (e) => e

        if (this.state === 'pending') {
            const p1 = new MyPromise((resolve, reject) => {
                this.resolveCallbacks.push(() => {
                    try {
                        const newValue = fn1(this.value)
                        resolve(newValue)
                    } catch (err) {
                        reject(err)
                    }
                })

                this.rejectCallbacks.push(() => {
                    try {
                        const newReason = fn2(this.reason)
                        reject(newReason)
                    } catch (err) {
                        reject(err)
                    }
                })
            })
            return p1
        }

        if (this.state === 'fulfilled') {
            const p1 = new MyPromise((resolve, reject) => {
                try {
                    const newValue = fn1(this.value)
                    resolve(newValue)
                } catch (err) {
                    reject(err)
                }
            })
            return p1
        }

        if (this.state === 'rejected') {
            const p1 = new MyPromise((resolve, reject) => {
                try {
                    const newReason = fn2(this.reason)
                    reject(newReason)
                } catch (err) {
                    reject(err)
                }
            })
            return p1
        }
    }

    // 就是 then 的一个语法糖，简单模式
    catch(fn) {
        return this.then(null, fn)
    }
}

MyPromise.resolve = function (value) {
    return new MyPromise((resolve, reject) => resolve(value))
}
MyPromise.reject = function (reason) {
    return new MyPromise((resolve, reject) => reject(reason))
}

MyPromise.all = function (promiseList = []) {
    const p1 = new MyPromise((resolve, reject) => {
        const result = [] // 存储 promiseList 所有的结果
        const length = promiseList.length
        let resolvedCount = 0

        promiseList.forEach(p => {
            p.then(data => {
                result.push(data)

                // resolvedCount 必须在 then 里面做 ++
                // 不能用 index
                resolvedCount++
                if (resolvedCount === length) {
                    // 已经遍历到了最后一个 promise
                    resolve(result)
                }
            }).catch(err => {
                reject(err)
            })
        })
    })
    return p1
}

MyPromise.race = function (promiseList = []) {
    let resolved = false // 标记
    const p1 = new Promise((resolve, reject) => {
        promiseList.forEach(p => {
            p.then(data => {
                if (!resolved) {
                    resolve(data)
                    resolved = true
                }
            }).catch((err) => {
                reject(err)
            })
        })
    })
    return p1
}


```
# 应用
## 加载图片
```js

```
## 利用抛出异常，连续处理多个任务。

[^1]: 内部访问了一个不存在的变量、存在拼写或语法错误