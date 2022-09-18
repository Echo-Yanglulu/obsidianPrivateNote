1. 内涵：==0或多个16位Unicode字符序列==。
2. 表示：
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
3. 特点
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
调用length属性会返回16 长度
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