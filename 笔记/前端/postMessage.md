```html
// 主页面
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>index</title>
</head>
<body>
    <p>
        主页面
        <button id="btn1">发送消息</button>
    </p>

    <iframe id="iframe1" src="./child.html"></iframe>

    <script>
        const btn1 = document.getElementById('btn1')
        btn1.addEventListener('click', () => {
            console.info('主页面点击')
            window.iframe1.contentWindow.postMessage('我是主页发送的消息', '*')
        })

        window.addEventListener('message', event => {
            console.info('主页面收到信息的来源', event.origin) // 来源的域名
            console.info('主页面收到的消息：', event.data)
        })
    </script>
</body>
</html>
```

```html
// iframe页面
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>child</title>
</head>
<body>
    <p>
        iframe页面
        <button id="btn1">发送消息</button>
    </p>

    <script>
        const btn1 = document.getElementById('btn1')
        btn1.addEventListener('click', () => {
            console.info('iframe页面点击')
            window.parent.postMessage('我是iframe页面发送的消息', '*')
        })

        window.addEventListener('message', event => {
            console.info('origin', event.origin) // 判断 origin 的合法性
            console.info('iframe收到了：', event.data)
        })
    </script>
</body>
</html>
```