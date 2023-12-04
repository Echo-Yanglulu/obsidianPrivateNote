# 概述
在[[面向对象编程]]过程中，一些常见问题的解决方案

背景
	1. 设计面向对象软件比较困难，而设计**可复用**的*面向对象软件*就更加困难。
		1. 你必须找到相关的对象，以适当的粒度将它们归类，再定义类的接口和继承层次，建立对象之间的基本关系。
		2. 你的设计应该对手头的问题有*针对性*，同时对将来的问题和需求也要有足够的*通用性*。
		3. 你也希望避免*重复设计*或尽可能少做重复设计。有经验的面向对象设计者会告诉你，要一下子就得到复用性和灵活性好的设计，即使不是不可能的至少也是非常困难的。一个设计在最终完成之前经常要被复用好几次，而且每一次都有所修改。
	2. 专业的设计者：不是每个（设计）问题都要重新努力解决，而是直接复用以前的解决方案。【这些针对问题被复用的解决方案，就是所谓“经验”。这也是为什么说，干“设计”的，经验很重要】
		1. 特定的**解决方案/设计方案**对应特定的**设计问题**，使这些面向对象设计*灵活*、*优雅*、*复用性*更好。
		2. 将这套映射保存下来，即为**设计模式**。
意义
	1. 设计模式可以帮助设计者更快、更好地完成系统设计。
		1. 每个设计模式对应面向对象系统/软件中重复出现的设计。
要素【一般情况，1个设计模式有4个要素】
	1. 名称：一个助记名，它用一两个词来描述模式的问题、解决方案和效果。
	2. 问题：描述了应该在何时使用模式
		1. 可能描述了特定的设计问题（如怎样用对象表示算法等）
		2. 也可能描述了导致不灵活设计的类或对象结构。
		3. 有时候，问题部分会包括<u>使用模式必须满足的一系列先决条件</u>。
	3. 解决方案：描述了设计的组成成分、它们之间的相互关系及各自的职责和协作方式。
		1. 因为模式就像一个模板，可应用于多种不同场合，所以**解决方案并不描述一个特定而具体的设计或实现**，而是提供*设计问题的抽象描述*和*怎样用一个具有一般意义的元素组合*（类或对象组合）来解决这个问题
		2. 所以需要根据具体的语言，去实现设计。
	4. 效果：描述了模式应用的效果及使用模式应权衡的问题
		1. 对于*评价设计选择*和*理解使用模式的代价*及好处具有重要意义
		2. 模式效果包括它对系统的灵活性、扩充性或可移植性的影响，显式地列出这些效果对*理解和评价这些模式*很有帮助
定义
	1. 对用来在特定场景下解决一般设计问题的**类和相互通信的对象**的描述。
那么，设计问题都有哪些呢？
# 创建型
>创建对象（封装**创建**对象的变化）
>1.  封装良好与否的标准
	1.  变量在外部不可见
	2.  通过调用接口使用
	3.  存在扩展接口
>2.  为什么要封装一个对象
	4.  避免变量污染
	5.  整体能作为一个模块使用（复用）
	6.  避免修改（开闭原则）
## [[单例模式]] 
保证实例唯一
## [[工厂模式]] 
将创建实例的过程封装到一个工厂函数中，**便利地创建实例**。
## [[建造者模式]] 
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
## [[享元模式]]
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
# 结构型
>优化代码结构（封装对象之间**组合关系**的变化）

## [[命令模式]] 
>定义：把方法的调用封装起来

基本原理

表现形式

JavaScript中函数能实现功能、作为值，这两个作为还能作为对象被四处传递

## [[享元模式]] 
>定义：大量相似的对象

场景：
	1.  文件上传功能，可上传多个文件
	2.  JQ的extends方法需要根据参数数量不同进行不同操作
## [[外观模式]] 

## [[代理模式]] 

## [[适配器模式]]
>定义：后端接口结构改变，但不想动这个老接口（把方块放进一个圆洞）

## [[桥接模式]]
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
## [[装饰器模式]] 
>定义：【已加入JS原生套餐】
# 行为型
>对象/模块间的沟通（封装对象的**行为**变化）

## [[观察者模式]] 
## [[发布订阅模式]] 
## [[迭代器模式]] 
>定义：提供一个工具用于**遍历容器中各个元素**，不用暴露该对象的内部表示。无论数据类型是什么，迭代器的接口应该一样，遵循迭代器协议。【遍历数据不只for与forEach，还有高级的Iterator已加入JS原生套餐】

优点：不关心对象内部构造，顺序访问每个元素。

一个迭代器通常要实现2个接口：
	1.  hasNext()：判断（控制？）迭代是否结束，返回布尔
	2.  next()：查找并返回下一个元素

## 策略模式
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
## 状态模式
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
## 策略模式与状态模式是双胞胎---《Head First设计模式》

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

  

# 技巧型

## [[链模式]] 

## [[惰性模式]] 

## [[委托模式]] 
代理模式？
## [[等待模式]] 

## [[迭代器模式]] 

## [[备忘录模式]] 

## [[模板方法模式]] 
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

# 架构型

# 如何复合设计模式（形成如著名的MVC模式）