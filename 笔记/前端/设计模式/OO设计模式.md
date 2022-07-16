## 创建型
>创建对象（封装**创建**对象的变化）
>1.  封装良好与否的标准
	1.  变量在外部不可见
	2.  通过调用接口使用
	3.  存在扩展接口
>2.  为什么要封装一个对象
	4.  避免变量污染
	5.  整体能作为一个模块使用（复用）
	6.  避免修改（开闭原则）
### 单例模式（*）

定义：确保某个类只能有一个实例，并提供全局访问

如：线程池，全局缓存，浏览器的window对象，登录弹窗，全局提醒，唯一的iframe

思路：用一个变量判断当前类是否已经实例化过，如果没有实例化过，实例化并修改变量。如果已经实例化过直接返回该实例。

分类：
	1.  不透明单例
```javascript
// "不透明"单例模式：该类的使用者必须知道这是一个单例类（只能创建一个实例的类）
class Singleton {
  constructor(name) {
    this.name = name
    this.instance = null
  }
  static getInstance(name) {
    return this.instance || (this.instance = new Singleton(name))
  }
}

var sin1 = Singleton.getInstance('name1')
var sin2 = Singleton.getInstance('name2')
console.log(sin1, sin2, sin1 === sin2)
```
 2.  透明单例
 3.  代理单例
 4.  惰性单例

场景：
	1.  给项目写一个全局的数据存储对象
	2.  vue-router（路由）必须保证全局只有一个（避免重复注册），否则会错乱
	3.  多次点击登陆时，只弹出一次成功/失败的提示

### 工厂模式

>定义：某个（简单）对象需要经常创建。封装实例的创建过程，解放new Class()【vue,react都在用】

==任何行为都可以单独封装到一个对象==中。实现对行为/操作的封装，因为行为必然需要一个对象作为施展的主体。

场景：
	1.  table组件中columns属性，数组中对象大多相似。
	2.  项目中有一部分内容（UI，逻辑，组件）经常被重复用到

```javascript
//弹窗
function infoPop(){

}
function confirmPop(){

}
function cancelPop(){

}

function pop(type,content,color){
	if(this instanceof pop){
 		var s=new this[type](content,color);
 		return s;
	}else{
		return new pop(type,content,color);
	}
	
	/*if(this instanceof pop){
	  return pop(type,content,color)
	}else{
            
	}
	function infoPop(){

	}
	function confirmPop(){

	}
	function cancelPop(){

	}	

	switch(type) {
	  case 'infoPop':
	  return new infoPop(content,color);
	  case 'confirmPop':
	  return new confirmPop(content,color);
	  case 'cancelPop':
	  return new cancelPop(content,color);
	}*/
}
pop.prototype.infoPop=function(){
  console.log('infoPop');
}
pop.prototype.confirmPop=function(){
	
}
pop.prototype.cancelPop=function(){
	
}

//pop('infoPop','hello','red');
var data=[
  {
  	type:'infoPop',
  	content:'hello',
  	color:'red'
  },
  {
  	type:'infoPop',
  	content:'good good study',
  	color:'red'
  },  
  {
  	type:'confirmPop',
  	content:'good good study',
  	color:'green'
  },    
];
data.forEach((item)=>{
   console.log( pop(item.type,item.content,item.color));
})
data.forEach((item)=>{
   console.log(new pop(item.type,item.content,item.color));
})
```
### 建造者模式
>定义：组合出一个复杂对象（参数较多，不需要大量产出）。把一个复杂类分为多个子类，最后组合在一起，只暴露最终组合得到的类

场景：
	1.  编写一个编辑器插件
		1.  组成
			1.  用于初始化的类
			2.  用于控制字体的类
			3.  用于状态管理的类
			4.  ...
		2.  为组成类添加方法
	2.  Vue类的初始化

```javascript
//定义最终类
function Editor(){

}
//html初始模块
function initHtml(domStyle){
  this.template='<div style={{editorStyle}}><div></div><div><textarea style={{areaSyle}}/></div></div>';

}
initHtml.prototype.initStyle=function(){

}
initHtml.prototype.renderDom=function(){

}
//字体颜色,大小控制
function fontControll(){
  
};
fontControll.prototype.changeColor=function(){

}
fontControll.prototype.changeFontsize=function(){

}
//回滚
function stateControll(){

}
stateControll.prototype.saveState=function(){

}
stateControll.prototype.stateBack=function(){

}
stateControll.prototype.stateGo=function(){

}
window.Editor=Editor;
  function Vue (options) {
    if (!(this instanceof Vue)
    ) {
      warn('Vue is a constructor and should be called with the `new` keyword');
    }
    this._init(options);
  }

  initMixin(Vue);
  stateMixin(Vue);
  eventsMixin(Vue);
  lifecycleMixin(Vue);
  renderMixin(Vue);

  export function install (_Vue) {
  if (Vue && _Vue === Vue) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      )
    }
    return
  }
  Vue = _Vue
  applyMixin(Vue)
}
```
### 享元模式
>定义：大量相似的对象

