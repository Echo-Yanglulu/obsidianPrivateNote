# 概述
定义：Date类型将日期保存为**自协调世界时**（UTC，Universal Time Coordinated）时间1970年1月1日午夜（零时）至今所经过的*毫秒数*。
	1. 使用这种存储格式，Date类型可以精确表示1970年1月1日之前及之后*285616*年的日期
背景
	1. 不同的浏览器对Date类型的实现有很多问题
# 创建
使用new操作符来调用Date构造函数
1. 不传参：创建的对象保存的是当前日期和时间
2. *日期字符串*。后台调用Date.parse()
3. *毫秒表示*：基于其他日期和时间创建日期对象
	1. ECMAScript为此提供了两个辅助方法：Date.parse()和Date.UTC()
## Date.parse()
接收一个*表示日期的字符串参数*，尝试将这个字符串转换为表示该日期的毫秒数
1. 5/23/2019。1970/12/12
2. May 23, 2019。May/23/2003
3. 周几月名日年时:分:秒时区。如"Tue May 23 2019 00:00:00 GMT-0700"
4. ISO 8601扩展格式“YYYY-MM-DDTHH:mm:ss.sssZ”
5. 传入字符串并不表示日期，则返回NaN
## Date.UTC()
# 方法
## 转换
1. toLocaleString()。返回与浏览器运行的*本地环境*一致的日期和时间
	1. 包含针对时间的AM（上午）或PM（下午），但不包含时区信息（具体格式可能因浏览器而不同）
2. toString()。返回*带时区*信息的日期和时间，而时间也是以24小时制（0~23）表示
	1. 
3. valueOf()。返回日期对象的*毫秒*表示
	1. 操作符（如小于号和大于号）可以直接使用它返回的值。直接比较日期对象

这些差异意味着**toLocaleString()和toString()可能只对调试有用，不能用于显示** 
	1. 现代浏览器在前两个方法的输出上已经趋于一致。
	2. 在比较老的浏览器上，每个方法返回的结果可能在每个浏览器上都是不同的。
## 格式化
1. toDateString()显示日期中的*周几、月、日、年*（格式特定于实现）；
2. toTimeString()显示日期中的*时、分、秒和时区*（格式特定于实现）；
3. toUTCString()显示完整的*UTC日期*（格式特定于实现）。
4. toLocaleDateString()显示日期中的周几、月、日、年（格式特定于实现和地区）；
5. toLocaleTimeString()显示日期中的时、分、秒（格式特定于实现和地区）；

## 读取
UTC日期：没有时区偏移（将日期转换为GMT）时的日期

| 方法                             | 含义                                                                                                  |
| -------------------------------- | ----------------------------------------------------------------------------------------------------- |
| getTime()                        | 返回日期的毫秒表示；与valueOf()相同                                                                   |
| setTime(milliseconds)            | 设置日期的毫秒表示，从而修改整个日期                                                                  |
| getFullYear()                    | 返回4位数年（即2019而不是19）                                                                         |
| getUTCFullYear()                 | 返回UTC日期的4位数年                                                                                  |
| setFullYear(year)                | 设置日期的年（year必须是4位数）                                                                       |
| setUTCFullYear(year)             | 设置UTC日期的年（year必须是4位数）                                                                    |
| getMonth()                       | 返回日期的月（0表示1月，11表示12月）                                                                  |
| getUTCMonth()                    | 返回UTC日期的月（0表示1月，11表示12月）                                                               |
| setMonth(month)                  | 设置日期的月（month为大于0的数值，大于11加年）                                                        |
| setUTCMonth(month)               | 设置UTC日期的月（month为大于0的数值，大于11加年）                                                     |
| getDate()                        | 返回日期中的日（1~31）                                                                                |
| getUTCDate()                     | 返回UTC日期中的日（1~31）                                                                             |
| setDate(date)                    | 设置日期中的日（如果date大于该月天数，则加月）                                                        |
| setUTCDate(date)                 | 设置UTC日期中的日（如果date大于该月天数，则加月）                                                     |
| getDay()                         | 返回日期中表示周几的数值（0表示周日，6表示周六）                                                      |
| getUTCDay()                      | 返回UTC日期中表示周几的数值（0表示周日，6表示周六）                                                   |
| getHours()                       | 返回日期中的时（0~23）                                                                                |
| getUTCHours()                    | 返回UTC日期中的时（0~23）                                                                             |
| setHours(hours)                  | 设置日期中的时（如果hours大于23，则加日）                                                             |
| setUTCHours(hours)               | 设置UTC日期中的时（如果hours大于23，则加日）                                                          |
| getMinutes()                     | 返回日期中的分（0~59）                                                                                |
| getUTCMinutes()                  | 返回UTC日期中的分（0~59）                                                                             |
| setMinutes(minutes)              | 设置日期中的分（如果minutes大于59，则加时）                                                           |
| setUTCMinutes(minutes)           | 设置UTC日期中的分（如果minutes大于59，则加时）                                                        |
| getSeconds()                     | 返回日期中的秒（0~59）                                                                                |
| getUTCSeconds()                  | 返回UTC日期中的秒（0~59）                                                                             |
| setSeconds(seconds)              | 设置日期中的秒（如果seconds大于59，则加分）                                                           |
| setUTCSeconds(seconds)           | 设置UTC日期中的秒（如果seconds大于59，则加分）                                                        |
| getMilliseconds()                | 返回日期中的毫秒                                                                                      |
| getUTCMilliseconds()             | 返回UTC日期中的毫秒                                                                                   |
| setMilliseconds(milliseconds)    | 设置日期中的毫秒                                                                                      |
| setUTCMilliseconds(milliseconds) | 设置UTC日期中的毫秒                                                                                   |
| getTimezoneOffset()              | 返回以分钟计的UTC与本地时区的偏移量（如美国EST即“东部标准时间”返回300，进入夏令时的地区可能有所差异） |
