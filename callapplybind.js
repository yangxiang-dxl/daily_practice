// Function.prototype.myCall = function(thisArg, ...args) {
//     const fn = Symbol('fn')        // 声明一个独有的Symbol属性, 防止fn覆盖已有属性
//     thisArg = thisArg || window    // 若没有传入this, 默认绑定window对象
//     thisArg[fn] = this   
//     console.log(this,thisArg)           // this指向调用call的对象,即我们要改变this指向的函数
//     const result = thisArg[fn](...args)  // 执行当前函数
//     delete thisArg[fn]              // 删除我们声明的fn属性
//     return result                  // 返回函数执行结果
// }
function a(name,age){
    console.log(name,age)
    console.log(this.c)
}
function b(){
    this.c = 2
}

Function.prototype.yCall = function (context,...args){
    context = context || window
    let fn = this
    context.fn = fn
    let result = context.fn(...args)
    delete context.fn
    return result
}
Function.prototype.yApply= function (context,args){
    context = context || window
    let fn = this
    context.fn  = fn
    let result = context.fn(...args)
    delete context.fn
    return result
}
// a.yApply(new b(),['demaxiya',12])

Function.prototype.yBind=function(context,args){
    const _this  = this
    return function F(){
        if(this instanceof F) return new _this(...args,...arguments)
        else return  _this.apply(context,[...args,...arguments])
    }
}
a.yBind(new b(),['代欣璐',21])()
