在app.js中写组件
在index.js中使用render将app绑定到DOM节点。
# 目录
## html文件
自定义，可作为webpack自动打包时使用的模板
1. 插入变量![[Pasted image 20230529175821.png]]

# 鉴权
# 请求
在组件卸载时取消发出的网络请求
	1. 设置一个state，在componentWillUnmount中修改为一个布尔值
	2. 在发送请求的方法中添加判断，如果该state符合期望，则setState。避免修改不存在的state
# [[webpack]]配置
[[react-app-rewired]] 