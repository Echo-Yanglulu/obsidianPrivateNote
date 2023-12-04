只要 JS 还是单线程的，异步的，这个题目就是热门的。但原生没有`sleep`这个功能。

要求
	1. 支持 sleep 和 eat 两个方法
	2. 支持链式调用

示例
![[Pasted image 20231101092127.png]]

分析
	1. 因为有 sleep 功能，所以函数不能在调用时直接触发/执行。
		1. 初始化一个列表，把函数全部注册进去。
		2. 所有的注册结束后，从第一个 fn1 开始执行。
			1. 由每个函数触发 next 执行（当前的触发下一个）。遇到 sleep 则异步（等待设定时间后）触发
![[Pasted image 20231101093141.png]]


# 代码
```ts
class LazyMan {
    private name: string
    private tasks: Function[] = [] // 任务列表

    constructor(name: string) {
        this.name = name

        setTimeout(() => {
            this.next()
        })
    }

    private next() {
        const task = this.tasks.shift() // 取出当前 tasks 的第一个任务
        if (task) task()
    }

    eat(food: string) {
        const task = () => {
            console.info(`${this.name} eat ${food}`)
            this.next() // 立刻执行下一个任务
        }
        this.tasks.push(task)

        return this // 链式调用
    }

    sleep(seconds: number) {
        const task = () => {
            console.info(`${this.name} 开始睡觉`)
            setTimeout(() => {
                console.info(`${this.name} 已经睡完了 ${seconds}s，开始执行下一个任务`)
                this.next() // xx 秒之后再执行下一个任务
            }, seconds * 1000)
        }
        this.tasks.push(task)

        return this // 链式调用
    }
}

const me = new LazyMan('双越')
me.eat('苹果').eat('香蕉').sleep(2).eat('葡萄').eat('西瓜').sleep(2).eat('橘子')

```
# 总结
1. 构造函数中的异步。
	1. 并不是在构造函数执行结束后立即执行，而是在后续所有同步执行结束后执行。
	2. 在最后一个 eat 调用结束后。开始执行第一个任务

