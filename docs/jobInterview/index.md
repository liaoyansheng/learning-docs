## 函数的节流和防抖

### 节流函数
- 一个函数执行一次之后，只有大于设定的执行周期后才会执行第二次。
- 应用场景：有个需要频繁触发的函数，出于优化性能角度，在规定时间内，只让函数触发的第一次生效，后面不生效；例如：下拉滚动条加载、

```js
function throttle(fn, delay) {
    var lastTime = 0
    return function () {
        var nowTime = Date.now()
        if (nowTime - lastTime > delay) {
            fn.call(this) //修正 this 指向问题
            lastTime = nowTime //同步时间
        }
    }
}

document.onscroll = throttle( function() {console.log('scroll 事件被触发了' + Date.now())}, 200)
```

### 防抖函数
- 一个需要频繁触发的函数，在规定时间内，只让最后一次生效，前面的不生效
- 应用场景：按钮点击
 
```js
function debounce(fn, delay) {
    var timer = null //记录上一次的延时器
    return function () {
        clearTimeout(timer) //清除上一次延时器
        timer = setTimeout(()=>{ //重新设置新的延时器
            fn().apply(this)
        }, delay)
    }

}

document.getElementById('btn').onclick = debounce( function() {console.log('点击事件被触发了' + Date.now())}, 1000)
``` 

## JavaScript中的call、apply、 bind的用法、实现以及三者之间的区别？
call，apply，bind 都是函数 Function 原型上的方法，三者的功能都是用来改变函数中的 this 指向。

##  1、call用法
call() 方法是预定义的 JavaScript 方法。它可以用来调用所有者对象作为参数的方法。通过 call()，您能够使用属于另一个对象的方法。
- call传入的参数数量不固定，第一个参数代表函数内的this指向，从第二个参数开始往后，每个参数被依次传入函数。
- call是包装在apply上面的一颗语法糖，如果我们明确知道函数接受多少个参数，而且想一目了然的表达形参和实参的对应关系，那么我们可以用call来传达参数。
```js
  const person = {
    fullName: function (country, city) {
      return this.firstName + this.lastName + " " + country + " " + city
    }
  }
  const newPerson = {
    firstName: "fu",
    lastName: "chaoyang",
  }
  person.fullName.call(newPerson, 'china', 'xian')
```

## 2、apply 用法
- apply接受两个参数，第一个参数指定了函数体内的this指向。第二个参数为一个带下标的集合，这个集合可以为数组，也可以为类数组，apply方法把这个集合中的元素作为参数传递给被调用的函数。
- 当调用一个函数时，js的解释器并不会计较形参和实参在数量，类型以及顺序上的区别，js在内部就是用一个数组来表示的。
```js
  const person = {
    fullName: function (country, city) {
      return this.firstName + this.lastName + " " + country + " " + city
    }
  }
  const newPerson = {
    firstName: "fu",
    lastName: "chaoyang",
  }
  person.fullName.apply(newPerson, ['china', 'xian'])
```

## 3、bind用法
- 相信大家在使用React调用函数的时候必须使用bind(this)，后直接在class中声明函数即可正常使用，但是为什么要使用这个呢？
- bind()方法主要就是将函数绑定到某个对象，bind()会创建一个函数，函数体内的this对象的值会被绑定到传入bind()中的第一个参数的值，例如：f.bind(obj)，实际上可以理解为obj.f()，这时f函数体内的this自然指向的是obj；
```js
  const person = {
    fullName: function (country, city) {
      return this.firstName + this.lastName + " " + country + " " + city
    }
  }
  const newPerson = {
    firstName: "fu",
    lastName: "chaoyang",
  }
  person.fullName.bind(newPerson, 'china', 'xian') // 打印出fullName函数
  person.fullName.bind(newPerson, 'china', 'xian')() // fuchaoyang china xian
```
## 手写源码实现
## 1、手写 call 函数
```js 
  // call实现
  Function.prototype.myCall = function (context) {
    context = context || window
    const arg = [...arguments].slice(1)
    const fn = Symbol()
    context[fn] = this
    const result = context[fn](...arg)
    delete context[fn]
    return result
  }
```

## 2、手写 apply 函数
```js 
  // apply 实现
  Function.prototype.myApply = function (context, args) {
    context = context || window // 默认 window
    args = [...args] // 参数
    const fn = Symbol() // 给 context 设置一个独一无二的属性，避免覆盖原有属性
    context[fn] = this // 这里的 this 指向调用它的函数fn
    const result = context[fn](...args) // 调用之
    delete context[fn] // 删除添加的属性
    return result // 返回值
  }
```

## 3、手写 bind 函数
```js 
  // bind 实现
  Function.prototype.myBind = function (context) {
    context = context || window // 默认 window
    const args = [...arguments].slice(1) // 参数
    const fn = this // 这里的 this 指向调用它的函数 fn
    return function () {
      return fn.apply(context, args)
    }
  }
```

## 区别以及使用场景
### 相同点
- bind、call、apply都是用来指定一个函数内部的this的值。 
- 接收的第一个参数都是this要指向的对象。
- 都可以利用后续参数传参。

### 不同点
- call和bind传参相同，多个参数依次传入的。
- apply只有两个参数，第二个参数为数组。
- call和apply都是对函数进行直接调用，而bind方法不会立即调用函数，而是返回一个修改this后的函数。

### 使用场景
- call函数的使用多用于类的继承。
- apply函数可配合Math.max()用于计算数组最大值等。
- bind函数可用于函数内部有定时器，改变定时器内部的this指向。