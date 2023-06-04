# 如何便捷？
## 使用多个模块化样式

```js
// 引入
import style from './a.module.css'
import classnames from 'classnames/bind'
const cls = classnames.bind(style)
// 使用
classname={cls('title','list-title')}
```

## 判断classname是否需要渲染
```js
import cn from 'classnames'
// 在组件的渲染函数中
const _cn = ({
	'themed-grid-col-s': !count // 是否使用该类名取决于存储变量
})
// 组件元素中
classname={'themed-grid-col '+ _cn}
```

