# 概述

## 组成
1. 特殊值
2. 原生引用类型的构造函数
3. [[d]]
# 属性
innerHeight: 见面文档显示区
与document.documentElement.clientHeight[^1]有什么区别？


显示器高度：screen.height
浏览器软件高度：window.outerHeight【全屏时等于显示器高度】
浏览器可视区高度：window.innerHeight
[[DOM]]部分
body高度：document.body.clientHeight
元素内content+padding：clientHeight、clientLeft 、scrollHeight、scrollY
元素边框content+padding+border：offsetHeight 、offsetTop

[^1]: 某个元素的content+padding