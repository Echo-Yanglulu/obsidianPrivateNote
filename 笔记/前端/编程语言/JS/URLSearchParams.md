```JS
// 获取
const params = new URLSearchParams(location.search)
const name = params.get('name')
const age = params.get('age')
// 新增
const params = new URLSearchParams();
params.append('param1', 'value1');
params.append('param2', 'value2');
axios.post('/foo', params);
```

