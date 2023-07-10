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

// 取出props中的dispatch
let AddTodo = ({ dispatch }) => {
	// 在事件处理函数触发对应action
	handleSubmit = (e) => {
		dispatch(addTodo(e.target.value))
	}
	reuturn <div></div>
}

// 将dispatch方法注入组件
AddTodo = connect()(AddTodo)
```