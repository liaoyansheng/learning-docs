## vue2 和 vue3 有什么区别
[https://cn.vuejs.org/guide/built-ins/suspense.html#suspense]

## 扁平化数组以及数组去重
编写一个程序，将数组扁平化，并去除其中重复部分，最终得到一个升序且不重复的数组：
```js
let  arr = [3, 12, 1, 2, [3, 4, 4, [5, 4,6, [8,9,7, 8, [9, 10, 11]]]]];
```
### 方法一：递归
```js
let result = [];
function fn(array){
  for(let i = 0; i < array.length; i++){
    let item = array[i];
    if(Array.isArray(array[i])){
      fn(item);
    }else{
      result.push(item)
    }
  }
  return result;
}
fn(arr)
```

### 方法二：数组.some
```js
while( arr.some(item => Array.isArray(item)) ){
  arr = [].concat(...arr);
}
```

### 方法三：flat和flatMap方法（为ES2019(ES10)方法，目前还未在所有浏览器完全兼容。）
- flat不传参数时，默认扁平化一层
- flat传入一个整数参数，整数即扁平化的层数
- Infinity 关键字作为参数时，无论多少层嵌套，都会转为一维数组
- 传入 <=0 的整数将返回原数组，不扁平化
- 如果原数组有空位，flat()方法会跳过空位。
```js
const arr = nestedArray.flat(Infinity)
const result = Array.from( new Set(arr)).sort((a:any, b:any) => a - b )
```
```js
//数组扁平化实现
function flatten(arr) {
  return arr.reduce((pre, cur) => {
    return pre.concat(Array.isArray(cur) ? flatten(cur) : cur);
  }, [])
}
```

### 方法四
```js
let arr22 = Array.from( new Set(arr11.toString().split(','))).sort((a,b)=>{
    return Number(a) - Number(b)
})
```

## 长列表页面滚动卡顿性能优化方法

### 1.懒加载，分页
### 2.高清图替换成缩略图，因为很多时候长列表的图尺寸都比较小，所以可以用小图来代替
### 3.Object.freeze（vue2）冻结数组取消响应式，因为大多时候都是展示
### 4.使用虚拟列表 vue-virtual-scroller 和 vue-virtual-scroll-list 等插件
### 5.自己实现可视区域渲染
```js
var currentInstance = getCurrentInstance();
function handleScroll () {
    const scrollTop = currentInstance.ctx.$refs.container.scrollTop
    start.value = Math.floor(scrollTop / props.size)
    end.value = start.value + props.showNumber
    console.log('@@@@', start.value, end.value)
}
```

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

## 手写 instanceof 方法
instanceof 运算符用于判断构造函数的 prototype 属性是否出现在对象的原型链中的任何位置。

```js
function myInstanceof(left, right) {
  let proto = Object.getPrototypeOf(left), // 获取对象的原型
      prototype = right.prototype; // 获取构造函数的 prototype 对象

  // 判断构造函数的 prototype 对象是否在对象的原型链上
  while (true) {
    if (!proto) return false;
    if (proto === prototype) return true;

    proto = Object.getPrototypeOf(proto);
  }
}
```

## 如何⽤webpack来优化前端性能？
⽤webpack优化前端性能是指优化webpack的输出结果，让打包的最终结果在浏览器运⾏快速⾼效。 
- 压缩代码：删除多余的代码、注释、简化代码的写法等等⽅式。可以利⽤webpack的 UglifyJsPlugin 和 ParallelUglifyPlugin 来压缩JS⽂件， 利⽤ cssnano （css-loader?minimize）来压缩css 
- 利⽤CDN加速: 在构建过程中，将引⽤的静态资源路径修改为CDN上对应的路径。可以利⽤webpack对于 output 参数和各loader的 publicPath 参数来修改资源路径 
- Tree Shaking: 将代码中永远不会⾛到的⽚段删除掉。可以通过在启动webpack时追加参数 --optimize-minimize 来实现
- Code Splitting: 将代码按路由维度或者组件分块(chunk),这样做到按需加载,同时可以充分利⽤浏览器缓存 
- 提取公共第三⽅库: SplitChunksPlugin插件来进⾏公共模块抽取,利⽤浏览器缓存可以⻓期缓存这些⽆需频繁变动的公共代码 
