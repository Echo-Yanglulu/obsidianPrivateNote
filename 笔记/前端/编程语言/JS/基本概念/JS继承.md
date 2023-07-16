# 概述
继承是面向对象编程中讨论最多的话题。很多[[面向对象编程]] 语言都支持两种继承：*接口继承*和*实现继承*
	1. 前者只继承*方法签名*。接口继承在ECMAScript中是不可能的，因为函数没有签名。
	2. 后者继承*实际方法*。是ECMAScript唯一支持的继承方式，而这主要是通过**原型链**实现的。
# 工厂模式
用于抽象出创建特定对象的过程
```js
function createPerson(name, age, job) {
  let o = new Object();
  o.name = name;
  o.age = age;
  o.job = job;
  o.sayName = function() {
    console.log(this.name);
  };
  return o;
}

let person1 = createPerson("Nicholas", 29, "Software Engineer");
let person2 = createPerson("Greg", 27, "Doctor");
```
# [[构造函数]]模式
自定义构造函数，以函数的形式为自己的对象类型定义属性和方法。通过new的方式调用
```js
function Person(name, age, job){
  this.name = name;
  this.age = age;
  this.job = job;
  this.sayName = function() {
    console.log(this.name);
  };
}

let person1 = new Person("Nicholas", 29, "Software Engineer");
let person2 = new Person("Greg", 27, "Doctor");

person1.sayName();  // Nicholas
person2.sayName();  // Greg
```
与工厂模式比较
	1. 相同
		1. 都使用了函数
	2. 不同
		1. 没有显式创建对象
		2. 属性与方法赋值给了this
		3. 没有return
new操作符机制
	1. 在内存中*创建*一个新对象
	2. 将新对象的\[\[prototype]] *特性赋值*为该构造函数的prototype属性
	3. 构造函数内部的*this赋值*为该新对象。
	4. *执行*构造函数，添加属性与方法
	5. 如果构造函数主动*返回*非空对象，则使用该对象；否则返回新建对象
## 注意
1. 构造函数也是函数
	1. 在调用一个函数而没有明确设置this值的情况下（即没有作为对象的方法调用，或者没有使用call()/apply()调用），this始终指向Global对象
2. 构造函数的问题
	1. 其定义的方法会在每个实例上都创建一遍。
		1. 可以把方法定义为全局变量，这样都可引用，但会扰乱全局作用域。
# 原型模式
基于原型的继承：每个函数都会创建一个prototype属性，它是一个对象，包含应该*由特定引用类型的实例共享*的属性和方法。
# 对象迭代
# [[class]] 
ES6的类都仅仅是封装了ES5.1**构造函数**加**原型继承**的语法糖而已。