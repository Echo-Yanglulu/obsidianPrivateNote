功能：将[[redux]]中的 store 数据缓存到浏览器的 localStorage 中

只需修改 store 的生成过程
```js
import {createStore} from 'redux' 
import reducers from '../reducers/index' 
// 关键处理：reducer与store
import {persistStore, persistReducer} from 'redux-persist'; 
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'; const persistConfig = { 
	key: 'root', 
	storage: storage, 
	stateReconciler: autoMergeLevel2 // 查看 'Merge Process' 部分的具体情况 
}; 
const myPersistReducer = persistReducer(persistConfig, reducers) 
const store = createStore(myPersistReducer) 
export const persistor = persistStore(store) 
export default store
```

index.js 中将 PersistGate 标签作为页面内容的上级标签
```js
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux'
import store from './redux/store/store'
import {persistor} from './redux/store/store'
import {PersistGate} from 'redux-persist/lib/integration/react';

ReactDOM.render(<Provider store={store}>
	<PersistGate loading={null} persistor={persistor}>
		{/*网页内容*/}
	</PersistGate>
</Provider>, 
document.getElementById('root')
);
```