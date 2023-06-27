[起步 | Axios 中文文档 | Axios 中文网](https://www.axios-http.cn/docs/intro) 
[axios中文文档|axios中文网 | axios](http://axios-js.com/zh-cn/docs/) 
# 概述
定义：一个基于 [[promise]] 的[[网络请求库]]，作用于node.js 和浏览器中。
	1. 在服务端使用原生[[node|node.js]]的http模块
	2. 在客户端则使用[[网络请求#XHR对象|XMLHttpRequests]] 
特性
	1. 基于[[Promise]] 
	2. isomorphic。即同一套代码可以运行在浏览器和node.js中
		2. 从客户端创建[[网络请求#XHR对象|XMLHttpRequests]] 
		3. 从 node.js 创建[[http]]请求
	3. *拦截*请求和响应
	4. *取消*请求
	5. *转换*请求和响应数据
	6. *自动转换*[[JSON]]数据
	7. 客户端支持防御[[XSRF]] 

# 使用
## 创建实例
axios.create(\[config])
创建一个实例，设置请求的通用配置
```js
const instance = axios.create({
  baseURL: 'https://some-domain.com/api/',
  timeout: 1000,
  headers: {'X-Custom-Header': 'foobar'}
});
```
### 实例方法
指定的配置将与实例的配置合并
request(config)
get(url\[, config])
delete(url\[, config])
head(url\[, config])
options(url\[, config])
post(url\[, data\[, config]])
put(url\[, data\[, config]])
patch(url\[, data\[, config]])
getUri(\[config])
## 发送请求
axios(options)：发起请求，返回[[Promise]] 
axios(url\[, config])
	1. 不传config是默认的get方法
## 仅使用模块上的方法
直接使用方法时，不必配置请求方法method、链接url、负载data。
axios.request(config)
axios.get(url\[, config])
axios.delete(url\[, config])
axios.head(url\[, config])
axios.options(url\[, config])
axios.post(url\[, data\[, config]])
axios.put(url\[, data\[, config]])
axios.patch(url\[, data\[, config]])
# 响应结构

 `status` 来自服务器响应的 [[HTTP状态码]] 
  status: 200,

 `statusText` 来自服务器响应的*HTTP状态信息*
  statusText: 'OK',

 `headers` 是服务器*响应头*
	1.  所有的 header 名称都是小写，而且可以使用方括号语法访问。例如: `response.headers['content-type']`
  headers: {},

 `data` 由服务器提供的*响应*
  data: {},
  
 `config` 是 `axios` *请求的配置信息*
  config: {},

 `request` 是生成此响应的请求
	1. 在node.js中它是最后一个ClientRequest实例 (in redirects)
	2. 在浏览器中则是 XMLHttpRequest 实例
  request: {}

获取
```js
axios.get('/user/12345')
  .then(function (response) {
    console.log(response.data);
    console.log(response.status);
    console.log(response.statusText);
    console.log(response.headers);
    console.log(response.config);
  });
```
# 默认配置
默认配置将作用于每个请求头
## 全局
axios.defaults.baseURL = 'https://api.example.com';
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
## 自定义
// 创建实例时配置默认值
const instance = axios.create({
  baseURL: 'https://api.example.com'
});

// 创建实例后修改默认值
instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;
## 配置的优先级
在lib/defaults.js中找到的库默认值<实例的 defaults 属性<请求的 config 参数
# 拦截器
请求或响应被 then 或 catch 处理前拦截它们
## 添加
use
```js
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response;
  }, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
  });
```
## 移除
eject
```js
const myInterceptor = axios.interceptors.request.use(function () {/*...*/});
axios.interceptors.request.eject(myInterceptor);
```
## 给实例添加拦截器
给*实例*添加拦截器和直接给*从库引入的对象*添加拦截器有什么区别？
```js
const instance = axios.create();
instance.interceptors.request.use(function () {/*...*/});
```
# 发送请求时的配置
  ## [[URL]] 
  url: '/user',
  // `url` 是用于请求的服务器 URL
## baseURL
  // `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
  // 它可以通过设置一个 `baseURL` 便于为 axios 实例的方法传递相对 URL
  baseURL: 'https://some-domain.com/api/',
## method
  // `method` 是创建请求时使用的方法
  method: 'get', // 默认值
## transformRequest
 `transformRequest` 允许在向服务器发送前，**修改请求数据** 
  // 它只能用于 'PUT', 'POST' 和 'PATCH' 这几个请求方法
  // 数组中最后一个函数必须返回一个字符串， 一个Buffer实例，ArrayBuffer，FormData，或 Stream
  // 你可以修改请求头。
  transformRequest: \[function (data, headers) {
    // 对发送的 data 进行任意转换处理
    return data;
  }],
## transformResponse
  // `transformResponse` 在传递给 then/catch 前，允许**修改响应数据** 
  transformResponse: \[function (data) {
    // 对接收的 data 进行任意转换处理

    return data;
  }],
## headers
  // 自定义请求头
  headers: {'X-Requested-With': 'XMLHttpRequest'},
## params
  // `params` 是与请求一起发送的 URL 参数
  // 必须是一个简单对象或 URLSearchParams 对象
  params: {
    ID: 12345
  },
## paramsSerializer
  // `paramsSerializer`是可选方法，主要用于序列化`params`
  // (e.g. https://www.npmjs.com/package/qs, http://api.jquery.com/jquery.param/)
  paramsSerializer: function (params) {
    return Qs.stringify(params, {arrayFormat: 'brackets'})
  },
## data
作为请求体被发送的数据
  // 仅适用 'PUT', 'POST', 'DELETE 和 'PATCH' 请求方法
  // 在没有设置 `transformRequest` 时，则必须是以下类型之一:
  // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
  // - 浏览器专属: FormData, File, Blob
  // - Node 专属: Stream, Buffer
  data: {
    firstName: 'Fred'
  },
  
  // 发送请求体数据的可选语法
  // 请求方式 post
  // 只有 value 会被发送，key 则不会
  data: 'Country=Brasil&City=Belo Horizonte',
## timeout
  // `timeout` 指定请求超时的毫秒数。
  // 如果请求时间超过 `timeout` 的值，则请求会被中断
  timeout: 1000, // 默认值是 `0` (永不超时)
## withCredentials
  // `withCredentials` 表示跨域请求时是否需要使用凭证
  withCredentials: false, // default
## adapter
  // `adapter` 允许自定义处理请求，这使测试更加容易。
  // 返回一个 promise 并提供一个有效的响应 （参见 lib/adapters/README.md）。
  adapter: function (config) {
  },
## auth
  // `auth` HTTP Basic Auth
  auth: {
    username: 'janedoe',
    password: 's00pers3cret'
  },
## responseType
  // `responseType` 表示浏览器将要响应的数据类型
  // 选项包括: 'arraybuffer', 'document', 'json', 'text', 'stream'
  // 浏览器专属：'blob'
  responseType: 'json', // 默认值
## responseEncoding
  // `responseEncoding` 表示用于解码响应的编码 (Node.js 专属)
  // 注意：忽略 `responseType` 的值为 'stream'，或者是客户端请求
  // Note: Ignored for `responseType` of 'stream' or client-side requests
  responseEncoding: 'utf8', // 默认值
## xsrfCookieName
  // `xsrfCookieName` 是 xsrf token 的值，被用作 cookie 的名称
  xsrfCookieName: 'XSRF-TOKEN', // 默认值
## xsrfHeaderName
  // `xsrfHeaderName` 是带有 xsrf token 值的http 请求头名称
  xsrfHeaderName: 'X-XSRF-TOKEN', // 默认值
## onUploadProgress
  // `onUploadProgress` 允许为上传处理进度事件
  // 浏览器专属
  onUploadProgress: function (progressEvent) {
    // 处理原生进度事件
  },
## onDownloadProgress
  // `onDownloadProgress` 允许为下载处理进度事件
  // 浏览器专属
  onDownloadProgress: function (progressEvent) {
    // 处理原生进度事件
  },
## maxContentLength
  // `maxContentLength` 定义了node.js中允许的HTTP响应内容的最大字节数
  maxContentLength: 2000,
## maxBodyLength
  // `maxBodyLength`（仅Node）定义允许的http请求内容的最大字节数
  maxBodyLength: 2000,
## validateStatus
  // `validateStatus` 定义了对于给定的 HTTP状态码是 resolve 还是 reject promise。
  // 如果 `validateStatus` 返回 `true` (或者设置为 `null` 或 `undefined`)，
  // 则promise 将会 resolved，否则是 rejected。
  validateStatus: function (status) {
    return status >= 200 && status < 300; // 默认值
  },
## maxRedirects
  // `maxRedirects` 定义了在node.js中要遵循的最大重定向数。
  // 如果设置为0，则不会进行重定向
  maxRedirects: 5, // 默认值
## socketPath
  // `socketPath` 定义了在node.js中使用的UNIX套接字。
  // e.g. '/var/run/docker.sock' 发送请求到 docker 守护进程。
  // 只能指定 `socketPath` 或 `proxy` 。
  // 若都指定，这使用 `socketPath` 。
  socketPath: null, // default
## httpAgent httpsAgent
  // `httpAgent` and `httpsAgent` define a custom agent to be used when performing http
  // and https requests, respectively, in node.js. This allows options to be added like
  // `keepAlive` that are not enabled by default.
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),
## proxy
  // `proxy` 定义了代理服务器的主机名，端口和协议。
  // 您可以使用常规的`http_proxy` 和 `https_proxy` 环境变量。
  // 使用 `false` 可以禁用代理功能，同时环境变量也会被忽略。
  // `auth`表示应使用HTTP Basic auth连接到代理，并且提供凭据。
  // 这将设置一个 `Proxy-Authorization` 请求头，它会覆盖 `headers` 中已存在的自定义 `Proxy-Authorization` 请求头。
  // 如果代理服务器使用 HTTPS，则必须设置 protocol 为`https`
  proxy: {
    protocol: 'https',
    host: '127.0.0.1',
    port: 9000,
    auth: {
      username: 'mikeymike',
      password: 'rapunz3l'
    }
  },
## cancelToken
  // see https://axios-http.com/zh/docs/cancellation
  cancelToken: new CancelToken(function (cancel) {
  }),
## decompress
  // `decompress` indicates whether or not the response body should be decompressed 
  // automatically. If set to `true` will also remove the 'content-encoding' header 
  // from the responses objects of all decompressed responses
  // - Node only (XHR cannot turn off decompression)
  decompress: true // 默认值
