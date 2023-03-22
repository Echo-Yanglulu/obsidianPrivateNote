当前窗口首次使用以来，导航历史记录。
是window的属性，每个window都有自己的history对象

出于安全，不暴露用户访问的URL，但可通过它进行前进后退。(开发者无法通过该API获取用户的访问记录，只能作跳转)
# 导航
history.go([[Number]])
forward
back
# 历史状态管理
起源：web应用开发中最难的环节之一：历史记录管理。
	因为每次点击不再刷新页面，
## 方案
### 首先出现的是hashchange事件
状态管理API：开发者可改变浏览器URL而不加载新页面

history.pushState(state对象，state的标题，可选的相对URL)
结果
	1. 状态信息被推送的历史记录中
	2. 浏览器地址栏改变为新的URL

单击浏览器的后退时，触发popstate事件。事件对象的state属性包含传入的state对象。

history.replace()只存在结果2，会覆盖当前状态