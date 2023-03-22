# 概述
## 起源
netscape navigator 2最早引入浏览器，已成为客户端标识浏览器的标准。（这里的客户端是指什么？PC？）
只要浏览器启用JS，该对象就一定存在。
属性/方法
说明

activeVrDisplays：返回数组，包含ispresenting属性为true的VRDisplay实例
appCodeName：即使在非Mozilla浏览器中也会返回"Mozilla"
appName：浏览器**全名**
appVersion：浏览器**版本**。通常与实际的浏览器版本不一致
battery：返回暴露Battery Status API的BatteryManager对象
buildId：浏览器的**构建编号**
connection：返回暴露Network Information API的NetworkInformation对象
cookieEnabled：返回布尔值，表示是否**启用cookie**
credentials：返回暴露Credentials Management API的CredentialsContainer对象
deviceMemory：返回单位为GB的**设备内存**容量
doNotTrack：返回用户的“不跟踪”（do-not-track）设置
geolocation：返回暴露Geolocation API的Geolocation对象
getVRDisplays()：数组，包含可用的每个VRDisplay实例
getUserMedia()：返回与可用媒体设备硬件关联的流
hardwareConcurrency：设备的**处理器核心数量**
javaEnabled：浏览器是否**启用了Java**
language：浏览器的**主语言**
languages：浏览器**偏好的语言**数组
locks：返回暴露Web Locks API的LockManager对象
mediaCapabilities：返回暴露Media Capabilities API的MediaCapabilities对象
mediaDevices：返回**可用的媒体设备**
maxTouchPoints：返回设备触摸屏支持的**最大触点数**
mimeTypes：返回浏览器中注册的MIME类型数组
onLine：返回布尔值，表示浏览器**是否联网**
oscpu：返回浏览器运行设备的**操作系统和（或）CPU**
permissions：返回暴露Permissions API的Permissions对象
platform：返回浏览器运行的**系统平台**
plugins：返回浏览器**安装的插件**数组。在IE中，这个数组包含页面中所有<embed>元素
product：返回**产品名称**（通常是"Gecko"）
productSub：返回**产品的额外信息**（通常是Gecko的版本）
registerProtocolHandler()：将一个网站注册为**特定协议的处理程序**
requestMediaKeySystemAccess()：返回一个期约，解决为MediaKeySystemAccess对象
sendBeacon()：异步传输一些小数据
serviceWorker：返回用来与ServiceWorker实例交互的ServiceWorkerContainer
share()：返回当前平台的原生共享机制
storage：返回暴露Storage API的StorageManager对象
userAgent：返回浏览器的**用户代理字符串**
vendor：返回**浏览器的厂商**名称
vendorSub：返回浏览器厂商的更多信息
vibrate()：触发设备振动
webdriver：返回浏览器当前是否被自动化程序控制

该对象的属性通常用于确定**浏览器的类型**（？）
# 插件检测
检测浏览器是否安装了某个插件

除IE10以下版本的浏览器，可通过plugins属性读取，该属性值为一个List，
# 注册事件处理程序
navigator.registerProtocolHandler(协议，处理该协议的URL，应用名)

将某个web应用注册为处理某种类型信息（**某种协议**）的应用。
	1. 把web应用注册为像桌面软件一样的默认应用
	2. 某种类型信息
		1.  在线RSS阅读器
		2. 电子邮件客户端
	3. 某种协议
		1. mailto
		2. ftp