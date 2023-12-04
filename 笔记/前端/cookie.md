# 概述
背景：
	1. 本身用于*浏览器与服务端通讯*。通常由浏览器存储，随后将 cookie 与每个请求一起发送到同一服务器。
	2. 当时 H5流行，没有 webStorage，所以被借用于本地存储。但它会在请求时被发送，所以**价值**并不在于本地存储，而在于*与服务端通讯*。 
	3. 如何将与用户相关的信息存储的客户端？
发展
	1. 由网景公司发明，由一份名为 PCS: HTTP Cookies 的规范定义
	2. 如今只是在**客户端存储数据**的一个选项。
特点
	1. 生命周期：浏览器会话【还是页面会话？还是 TCP 连接会话？】。**页面刷新**，始终存在。被用于本地存储
	2. 域绑定。(跨域不共享/仅一个域内可用)
		3. 设置 cookie 后，它会与请求一起发送到创建它的域。【如果是服务端某个域设置的，那就可访问该域。如果是客户端设置的，就只能访问客户端该域下的资源】
			1. 之后的*每次请求*中通过 HTTP 头部：cookie 将它们发回服务器。【与服务端通讯】
			2. 这个限制能保证 cookie 中存储的信息只对被认可的接收者开放，不被其他域访问
		4. 场景【默认有跨域限制】
			1. 嵌入[[iframe]]的页面是另一个域，默认不能获取所在页面的 cookie【可解决】
			2. 客户端与服务端的域不同，默认不能发送 cookie。【前端发送请求时设置 withCredentials，证明前端想要跨域。服务端也需要设置，允许跨域请求】
	3. 大小。不会占用太多磁盘空间。4k
		1. 原因：一个页面会发出许多请求，每次请求都携带
		2. 限制
			1. 不超过300个 cookie；
			2. 每个 cookie 不超过4096字节；最大4k
			3. 每个域不超过20个 cookie；
			4. 每个域不超过81 920字节。
		3. 每个域能设置的 cookie 总数[^1]
			1. 最新版 IE 和 Edge 限制每个域不超过50个 cookie；
			2. 最新版 Firefox 限制每个域不超过150个 cookie；
			3. 最新版 Opera 限制每个域不超过180个 cookie；
			4. Safari 和 Chrome 对每个域的 cookie 数没有硬性限制
