属性：数学中的一些特殊值
	1. Math.E：自然对数的基数e的值
	2. Math.LN10：10为底的自然对数
	3. Math.LN2：2为底的自然对数
	4. Math.LOG2E：以2为底e的对数
	5. Math.LOG10E：以10为底e的对数
	6. Math.PI：π的值
	7. Math.SQRT1_2：1/2的平方根
	8. Math.SQRT2：2的平方根

数学计算的方法
1. 最值
	1. min()和max()方法用于确定一组数值中的最小值和最大值。任意多个参数
	2. 可以避免使用额外的循环和if语句来确定一组数值的最大最小值。
2. 舍入
	1. 小数值舍入为整数
		1. Math.ceil()
		2. Math.floor()
		3. Math.round()
		4. Math.fround()：数值最接近的单精度（32位）浮点值表示【ES使用双精度浮点值表示整数和浮点数】
3. 随机：Math.random()[^1] 
	1. 一组整数中随机选择一个
		1. number = Math.floor(Math.random() * **total_number_of_choices** + **first_possible_value**)
		2. 1~10范围内随机选择一个数：let num = Math.floor(Math.random() * 10 + 1);[^2] 
		3. 2~10范围：let num = Math.floor(Math.random() * 9 + 2);[^3] 
4. 其他[^4] 
	1. Math.abs(x)	返回x的绝对值
	2. Math.exp(x)	返回Math.E的x次幂
	3. Math.expm1(x)	等于Math.exp(x) - 1
	4. Math.log(x)	返回x的自然对数
	5. Math.log1p(x)	等于1 + Math.log(x)
	6. Math.pow(x, power)	返回x的power次幂
	7. Math.hypot(...nums)	返回nums中每个数平方和的平方根
	8. Math.clz32(x)	返回32位整数x的前置零的数量
	9. Math.sign(x)	返回表示x符号的1、0、-0或-1
	10. Math.trunc(x)	返回x的<u>整数部分</u>，删除所有小数
	11. Math.sqrt(x)	返回x的<u>平方根</u>
	12. Math.cbrt(x)	返回x的立方根
	13. Math.acos(x)	返回x的反余弦
	14. Math.acosh(x)	返回x的反双曲余弦
	15. Math.asin(x)	返回x的反正弦
	16. Math.asinh(x)	返回x的反双曲正弦
	17. Math.atan(x)	返回x的反正切
	18. Math.atanh(x)	返回x的反双曲正切
	19. Math.atan2(y, x)	返回y/x的反正切
	20. Math.cos(x)	返回x的余弦
	21. Math.sin(x)	返回x的正弦
	22. Math.tan(x)	返回x的正切
# 应用
```js
function selectFrom(lowerValue, upperValue) {
  let choices = upperValue - lowerValue + 1;
  return Math.floor(Math.random() * choices + lowerValue);
}

let num = selectFrom(2,10);
console.log(num);  // 2~10范围内的值，其中包含2和10
```
如果是为了加密而需要生成随机数（传给生成器的输入需要较高的不确定性），那么建议使用[[window]].crypto.getRandomValues()


[^1]: 0~1范围内的随机数，其中包含0但不包含1
[^2]: 如果不+1，是0-9
[^3]: 可选总数（total_number_of_choices）是9，最小可能的值（first_possible_value）是2
[^4]: 即便这些方法都是由ECMA-262定义的，对正弦、余弦、正切等计算的实现仍然取决于浏览器，因为计算这些值的方式有很多种。结果，这些方法的精度可能因实现而异。