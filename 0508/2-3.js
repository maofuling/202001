// <script> 放到页面头部和尾部的区别？以及解决办法？
// 1. 浏览器渲染的机制（主要SCRIPT是如何处理的？ 同步异步编程）
// 2. DOMContentLoaded和window.onload的区别？

/*
 * 参考的回答方案：
   当我们从服务器请求回来HTML页面资源后，浏览器会开辟一个 GUI 的渲染线程（浏览器打开页面是开辟一个进程，里面存在很多线程，其中包含用来做页面渲染和执行JS的GUI渲染线程，所以JS以及页面渲染是单线程的【同时只能做一件事情】）用来自上而下渲染和解析我们的代码！
	  在渲染的过程中如果遇到<link>/<img>/<video>等标记，浏览器会单独开辟出HTTP加载线程，去服务器加载资源文件，GUI线程会继续向下渲染【也就是他们不会阻塞GUI的渲染】
	  =>页面加载的步骤：DOM TREE -> CSSOM TREE -> RENDER TREE -> LAYOUT（布局/回流） -> PAINTING（绘制）... 修改了元素的结构和样式，会重新进行布局和绘制，引发DOM的回流(重排)和重绘

	  但是如果遇到的是<script>，则不会开辟新的HTTP加载线程，是当前GUI线程自己去加载资源文件，导致渲染被阻碍（SCRIPT默认是立即加载渲染的）！只有JS执行完，页面才会继续向下渲染！
	  
	  所以在真实项目中，我们一般都会把JS加载放到页面的尾部：
		   1.防止其阻碍GUI的渲染，让DOM TREE等尽快完成
		   2.放到DOM的前面（例如：页面的头部）加载JS的时候，此时我们还没有渲染出DOM，无法基于JS获取到DOM元素
		   ...
	
	  如果放到头部，我在真实项目中经常处理的几个事情：
		   1. 给script设置 defer 或者 async 标识来进行异步修饰（两者都不会阻碍GUI的渲染，都是异步去加载资源文件，async是在加载回来文件后，立即去执行（此时会阻碍GUI的渲染），谁先加载回来，谁先执行（没有明确的执行顺序）；defer是需要等待GUI渲染完后，统一按照之前编写的SCRIPT顺序，依次把JS再执行；）
		   2. 除了设置这些标识，我们也可以基于事件监听的方式来处理；基于 window.onload=function(){} 或者 window.addEventListener('DOMContentLoaded',function(){}) 任何一种方式，都可以让DOM结构加载完后，再去执行对应的JS代码，此时我们就可以获取对应的DOM元素了（引申：我之前用JQ的时候，看过它的部分源码，它的$(document).ready() 就是基于对DOMContentLoaded事件进行监听，从而保证在DOM结构加载完，再去执行代码获取DOM元素的，而window.onload是在所有资源都加载完，不仅仅是DOM，才会被触发的，触发时间晚于DOMContentLoaded）
 */