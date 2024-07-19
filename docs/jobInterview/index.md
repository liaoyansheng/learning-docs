## vue2 和 vue3 有什么区别
[https://cn.vuejs.org/guide/built-ins/suspense.html#suspense]

## 正确理解setTimeout的方式(注册事件)：
1、有两个参数，第一个参数是函数，第二参数是时间值。
2、调用setTimeout时，把函数参数，放到事件队列中。等主程序运行完，再调用。
```js
fn() {
  for(var i = 0; i<3; i++){
    console.log(i);
    setTimeout(function() {
      console.log(i);
    },0)
  }
},
//输出 3、3、3
```


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

## TCP与UDP
### TCP和UDP的区别
UDP	TCP
无连接	面向连接
不可靠传输，不使用流量控制和拥塞控制	可靠传输（数据顺序和正确性），使用流量控制和拥塞控制
支持一对一，一对多，多对一和多对多交互通信	只能是一对一通信
面向报文	面向字节流
首部开销小，仅8字节	首部最小20字节，最大60字节
适用于实时应用，例如视频会议、直播	适用于要求可靠传输的应用，例如文件传输


## 一、浏览器安全
## 什么是 XSS 攻击？
（1）概念
XSS 攻击指的是跨站脚本攻击，是一种代码注入攻击。攻击者通过在网站注入恶意脚本，使之在用户的浏览器上运行，从而盗取用户的信息如 cookie 等。

XSS 的本质是因为网站没有对恶意代码进行过滤，与正常的代码混合在一起了，浏览器没有办法分辨哪些脚本是可信的，从而导致了恶意代码的执行。

攻击者可以通过这种攻击方式可以进行以下操作：
- ● 获取页面的数据，如DOM、cookie、localStorage；
- ● DOS攻击，发送合理请求，占用服务器资源，从而使用户无法访问服务器；
- ● 破坏页面结构；
- ● 流量劫持（将链接指向某网站）；
（2）攻击类型
XSS 可以分为存储型、反射型和 DOM 型：
- ● 存储型指的是恶意脚本会存储在目标服务器上，当浏览器请求数据时，脚本从服务器传回并执行。
- ● 反射型指的是攻击者诱导用户访问一个带有恶意代码的 URL 后，服务器端接收数据后处理，然后把带有恶意代码的数据发送到浏览器端，浏览器端解析这段带有 XSS 代码的数据后当做脚本执行，最终完成 XSS 攻击。 
- ● DOM 型指的通过修改页面的 DOM 节点形成的 XSS。

## 什么是 CSRF 攻击？
（1）概念
CSRF 攻击指的是跨站请求伪造攻击，攻击者诱导用户进入一个第三方网站，然后该网站向被攻击网站发送跨站请求。如果用户在被攻击网站中保存了登录状态，那么攻击者就可以利用这个登录状态，绕过后台的用户验证，冒充用户向服务器执行一些操作。

CSRF 攻击的本质是利用 cookie 会在同源请求中携带发送给服务器的特点，以此来实现用户的冒充。
（2）攻击类型
常见的 CSRF 攻击有三种：
- ●  GET 类型的 CSRF 攻击，比如在网站中的一个 img 标签里构建一个请求，当用户打开这个网站的时候就会自动发起提交。
- ●  POST 类型的 CSRF 攻击，比如构建一个表单，然后隐藏它，当用户进入页面时，自动提交这个表单。
- ● 链接类型的 CSRF 攻击，比如在 a 标签的 href 属性里构建一个请求，然后诱导用户去点击。

## 有哪些可能引起前端安全的问题? 
- ● 跨站脚本 (Cross-Site Scripting, XSS): ⼀种代码注⼊⽅式, 为了与 CSS 区分所以被称作 XSS。早期常⻅于⽹络论坛, 起因是⽹站没有对⽤户的输⼊进⾏严格的限制, 使得攻击者可以将脚本上传到帖⼦让其他⼈浏览到有恶意脚本的⻚⾯, 其注⼊⽅式很简单包括但不限于 JavaScript / CSS / Flash 等； 
- ● iframe的滥⽤: iframe中的内容是由第三⽅来提供的，默认情况下他们不受控制，他们可以在iframe中运⾏JavaScirpt脚本、Flash插件、弹出对话框等等，这可能会破坏前端⽤户体验；
- ● 跨站点请求伪造（Cross-Site Request Forgeries，CSRF）: 指攻击者通过设置好的陷阱，强制对已完成认证的⽤户进⾏⾮预期的个⼈信息或设定信息等某些状态更新，属于被动攻击 
- ● 恶意第三⽅库: ⽆论是后端服务器应⽤还是前端应⽤开发，绝⼤多数时候都是在借助开发框架和各种类库进⾏快速开发，⼀旦第三⽅库被植⼊恶意代码很容易引起安全问题。

## Vue的性能优化有哪些
### （1）编码阶段
● 尽量减少data中的数据，data中的数据都会增加getter和setter，会收集对应的watcher
● v-if和v-for不能连用
● 如果需要使用v-for给每项元素绑定事件时使用事件代理
● SPA 页面采用keep-alive缓存组件
● 在更多的情况下，使用v-if替代v-show
● key保证唯一
● 使用路由懒加载、异步组件
● 防抖、节流
● 第三方模块按需导入
● 长列表滚动到可视区域动态加载
● 图片懒加载

### （2）SEO优化
● 预渲染
● 服务端渲染SSR

### （3）打包优化
● 压缩代码
● Tree Shaking/Scope Hoisting
● 使用cdn加载第三方模块
● 多线程打包happypack
● splitChunks抽离公共文件
● sourceMap优化

### （4）用户体验
● 骨架屏
● PWA
● 还可以使用缓存(客户端缓存、服务端缓存)优化、服务端开启gzip压缩等。

## 垃圾回收与内存泄漏
### 1. 浏览器的垃圾回收机制
（1）垃圾回收的概念
垃圾回收：JavaScript代码运行时，需要分配内存空间来储存变量和值。当变量不在参与运行时，就需要系统收回被占用的内存空间，这就是垃圾回收。

回收机制：
- ● Javascript 具有自动垃圾回收机制，会定期对那些不再使用的变量、对象所占用的内存进行释放，原理就是找到不再使用的变量，然后释放掉其占用的内存。
- ● JavaScript中存在两种变量：局部变量和全局变量。全局变量的生命周期会持续要页面卸载；而局部变量声明在函数中，它的生命周期从函数执行开始，直到函数执行结束，在这个过程中，局部变量会在堆或栈中存储它们的值，当函数执行结束后，这些局部变量不再被使用，它们所占有的空间就会被释放。
- ● 不过，当局部变量被外部函数使用时，其中一种情况就是闭包，在函数执行结束后，函数外部的变量依然指向函数内部的局部变量，此时局部变量依然在被使用，所以不会回收。

(2）垃圾回收的方式
浏览器通常使用的垃圾回收方法有两种：标记清除，引用计数。
1）标记清除
- ● 标记清除是浏览器常见的垃圾回收方式，当变量进入执行环境时，就标记这个变量“进入环境”，被标记为“进入环境”的变量是不能被回收的，因为他们正在被使用。当变量离开环境时，就会被标记为“离开环境”，被标记为“离开环境”的变量会被内存释放。
- ● 垃圾收集器在运行的时候会给存储在内存中的所有变量都加上标记。然后，它会去掉环境中的变量以及被环境中的变量引用的标记。而在此之后再被加上标记的变量将被视为准备删除的变量，原因是环境中的变量已经无法访问到这些变量了。最后。垃圾收集器完成内存清除工作，销毁那些带标记的值，并回收他们所占用的内存空间。
2）引用计数
- ● 另外一种垃圾回收机制就是引用计数，这个用的相对较少。引用计数就是跟踪记录每个值被引用的次数。当声明了一个变量并将一个引用类型赋值给该变量时，则这个值的引用次数就是1。相反，如果包含对这个值引用的变量又取得了另外一个值，则这个值的引用次数就减1。当这个引用次数变为0时，说明这个变量已经没有价值，因此，在在机回收期下次再运行时，这个变量所占有的内存空间就会被释放出来。
- ● 这种方法会引起循环引用的问题：例如： obj1和obj2通过属性进行相互引用，两个对象的引用次数都是2。当使用循环计数时，由于函数执行完后，两个对象都离开作用域，函数执行结束，obj1和obj2还将会继续存在，因此它们的引用次数永远不会是0，就会引起循环引用。

（3）减少垃圾回收
虽然浏览器可以进行垃圾自动回收，但是当代码比较复杂时，垃圾回收所带来的代价比较大，所以应该尽量减少垃圾回收。
- ● 对数组进行优化：在清空一个数组时，最简单的方法就是给其赋值为[ ]，但是与此同时会创建一个新的空对象，可以将数组的长度设置为0，以此来达到清空数组的目的。
- ● 对object进行优化：对象尽量复用，对于不再使用的对象，就将其设置为null，尽快被回收。
- ● 对函数进行优化：在循环中的函数表达式，如果可以复用，尽量放在函数的外面。

### 2. 哪些情况会导致内存泄漏
以下四种情况会造成内存的泄漏：
● 意外的全局变量：由于使用未声明的变量，而意外的创建了一个全局变量，而使这个变量一直留在内存中无法被回收。
● 被遗忘的计时器或回调函数：设置了 setInterval 定时器，而忘记取消它，如果循环函数有对外部变量的引用的话，那么这个变量会被一直留在内存中，而无法被回收。
● 脱离 DOM 的引用：获取一个 DOM 元素的引用，而后面这个元素被删除，由于一直保留了对这个元素的引用，所以它也无法被回收。
● 闭包：不合理的使用闭包，从而导致某些变量一直被留在内存当中。

## Vue 子组件和父组件执行顺序
加载渲染过程：
1.父组件 beforeCreate
2.父组件 created
3.父组件 beforeMount
4.子组件 beforeCreate
5.子组件 created
6.子组件 beforeMount
7.子组件 mounted
8.父组件 mounted

更新过程：
1. 父组件 beforeUpdate
2.子组件 beforeUpdate
3.子组件 updated
4.父组件 updated

销毁过程：
1. 父组件 beforeDestroy
2.子组件 beforeDestroy
3.子组件 destroyed
4.父组件 destoryed