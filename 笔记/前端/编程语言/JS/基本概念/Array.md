# 概述
定义
	1. 使用==整数==作为元素索引的[[类列表对象]]，一种[[Object]]。
		1. 使用<u>字符串</u>作为索引的叫[[关联数组]]。
		2. 通过方括号或点语法，通过==非整数==索引读写数组时，读写的实际上是**数组对象**的**属性集合**[^1]上的变量。
	2. 值的有序集合。值叫做“元素”，元素的位置是[[Number]]，叫做“索引”
原型中提供了操作方法
## 特性
1. 数组
	1. 动态：数组的长度，元素的[[数据类型]]不固定。
	2. 稀疏：数据在内存中可以不连续：JS数组不一定是密集型的。
2. 值
	1. 无类型限制：元素可以是任何类型
3. 索引
	1. 基于0，使用32位数值。最大可能索引：2\^32 -1 
4. 数组空位
	1. 使用连续的逗号创建空位。是存在的元素，值为undefined
如果以上特性不适合使用场景，可使用[[TypedArray]] 
# 创建
## 字面量
## [[构造函数]] 
new Array()
## 静态方法
from()：将*类数组结构*转换为*数组实例* 
of()：将一组参数转换为数组实例
# 访问
## 方式
### []
不能arr.2，因为[[Number]]类型开头的键必须使用`[]`访问
执行arr[2]时，[[JS解释器]]会调用toString方法隐式转换成字符串
	1. arr['2']与arr['02']可能是不同位置的元素【？？？不是肯定。】
## 结果
访问的索引不存在：不报错，返回undefined
	1. 无法分辨本来就是undefined，还是索引不存在
# [[属性]]
## [[静态属性]]

## 实例属性
1. length
	1. 返回一个数组实例中元素的个数
	2. 永远大于最大的下标
	3. [[JS解释器]]会动态修改length的值
# 方法
## 静态方法
Array.from
Array.of
Array.isArray()：传递的值是否是一个 [[Array]] 
## 实例方法【增删，填充，修改，转换，查找，遍历】
### 增删【5个】
1. push：尾增，返回增加后长度
2. pop：尾删，返回删除元素
3. unshift：头增，返回增加后长度
4. shift：头删，返回删除元素
5. splice(索引，删除个数，增加的元素)：
	1. 从某个索引开始，同时增删元素
	2. 返回值：被删除元素组成的数组
6. concat。合并：一个数组后追加：数组/值，返回一个新数组
		1. 如果是数组，先打平再推入【**合并两个数组的元素**】
		2. 如果是其它值，直接推入【相当于**将值 push 到数组最后**】
### 填充【2个】
1. fill(任意值，起点，终点（不含）)：**使用数组外的值**
	1.  ![[Pasted image 20230722203556.png]] 
7. copyWithin(a, b, c)：**使用数组内的值**
	1. ![[Pasted image 20230722203907.png]] 
	2. 1参数：使用\[0, a)元素，替换\[a, Infinity)元素【后面替换前面】
	3. 2参数：使用\[b, Infinity)元素，替换\[a, b]元素【后面替换前面】
	4. 3参数：使用\[b, c)元素，替换\[a, Infinity)元素【部分后面替换前面】
### 修改【4个】
1. 打平
	1. flat：根据深度，把元素拼接到新数组
	2. flatMap：等价于先map，再flat(1)。但更高效
		1. 场景：map时某个元素需要返回数组。
2. 排序
	1. sort。升序return a-b
	2. reverse
### 转换【5个】
1. 其他转数组
	1. Array.from：[[类数组对象]] 
	2. Array.of：参数列表
2. 数组转其他
	1. join（自定义连接符号）
	2. toString（默认以逗号为连接符号）
	3. toLocaleString
### 查找【10个】
1. 根据条件（传函数）
	1. 一个
		1. find：*符合条件*的第一个**值**。`const res = array.find(element => element > 10); // 12` 
		2. findLast：反向迭代数组。*符合条件*的第一个**值**。
		3. findIndex：*符合条件的值*第一次出现的**索引**。
		4. findLastIndex：反向迭代数组。*符合条件的值*第一次出现的**索引**。
	2. 多个
		1. some：部分值符合条件
		2. every：全部值符合条件
		3. filter：获取符合条件的值
2. 根据具体值（传值）
	1. includes(目标值, 查找起点)：某个值**存在**【严格相等】
		1. fromIndex大于等于数组长度：返回false
		2. fromIndex为负值：追加数组长度，作为起点
	2. indexOf(目标值，查找起点)：某个值第一次出现的**索引** 【严格相等】
	3. lastIndexOf()：【严格相等】
	4. at()
3. 根据索引
	1. slice。浅拷贝部分元素，返回新数组
### 遍历【6个】
1. map：对每个元素进行批处理
2. forEach
3. reduce（当前元素的处理依赖于之前元素）
	1. [25个你不得不知道的数组reduce高级用法 - 掘金](https://juejin.cn/post/6844904063729926152#heading-10) 
	2. 指定初始值
	3. 每次迭代返回值作为下次迭代初始值【上次迭代的结论可用于下次迭代】
		1. 统计，比较，运算
4. reduceRight
5. for/of, for 循环
6. entries：返回一个新的数组[[迭代器]]对象，其中包含数组中每个索引的键
7. values
```js
// 应用场景：每个元素的操作，与前面元素有关
// 1. 统计：每个/某个元素出现的次数；
let names = ['小猪课堂', '张三', '李四', '王五', '小猪课堂']
let countedNames = names.reduce(function (allNames, name) {
  // 判断当前数组元素是否出现过
  if (name in allNames) {
    allNames[name]++
  } else {
    allNames[name] = 1
  }
  return allNames
}, {})
console.log(countedNames); // {小猪课堂: 2, 张三: 1, 李四: 1, 王五: 1}
// 2. 把二维数组打平，成为一维
// 3. 求和，字符串累加，数值累乘
```

### 分类
1. 哪些会修改原数组？增删与排序，共7个
	1. push，pop，unshift，shift，splice，sort，reverse
# 相关
## 去重
```js
// 1. 使用Set
const arr = [1,2,3,1,2,2]
[...new Set(arr)]和 Array.from(new Set(arr))
//  [1, 2, 3]

// 2. filter
const arr = [1,2,3,1,2,2]
const res = arr.filter((item, index) => {
  return index === arr.indexOf(item);
});

// 3. forEach
const a = []
arr.forEach(function(item, index) {
  if(!a.includes(item)){
    a.push(item)
  }
})
// 4. reduce
const arr = [1,2,3,1,2,2]
const a = []
arr.reduce((acc, val, indexedDB) => {
  if(!acc.includes(val)){
    acc.push(val)
  }
  return acc
}, a)
```



[^1]: 数组对象上一组属性的集合