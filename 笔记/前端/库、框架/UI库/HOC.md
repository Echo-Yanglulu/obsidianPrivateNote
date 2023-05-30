```js
import React, { Component } from "react";

class Avatar extends Component {
  render() {
    return <div>{this.props.name}</div>;
  }
}

function HocAvatar(Component) {
  return () => <Component name="云课堂" />;
}

export default HocAvatar(Avatar);
```

接收组件，增加属性后返回？