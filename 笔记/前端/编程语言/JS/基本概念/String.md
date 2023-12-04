# 概述
JavaScript字符串由16位码元（code unit）组成
	字符串的length属性表示字符串包含多少16位码元
1. 
2. 内涵：==0或多个16位Unicode字符序列==。
3. 表示：
	1. 形式[^3] 
		1. 单引
		2. 双引
		3. 反引：模板字面量
			1. 保留换行字符，可**跨行定义**字符串（通过\\n后添加字符串，结果等同于手动敲击回车再添加字符）
			2. 定义模板时特别有用
				1. 所有插入值都会调用toString()
				2. 可调用方法
	2. 内容：
		1. **打印字符** 
		2. [[非打印字符]]/其他用途字符
			1. 可出现在字符串的任意位置
			2. 可作为单个字符被解释[^1]。
4. 特点
	1. **不可变**[^2]：先删除，再新增
	2. 拼接过程：与修改某个字符的过程相反。先分配内存并拼成新字符串，再删除原有的多个字符串
	3. **标签函数**：自定义插值行为

```javascript 标签函数
let a = 6;
let b = 9;

function simpleTag(strings, aValExpression, bValExpression, sumExpression) {
  console.log(strings);
  console.log(aValExpression);
  console.log(bValExpression);
  console.log(sumExpression);
	// 参数数量不定，所以使用剩余参数收集
  return 'foobar';
}

let untaggedResult = `${ a } + ${ b } = ${ a + b }`;
let taggedResult = simpleTag`${ a } + ${ b } = ${ a + b }`;
// ["", " + ", " = ", ""]
// 6
// 9
// 15

console.log(untaggedResult);   // "6 + 9 = 15"
console.log(taggedResult);     // "foobar"
```
# 属性
调用length属性会返回16位Unicode字符的个数
# 方法【**PB拼迭，删取转含**】
## 拼接
1. repeat()。接收一个整数参数，表示要将字符串复制多少次
2. padStart()和padEnd()
	1. 第一个参数是*长度*，第二个参数是可选的*填充字符串*，默认为空格（U+0020）
3. concat()。一个或多个字符串拼接成一个新字符串
4. 多数情况下，使用加号拼接多个字符串更方便
## 删除
1. trim()。返回的是字符串的副本
	1. 手写：`str.replace(/^\s+/, '').replace(/\s+$/, '');` 
## 提取
子字符串*开始位置*，第二个参数表示
	1. slice()。提取结束*位置*（即该位置之前的字符会被提取出来）
		1. 所有负值参数：都加上字符串长度
	2. substring()。提取结束*位置*（即该位置之前的字符会被提取出来）
		1. 所有负参数值：都转换为0
	3. substr()。子字符串*数量* 
		1. 第一个负参数：加上字符串长度，将第二个负参数值转换为0
## 转换
1. toUpperCase()：所有字符大写
2. toLowerCase()
3. toLocaleUpperCase()
4. toLocaleLowerCase()
	1. 基于特定地区实现。少数语言中（如土耳其语），**Unicode大小写转换**需应用特殊规则，要使用地区特定的方法才能实现正确转换
	2. 通常，如果不知道代码涉及什么语言，则最好使用地区特定的转换方法
## 包含
返回布尔？
1. startsWith() 
	1. 第二个参数，表示开始搜索的位置
2. endsWith()
	1. 第二个参数，表示应该当作字符串末尾的位置
3. includes()
	1. 第二个参数，表示开始搜索的位置
## 匹配
1. match()。本质上跟[[RegExp]]对象的exec()方法相同
2. search()。
	1. 接收正则表达式字符串或RegExp对象
	2. 返回模式第一个匹配的位置索引，如果没找到则返回-1