# 组成
[广告是如何跟踪我们的？所有关于 cookie - 掘金](https://juejin.cn/post/7052507369690890270?searchId=20230805210130A941551291CC8ECCA886) 
1. 名称：唯一标识 cookie 的名称。
	1. 不区分大小写。实践中最好将 cookie 名当成区分大小写来对待，因为一些服务器软件可能这样对待它们
	2. 必须经过[[Global#URL 编码|URL编码]]
2. 值：
	1. 存储在 cookie 里的字符串值
	2. 必须经过 URL 编码
3. 域：cookie 有效的域
	1. 发送到这个域的所有请求都会包含对应的 cookie。
	2. 这个值可能包含子域（如 www.wrox.com ），也可以不包含（如`.wrox.com`表示对 wrox.com 的所有子域都有效）。
	3. 如果不明确设置，则默认为*设置 cookie 的域*。自动绑定到执行语句的当前域
4. 路径：需要发送 cookie 的路径。请求 URL 中包含这个路径才会把 cookie 发送到服务器
	1. 例如，可以指定 cookie 只能由`http://www.wrox.com/books/`访问 ，因此访问`http://www.wrox.com/`下的页面就不会发送cookie ，即使请求的是同一个域。
5. Max-Age：删除 cookie 的时间戳（即什么时间之后就不发送到服务器了）
	1. 默认情况下，*浏览器会话结束*后会删除所有 cookie。【浏览器关闭】
	2. 不过，也可以设置删除 cookie 的时间。这个值是 GMT 格式（Wdy, DD-Mon-YYYY HH:MM:SS GMT），用于指定删除 cookie 的具体时间。这样即使关闭浏览器 cookie 也会保留在用户机器上。
	3. 把过期时间设置为过去的时间会立即删除 cookie。
6. secure：设置之后，只在*使用 [[SSL]] 安全连接*的情况下才会把 cookie 发送到服务器
	1. 例如，请求 `https://www.wrox.com` 会发送 cookie ，而请求 `http://www.wrox.com` 则不会
	2. cookie 中唯一的非名/值对，只需一个 secure 就可以了
7. SameSite：跨域时决定浏览器是否自动携带 cookie。
	1. Strict：完全禁止第三方 Cookie，*跨站点时不会发送 Cookie*。只有当前网页的 URL 与请求目标一致，才会带上 Cookie。
		1. 过于严格，可能造成非常不好的用户体验。比如，当前网页有一个 GitHub 链接，用户点击跳转就不会带有 GitHub 的 Cookie，跳转过去总是未登陆状态
	2. Lax：允许部分第三方请求携带 Cookie【默认】
	3. None：无论是否跨站都会发送 Cookie
	4. 跨站则比较宽松，只要*二级域名*相同就是同站（二级域名指 .com 这种顶级域名的下一级，如 test.com）
8. HTTPOnly
	1. 防止客户端脚本访问 Cookie（通过 document.cookie 等方式）。有助于避免 XSS 攻击
9. SameParty。
	1. Chrome 新推出了一个 First-Party Sets 策略，它可以允许<u>由同一实体拥有的不同关域名都被视为第一方</u>。之前都是以站点做区分，现在可以以一个 party 做区分。SameParty 就是为了配合该策略。（目前只有 Chrome 有该属性）
10. Priority
	1. 优先级，chrome 的提案（firefox 不支持），定义了三种优先级，Low/Medium/High，当 cookie 大小超出浏览器限制时，低优先级的 cookie 会被优先清除。（目前只有 Chrome 有该属性）

// 这些参数在 Set-Cookie 头部中使用*分号加空格*隔开
HTTP/1.1 200 OK
Content-type: text/html
Set-Cookie: name=value; expires=Mon, 22-Jan-07 07:10:24 GMT; domain=.wrox.com
Other-header: other-header-value
// 这个cookie在2007年1月22日7:10:24过期，对www.wrox.com及其他wrox.com的子域（如p2p.wrox.com）有效

HTTP/1.1 200 OK
Content-type: text/html
Set-Cookie: name=value; expires=Mon, 22-Jan-07 07:10:24 GMT; domain=.wrox.com
Other-header: other-header-value
// 对所有wrox.com的子域及该域中的所有页面有效（通过path=/指定）。不过，这个cookie只能在SSL连接上发送，因为设置了secure标志。




后面四个属性只是用于表示何时应该在请求中包含 cookie，在发送 cookie 时并不会作为内容。真正发送的内容只有名值对。
# 创建
服务端创建：某次响应的 set-cookie 头部
客户端创建：document.cookie = ''。
# 机制
1. 某个 cookie 是否发送取决于此次**请求的目标域名**。
	1. 登录 A 网站保存 cookie 之后，如果登录的 B 网站向 A 网站发起请求，则此次请求使用的是 A 网站保存的 cookie。
	2. 该特性会导致 [[CSRF]]。
# 分类
[谈谈 cookie & session & jwt - 掘金](https://juejin.cn/post/7236028062872600636?searchId=20230805210130A941551291CC8ECCA886) 
Cookie 是属于一方 Cookie、还是三方 Cookie，只取决于两个要素：
	1. Cookie 是被哪个域名种的
	2. Cookie 是在哪个网站上种的
## 第一方 cookie

## 第三方 cookie
当前页面所在的域调用了外域的接口。该外域接口所设置的 cookie 即是第三方 cookie。

特点
	1. *我们的网站不可能只调用同站的域名的接口*，调用其他域名的接口再正常不过了，所以有三方 Cookie 也是很正常的，我们也通过三方 Cookie 做了很多正常的需求，比如*日志打点*、*单点登录*、*广告转化分析*等等
	2. 广告。
		1. 一个购物网站，调用第三方广告商的接口（购物网站需要购买广告平台提供的广告投放业务）。第三方广告平台通过设置三方 cookie 记录用户行为、搜索记录。下次用户浏览其他网站时时，如果该网站也在广告平台上开通了承接广告业务，同一个用户则会浏览到精准推送的广告。
# 限制
使用**多字节字符**（如 UTF-8 Unicode 字符），每个字符最多可能占4字节
## 现代浏览器开始禁止第三方 cookie
目的：保护用户隐私，打击第三方广告。
	1. 背景：*禁止网页引入的第三方 JS 使用 cookie* 
		1. 背景：第三方 JS 为何要设置 cookie？第三方可能记录用户访问历史，知道用户的目的（买手机）。
即：为了避免第三方库通过设置 cookie 记录用户访问历史，投放广告，直接禁止第三方库设置 cookie

cookie 新增属性 SameSite: Strict/Lax/None。严格禁止，取消禁止
![[Pasted image 20230802113946.png]]

# JS 中的 cookie
JavaScript 中处理 cookie 比较麻烦，因为接口过于简单，只有 BOM 的 document.cookie 属性
1. 获取: document.cookie 返回包含页面中所有有效 cookie 的字符串(根据域、路径、过期时间和安全设置)，如 `name1=value1;name2=value2;name3=value3` 
	1. 名和值都是 URL 编码的，因此必须使用 decodeURIComponent()解码
2. 设置：通过 document.cookie 属性设置新的 cookie 字符串
	1. 这个字符串在被解析后会添加到原有 cookie 中。
	2. 设置 document.cookie 不会*覆盖*之前存在的任何 cookie，除非设置了已有的 cookie。
	3. 设置 cookie 的格式如下，与 Set-Cookie 头部的格式一样 `name=value; expires=expiration_time; path=domain_path; domain=domain_name; secure` 
	4. 只有 cookie 的名称和值是必需的。有时名值对中只有 `URI非转义字符` ，不用进行 URI 编码，但最好还是使用 encodeURIComponent
	5. 要为创建的 cookie 指定额外的信息,像 Set-Cookie 头部一样直接在后面追加相同格式的字符串即可
# 子 cookie
背景：为绕过浏览器对每个域 cookie 数的限制，有些开发者提出了子 cookie 的概念
定义：在单个 cookie 存储的小块数据，本质上是使用 cookie 的值在单个 cookie 中存储多个名/值对
实例： `name=name1=value1&name2=value2&name3=value3&name4=value4&name5=value5` 
格式：类似于查询字符串。
	1. 这些值可以存储为单个 cookie，而不用单独存储为自己的名/值对。结果就是网站或 Web 应用程序能够在单域 cookie 数限制下存储更多的结构化数据
# 使用时的注意事项
1. 读取
	1. 还有一种叫作 `HTTP-only` 的 cookie
		1. 可以在浏览器设置，也可以在服务器设置，
		2. 只能在服务器上读取，这是因为 JavaScript 无法取得这种 cookie 的值
2. 性能
	1. 因为所有 cookie 都会作为请求头部由浏览器发送给服务器，所以在 cookie 中保存大量信息可能会影响特定域浏览器请求的性能。
	2. 保存的 cookie 越大，请求完成的时间就越长。即使浏览器对 cookie 大小有限制，最好还是尽可能只通过 cookie 保存*必要信息*，以避免性能问题
3. 安全
	1. 不要在 cookie 中存储重要或敏感的信息。
		1. cookie 数据不是保存在安全的环境中，因此*任何人都可能获得*。应该避免把信用卡号或个人地址等信息保存在 cookie 中
4. 应用
	1. 会话管理：登录名，购物车商品，游戏得分、服务器要记录的其他内容
	2. 个性化：用户首选项，主题，语言
	3. 跟踪：记录和分析用户行为，如埋点。





[^1]: 如果 cookie 总数超过了单个域的上限，浏览器就会删除之前设置的 cookie。