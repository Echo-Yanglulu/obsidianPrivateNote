compress: true  开启g-zip压缩，提高资源的加载速度。
clientLogLevel：‘none’    日志等级
contentBase：  资源路径
hot：   HMR。在webpack4中只需设置hot为true，对应plugin会自动添加
transportMode：‘ws’     webpackDevServer与前端页面通信的方式
watchOption：{}   wds对文件变化的监听（ignoredFiles：生成不需要监听变化的路径，提高监听的性能）
![[Pasted image 20220806125628.png]]