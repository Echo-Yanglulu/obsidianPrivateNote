---
时间: 20220827
---
输入代码，产出[[AST]] 

```json
{
	"parser": "esprima",
	"parserOption": {
	}
}
```
parser: 使用哪种解析器(一般不需指定)
	1. Espree
	2. Esprima 
	3. Babel-ESLint
	4. @typescript-eslint/parser（需要规范TS代码时）
parserOption :配置使用的解析器（修改解析代码的行为）