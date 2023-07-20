# 属性
数学中的一些**特殊值**
	1. Math.E：自然对数的基数e的值
	2. Math.PI：π的值
	4. Math.LN2：2为底的自然*对数* 
	3. Math.LN10：10为底的自然对数
	4. Math.LOG2E：以2为底e的对数
	5. Math.LOG10E：以10为底e的对数
	6. Math.SQRT2：2的*平方根* 
	7. Math.SQRT1_2：1/2的平方根
# 方法
1. 最值
	1. min()和max()方法用于确定一组数值中的最小值和最大值。任意多个参数
	2. 可以避免使用额外的循环和if语句来确定一组数值的最大最小值。
2. 舍入
	1. 浮点数舍入为整数
		1. Math.ceil()
		2. Math.floor()
		3. Math.round()
	2. Math.trunc(x)	返回x的**整数部分**，删除所有小数  
		1. `Math.trunc(-5.05) // -5` 如果是floor，结果是-6
3. 随机：Math.random()[^1] 
	1. 一组整数中随机选择一个
		1. number = Math.floor(Math.random() * **total_number_of_choices** + **first_possible_value**)
		2. 1~10范围内随机选择一个数：let num = Math.floor(Math.random() * 10 + 1);[^2] 
		3. 2~10范围：let num = Math.floor(Math.random() * 9 + 2);[^3] 
	2. 如果是为了加密而需要生成随机数（传给生成器的输入需要较高的不确定性），那么建议使用[[window]].crypto.getRandomValues()
4. 计算
	1. Math.sqrt(x)	返回x的**平方根** 
	2. Math.cbrt(x)	返回x的**立方根** 
	3. Math.tan(x)	       返回x的**正切**
	4. Math.atan(x)	返回x的**反正切**
	5. Math.atanh(x)	返回x的**反双曲正切** 
	6. Math.sin(x)	       返回x的**正弦**
	7. Math.asin(x)	返回x的**反正弦** 
	8. Math.asinh(x)	返回x的**反双曲正弦**
	9. Math.cos(x)	返回x的**余弦**
	10. Math.acos(x)	返回x的**反余弦** 
	11. Math.acosh(x)	返回x的**反双曲余弦**
	12. Math.atan2(y, x)	返回y/x的**反正切**
	13. Math.log(x)	返回x的**自然对数** 
	14. Math.exp(x)	返回Math.E的**x次幂** 
	15. Math.abs(x)	返回x的**绝对值** 
	16. Math.expm1(x)	等于Math.exp(x) - 1
	17. Math.log1p(x)	等于1 + Math.log(x)
	18. Math.pow(x, power)	返回**x的power次幂** 
	19. Math.hypot(...nums)	返回nums中**每个数平方和的平方根** 
5. 其他[^4] 
	1. Math.sign(x)	返回表示x**符号**的1、-1、0、-0、NaN：正数，负数，正零，负零，NaN
	2. Math.fround()：数值最接近的单精度（32位）浮点值表示【ES使用[[双精度浮点值]]表示整数和浮点数】
			1. `Math.fround(-5.05) // -5.050000190734863` 
	3. Math.clz32(x)	返回32位整数x的**前置零**的数量
# 应用
```js
function selectFrom(lowerValue, upperValue) {
  let choices = upperValue - lowerValue + 1;
  return Math.floor(Math.random() * choices + lowerValue);
}

let num = selectFrom(2,10);
console.log(num);  // 2~10范围内的值，其中包含2和10
```


[^1]: 0~1范围内的随机数，其中包含0但不包含1
[^2]: 如果不+1，是0-9
[^3]: 可选总数（total_number_of_choices）是9，最小可能的值（first_possible_value）是2
[^4]: 即便这些方法都是由ECMA-262定义的，对正弦、余弦、正切等计算的实现仍然取决于浏览器，因为计算这些值的方式有很多种。结果，这些方法的精度可能因实现而异。