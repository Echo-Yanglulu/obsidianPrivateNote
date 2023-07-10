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
// 创建、提供、reducer
```
在需要使用 store 的组件中 
```js
import { connect } from 'react-redux'
import { addTodo } from '../actions'
```