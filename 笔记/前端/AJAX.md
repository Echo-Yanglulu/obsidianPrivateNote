定义
	1.  [[异步JS]] 与 [[HTML]]。
	2. 无需重新加载整个网页的情况下，更新部分网页的技术。传统的网页（不使用 Ajax）如果需要更新内容，必须重载整个网页页面
意义：XHR是AJAX的基础，DOM操作是 [[vue]] 的基础
核心：使用XHR对象发送请求
```js
function ajax(url) {
    const p = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('GET', url, true)
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(
                        JSON.parse(xhr.responseText)
                    )
                } else if (xhr.status === 404 || xhr.status === 500) {
                    reject(new Error('404 not found'))
                }
            }
        }
        xhr.send(null)
    })
    return p
}

const url = '/data/test.json'
ajax(url)
.then(res => console.log(res))
.catch(err => console.error(err))
```

# 常用工具、插件
[[jQuery]]对ajax的实现，没有使用promise，有点过时。
![[Pasted image 20230701142649.png]] 