场景：
	1.  文件上传功能，可上传多个文件
	2.  JQ的extends方法需要根据参数数量不同进行不同操作

```javascript
//文件上传
function uploader(fileType,file){
	 this.fileType=fileType;
    this.file=file;
}
uploader.prototype.init=function(){
  //初始化文件上传的html
}
uploader.prototype.delete=function(){
  //删除掉该html
}
uploader.prototype.uploading=function(){
  //上传
}
var fileob1,fileob2,fileob3,fileob4
var data=[
  {
  	type:'img',
  	file:fileob1
  },
  {
  	type:'txt',
  	file:fileob2
  },
  {
  	type:'img',
  	file:fileob3
  },
  {
  	type:'word',
  	file:fileob4
  },      
]
for(var i=0;i<data.length;i++){
	new uploader(data[i].type,data[i].file);
};

//fileType,file
function uploader(){

}
uploader.prototype.init=function(){
  //初始化文件上传的html
}
uploader.prototype.delete=function(){
  //删除掉该html
}
uploader.prototype.uploading=function(filetype,file){

}
var uploader=new uploader();
for(var i=0;i<data.length;i++){
	uploader.uploading(data[i].type,data[i].file);
}


//extends
var jQuery={};
jQuery.fn={};
jQuery.extend = jQuery.fn.extend = function() {
 /* if(arguments.length==1){
     for(var item in arguments[0]){
         this[item]=arguments[0][item]
     }
  }else if(arguments.length==2){
    for(var item in arguments[1]){
      arguments[0][item]=arguments[1][item]
    }
    return arguments[0];
  }*/
  var target=arguments[0];
  var source;
  if(arguments.length==1){
    target=this;
    source=arguments[0];
  }else if(arguments.length==2){
    target=arguments[0];
    source=arguments[1];
  }
  for(var item in source){
    target[item]=source[item]
  }
  return target;
}
```
## 结构型
>优化代码结构（封装对象之间**组合关系**的变化）

### 命令模式
>定义：把方法的调用封装起来

基本原理

表现形式

JavaScript中函数能实现功能、作为值，这两个作为还能作为对象被四处传递

### 享元模式
>定义：大量相似的对象

场景：
	1.  文件上传功能，可上传多个文件
	2.  JQ的extends方法需要根据参数数量不同进行不同操作
### 外观模式

### 代理模式
>定义：为一个对象提供一个**占位符**，管理所有对这个对象的访问。也可代替某些**懒惰**的对象做一些事情。

1.  Java中实现代理需要进行向上转型（将子类实例化得到的对象的类型声明为父类），JavaScript中实现代理只需检测代理对象和原访问对象是否都实现了访问方法。（为了健壮性，在调用某个方法时需确定方法存在）
2.  分为保护代理与虚拟代理
	1.  保护代理（访问权限控制）
	2.  虚拟代理（在适当的时候，由代理对象向被访问者发起请求/访问，而不是访问者）即访问者不是必须的
	3.  JS难以实现保护代理，因为无法判断一个对象的访问者。所以虚拟代理是常用的代理模式。
3.  代理对象与访问者提供的接口的一致性：
	1.  不再需要代理时，访问者可直接访问被访问对象。
	2.  需要使用原访问者的地方都可替换使用代理对象

场景
	1.  图片过大/网速较慢导致图片所在位置空白。
		1.  方案：图片预加载，定义一个img，对外界提供一个setSrc接口。使用异步的方式**加载**图片，等图片加载好了再**填充**到该img元素
	2.  节流
	3.  缓存大量计算的结果（常用）
	4.  合并HTTP请求
	5.  虚拟代理（常用）
	6.  DOM事件代理
	7.  webpack devServer
	8.  nginx反向代理
	9.  Proxy与Reflect

总结：创建一个中间人。懒惰（收集请求，延迟代码，避免重复计算）
### 适配器模式（
>定义：后端接口结构改变，但不想动这个老接口（把方块放进一个圆洞）

