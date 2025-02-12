(function () {
  "use strict";
  // 定义工具方法: 设置不可枚举的属性和方法
  const define = function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      enumerable: false,
      configurable: true,
      writable: true,
      value: value,
    });
  };
  /**
   * 1. promise的状态即使立即改变, then里面的回调函数也是异步执行的
   * 2. executor函数执行报错就会影响promise的状态, promise的状态为rejected
   * 3. promise的状态为rejected, 但其调用then返回的状态还是fulfilled
   */

  function Promise(executor) {
    const self = this;

    // 判断executor是不是函数
    if (typeof executor !== "function")
      throw new TypeError("Promise resolver executor is not a function");
    // Promise是普通调用还是通过new调用
    if (!(self instanceof Promise))
      throw new TypeError("undefined is not a promise");

    // 定义属性
    self.state = "pending";
    self.result = undefined;
    define(self, "onfulfilledCallbacks", []);
    define(self, "onrejectedCallbacks", []);

    // 统一改变状态和值的方法入口
    const change = function change(state, result) {
      if (self.state !== "pending") return;
      self.state = state;
      self.result = result;
    };

    // 执行executor函数
    try {
      executor(
        function resolve(value) {
            change('fulfilled', value)
        },
        function reject(reason) {
            change('rejected', reason)
        }
      );
    } catch (error) {
      change("rejected", error);
    }

    // 添加原型方法
    const proto = Promise.prototype;
    if(typeof Symbol !== 'undefined') define(proto,  Symbol.toStringTag, 'Promise');
    
  }

  // 暴漏API
  if (typeof window !== "undefined") window.Promise = Promise;
  if (typeof module === "object" && typeof module.exports === "object")
    module.exports = Promise;
})();
