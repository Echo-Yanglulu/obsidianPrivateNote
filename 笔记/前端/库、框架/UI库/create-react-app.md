包含
	1. create-react-app
	2. react-scripts。包含了webpack配置。如果想自定义构建过程，需要eject或使用第三方库。
		1. react-app-rewired
			1. `yarn add react-app-rewired customize-cra babel-plugin-import -D` 
			2. 将package.json中的脚本修改为`"build": "react-app-rewired build"` 
			3. 新建config-override.js文件
```js
const { override, fixBabelImports, addLessLoader } = require("customize-cra");

module.exports = override(
    fixBabelImports("import", {
        libraryName: 'antd',
        libraryDirectory: "es",
        style: true // true代表使用less，使用css文件时配置为字符串'css'
    }),
    addLessLoader({
        javascriptEnabled: true
    })
);
```

```js
// less配置
const { override, addLessLoader } = require('customize-cra');
module.exports = override(
    addLessLoader({
        lessOptions: {
           javascriptEnabled: true,
           localIdentName: '[local]--[hash:base64:5]'
        }
    }),
);
```

```js
// 设置路径别名
const { override, addWebpackAlias} = require('customize-cra');
const path = require('path');
module.exports = override(    
    addWebpackAlias({      
        ["containers"]: path.resolve(__dirname, "src/containers"),// 如果遇到这些路径，就解析为后面的        
        ["components"]: path.resolve(__dirname, "src/components")   
    })
)


import containers from 'containers';
import components from 'components';
// 等同于
import containers from '"src/containers"';
import components from 'src/components';

```

注释
	1. 引入antd样式文件，需要下载插件：babel-plugin-import。因为直接使用antd组件没有样式，需要单独引入UI库的样式文件


[[customize-cra]] 