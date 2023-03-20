ES6的**语言级**模块化方案[^2]
	1. 支持node与浏览器等运行时
		1. 不再需要加载器或预处理
	2. [[静态分析]][^1] 
# 模块标签及定义
作为整块JS代码存在
JS模块文件没有专门的内容类型

带有type="module"属性的script标签：
	1. 告诉浏览器，相关代码应*作为模块执行*，而不是*作为传统脚本执行*。
	2. 立即下载模块文件，文档解析完成后执行（标签出现顺序就是执行顺序）
带有async属性的script标签
	1. 执行顺序不再是标签出现顺序，执行时机也不再是文档解析完成

加载
	1. 次数与方式不影响，都只会加载一次。
```javascript
<!-- moduleA在这个页面上只会被加载一次 -->

<script type="module">
  import './moduleA.js'
<script>
<script type="module">
  import './moduleA.js'
<script>
<script type="module" src="./moduleA.js"></script>
<script type="module" src="./moduleA.js"></script>
```
执行
	1. 按顺序
# 模块标识符
内容：可是[[相对路径]]或[[绝对路径]] 
形式：必须是纯字符串，不能是拼接
# 模块加载
完全支持该规范的浏览器可从顶级模块（异步地）加载整个依赖图，

浏览器加载模块过程
	1. 解析入口模块
	2. 确定依赖
	3. 发送对依赖模块的请求
	4. 对返回的请求解析，请求并加载所有依赖
	5. 整个依赖图解析完成
	6. 应用正式加载模块
# 模块行为
## 属性
1. 模块是单例
2. 可定义公共接口
	1. 其他模块可基于这个接口观察与交互
3. 不共享全局命名空间
4. 顶级this的值是undefined
5. var声明不会添加到window对象
## 行为
1. 依赖
	1. 支持循环依赖
2. 加载
	1. 异步加载
	2. 因为属性1，所以只能加载一次
	3. 可请求加载其他模块
	4. 浏览器原生加载模块时必须带有扩展名
	5. 构建工具或第三方模块加载器：不用带有扩展名
3. 执行
	1. 异步执行
	2. 默认在严格模式下
# 模块导出
方式（不同的导出方式对应不同的导入方式）
	1. 命名导出
		1. 形式：export 关键字
		2. 数量：可有多个
		3. 环境：只能在模块顶级，不能在块中
		4. 导入处理：可通过`*`进行批量导入、指名导入
	2. 默认导出：模块就是被导出的值
		1. 形式：export default
		2. 数量：只有一个【重复会报typeError】
		3. 导入处理：无法通过`*`导入
两种方式可并存

==可以理解为，默认导出是命名导出的子集，是这个对象的一个属性，字段名为default==。只是在导入时可方便地不用加export子句（对象的大括号）

别名
	1. 必须在大括号语法中
	2. 如果别名是default，则等同于默认导出
``` javascript
// 命名导出（每个都会作为唯一的命名导出对象的一个属性）
export let num = 1  // 原始类型初始化
export const baz = 'baz';
export const foo = 'foo', bar = 'bar';
export function* foo() {}  // 对象初始化
export function foo() {}
export class Foo {}
export { name1, name2, …, nameN };// 导出列表
export {a: 1, b: function(){}} 
export { str as helloStr } from './b'// 引入外部模块，**别名导出**

// 子句命名导出
export { foo };
export { foo, bar };
export { foo as myFoo, bar };

// 导出单个特性
export let name1, name2, …, nameN; // also var, const
export let name1 = …, name2 = …, …, nameN; // also var, const
export function FunctionName(){...}
export class ClassName {...}

// 默认导出
export default 'foo';
export default 123;
export default /[a-z]*/;
export default { foo: 'foo' };
export { foo, bar as default };
export default foo
export default function () {} // 默认导出：变量命名无效
export default function foo() {}
export default function*() {}
export default class {}

// 解构导出并重命名
export const { name1, name2: bar } = o;

// 导出模块合集
export * from …; // does not set the default export
export * as name1 from …; // Draft ECMAScript® 2O21
export { name1, name2, …, nameN } from …;
export { import1 as name1, import2 as name2, …, nameN } from …;
export { default } from …;

// 会导致错误的不同形式：

// 1.行内默认导出中不能出现变量声明
export default const foo = 'bar';

// 2.只有标识符可以出现在export子句中
export { 123 as foo }

// 3.别名只能在export子句中出现
export const foo = 'foo' as myFoo;
```

# 模块导入
方式
	1. 命名导入
	2. 默认导入
特性
	1. 导入变量对模块而言只读
		1. 无法直接修改导入的值
		2. 已导出的属性也不能修改
环境：同样必须出现在模块顶级
```javascript
import * as name from "module-name"; // 所有导出（包含命名与默认），并绑定在All
import defaultExport from "module-name"; // 默认导出，重命名
import { export } from "module-name"; // 显式/命名导出
import {
  reallyReallyLongModuleMemberName as shortName,
  anotherLongModuleName as short
} from '/modules/my-module.js'; // 多个重命名
import { foo , bar } from "module-name/path/to/specific/un-exported/file";
import { export1 , export2 } from "module-name"; // 多个
import { export as alias } from "module-name"; // 重命名
import { export1 , export2 as alias2 , [...] } from "module-name"; // 收集
import defaultExport, { export [ , [...] ] } from "module-name";
import defaultExport, * as name from "module-name"; // 默认与命名同时导入（默认必须在前）
(async () => {
  if (somethingIsTrue) {
    const { default: myDefault, foo, bar } = await import('/modules/my-module.js');
  }
})(); // 动态导入默认导出时，必须以default字段重命名
import "module-name"; // 运行模块中的全局代码，不导入任何导出
var promise = import("module-name");//这是一个处于第三阶段的提案。
```

# 模块转移导出
```javascript
export * from './foo.js';
```
# 工作者模块
# 向后兼容

[^1]: JS引擎不需要通过require函数才能知道引入的模块，在解析代码时可通过[[AST]]得到依赖关系
[^2]: 意思就是语言原生支持？