
/**
 *  1、原型链继承：ECMAScript 中将原型链作为实现继承的主要方法,
 *                其基本思想是利用原型让一个引用类型继承另一个引用类型的属性和方法
 */
function SuperType() {
    this.property = true;
}
SuperType.prototype.getSuperValue = function () {
    return this.property;
}

function SubType() {
    this.subproperty = false;
}

//  通过创建SuperType的实例继承了SuperType
SubType.prototype = new SubType()

SubType.prototype.getSubValue = function () {
    return this.subproperty
}

var instance = new SubType()
alert(instance.getSuperValue) // true

// 缺点：
//      1、包含引用类型值的原型属性会被所有实例共享，这会导致对一个实例的修改会影响另一个实例
//      2、在创建子类型的实例时，不能向超类型的构造函数中传递参数

/**
 *  2、构造函数实现继承 ：
 *      借用构造函数的基本思想，即在子类型构造函数的内部调用超类型构造函数。
 *　    函数只不过是在特定环境中执行代码的对象，因此通过使用 apply() 和 call() 方法可以在新创建的对象上执行构造函数。
 */
function SuperType(name) {
    this.name = name;
}

function SubType() {
    // 继承了SuperType,同时还传递了参数
    SuperType.call(this, "mary")
    // 实例属性
    this.age = "22"
}
var instance = new SubType()
alert(instance.name)
alert(instance.age)
// 缺点：
//      1、无法避免构造函数模式存在的问题，方法都在构造函数中定义，因此无法复用函数
//      2、在超类型的原型中定义的方法，对子类型而言是不可见的

/**
 *  3、组合继承 ：
 *      指的是将原型链和借用构造函数的技术组合到一起，
 *　    思路是使用原型链实现对原型方法的继承，而通过借用构造函数来实现对实例属性的继承。
 *　　  这样，既通过在原型上定义方法实现了函数的复用，又能够保证每个实例都有它自己的属性。
 */
function SuperType(name) {
    this.name = name
    this.colors = ["red", "blue", "green"]
}
SuperType.prototype.sayName = function () {
    alert(this.name)
}

function SubType(name, age) {
    SuperType.call(name)
    this.age = age
}
// 继承方法 使用原型链继承
SubType.prototype = new SubType()
SubType.prototype.constructor = SubType
SubType.prototype.sayAge = function () {
    alert(this.age)
}

var instance1 = new SubType("mary", 22)
instance1.colors.push("black")
alert(instance1.colors)
instance1.sayName()
instance1.sayAge()

var instance2 = new SubType("mary", 22)
alert(instance2.colors)
instance2.sayName()
instance2.sayAge()
// 组合继承避免了原型链和借用构造函数的缺点，融合了他们的优点，是JavaScript中最常用的继承模式
// 缺点：无论在什么情况下，都会调用两次超类型构造函数，一次是在创建子类型原型的时候，一次是在子类型构造函数的内部

/**
 *  4、原型式继承 ：
 *     原型式继承是借助原型可以基于已有的对象创建新对象，同是还不比因此创建自定义类型
 *　    在 object 函数内部，先创建一个临时性的构造函数，然后将传入的对象作为这个构造函数的原型，最后返回这个临时类型的一个新实例。
 *　　  本质上来说，object对传入其中的对象执行了一次浅复制。
 */

function object(o) {
    function F() { }
    F.prototype = o
    return new F()
}

/**
 *  4、寄生式继承 ：
 *    和寄生构造函数和工厂模式类似，即创建一个仅用于封装继承过程中的函数，
 *    该函数在内部已某种方式来增强对象，最后返回对象。
 */
function createAnother(o) {
    var clone = Object.create(o)
    clone.sayHi = function () {
        console.log("hi")
    }
    return clone
}
var person = {
    name: "GaoSirs"
}
var anotherPerson = createAnother(person)
anotherPerson.sayHi()
// 缺点：使用寄生式继承来为对象添加函数，会因为做不到函数复用而降低效率，这个与构造函数模式类似。

/**
 *  6、寄生组合式继承 ：
 *   在前面说的组合模式(原型链+构造函数)中，继承的时候需要调用两次父类构造函数
 *   使用寄生组合式继承，可以规避这些问题。
 *   这种模式通过借用构造函数来继承属性，通过原型链的混成形式来继承方法。
   本质上就是使用寄生式继承来继承父类的原型，在将结果指定给子类型的原型。
 */
function inheritPrototype(subType, superType) {
    var prototype = Object.create(superType.prototype)
    prototype.constructor = subType
    subType.prototype = prototype

}
// 该函数实现了寄生组合模式的最简单形式。　
// 这个函数接受两个参数，一个子类，一个父类。
// 第一步创建父类原型的副本，第二步将创建的副本添加constructor属性，第三部将子类的原型指向这个副本。

/**
 *  7、ES6中Class... extends关键字实现继承 ：
 */
class ColorPoint extends Point {
    constructor(x, y, color) {
        super(x, y)
        this.color = color
    }
    toString() {
        return this.color + " " + super.toString()
    }
}

// prototype 和__proto__：
// 一个继承语句同时存在两条继承链：一条实现属性继承，一条实现方法的继承
class A extends B { }
A.__proto__ = B; // 继承属性
A.prototype.__proto__ = B.prototype // 继承方法