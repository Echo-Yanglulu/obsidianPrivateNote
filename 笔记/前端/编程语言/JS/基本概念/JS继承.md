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
		2. 属性与方法
# 原型模式
基于原型的继承
# 对象迭代
# [[class]] 
ES6的类都仅仅是封装了ES5.1**构造函数**加**原型继承**的语法糖而已。