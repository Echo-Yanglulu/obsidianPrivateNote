# 概述
ES6的**语言级**的模块化方案[^2]
1. 特性
	1. 支持node与浏览器等运行时
		1. 不再需要加载器或预处理
		2. 取代 CommonJS 和 AMD 规范，成为浏览器和服务器通用的模块解决方案
	2. [[静态分析]][^1] 
	3. 动态引入：`import()` 
# 模块标签及定义
作为整块JS代码存在
JS模块文件没有专门的内容类型

带有type="module"属性的script标签：
	1. 告诉浏览器，相关代码应*作为模块执行*，而不是*作为传统脚本执行*。
	2. 立即下载模块文件，文档解析完成后执行（标签出现顺序就是执行顺序）
带有async属性的script标签
	1. 执行顺序不再是标签出现顺序，执行时机也不再是文档解析完成
定义：一个模块就是一个独立的文件
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
# 工作者模块

# 模块导出
方式（不同的导出方式对应不同的导入方式）
	1. 命名导出
	2. 默认导出：模块就是被导出的值
		1. 形式：export default
		2. 数量：只有一个【重复会报typeError】
		3. 导入处理：无法通过`*`导入
两种方式可并存

内容【可输出接口】
	1. 变量
	2. 函数
	3. 类
## 形式
结构
	1. [[作用域]] 
		1. 只能在模块顶级。函数或块级作用域报SyntaxError
		2. 默认导出只有一个。typeError
	2. 普通导出
		1. 声明同时导出 [[Pasted image 20230715122821.png]] 
		2. 先声明再导出 [[Pasted image 20230715122839.png]] 
			1. *后导出只能通过对象*，不能导出已声明的接口
		3. 重命名 [[Pasted image 20230715123040.png]] 
			1. 别名是default，则等同于默认导出
		4. 可通过 `*` 进行批量导入、指名导入
		5. 大括号中重命名为default可作为默认导出
	3. 默认导出
		1. 本质是将后面的值，赋给default变量
			1. 不能使用声明[[Pasted image 20230715145016.png]] 
			2. 后导出不用对象 [[Pasted image 20230715144338.png]] 
	4. 转移导出
		1. 只是转移，当前模块不能使用该变量
		2. 重命名转移
		3. 具名转默认转出
		4. 默认转具名转出
		5. 整体转具名转出[[Pasted image 20230715145523.png]] 
特性
	1. 动态。导出语句出执行了修改，导入会收到修改的值

==可以理解为，默认导出是命名导出的子集，是这个对象的一个属性，字段名为default==。只是在导入时可方便地不用加export子句（对象的大括号）


``` javascript
// 单个具名导出
export class Foo {}
export function foo() {}
export function* foo() {}
export const foo = 'foo', bar = 'bar'; 
export let name1, name2, …, nameN; // also var, const。可只声明，不初始化
// 集合/子句导出
// 优先使用，可直接看清导出的所有变量
export { a: 1, b: function(){} }  // 导出列表
export { str as helloStr } from './b'// 引入外部模块
export { foo as myFoo, bar };
// 解构导出
export const { name1, name2: bar } = o;

// 默认导出
export default { foo: 'foo' };
export { foo, bar as default };
export default foo
export default function foo() {} // 默认导出：变量命名无效
export default function*() {}


// 转移导出
export * from …; // does not set the default export
export * as name1 from …; // 导入一个默认导出作为导出，并重命名
export { name1, name2, …, nameN } from …;
export { import1 as name1, import2 as name2, …, nameN } from …; // 导入多个导出作为一个导出，并重命名
export { default } from …;

// 会导致错误的不同形式：

// 1.默认导出中不能出现变量声明
export default const foo = 'bar';

// 2.只有标识符可以出现在export子句中
export { 123 as foo }

// 3.别名只能在export子句中出现
export const foo = 'foo' as myFoo;
```

# 模块导入
使用export定义了对外接口后，其他JS文件可使用import命令加载

## 形式
普通结构
	1. 单个加载 `import { firstName, lastName, year } from './profile.js';` 
		1. 合并[[引入合并.png]] 
	2. 重命名 `import { lastName as surname } from './profile.js';` 
		1. 大括号中使用default可成为默认导入
	3. 整体加载 `import * as circle from './circle';` 
		1. 必须使用重命名，否则报错
		2. 需要静态分析，不能在运行时改变 [[整体导入.png]] 
	4. 加载且执行 `import 'lodash';` 
		1. 幂等
特性
	1. 只读。导入变量对模块而言只读
		1. 无法直接修改导入的值
		2. 已导出的属性也不能修改
	2. 提升。在编译阶段执行，其他代码运行之前
	3. 静态执行。变量、表达式、语句等执行时才能定值的导入，无法导入成功 [[错误导入.png]] 
	4. 作用域。模块顶级
普通结构
	1. import 
	3. from
	4. 模块文件的位置
		1. [[相对路径]] 
		2. [[绝对路径]] 
		3. 不带有路径，只是一个模块名，那么必须有配置文件，告诉 JavaScript 引擎该模块的位置

```javascript
// 所有导出（包含命名与默认），重命名
import * as name from "module-name"; 
// 默认与命名同时、分开导入（默认必须在前）
import defaultExport, * as name from "module-name"; 
// 默认导出重命名
import defaultExport from "module-name"; 
// 命名导出
import { export } from "module-name"; 
import { foo , bar } from "module-name/path/to/specific/un-exported/file";
// 命名导出重命名
import {
  reallyReallyLongModuleMemberName as shortName,
  anotherLongModuleName as short
} from '/modules/my-module.js'; 
// 命名导出收集
import { export1 , export2 as alias2 , [...] } from "module-name"; 
import defaultExport, { export [ , [...] ] } from "module-name";

// 动态导入默认导出时，必须以default字段重命名
(async () => {
  if (somethingIsTrue) {
    const { default: myDefault, foo, bar } = await import('/modules/my-module.js');
  }
})(); 
import "module-name"; // 运行模块中的全局代码，不导入任何导出
var promise = import("module-name");//这是一个处于第三阶段的提案。
```
# 动态加载
背景：引擎在编译时处理Import语句，并不会分析或执行分支等语句。无法进行模块的异步加载或条件加载。
方案：import(specifier)函数
	1. 同步加载[^3] 
	2. 返回一个 [[Promise]] 

```js
async function renderWidget() {
  const container = document.getElementById('widget');
  if (container !== null) {
    // 等同于
    // import("./widget").then(widget => {
    //   widget.render(container);
    // });
    const widget = await import('./widget.js');
    widget.render(container);
  }
}

renderWidget();
```
# 模块继承

# 向后兼容


[^1]: JS引擎不需要通过require函数才能知道引入的模块，在解析代码时可通过[[AST]]得到依赖关系
[^2]: 意思就是语言原生支持？
[^3]: node的require()方法是异步加载