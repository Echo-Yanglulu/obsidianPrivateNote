# 方案
## ES6 Module
### 导出
``` javascript
export let num = 1
export {a: 1, b: function(){}} // 对象字面量
export default function () {} // 默认导出：变量命名无效
export { num as aName }// 导出重命名
export { str as helloStr } from './b'// 引入外部模块，**重新导出**

// 导出单个特性
export let name1, name2, …, nameN; // also var, const
export let name1 = …, name2 = …, …, nameN; // also var, const
export function FunctionName(){...}
export class ClassName {...}

// 导出列表
export { name1, name2, …, nameN };

// 重命名导出
export { variable1 as name1, variable2 as name2, …, nameN };

// 解构导出并重命名
export const { name1, name2: bar } = o;

// 默认导出
export default expression;
export default function (…) { … } // also class, function*
export default function name1(…) { … } // also class, function*
export { name1 as default, … };

// 导出模块合集
export * from …; // does not set the default export
export * as name1 from …; // Draft ECMAScript® 2O21
export { name1, name2, …, nameN } from …;
export { import1 as name1, import2 as name2, …, nameN } from …;
export { default } from …;
```

### 导入
```javascript
import * as name from "module-name"; // 所有导出（包含命名与默认），并绑定在All
import defaultExport from "module-name"; // 默认导出，重命名
import { export } from "module-name"; // 显式/命名导出
import { export1 , export2 } from "module-name"; // 多个
import { export as alias } from "module-name"; // 重命名
import {
  reallyReallyLongModuleMemberName as shortName,
  anotherLongModuleName as short
} from '/modules/my-module.js'; // 多个重命名
import { foo , bar } from "module-name/path/to/specific/un-exported/file";
import { export1 , export2 as alias2 , [...] } from "module-name"; // 收集
import defaultExport, { export [ , [...] ] } from "module-name";
import defaultExport, * as name from "module-name"; // 默认与命名同时（默认必须在前）
(async () => {
  if (somethingIsTrue) {
    const { default: myDefault, foo, bar } = await import('/modules/my-module.js');
  }
})(); // 动态导入默认导出时，必须以default字段重命名
import "module-name"; // 运行模块中的全局代码，不导入任何导出
var promise = import("module-name");//这是一个处于第三阶段的提案。

```
## CommonJS
Node是CommonJS 的一种实现。
是node.js使用的一种模块化规范，加载依赖模块方式：**同步**加载。
```JavaScript
// 整体导出
let a = {
	c: 1,
	fn: () => {}
}
module.exports = a
```
## AMD
加载模块依赖方式：**异步**
## CMD
## UMD
兼容CommonJS与AMD。即要在node.js环境运行，又要在浏览器环境运行，一般使用该规范进行模块化。
