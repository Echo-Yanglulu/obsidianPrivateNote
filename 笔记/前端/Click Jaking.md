点击劫持：在诱导点击的界面上添加一个透明的 [[iframe]]，实际点击的内容与展示内容不同


![[Pasted image 20230802171231.png]]
如果没有登录，请求不会成功，如果已经登录则请求成功。
	1. 关注、付款、

预防：禁止 iframe 跨域加载![[Pasted image 20230802171513.png]]
	1. 钓鱼网站的域名与正常访问的域名不同，进行跳转
	2. 响应头设置后，当前网站无法被嵌入到第三方使用的[[iframe]]中。
		1. Content-Security-Policy HTTP 响应头有一个 frame-ancestors 指令，支持这一指令的浏览器已经废弃了 X-Frame-Options 响应头
		2. [跟我一起探索HTTP-X-Frame-Options - 掘金](https://juejin.cn/post/7235426780697428023?searchId=20230802172142E76F187D5CDDC8B4C544)  