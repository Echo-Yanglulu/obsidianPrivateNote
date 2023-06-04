# 概述
定义：在一个[[CSS]]文件中，所有的类名、动画名的*作用域*都被默认限制到本地。所有的`url(...)`与`@imports`都是模块引入格式（`./xxx` and `../xxx` means relative, `xxx` and `xxx/yyy` means in modules folder, i. e. in `node_modules`）。

本质：不是官方提出的，也不是浏览器中的特殊实现。而是构建过程中的一个步骤。

区别：为了让CSS适应软件工程方法，让它变得像编程语言，提出了[[LESS]]、[[Sass]]、[[CSS in JS]]。不同的是，它并没有把CSS改造成[[编程语言]]。只是加入了**局部作用域**和**模块依赖**，这恰恰是网页组件最急需的功能。

优点：基于前端[[工程化]]开发的一套CSS解决方案
	1. 相较于CSS，*没有全局作用域*，*没有命名冲突*。
	3. CSS没有依赖管理。*清晰的依赖关系* 
# 局部作用域
CSS中的规则都是全局的，任何一个组件的样式规则，对整个页面有效。产生局部作用域的唯一办法就是，定义一个唯一的类名。
1. 通过引入并重命名为style，类名作为对象的属性，
```js
import React from 'react';
import style from './App.css';

export default () => {
  return (
    <h1 className={style.title}>
      Hello World
    </h1>
  );
};
// 构建工具会将组件中的类名style.title、CSS文件中的类名编译成同一个哈希字符串。只对当前组件有效
```
```js
// webpack配置文件
module.exports = {
  entry: __dirname + '/index.js',
  output: {
    publicPath: '/',
    filename: './bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'stage-0', 'react']
        }
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader?modules", // 添加查询参数modules表示打开css module功能
        localIdentName: "[name]_[local]_[hash:base64:5]"
      },
    ]
  }
};
```
# 形式
## 定义
在CSS模块化中使用组合
	1. 文件内：![[Pasted image 20230602141816.png]] 
	2. 跨文件：![[Pasted image 20230602142156.png]] 

## 使用
1. import style from './index.module.less' 或 import style from './index.module.css'
2. className={style.title}

# 原理
当从JS模块中导入css module时：将单独的CSS文件编译为**CSS代码**和**数据**。数据用于将开发者定义的名称（类名或动画名）映射为全局安全的CSS输出
# 将CSS Modules集成到项目中
4种方式
## [[webpack]] 
`css-loader`内置了CSS Modules，加个?modules即可激活
## Browserify
## JSPM
## NodeJS

# 相关
[CSS Modules 用法教程 - 阮一峰的网络日志](http://www.ruanyifeng.com/blog/2016/06/css_modules.html) 