3. replace()
	1. 接收
		1. 第一个参数
			1. RegExp对象
			2. 或一个字符串
		2. 第二个参数
			1. 一个字符串
			2. 或一个函数
				1. 只有一个匹配项时，这个函数会收到3个参数：与整个模式*匹配的字符串*、匹配项在字符串中的*开始位置*，以及*整个字符串*
				2. 有多个捕获组的情况下，每个匹配捕获组的字符串也会作为参数传给这个函数，但*最后两个参数不变* 
				3. 返回一个字符串，表示应该把匹配项替换成什么
4. split() 。根据传入的分隔符将字符串*拆分*成数组
	1. 分隔符：[[String]]或[[RegExp]] 
	2. 目标[[Array]]长度。限制长度后会删除多余元素
## 比较
localeCompare()：方法比较两个字符串，返回如下3个值中的一个
	1. 如果按照字母表顺序，*字符串应该排在字符串参数前头*，则返回负值
	2. 如果字符串与字符串参数相等，则返回0
	3. 如果按照字母表顺序，字符串应该排在字符串参数后头，则返回正值。【字符串在后，返回正值】
```js
let stringValue = "yellow";
console.log(stringValue.localeCompare("brick"));  // 1
console.log(stringValue.localeCompare("yellow")); // 0
console.log(stringValue.localeCompare("zoo"));    // -1 "zoo"在"yellow"后面，因此localeCompare()返回-1
```
## 迭代
字符串的原型上暴露了一个@@iterator方法，表示可以迭代字符串的每个字符
	1. 在for-of循环中可以*通过这个迭代器按序访问每个字符*
	2. 有了这个迭代器之后，字符串就可以通过*解构操作符*来解构了
10. charAt()：方法返回给定索引位置的字符，由传给方法的整数参数指定
11. charCodeAt()：查看指定码元的字符编码
	1. 查看指定索引位置的码元值，索引以整数指定
12. fromCharCode()：根据给定的UTF-16码元创建字符串中的字符
	1. 接受任意多个数值，并返回将所有数值对应的字符拼接起来的字符串
## 正则相关【查换组】
1. search([[RegExp]]）返回第一个匹配项的*位置*
2. match([[RegExp]]) 返回一个数组，成员是所有匹配的子字符串
3. replace()
	1. 匹配
		1. [[String]] 文本![[Pasted image 20230728172217.png]] 
			1. $&：匹配的子字符串。
			2. $\`：匹配结果前面的文本。
			3. $’：匹配结果后面的文本。
			4. $n：匹配成功的第 n 组内容，n 是从1开始的自然数。
			5. \$\$：指代美元符号$
		2. [[RegExp]] 文本模式
	2. 替换
		1. [[String]] 
		2. [[Function]] 
4. split(分隔符，数组的最大长度) 按照给定规则进行字符串分割，返回一个数组，包含分割后的各个成员
	1. 分隔符
		1. 文本
		2. 文本模式
# 转换
转换为字符串类型像转换为布尔类型一样常用。

toString()
	1. 返回当前值的字符串等价物
	2. 两假值没有，布尔、数值、字符串、对象都有。
		1. 两假值、布尔值调用：返回引号包裹后的两假值/布尔值（不转换值，只转换类型）
		2. 数值调用：默认返回二进制。传数值返回对应进制的字符串表示。（转换类型与进制）
		3. 字符串调用：只是返回副本（值与类型都不转换）。
		4. 对象调用：调用内部的toString()方法。没有则报错
# 其他
获取原始字符串，而非转换字符串
```javascript
function printRaw(strings) {
  console.log('Actual characters:');
  for (const string of strings) {
    console.log(string);
  }

  console.log('Escaped characters;');
  for (const rawString of strings.raw) {
    console.log(rawString);
  }
}

printRaw`\u00A9${ 'and' }\n`;
// Actual characters:
// ©
//（换行符）
// Escaped characters:
// \u00A9
// \n
```

[^1]: let text = "This is the letter sigma: \u03a3.";长度为28，因为\u03a3是一个16位字符
[^2]: 一旦创建，值不能改变。没有修改，只有新增且删除。所以有的浏览器拼接字符串非常慢。
[^3]: 几种表示相同，但开头与结尾表示必须相同