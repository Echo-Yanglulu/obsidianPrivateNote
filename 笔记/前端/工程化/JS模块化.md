# 方案
## ES6 Module
### 导出
``` javascript
export let num = 1
export {a: 1, b: function(){}} // 对象字面量
export default function () {} // 默认导出：变量命名无效
export { num as aName }// 导出重命名
export { str as helloStr } from './b'// 引入外部模块，**重新导出**
```
### 导入
```javascript
import defaultExport from "module-name"; // 导入被默认导出的内容，并重命名
import * as name from "module-name"; // 导入所有导出（包含直接与默认），并绑定在All
import { export } from "module-name"; // 导入显式导出的接口
import { export as alias } from "module-name"; 
import { export1 , export2 } from "module-name";
import { foo , bar } from "module-name/path/to/specific/un-exported/file";
import { export1 , export2 as alias2 , [...] } from "module-name";
import defaultExport, { export [ , [...] ] } from "module-name";
import defaultExport, * as name from "module-name";
import "module-name";
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
