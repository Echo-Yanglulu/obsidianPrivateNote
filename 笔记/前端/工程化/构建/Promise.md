# 概述
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
	1. 状态的变化不可逆
每次链式调用，都会返回一个落定的promise，如果有异常，则落定为rejected状态，否则是fulfilled状态
# API

# 手写
```js
// 定义三种状态的常量
const PROMISE_STATUS_PENDING = "pending";
const PROMISE_STATUS_FULFILLED = "fulfilled";
const PROMISE_STATUS_REJECTED = "rejected";

class MYPromise {
  constructor(executor) {
    this.status = PROMISE_STATUS_PENDING;
    this.value = undefined;
    this.reason = undefined;
    // 为了支持promise多次使用，将成功和失败的回调保存到[]中
    this.onFulfilledFns = [];
    this.onRejectedFns = [];

    const resolve = (value) => {
      if (this.status === PROMISE_STATUS_PENDING) {
        // 放到微任务，确保可以拿到onFulfilled
        queueMicrotask(() => {
          if (this.status !== PROMISE_STATUS_PENDING) return;
          this.status = PROMISE_STATUS_FULFILLED;
          this.value = value;
          this.onFulfilledFns.forEach((fn) => fn(value));
        });
      }
    };

    const reject = (reason) => {
      if (this.status === PROMISE_STATUS_PENDING) {
        // 放到微任务，确保可以拿到onRejected
        queueMicrotask(() => {
          if (this.status !== PROMISE_STATUS_PENDING) return;
          this.status = PROMISE_STATUS_REJECTED;
          this.reason = reason;
          this.onRejectedFns.forEach((fn) => fn(reason));
        });
      }
    };

    try {
      executor(resolve, reject); // 执行回调函数
    } catch (err) {
      reject(err);
    }
  }

  then(onFulfilled, onRejected) {
    // 如果onRejected没有传入,就将抛异常给catch
    onRejected =
      onRejected ||
      ((err) => {
        throw err;
      });

    // 如果是fulfilled执行完then方法,会到catch中,但是为了避免断层(因为catch中onfulfilled是undefined)
    onFulfilled =
      onFulfilled ||
      ((value) => {
        return value;
      });

    // 返回promise为了能够达到链式调用与值穿透
    return new MYPromise((resolve, reject) => {
      // 异步使用promise的判断
      if (this.status === PROMISE_STATUS_FULFILLED) {
        try {
          const value = onFulfilled(this.value); // 拿到返回值
          resolve(value); // 传递到下一个promise中，下同
        } catch (error) {
          reject(error);
        }
      }
      if (this.status === PROMISE_STATUS_REJECTED) {
        try {
          const reason = onRejected(this.reason);
          reject(reason);
        } catch (error) {
          reject(error);
        }
      }
      //  同步使用promise的判断：成功的回调和失败的回调保存到数组中
      if (this.status === PROMISE_STATUS_PENDING) {
        // 通过push回调函数的方式，实现同步promise的值穿透及链式调用
        if (onFulfilled) {
          this.onFulfilledFns.push(() => {
            try {
              const value = onFulfilled(this.value);
              resolve(value);
            } catch (error) {
              reject(error);
            }
          });
        }

        if (onRejected) {
          this.onRejectedFns.push(() => {
            try {
              const reason = onRejected(this.reason);
              reject(reason);
            } catch (error) {
              reject(error);
            }
          });
        }
      }
    });
  }

  catch(onRejected) {
    const reason = this.then(undefined, onRejected);
    return reason;
  }

  finally(onFinally) {
    this.then(onFinally, onFinally);
  }
}

```
# 应用
## 加载图片
```js

```
## 利用抛出异常，连续处理多个任务。