### 桥接模式
>定义：

目的：以桥接代替耦合

场景：
```javascript
//menu1,menu2,menu3
/*function menuItem(word){
  this.word="";
  this.dom=document.createElement('div');
  this.dom.innerHTML=this.word;  
}
var menu1=new menuItem('menu1');
var menu2=new menuItem('menu2');
var menu3=new menuItem('menu3');
menu1.onmouseover=function(){
  menu1.style.color='red';
}
menu2.onmouseover=function(){
  menu1.style.color='green';
}
menu3.onmouseover=function(){
  menu1.style.color='blue';
}
menu1.onmouseout=function(){
  menu1.style.color='white';
}
menu2.onmouseout=function(){
  menu1.style.color='white';
}
menu3.onmouseout=function(){
  menu1.style.color='white';
}*/

function menuItem(word,color){
  this.word=word;
  this.color=color;
  this.dom=document.createElement('div');
  this.dom.innerHTML=this.word;
  document.getElementById('app').appendChild(this.dom);
}

menuItem.prototype.bind=function(){
  var self=this;
  this.dom.onmouseover=function(){
     console.log(self.color);
  	this.style.color=self.color.colorOver;
  }
  this.dom.onmouseout=function(){
  	this.style.color=self.color.colorOut;
  }  
}
function menuColor(colorover,colorout){
  this.colorOver=colorover;
  this.colorOut=colorout;
}

var data=[{word:'menu1',color:['red','black']},{word:'menu2',color:['green','black']},{word:'menu3',color:['blue','black']}]
for(var i=0;i<data.length;i++){

  new menuItem(data[i].word,new menuColor(data[i].color[0],data[i].color[1])).bind();

}

//express
var methods=['get','post','delete','put'];
methods.forEach(function(method){
  app[method]=function(){
    route[method].apply(route,slice.call(arguments,1))
  }
})
```
### 装饰者/装饰器模式
>定义：【已加入JS原生套餐】

## 行为型
>对象/模块间的沟通（封装对象的**行为**变化）

### 迭代器模式
>定义：提供一个工具用于**遍历容器中各个元素**，不用暴露该对象的内部表示。无论数据类型是什么，迭代器的接口应该一样，遵循迭代器协议。【遍历数据不只for与forEach，还有高级的Iterator已加入JS原生套餐】

优点：不关心对象内部构造，顺序访问每个元素。

一个迭代器通常要实现2个接口：
	1.  hasNext()：判断（控制？）迭代是否结束，返回布尔
	2.  next()：查找并返回下一个元素

### 策略模式
>定义：封装一系列算法，使它们可以相互替换

举例：
	1.  对象有某个行为，但在不同场景下该行为需要不同的实现算法
	2.  个人收入需要交个人所得税，一个人在美国（context）交个税与在中国交个税的行为（strategy）不同
	3.  网站需要登陆，使用密码，验证码，第三方账号登陆的行为不同
	4.  react中的useReducer，根据action类型去dispatch
组成：一个策略对象，一个context对象
特性：
	1.  每个策略复用的可能性很小
要点：
	1.  每个策略类控制自己的算法逻辑，策略与使用者之间独立

优点：
	1.  方便扩展，每增加一个策略，增加一个类即可。
缺点：
	1.  外部需要知道内部的具体策略才能进行选择。
### 状态模式
>定义：允许一个对象在其内部状态改变时改变它的行为，对象看起来像修改了它的类。

组成：一个状态对象，一个随状态对象改变的context对象。
理解：
	1.  在不同状态下调用同一个方法有不同结果。（有点像多态的定义，区别是多态是调用不同对象上的同名方法产生不同结果，但状态模式是一个对象内的状态不同时，调用该对象的相同方法就产生不同结果）
	2.  外部使用时，对象没有变，但状态不同导致了对象的行为不同了，像是修改了它的方法。
特性：
	1.  使用方便，算法的选择策略已经被确定，不用了解细节
