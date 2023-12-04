可单独开启一个进程，用于*同域*页面通讯。引入的文件可执行该文件。

# 使用
```js
//sharedWorker.js
const set = new Set()

onconnect = event => {
    const port = event.ports[0]
    // 如果是多个页面通讯，就添加多个进set
    set.add(port)

    // 收到信息时
    port.onmessage = e => {
		// 向其他页面发送消息
        set.forEach(p => {
            if (p === port) return
            p.postMessage(e.data)
        })
    }

    // 发送信息
    port.postMessage('worker.js 发送的消息')
}

```
需要通讯的所有页面，都引入该 JS文件，
	1. 通过 worker.port.postMessage 发送消息
	2. 通过 worker.port.onmessage 接收消息
```html
// 列表页
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>list</title>
</head>
<body>
    <p>SharedWorker message - list page</p>

    <script>
        const worker = new SharedWorker('./sharedWorker.js')
        worker.port.onmessage = e => console.info('list文件收到消息：', e.data)
    </script>
</body>
</html>
```

```html
// 详情页
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>detail</title>
</head>
<body>
    <p>SharedWorker message - detail page</p>
    <button id="btn1">修改标题</button>
    <script>
        const worker = new SharedWorker('./sharedWorker.js')
        const btn1 = document.getElementById('btn1')
        btn1.addEventListener('click', () => {
            console.log('detail文件点击')
            worker.port.postMessage('DETAIL文件发送的消息')
        })
    </script>
</body>
</html>
```
# 调试
## 本地调试
如果在隐私模式下查看时，找不到控制台的输出消息。可在地址栏输入： `chrome://inspect` 找到 `shared workers` ，点击 `inspect`可做验证（使用时没有收到消息时使用此方式进行验证）
兼容性：IE11不支持