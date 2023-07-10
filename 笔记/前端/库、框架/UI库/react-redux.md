创建 store
```js
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import reducer from './reducers'

let store = createStore(reducer)
export default function (){
	return <Provider store={store}>
	<App />
	</Provider>
}
```
在需要使用 store 的组件中 
```js

```