```html

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>
  <button id="btn">灯光按钮</button>
  <script>
    // 状态对象
    const FSM = {
      off: {
        pressed() {
          console.log('黄灯')
          this.currState = FSM.yellow
        },
      },
      yellow: {
        pressed() {
          console.log('白光')
          this.currState = FSM.white
        },
      },
      white: {
        pressed() {
          console.log('关闭')
          this.currState = FSM.off
        },
      },
    }
    // context
    class Light {
      constructor() {
        this.currState = FSM.off // 设置当前状态
        this.button = null
      }
      init() {
        // 保存实例对象
        let self = this
        // 修改实例上的元素
        this.button = document.getElementById('btn')
        // 绑定对应方法
        this.button.onclick = function () {
          // 事件回调里的this是事件对象
          console.log(this, self)
          // 修改状态是在状态对象里完成，所以需要call调用
          self.currState.pressed.call(self)
        }
      }
    }

    const light = new Light()
    light.init()
  </script>
</body>

</html>
```
### 策略模式与状态模式是双胞胎---《Head First设计模式》

策略模式使用**可以互换的算法**来创建业务

状态模式：改变对象的内部**状态**，来控制对象的**行为**

理解：策略模式的不同算法之间平等，平行，没有联系。但状态模式的算法执行之外还需要切换为另一个状态，以便下次执行相同行为得到不同结果（防抖节流：内部维护了一个状态，不同状态时执行不同操作，且涉及状态的改变）。

相同：根据不同的**条件**，选择不同的**算法**。

内部区别：策略模式的重点在于不同场景下目的相同的**算法的平行替换**，状态模式的重点在于**状态转变导致行为不同，行为被执行又导致状态转变**。

外部区别：策略模式需要知道内部的算法逻辑然后根据需要进行选择。状态模式的算法的选择策略（第一个算法是什么，下一个算法是什么）已经固定，**不用了解细节进行选择**。

策略模式的条件是独立、互斥的，（A || B || C）只能选择其中一个。而状态模式的条件之间存在依赖关系（如果状态A的算法执行，就切换为状态B）。

场景：

制定锻炼计划：如果策略模式会这么做：不知道下个人的体脂范围，每次来个人都判断一下对方的范围，再计算

状态模式会这么做：三个人已经按体脂范围排队，每次换人只需直接给出计划

总结：策略模式需要根据条件手动选择策略。状态模式只需执行策略，内部会自动进行下一个策略的选择。（手动选择策略与自动选择策略的区别）

  

## 技巧型

### 链模式

### 惰性模式

### 委托模式

### 等待模式

### 迭代器模式

### 备忘录模式

### 模板方法模式
定义
场景
```javascript
function basePop(word,size){
  this.word=word;
  this.size=size;
  this.dom=null;
}
basePop.prototype.init=function(){
	var div=document.createElement('div');
	div.innerHTML=this.word;
	div.style.width=this.size.width+'px';
	div.style.height=this.size.height+'px';
	this.dom=div;
}
basePop.prototype.hidden=function(){
   //定义基础操作
   this.dom.style.display='none';
}
basePop.prototype.confirm=function(){
   //定义基础操作
   this.dom.style.display='none';
}
function ajaxPop(word,size){
  basePop.call(this,word,size);
}
ajaxPop.prototype=new basePop();
var hidden=ajaxPop.prototype.hidden;
ajaxPop.prototype.hidden=function(){
	hidden.call(this);
	console.log(1);
}
var confirm=ajaxPop.prototype.confirm;
ajaxPop.prototype.confirm=function(){
	confirm.call(this);
	console.log(1);
}
var pop=new ajaxPop('sendmes',{width:100,height:300});
pop.init();
pop.confirm();

var axios={get:function(){
	return Promise.resolve();
}};
 
 //算法计算器

function counter(){
  this.beforeCounter=[];
  this.afterCounter=[];
}

//然后我们把具体的不同部分留到具体使用的时候去扩展
//所以我们定义两个方法来扩展
counter.prototype.addBefore=function(fn){
   this.beforeCounter.push(fn);
}
counter.prototype.addAfter=function(fn){
   this.afterCounter.push(fn);
}

//最终计算方法
counter.prototype.count=function(num){
   //结果边两
   var _resultnum=num;
   //算法队列数组组装
   var _arr=[baseCount];
   _arr=this.beforeCounter.concat(_arr);
   _arr=_arr.concat(this.afterCounter);
   //不同部分的相同算法骨架
   function baseCount(num){
     num+=4;
     num*=2;
     return num;
   }
   //循环执行算法队列
   while(_arr.length>0){
     _resultnum=_arr.shift()(_resultnum);
   }
   return _resultnum;
}
//使用
var countObject=new counter();
countObject.addBefore(function(num){
   num--;
   return num;
})
countObject.addAfter(function(num){
  num*=2;
  return num;
})
countObject.count(10);
```

## 架构型

# 如何复合设计模式（形成如著名的MVC模式）