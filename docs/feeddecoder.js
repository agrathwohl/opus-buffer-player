(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.FeedDecoder = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _interopRequireDefault2 = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault2(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault2(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault2(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault2(require("@babel/runtime/helpers/createClass"));
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _audioBufferFrom = _interopRequireDefault(require("audio-buffer-from"));
var _audioBufferList = _interopRequireDefault(require("audio-buffer-list"));
var _decode = _interopRequireDefault(require("./lib/decode.mjs"));
require("@storyboard-fm/audio-core-library");
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}
var FeedDecoder = /*#__PURE__*/function () {
  function FeedDecoder() {
    var feed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    (0, _classCallCheck2["default"])(this, FeedDecoder);
    this.feed = feed;
    this.messages = {};
    this.ctx = new AudioContext();
    this.ctx.toggle();
  }
  /**
   * When feed receives a new audio message, pass the URL to this function to
   * produce decoded opus file chunks, from which we can generate AudioBuffers
   */
  (0, _createClass2["default"])(FeedDecoder, [{
    key: "_onNewMessage",
    value: function () {
      var _onNewMessage2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(url) {
        var opusChunks;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return (0, _decode["default"])(url);
            case 2:
              opusChunks = _context.sent;
              _context.next = 5;
              return this._onNewMessageChunks(opusChunks);
            case 5:
              this.messages[url] = _context.sent;
            case 6:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function _onNewMessage(_x) {
        return _onNewMessage2.apply(this, arguments);
      }
      return _onNewMessage;
    }()
  }, {
    key: "_onNewMessageChunks",
    value: function () {
      var _onNewMessageChunks2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(chunks) {
        var bufs;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              console.log(chunks);
              bufs = new _audioBufferList["default"](chunks.map(function (c) {
                return (0, _audioBufferFrom["default"])(c.channelData[0], {
                  sampleRate: 48000
                });
              }));
              console.log(bufs);
              return _context2.abrupt("return", bufs.join());
            case 4:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      function _onNewMessageChunks(_x2) {
        return _onNewMessageChunks2.apply(this, arguments);
      }
      return _onNewMessageChunks;
    }()
  }, {
    key: "playMessage",
    value: function playMessage(url) {
      var seek = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var buf = this.messages[url];
      var srcNode = this.ctx.createBufferSource();
      srcNode.buffer = buf;
      srcNode.connect(this.ctx.destination);
      srcNode.start(0, seek);
    }
  }, {
    key: "_startSrcNode",
    value: function _startSrcNode() {
      var when = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var seek = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      if (!this.srcNode) return;
      this.srcNode.start(when, seek);
      // TODO begin progress clock
    }
  }, {
    key: "_playBuffer",
    value: function _playBuffer(ab) {
      var seek = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var srcNode = this.ctx.createBufferSource();
      srcNode.buffer = ab;
      srcNode.connect(this.ctx.destination);
      this.srcNode = srcNode;
      this._startSrcNode(0, seek);
      // this.srcNode.start(0, seek)
    }
  }, {
    key: "_seekBuffer",
    value: function _seekBuffer(seek) {
      if (!this.srcNode) return;
      this.srcNode.stop();
      var bufferToSeek = this.srcNode.buffer;
      var newSrcNode = this.ctx.createBufferSource();
      newSrcNode.buffer = bufferToSeek;
      newSrcNode.connect(this.ctx.destination);
      this.srcNode = newSrcNode;
      this._startSrcNode(0, seek);
    }
  }]);
  return FeedDecoder;
}();
var _default = FeedDecoder;
exports["default"] = _default;

},{"./lib/decode.mjs":2,"@babel/runtime/helpers/asyncToGenerator":5,"@babel/runtime/helpers/classCallCheck":7,"@babel/runtime/helpers/createClass":8,"@babel/runtime/helpers/interopRequireDefault":10,"@babel/runtime/regenerator":16,"@storyboard-fm/audio-core-library":18,"audio-buffer-from":28,"audio-buffer-list":29}],2:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _awaitAsyncGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/awaitAsyncGenerator"));
var _wrapAsyncGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapAsyncGenerator"));
function _asyncIterator(iterable) { var method, async, sync, retry = 2; for ("undefined" != typeof Symbol && (async = Symbol.asyncIterator, sync = Symbol.iterator); retry--;) { if (async && null != (method = iterable[async])) return method.call(iterable); if (sync && null != (method = iterable[sync])) return new AsyncFromSyncIterator(method.call(iterable)); async = "@@asyncIterator", sync = "@@iterator"; } throw new TypeError("Object is not async iterable"); }
function AsyncFromSyncIterator(s) { function AsyncFromSyncIteratorContinuation(r) { if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object.")); var done = r.done; return Promise.resolve(r.value).then(function (value) { return { value: value, done: done }; }); } return AsyncFromSyncIterator = function AsyncFromSyncIterator(s) { this.s = s, this.n = s.next; }, AsyncFromSyncIterator.prototype = { s: null, n: null, next: function next() { return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments)); }, "return": function _return(value) { var ret = this.s["return"]; return void 0 === ret ? Promise.resolve({ value: value, done: !0 }) : AsyncFromSyncIteratorContinuation(ret.apply(this.s, arguments)); }, "throw": function _throw(value) { var thr = this.s["return"]; return void 0 === thr ? Promise.reject(value) : AsyncFromSyncIteratorContinuation(thr.apply(this.s, arguments)); } }, new AsyncFromSyncIterator(s); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _oggOpusDecoder = require("ogg-opus-decoder");
/**
 * Decode new audio messages in the feed.
 * Once a message arrives, provide its URL and duration as input into the
 * function in order to receive Uint8 decoded audio chunks. Create AudioBuffers
 * with these chunks.
 */
function initDecoder() {
  return _initDecoder.apply(this, arguments);
}
function _initDecoder() {
  _initDecoder = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var decoder;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          decoder = new _oggOpusDecoder.OggOpusDecoder();
          _context2.next = 3;
          return decoder.ready;
        case 3:
          console.log('decoder ready');
          return _context2.abrupt("return", decoder);
        case 5:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _initDecoder.apply(this, arguments);
}
function onMessage(_x) {
  return _onMessage.apply(this, arguments);
}
function _onMessage() {
  _onMessage = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(url) {
    var chunks, dec, bufs, decoder, resp, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, chunk, decoded;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          chunks = [];
          dec = [];
          bufs = [];
          _context3.next = 5;
          return initDecoder();
        case 5:
          decoder = _context3.sent;
          _context3.next = 8;
          return fetch(url);
        case 8:
          resp = _context3.sent;
          _iteratorAbruptCompletion = false;
          _didIteratorError = false;
          _context3.prev = 11;
          _iterator = _asyncIterator(readChunks(resp.body.getReader()));
        case 13:
          _context3.next = 15;
          return _iterator.next();
        case 15:
          if (!(_iteratorAbruptCompletion = !(_step = _context3.sent).done)) {
            _context3.next = 24;
            break;
          }
          chunk = _step.value;
          _context3.next = 19;
          return decoder.decode(chunk);
        case 19:
          decoded = _context3.sent;
          dec.push(decoded);
        case 21:
          _iteratorAbruptCompletion = false;
          _context3.next = 13;
          break;
        case 24:
          _context3.next = 30;
          break;
        case 26:
          _context3.prev = 26;
          _context3.t0 = _context3["catch"](11);
          _didIteratorError = true;
          _iteratorError = _context3.t0;
        case 30:
          _context3.prev = 30;
          _context3.prev = 31;
          if (!(_iteratorAbruptCompletion && _iterator["return"] != null)) {
            _context3.next = 35;
            break;
          }
          _context3.next = 35;
          return _iterator["return"]();
        case 35:
          _context3.prev = 35;
          if (!_didIteratorError) {
            _context3.next = 38;
            break;
          }
          throw _iteratorError;
        case 38:
          return _context3.finish(35);
        case 39:
          return _context3.finish(30);
        case 40:
          decoder.free();
          return _context3.abrupt("return", dec);
        case 42:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[11, 26, 30, 40], [31,, 35, 39]]);
  }));
  return _onMessage.apply(this, arguments);
}
function readChunks(reader) {
  return (0, _defineProperty2["default"])({}, Symbol.asyncIterator, function () {
    return (0, _wrapAsyncGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
      var readResult;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _awaitAsyncGenerator2["default"])(reader.read());
          case 2:
            readResult = _context.sent;
          case 3:
            if (readResult.done) {
              _context.next = 11;
              break;
            }
            _context.next = 6;
            return readResult.value;
          case 6:
            _context.next = 8;
            return (0, _awaitAsyncGenerator2["default"])(reader.read());
          case 8:
            readResult = _context.sent;
            _context.next = 3;
            break;
          case 11:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }))();
  });
}
var _default = onMessage;
exports["default"] = _default;

},{"@babel/runtime/helpers/asyncToGenerator":5,"@babel/runtime/helpers/awaitAsyncGenerator":6,"@babel/runtime/helpers/defineProperty":9,"@babel/runtime/helpers/interopRequireDefault":10,"@babel/runtime/helpers/wrapAsyncGenerator":15,"@babel/runtime/regenerator":16,"ogg-opus-decoder":76}],3:[function(require,module,exports){
var OverloadYield = require("./OverloadYield.js");
function AsyncGenerator(gen) {
  var front, back;
  function resume(key, arg) {
    try {
      var result = gen[key](arg),
        value = result.value,
        overloaded = value instanceof OverloadYield;
      Promise.resolve(overloaded ? value.v : value).then(function (arg) {
        if (overloaded) {
          var nextKey = "return" === key ? "return" : "next";
          if (!value.k || arg.done) return resume(nextKey, arg);
          arg = gen[nextKey](arg).value;
        }
        settle(result.done ? "return" : "normal", arg);
      }, function (err) {
        resume("throw", err);
      });
    } catch (err) {
      settle("throw", err);
    }
  }
  function settle(type, value) {
    switch (type) {
      case "return":
        front.resolve({
          value: value,
          done: !0
        });
        break;
      case "throw":
        front.reject(value);
        break;
      default:
        front.resolve({
          value: value,
          done: !1
        });
    }
    (front = front.next) ? resume(front.key, front.arg) : back = null;
  }
  this._invoke = function (key, arg) {
    return new Promise(function (resolve, reject) {
      var request = {
        key: key,
        arg: arg,
        resolve: resolve,
        reject: reject,
        next: null
      };
      back ? back = back.next = request : (front = back = request, resume(key, arg));
    });
  }, "function" != typeof gen["return"] && (this["return"] = void 0);
}
AsyncGenerator.prototype["function" == typeof Symbol && Symbol.asyncIterator || "@@asyncIterator"] = function () {
  return this;
}, AsyncGenerator.prototype.next = function (arg) {
  return this._invoke("next", arg);
}, AsyncGenerator.prototype["throw"] = function (arg) {
  return this._invoke("throw", arg);
}, AsyncGenerator.prototype["return"] = function (arg) {
  return this._invoke("return", arg);
};
module.exports = AsyncGenerator, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{"./OverloadYield.js":4}],4:[function(require,module,exports){
function _OverloadYield(value, kind) {
  this.v = value, this.k = kind;
}
module.exports = _OverloadYield, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{}],5:[function(require,module,exports){
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}
module.exports = _asyncToGenerator, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{}],6:[function(require,module,exports){
var OverloadYield = require("./OverloadYield.js");
function _awaitAsyncGenerator(value) {
  return new OverloadYield(value, 0);
}
module.exports = _awaitAsyncGenerator, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{"./OverloadYield.js":4}],7:[function(require,module,exports){
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
module.exports = _classCallCheck, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{}],8:[function(require,module,exports){
var toPropertyKey = require("./toPropertyKey.js");
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
module.exports = _createClass, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{"./toPropertyKey.js":13}],9:[function(require,module,exports){
var toPropertyKey = require("./toPropertyKey.js");
function _defineProperty(obj, key, value) {
  key = toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
module.exports = _defineProperty, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{"./toPropertyKey.js":13}],10:[function(require,module,exports){
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}
module.exports = _interopRequireDefault, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{}],11:[function(require,module,exports){
var _typeof = require("./typeof.js")["default"];
function _regeneratorRuntime() {
  "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */
  module.exports = _regeneratorRuntime = function _regeneratorRuntime() {
    return exports;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  var exports = {},
    Op = Object.prototype,
    hasOwn = Op.hasOwnProperty,
    defineProperty = Object.defineProperty || function (obj, key, desc) {
      obj[key] = desc.value;
    },
    $Symbol = "function" == typeof Symbol ? Symbol : {},
    iteratorSymbol = $Symbol.iterator || "@@iterator",
    asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
    toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
  function define(obj, key, value) {
    return Object.defineProperty(obj, key, {
      value: value,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), obj[key];
  }
  try {
    define({}, "");
  } catch (err) {
    define = function define(obj, key, value) {
      return obj[key] = value;
    };
  }
  function wrap(innerFn, outerFn, self, tryLocsList) {
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator,
      generator = Object.create(protoGenerator.prototype),
      context = new Context(tryLocsList || []);
    return defineProperty(generator, "_invoke", {
      value: makeInvokeMethod(innerFn, self, context)
    }), generator;
  }
  function tryCatch(fn, obj, arg) {
    try {
      return {
        type: "normal",
        arg: fn.call(obj, arg)
      };
    } catch (err) {
      return {
        type: "throw",
        arg: err
      };
    }
  }
  exports.wrap = wrap;
  var ContinueSentinel = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });
  var getProto = Object.getPrototypeOf,
    NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      define(prototype, method, function (arg) {
        return this._invoke(method, arg);
      });
    });
  }
  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if ("throw" !== record.type) {
        var result = record.arg,
          value = result.value;
        return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) {
          invoke("next", value, resolve, reject);
        }, function (err) {
          invoke("throw", err, resolve, reject);
        }) : PromiseImpl.resolve(value).then(function (unwrapped) {
          result.value = unwrapped, resolve(result);
        }, function (error) {
          return invoke("throw", error, resolve, reject);
        });
      }
      reject(record.arg);
    }
    var previousPromise;
    defineProperty(this, "_invoke", {
      value: function value(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function (resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }
        return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }
    });
  }
  function makeInvokeMethod(innerFn, self, context) {
    var state = "suspendedStart";
    return function (method, arg) {
      if ("executing" === state) throw new Error("Generator is already running");
      if ("completed" === state) {
        if ("throw" === method) throw arg;
        return doneResult();
      }
      for (context.method = method, context.arg = arg;;) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }
        if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) {
          if ("suspendedStart" === state) throw state = "completed", context.arg;
          context.dispatchException(context.arg);
        } else "return" === context.method && context.abrupt("return", context.arg);
        state = "executing";
        var record = tryCatch(innerFn, self, context);
        if ("normal" === record.type) {
          if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
          return {
            value: record.arg,
            done: context.done
          };
        }
        "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
      }
    };
  }
  function maybeInvokeDelegate(delegate, context) {
    var methodName = context.method,
      method = delegate.iterator[methodName];
    if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel;
    var record = tryCatch(method, delegate.iterator, context.arg);
    if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
    var info = record.arg;
    return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
  }
  function pushTryEntry(locs) {
    var entry = {
      tryLoc: locs[0]
    };
    1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
  }
  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal", delete record.arg, entry.completion = record;
  }
  function Context(tryLocsList) {
    this.tryEntries = [{
      tryLoc: "root"
    }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
  }
  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) return iteratorMethod.call(iterable);
      if ("function" == typeof iterable.next) return iterable;
      if (!isNaN(iterable.length)) {
        var i = -1,
          next = function next() {
            for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;
            return next.value = undefined, next.done = !0, next;
          };
        return next.next = next;
      }
    }
    return {
      next: doneResult
    };
  }
  function doneResult() {
    return {
      value: undefined,
      done: !0
    };
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", {
    value: GeneratorFunctionPrototype,
    configurable: !0
  }), defineProperty(GeneratorFunctionPrototype, "constructor", {
    value: GeneratorFunction,
    configurable: !0
  }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) {
    var ctor = "function" == typeof genFun && genFun.constructor;
    return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
  }, exports.mark = function (genFun) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
  }, exports.awrap = function (arg) {
    return {
      __await: arg
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    void 0 === PromiseImpl && (PromiseImpl = Promise);
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
    return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () {
    return this;
  }), define(Gp, "toString", function () {
    return "[object Generator]";
  }), exports.keys = function (val) {
    var object = Object(val),
      keys = [];
    for (var key in object) keys.push(key);
    return keys.reverse(), function next() {
      for (; keys.length;) {
        var key = keys.pop();
        if (key in object) return next.value = key, next.done = !1, next;
      }
      return next.done = !0, next;
    };
  }, exports.values = values, Context.prototype = {
    constructor: Context,
    reset: function reset(skipTempReset) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
    },
    stop: function stop() {
      this.done = !0;
      var rootRecord = this.tryEntries[0].completion;
      if ("throw" === rootRecord.type) throw rootRecord.arg;
      return this.rval;
    },
    dispatchException: function dispatchException(exception) {
      if (this.done) throw exception;
      var context = this;
      function handle(loc, caught) {
        return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught;
      }
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i],
          record = entry.completion;
        if ("root" === entry.tryLoc) return handle("end");
        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc"),
            hasFinally = hasOwn.call(entry, "finallyLoc");
          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
          } else {
            if (!hasFinally) throw new Error("try statement without catch or finally");
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          }
        }
      }
    },
    abrupt: function abrupt(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }
      finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
      var record = finallyEntry ? finallyEntry.completion : {};
      return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
    },
    complete: function complete(record, afterLoc) {
      if ("throw" === record.type) throw record.arg;
      return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
    },
    finish: function finish(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
      }
    },
    "catch": function _catch(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if ("throw" === record.type) {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }
      throw new Error("illegal catch attempt");
    },
    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
      return this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      }, "next" === this.method && (this.arg = undefined), ContinueSentinel;
    }
  }, exports;
}
module.exports = _regeneratorRuntime, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{"./typeof.js":14}],12:[function(require,module,exports){
var _typeof = require("./typeof.js")["default"];
function _toPrimitive(input, hint) {
  if (_typeof(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (_typeof(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
module.exports = _toPrimitive, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{"./typeof.js":14}],13:[function(require,module,exports){
var _typeof = require("./typeof.js")["default"];
var toPrimitive = require("./toPrimitive.js");
function _toPropertyKey(arg) {
  var key = toPrimitive(arg, "string");
  return _typeof(key) === "symbol" ? key : String(key);
}
module.exports = _toPropertyKey, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{"./toPrimitive.js":12,"./typeof.js":14}],14:[function(require,module,exports){
function _typeof(obj) {
  "@babel/helpers - typeof";

  return (module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports), _typeof(obj);
}
module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{}],15:[function(require,module,exports){
var AsyncGenerator = require("./AsyncGenerator.js");
function _wrapAsyncGenerator(fn) {
  return function () {
    return new AsyncGenerator(fn.apply(this, arguments));
  };
}
module.exports = _wrapAsyncGenerator, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{"./AsyncGenerator.js":3}],16:[function(require,module,exports){
// TODO(Babel 8): Remove this file.

var runtime = require("../helpers/regeneratorRuntime")();
module.exports = runtime;

// Copied from https://github.com/facebook/regenerator/blob/main/packages/runtime/runtime.js#L736=
try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}

},{"../helpers/regeneratorRuntime":11}],17:[function(require,module,exports){
/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
module.exports = Worker;
},{}],18:[function(require,module,exports){
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.audioCoreLibrary=t():e.audioCoreLibrary=t()}(this,(()=>(()=>{"use strict";var e={225:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),AudioContext.prototype.verifyACL=function(){return!0},AudioContext.prototype._eventTimings={},AudioContext.prototype.newEvent=function(e){this._eventTimings[e]={begin:this.currentTime}},AudioContext.prototype.endEvent=function(e){this._eventTimings[e]&&(this._eventTimings[e].end=this.currentTime)},AudioContext.prototype.biquadFactory=function(e,t,o=1,n=0,i=0){if(!["lowpass","highpass","bandpass","lowshelf","highshelf","peaking","notch","allpass"].includes(e))return;const u=this.createBiquadFilter();return u.type=e,u.frequency.value=t,u.Q.value=o,u.gain.value=n,u.detune.value=i,u},AudioContext.prototype.toggle=function(){if("suspended"!==this.state)return;const e=document.body,t=["touchstart","touchend","mousedown","keydown","click","contextmenu","auxclick","dblclick","mousedown","mouseup","pointerup","touchend","keydown","keyup"],o=async()=>{this.resume().then((()=>n()))},n=()=>{t.forEach((t=>e.removeEventListener(t,o)))};t.forEach((t=>e.addEventListener(t,o,!1)))}},319:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),OfflineAudioContext.prototype.biquadFactory=function(e,t,o,n=1,i=0,u=0){if(!["lowpass","highpass","bandpass","lowshelf","highshelf","peaking","notch","allpass"].includes(t))return;const r=e.createBiquadFilter();return r.type=t,r.frequency.value=o,r.Q.value=n,r.gain.value=i,r.detune.value=u,r},OfflineAudioContext.prototype.toggle=function(){if("suspended"!==this.state)return;const e=document.body,t=["touchstart","touchend","mousedown","keydown"],o=()=>{this.resume().then(n)},n=()=>{t.forEach((t=>e.removeEventListener(t,o)))};t.forEach((t=>e.addEventListener(t,o,!1)))},OfflineAudioContext.prototype.unlock=function(){if("suspended"!==this.state)return;const e=document.body,t=["touchstart","touchend","mousedown","keydown","click","contextmenu","auxclick","dblclick","mousedown","mouseup","pointerup","touchend","keydown","keyup"],o=async()=>{this.resume().then((()=>n()))},n=()=>{t.forEach((t=>e.removeEventListener(t,o)))};t.forEach((t=>e.addEventListener(t,o,!1)))}}},t={};function o(n){var i=t[n];if(void 0!==i)return i.exports;var u=t[n]={exports:{}};return e[n](u,u.exports,o),u.exports}var n={};return o(225),o(319),n.named})()));

},{}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "WASMAudioDecoderCommon", {
  enumerable: true,
  get: function () {
    return _WASMAudioDecoderCommon.default;
  }
});
Object.defineProperty(exports, "WASMAudioDecoderWorker", {
  enumerable: true,
  get: function () {
    return _WASMAudioDecoderWorker.default;
  }
});
Object.defineProperty(exports, "assignNames", {
  enumerable: true,
  get: function () {
    return _utilities.assignNames;
  }
});
var _WASMAudioDecoderCommon = _interopRequireDefault(require("./src/WASMAudioDecoderCommon.js"));
var _WASMAudioDecoderWorker = _interopRequireDefault(require("./src/WASMAudioDecoderWorker.js"));
var _utilities = require("./src/utilities.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./src/WASMAudioDecoderCommon.js":20,"./src/WASMAudioDecoderWorker.js":21,"./src/utilities.js":22}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = WASMAudioDecoderCommon;
function WASMAudioDecoderCommon() {
  // setup static methods
  const uint8Array = Uint8Array;
  const float32Array = Float32Array;
  if (!WASMAudioDecoderCommon.modules) {
    Object.defineProperties(WASMAudioDecoderCommon, {
      modules: {
        value: new WeakMap()
      },
      setModule: {
        value(Ref, module) {
          WASMAudioDecoderCommon.modules.set(Ref, Promise.resolve(module));
        }
      },
      getModule: {
        value(Ref, wasmString) {
          let module = WASMAudioDecoderCommon.modules.get(Ref);
          if (!module) {
            if (!wasmString) {
              wasmString = Ref.wasm;
              module = WASMAudioDecoderCommon.inflateDynEncodeString(wasmString).then(data => WebAssembly.compile(data));
            } else {
              module = WebAssembly.compile(WASMAudioDecoderCommon.decodeDynString(wasmString));
            }
            WASMAudioDecoderCommon.modules.set(Ref, module);
          }
          return module;
        }
      },
      concatFloat32: {
        value(buffers, length) {
          let ret = new float32Array(length),
            i = 0,
            offset = 0;
          while (i < buffers.length) {
            ret.set(buffers[i], offset);
            offset += buffers[i++].length;
          }
          return ret;
        }
      },
      getDecodedAudio: {
        value: (errors, channelData, samplesDecoded, sampleRate, bitDepth) => ({
          errors,
          channelData,
          samplesDecoded,
          sampleRate,
          bitDepth
        })
      },
      getDecodedAudioMultiChannel: {
        value(errors, input, channelsDecoded, samplesDecoded, sampleRate, bitDepth) {
          let channelData = [],
            i,
            j;
          for (i = 0; i < channelsDecoded; i++) {
            const channel = [];
            for (j = 0; j < input.length;) channel.push(input[j++][i] || []);
            channelData.push(WASMAudioDecoderCommon.concatFloat32(channel, samplesDecoded));
          }
          return WASMAudioDecoderCommon.getDecodedAudio(errors, channelData, samplesDecoded, sampleRate, bitDepth);
        }
      },
      /*
       ******************
       * Compression Code
       ******************
       */

      crc32Table: {
        value: (() => {
          let crc32Table = new Int32Array(256),
            i,
            j,
            c;
          for (i = 0; i < 256; i++) {
            for (c = i << 24, j = 8; j > 0; --j) c = c & 0x80000000 ? c << 1 ^ 0x04c11db7 : c << 1;
            crc32Table[i] = c;
          }
          return crc32Table;
        })()
      },
      decodeDynString: {
        value(source) {
          let output = new uint8Array(source.length);
          let offset = parseInt(source.substring(11, 13), 16);
          let offsetReverse = 256 - offset;
          let crcIdx,
            escaped = false,
            byteIndex = 0,
            byte,
            i = 21,
            expectedCrc,
            resultCrc = 0xffffffff;
          while (i < source.length) {
            byte = source.charCodeAt(i++);
            if (byte === 61 && !escaped) {
              escaped = true;
              continue;
            }
            if (escaped) {
              escaped = false;
              byte -= 64;
            }
            output[byteIndex] = byte < offset && byte > 0 ? byte + offsetReverse : byte - offset;
            resultCrc = resultCrc << 8 ^ WASMAudioDecoderCommon.crc32Table[(resultCrc >> 24 ^ output[byteIndex++]) & 255];
          }

          // expected crc
          for (crcIdx = 0; crcIdx <= 8; crcIdx += 2) expectedCrc |= parseInt(source.substring(13 + crcIdx, 15 + crcIdx), 16) << crcIdx * 4;
          if (expectedCrc !== resultCrc) throw new Error("WASM string decode failed crc32 validation");
          return output.subarray(0, byteIndex);
        }
      },
      inflateDynEncodeString: {
        value(source) {
          source = WASMAudioDecoderCommon.decodeDynString(source);
          return new Promise(resolve => {
            // prettier-ignore
            const puffString = String.raw`dynEncode0114db91da9bu*ttt$#U¤¤U¤¤3yzzss|yusvuyÚ&4<054<,5T44^T44<(6U~J(44< ~A544U~6J0444545 444J0444J,4U4UÒ7U454U4Z4U4U^/6545T4T44BU~64CU~O4U54U~5 U5T4B4Z!4U~5U5U5T4U~6U4ZTU5U5T44~4O4U2ZTU5T44Z!4B6T44U~64B6U~O44U~4O4U~54U~5 44~C4~54U~5 44~5454U4B6Ub!444~UO4U~5 U54U4ZTU#44U$464<4~B6^4<444~U~B4U~54U544~544~U5 µUä#UJUè#5TT4U0ZTTUX5U5T4T4Uà#~4OU4U $~C4~54U~5 T44$6U\!TTT4UaT4<6T4<64<Z!44~4N4<U~5 4UZ!4U±_TU#44UU6UÔ~B$544$6U\!4U6U¤#~B44Uä#~B$~64<6_TU#444U~B~6~54<Y!44<_!T4Y!4<64~444~AN44<U~6J4U5 44J4U[!U#44UO4U~54U~5 U54 7U6844J44J 4UJ4UJ04VK(44<J44<J$4U´~54U~5 4U¤~5!TTT4U$5"U5TTTTTTT4U$"4VK,U54<(6U~64<$6_!4< 64~6A54A544U~6#J(U54A4U[!44J(44#~A4U6UUU[!4464~64_!4<64~54<6T4<4]TU5 T4Y!44~44~AN4U~54U~54U5 44J(44J UÄA!U5U#UôJU"UÔJU#UÔ"JU#U´"JT4U´ZTU5T4UôZTU5T4UDZTU5T4U$[T44~UO4U~5 UÔUô4U~U´$.U5T4UP[T4U~4~UO4U~5 U#<U#<4U~U2$.UÄUN 44 ~UO4U~5 44!~UO4U~5 4U~4~UO4U~5 44J44J(U5 44U¤~J@44Uä~J<44UD~J844U~J44U$54U$5U54U$54U1^4U1^!4U~54U~5U54U~6U4U^/65T4T4U$54U~4BU~4O4U54U~5 UU'464U'_/54UU~5T4T4U~4BU~UO4U54U~5 U54Uä~4U¤~4U~U'$!44~5U5T44\T44U<~$6U\!4U#aT4U~4U~4O4U~5 U5U5U5TTT4U$"4YTU5 4U4~C5U5 U5U5444$4~64~\TU5 4U~4U~5T4Y!44O4U~54U~54U5 4CYTU5 4Uä~4U¤~4U~4$6TU54U\!44Bæ4Bä~[!4U~4UD~4U~4U~4$6TU54U\!44B4B~[!44U<~4U4~$5 4U"U#$544"Y!454U^!44<J44<(J454U~84­UN!#%'+/37?GOWgw·×÷Uä;U9$%& !"#`;
            WASMAudioDecoderCommon.getModule(WASMAudioDecoderCommon, puffString).then(wasm => WebAssembly.instantiate(wasm, {})).then(({
              exports
            }) => {
              // required for minifiers that mangle the __heap_base property
              const instanceExports = new Map(Object.entries(exports));
              const puff = instanceExports.get("puff");
              const memory = instanceExports.get("memory")["buffer"];
              const dataArray = new uint8Array(memory);
              const heapView = new DataView(memory);
              let heapPos = instanceExports.get("__heap_base");

              // source length
              const sourceLength = source.length;
              const sourceLengthPtr = heapPos;
              heapPos += 4;
              heapView.setInt32(sourceLengthPtr, sourceLength, true);

              // source data
              const sourcePtr = heapPos;
              heapPos += sourceLength;
              dataArray.set(source, sourcePtr);

              // destination length
              const destLengthPtr = heapPos;
              heapPos += 4;
              heapView.setInt32(destLengthPtr, dataArray.byteLength - heapPos, true);

              // destination data fills in the rest of the heap
              puff(heapPos, destLengthPtr, sourcePtr, sourceLengthPtr);
              resolve(dataArray.slice(heapPos, heapPos + heapView.getInt32(destLengthPtr, true)));
            });
          });
        }
      }
    });
  }
  Object.defineProperty(this, "wasm", {
    enumerable: true,
    get: () => this._wasm
  });
  this.getOutputChannels = (outputData, channelsDecoded, samplesDecoded) => {
    let output = [],
      i = 0;
    while (i < channelsDecoded) output.push(outputData.slice(i * samplesDecoded, i++ * samplesDecoded + samplesDecoded));
    return output;
  };
  this.allocateTypedArray = (len, TypedArray, setPointer = true) => {
    const ptr = this._wasm.malloc(TypedArray.BYTES_PER_ELEMENT * len);
    if (setPointer) this._pointers.add(ptr);
    return {
      ptr: ptr,
      len: len,
      buf: new TypedArray(this._wasm.HEAP, ptr, len)
    };
  };
  this.free = () => {
    this._pointers.forEach(ptr => {
      this._wasm.free(ptr);
    });
    this._pointers.clear();
  };
  this.codeToString = ptr => {
    const characters = [],
      heap = new Uint8Array(this._wasm.HEAP);
    for (let character = heap[ptr]; character !== 0; character = heap[++ptr]) characters.push(character);
    return String.fromCharCode.apply(null, characters);
  };
  this.addError = (errors, message, frameLength, frameNumber, inputBytes, outputSamples) => {
    errors.push({
      message: message,
      frameLength: frameLength,
      frameNumber: frameNumber,
      inputBytes: inputBytes,
      outputSamples: outputSamples
    });
  };
  this.instantiate = (_EmscriptenWASM, _module) => {
    if (_module) WASMAudioDecoderCommon.setModule(_EmscriptenWASM, _module);
    this._wasm = new _EmscriptenWASM(WASMAudioDecoderCommon).instantiate();
    this._pointers = new Set();
    return this._wasm.ready.then(() => this);
  };
}

},{}],21:[function(require,module,exports){
(function (process,Buffer){(function (){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _webWorker = _interopRequireDefault(require("@eshaz/web-worker"));
var _WASMAudioDecoderCommon2 = _interopRequireDefault(require("./WASMAudioDecoderCommon.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const getWorker = () => globalThis.Worker || _webWorker.default;
class WASMAudioDecoderWorker extends getWorker() {
  constructor(options, name, Decoder, EmscriptenWASM) {
    if (!_WASMAudioDecoderCommon2.default.modules) new _WASMAudioDecoderCommon2.default();
    let source = _WASMAudioDecoderCommon2.default.modules.get(Decoder);
    if (!source) {
      let type = "text/javascript",
        isNode,
        webworkerSourceCode = "'use strict';" +
        // dependencies need to be manually resolved when stringifying this function
        `(${((_Decoder, _WASMAudioDecoderCommon, _EmscriptenWASM) => {
          // We're in a Web Worker

          // setup Promise that will be resolved once the WebAssembly Module is received
          let decoder,
            moduleResolve,
            modulePromise = new Promise(resolve => {
              moduleResolve = resolve;
            });
          self.onmessage = ({
            data: {
              id,
              command,
              data
            }
          }) => {
            let messagePromise = modulePromise,
              messagePayload = {
                id
              },
              transferList;
            if (command === "init") {
              Object.defineProperties(_Decoder, {
                WASMAudioDecoderCommon: {
                  value: _WASMAudioDecoderCommon
                },
                EmscriptenWASM: {
                  value: _EmscriptenWASM
                },
                module: {
                  value: data.module
                },
                isWebWorker: {
                  value: true
                }
              });
              decoder = new _Decoder(data.options);
              moduleResolve();
            } else if (command === "free") {
              decoder.free();
            } else if (command === "ready") {
              messagePromise = messagePromise.then(() => decoder.ready);
            } else if (command === "reset") {
              messagePromise = messagePromise.then(() => decoder.reset());
            } else {
              // "decode":
              // "decodeFrame":
              // "decodeFrames":
              Object.assign(messagePayload, decoder[command](
              // detach buffers
              Array.isArray(data) ? data.map(data => new Uint8Array(data)) : new Uint8Array(data)));
              // The "transferList" parameter transfers ownership of channel data to main thread,
              // which avoids copying memory.
              transferList = messagePayload.channelData ? messagePayload.channelData.map(channel => channel.buffer) : [];
            }
            messagePromise.then(() => self.postMessage(messagePayload, transferList));
          };
        }).toString()})(${Decoder}, ${_WASMAudioDecoderCommon2.default}, ${EmscriptenWASM})`;
      try {
        isNode = typeof process.versions.node !== "undefined";
      } catch {}
      source = isNode ? `data:${type};base64,${Buffer.from(webworkerSourceCode).toString("base64")}` : URL.createObjectURL(new Blob([webworkerSourceCode], {
        type
      }));
      _WASMAudioDecoderCommon2.default.modules.set(Decoder, source);
    }
    super(source, {
      name
    });
    this._id = Number.MIN_SAFE_INTEGER;
    this._enqueuedOperations = new Map();
    this.onmessage = ({
      data
    }) => {
      const {
        id,
        ...rest
      } = data;
      this._enqueuedOperations.get(id)(rest);
      this._enqueuedOperations.delete(id);
    };
    new EmscriptenWASM(_WASMAudioDecoderCommon2.default).getModule().then(module => {
      this.postToDecoder("init", {
        module,
        options
      });
    });
  }
  async postToDecoder(command, data) {
    return new Promise(resolve => {
      this.postMessage({
        command,
        id: this._id,
        data
      });
      this._enqueuedOperations.set(this._id++, resolve);
    });
  }
  get ready() {
    return this.postToDecoder("ready");
  }
  async free() {
    await this.postToDecoder("free").finally(() => {
      this.terminate();
    });
  }
  async reset() {
    await this.postToDecoder("reset");
  }
}
exports.default = WASMAudioDecoderWorker;

}).call(this)}).call(this,require('_process'),require("buffer").Buffer)
},{"./WASMAudioDecoderCommon.js":20,"@eshaz/web-worker":17,"_process":87,"buffer":36}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assignNames = void 0;
const assignNames = (Class, name) => {
  Object.defineProperty(Class, "name", {
    value: name
  });
};
exports.assignNames = assignNames;

},{}],23:[function(require,module,exports){
(function (global){(function (){
'use strict';

var objectAssign = require('object-assign');

// compare and isBuffer taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
// original notice:

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
function compare(a, b) {
  if (a === b) {
    return 0;
  }

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) {
    return -1;
  }
  if (y < x) {
    return 1;
  }
  return 0;
}
function isBuffer(b) {
  if (global.Buffer && typeof global.Buffer.isBuffer === 'function') {
    return global.Buffer.isBuffer(b);
  }
  return !!(b != null && b._isBuffer);
}

// based on node assert, original notice:
// NB: The URL to the CommonJS spec is kept just for tradition.
//     node-assert has evolved a lot since then, both in API and behavior.

// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var util = require('util/');
var hasOwn = Object.prototype.hasOwnProperty;
var pSlice = Array.prototype.slice;
var functionsHaveNames = (function () {
  return function foo() {}.name === 'foo';
}());
function pToString (obj) {
  return Object.prototype.toString.call(obj);
}
function isView(arrbuf) {
  if (isBuffer(arrbuf)) {
    return false;
  }
  if (typeof global.ArrayBuffer !== 'function') {
    return false;
  }
  if (typeof ArrayBuffer.isView === 'function') {
    return ArrayBuffer.isView(arrbuf);
  }
  if (!arrbuf) {
    return false;
  }
  if (arrbuf instanceof DataView) {
    return true;
  }
  if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
    return true;
  }
  return false;
}
// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

var regex = /\s*function\s+([^\(\s]*)\s*/;
// based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
function getName(func) {
  if (!util.isFunction(func)) {
    return;
  }
  if (functionsHaveNames) {
    return func.name;
  }
  var str = func.toString();
  var match = str.match(regex);
  return match && match[1];
}
assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  } else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = getName(stackStartFunction);
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function truncate(s, n) {
  if (typeof s === 'string') {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}
function inspect(something) {
  if (functionsHaveNames || !util.isFunction(something)) {
    return util.inspect(something);
  }
  var rawname = getName(something);
  var name = rawname ? ': ' + rawname : '';
  return '[Function' +  name + ']';
}
function getMessage(self) {
  return truncate(inspect(self.actual), 128) + ' ' +
         self.operator + ' ' +
         truncate(inspect(self.expected), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual);
  }
};

function _deepEqual(actual, expected, strict, memos) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;
  } else if (isBuffer(actual) && isBuffer(expected)) {
    return compare(actual, expected) === 0;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if ((actual === null || typeof actual !== 'object') &&
             (expected === null || typeof expected !== 'object')) {
    return strict ? actual === expected : actual == expected;

  // If both values are instances of typed arrays, wrap their underlying
  // ArrayBuffers in a Buffer each to increase performance
  // This optimization requires the arrays to have the same type as checked by
  // Object.prototype.toString (aka pToString). Never perform binary
  // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
  // bit patterns are not identical.
  } else if (isView(actual) && isView(expected) &&
             pToString(actual) === pToString(expected) &&
             !(actual instanceof Float32Array ||
               actual instanceof Float64Array)) {
    return compare(new Uint8Array(actual.buffer),
                   new Uint8Array(expected.buffer)) === 0;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else if (isBuffer(actual) !== isBuffer(expected)) {
    return false;
  } else {
    memos = memos || {actual: [], expected: []};

    var actualIndex = memos.actual.indexOf(actual);
    if (actualIndex !== -1) {
      if (actualIndex === memos.expected.indexOf(expected)) {
        return true;
      }
    }

    memos.actual.push(actual);
    memos.expected.push(expected);

    return objEquiv(actual, expected, strict, memos);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b, strict, actualVisitedObjects) {
  if (a === null || a === undefined || b === null || b === undefined)
    return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b))
    return a === b;
  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
    return false;
  var aIsArgs = isArguments(a);
  var bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b, strict);
  }
  var ka = objectKeys(a);
  var kb = objectKeys(b);
  var key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length !== kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] !== kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects))
      return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

assert.notDeepStrictEqual = notDeepStrictEqual;
function notDeepStrictEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
  }
}


// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  }

  try {
    if (actual instanceof expected) {
      return true;
    }
  } catch (e) {
    // Ignore.  The instanceof check doesn't work for arrow functions.
  }

  if (Error.isPrototypeOf(expected)) {
    return false;
  }

  return expected.call({}, actual) === true;
}

function _tryBlock(block) {
  var error;
  try {
    block();
  } catch (e) {
    error = e;
  }
  return error;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (typeof block !== 'function') {
    throw new TypeError('"block" argument must be a function');
  }

  if (typeof expected === 'string') {
    message = expected;
    expected = null;
  }

  actual = _tryBlock(block);

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  var userProvidedMessage = typeof message === 'string';
  var isUnwantedException = !shouldThrow && util.isError(actual);
  var isUnexpectedException = !shouldThrow && actual && !expected;

  if ((isUnwantedException &&
      userProvidedMessage &&
      expectedException(actual, expected)) ||
      isUnexpectedException) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws(true, block, error, message);
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
  _throws(false, block, error, message);
};

assert.ifError = function(err) { if (err) throw err; };

// Expose a strict only variant of assert
function strict(value, message) {
  if (!value) fail(value, true, message, '==', strict);
}
assert.strict = objectAssign(strict, assert, {
  equal: assert.strictEqual,
  deepEqual: assert.deepStrictEqual,
  notEqual: assert.notStrictEqual,
  notDeepEqual: assert.notDeepStrictEqual
});
assert.strict.strict = assert.strict;

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"object-assign":75,"util/":26}],24:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],25:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],26:[function(require,module,exports){
(function (process,global){(function (){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":25,"_process":87,"inherits":24}],27:[function(require,module,exports){
module.exports = function _atob(str) {
  return atob(str)
}

},{}],28:[function(require,module,exports){
/**
 * @module  audio-dtype
 */

'use strict'

var AudioBuffer = require('audio-buffer')
var isAudioBuffer = require('is-audio-buffer')
var isObj = require('is-plain-obj')
var getContext = require('audio-context')
var convert = require('pcm-convert')
var format = require('audio-format')
var str2ab = require('string-to-arraybuffer')
var pick = require('pick-by-alias')

module.exports = function createBuffer (source, options) {
	var length, data, channels, sampleRate, format, c, l

	//src, channels
	if (typeof options === 'number') {
		options = {channels: options}
	}
	else if (typeof options === 'string') {
		options = {format: options}
	}
	//{}
	else if (options === undefined) {
		if (isObj(source)) {
			options = source
			source = undefined
		}
		else {
			options = {}
		}
	}

	options = pick(options, {
		format: 'format type dtype dataType',
		channels: 'channel channels numberOfChannels channelCount',
		sampleRate: 'sampleRate rate',
		length: 'length size',
		duration: 'duration time'
	})

	//detect options
	channels = options.channels
	sampleRate = options.sampleRate
	if (options.format) format = getFormat(options.format)

	if (format) {
		if (channels && !format.channels) format.channels = channels
		else if (format.channels && !channels) channels = format.channels
		if (!sampleRate && format.sampleRate) sampleRate = format.sampleRate
	}

	//empty buffer
	if (source == null) {
		if (options.duration != null) {
			if (!sampleRate) sampleRate = 44100
			length = sampleRate * options.duration
		}
		else length = options.length
	}

	//if audio buffer passed - create fast clone of it
	else if (isAudioBuffer(source)) {
		length = source.length
		if (channels == null) channels = source.numberOfChannels
		if (sampleRate == null) sampleRate = source.sampleRate

		if (source._channelData) {
			data = source._channelData.slice(0, channels)
		}
		else {
			data = []

			for (c = 0, l = channels; c < l; c++) {
				data[c] = source.getChannelData(c)
			}
		}
	}

	//if create(number, channels? rate?) = create new array
	//this is the default WAA-compatible case
	else if (typeof source === 'number') {
		length = source
	}

	//if array with channels - parse channeled data
	else if (Array.isArray(source) && (Array.isArray(source[0]) || ArrayBuffer.isView(source[0]))) {
		length = source[0].length;
		data = []
		if (!channels) channels = source.length
		for (c = 0; c < channels; c++) {
			data[c] = source[c] instanceof Float32Array ? source[c] : new Float32Array(source[c])
		}
	}

	//if ndarray, ndsamples, or anything with data
	else if (source.shape && source.data) {
		if (source.shape) channels = source.shape[1]
		if (!sampleRate && source.format) sampleRate = source.format.sampleRate

		return createBuffer(source.data, {
			channels: channels,
			sampleRate: sampleRate
		})
	}

	//TypedArray, Buffer, DataView etc, ArrayBuffer, Array etc.
	//NOTE: node 4.x+ detects Buffer as ArrayBuffer view
	else {
		if (typeof source === 'string') {
			source = str2ab(source)
		}

		if (!format) format = getFormat(source)
		if (!channels) channels = format.channels || 1
		source = convert(source, format, 'float32 planar')

		length = Math.floor(source.length / channels);
		data = []
		for (c = 0; c < channels; c++) {
			data[c] = source.subarray(c * length, (c + 1) * length);
		}
	}

	//create buffer of proper length
	var audioBuffer = new AudioBuffer((options.context === null || length === 0) ? null : options.context || getContext(), {
		length: length == null ? 1 : length,
		numberOfChannels: channels || 1,
		sampleRate: sampleRate || 44100
	})

	//fill channels
	if (data) {
		for (c = 0, l = data.length; c < l; c++) {
			audioBuffer.getChannelData(c).set(data[c]);
		}
	}


	return audioBuffer
}


function getFormat (arg) {
	return typeof arg === 'string' ? format.parse(arg) : format.detect(arg)
}

},{"audio-buffer":31,"audio-context":32,"audio-format":33,"is-audio-buffer":68,"is-plain-obj":72,"pcm-convert":84,"pick-by-alias":86,"string-to-arraybuffer":89}],29:[function(require,module,exports){
/**
 * AudioBufferList class
 *
 * @module audio-buffer/buffer
 *
 */
'use strict'

var isAudioBuffer = require('is-audio-buffer')
var util = require('audio-buffer-utils')
var extend = require('object-assign')
var nidx = require('negative-index')
var isPlainObj = require('is-plain-obj')
var AudioBuffer = require('audio-buffer')

module.exports = AudioBufferList


// @constructor
function AudioBufferList(arg, options) {
  if (!(this instanceof AudioBufferList)) return new AudioBufferList(arg, options)

  if (isPlainObj(arg)) {
    options = arg
    arg = null
  }
  if (typeof options === 'number') {
    options = {channels: options}
  }
  if (options && options.channels != null) options.numberOfChannels = options.channels

  extend(this, options)

  this.buffers = []
  this.length = 0
  this.duration = 0

  this.append(arg)
}


//AudioBuffer interface
AudioBufferList.prototype.numberOfChannels = 1
AudioBufferList.prototype.sampleRate = null


//copy from channel into destination array
AudioBufferList.prototype.copyFromChannel = function (destination, channel, from, to) {
  if (from == null) from = 0
  if (to == null) to = this.length
  from = nidx(from, this.length)
  to = nidx(to, this.length)

  var fromOffset = this.offset(from)
  var bufOffset = from - fromOffset[1]
  var initialOffset = from
  var toOffset = this.offset(to)

  if (fromOffset[0] === toOffset[0]) {
    var buf = this.buffers[fromOffset[0]]
    var data = buf.getChannelData(channel).subarray(fromOffset[1], toOffset[1])
    destination.set(data)
    return this
  }

  for (var i = fromOffset[0], l = toOffset[0]; i < l; i++) {
    var buf = this.buffers[i]
    var data = buf.getChannelData(channel)
    if (from > bufOffset) data = data.subarray(from - bufOffset)
    if (channel < buf.numberOfChannels) {
      destination.set(data, Math.max(0, -initialOffset + bufOffset))
    }
    bufOffset += buf.length
  }

  var lastBuf = this.buffers[toOffset[0]]
  if (toOffset[1]) {
    destination.set(lastBuf.getChannelData(channel).subarray(0, toOffset[1]), Math.max(0, bufOffset - initialOffset))
  }

  return this
}

//put data from array to channel
AudioBufferList.prototype.copyToChannel = function (source, channel, from) {
  if (from == null) from = 0
  from = nidx(from, this.length)

  var offsets = this.offset(from)
  var bufOffset = from - offsets[1]

  source = source.subarray(0, this.length - from)

  for (var i = offsets[0], l = this.buffers.length; i < l; i++) {
    var buf = this.buffers[i]
    var channelData = buf.getChannelData(channel)
    if (channel < buf.numberOfChannels) {
      var chunk = source.subarray(Math.max(0, bufOffset - from), bufOffset - from + buf.length)
      channelData.set(chunk, from > bufOffset ? from : 0);
    }
    bufOffset += buf.length
  }

  return this
}


//patch BufferList methods
AudioBufferList.prototype.append = function (buf) {
  //FIXME: we may want to do resampling/channel mapping here or something
  var i = 0

  // unwrap argument into individual BufferLists
  if (buf instanceof AudioBufferList) {
    this.append(buf.buffers)
  }
  else if (isAudioBuffer(buf) && buf.length) {
    this._appendBuffer(buf)
  }
  else if (Array.isArray(buf) && typeof buf[0] !== 'number') {
    for (var l = buf.length; i < l; i++) {
      this.append(buf[i])
    }
  }
  //create AudioBuffer from (possibly num) arg
  else if (buf) {
    buf = util.create(buf, this.numberOfChannels, this.sampleRate)
    this._appendBuffer(buf)
  }

  return this
}

AudioBufferList.prototype._appendBuffer = function (buf) {
  if (!buf) return this

  //update channels count
  if (!this.buffers.length) {
    this.numberOfChannels = buf.numberOfChannels
  }
  else {
    this.numberOfChannels = Math.max(this.numberOfChannels, buf.numberOfChannels)
  }
  this.duration += buf.duration

  //init sampleRate
  if (!this.sampleRate) this.sampleRate = buf.sampleRate

  //push buffer
  this.buffers.push(buf)
  this.length += buf.length

  return this
}


AudioBufferList.prototype.offset = function _offset (offset) {
  var tot = 0, i = 0, _t
  if (offset === 0) return [ 0, 0 ]
  for (; i < this.buffers.length; i++) {
    _t = tot + this.buffers[i].length
    if (offset < _t || i == this.buffers.length - 1)
      return [ i, offset - tot ]
    tot = _t
  }
}



//copy data to destination audio buffer
AudioBufferList.prototype.copy = function copy (dst, dstStart, srcStart, srcEnd) {
  if (typeof dst === 'number') {
    srcEnd = srcStart;
    srcStart = dstStart
    dstStart = dst;
    dst = null;
  }
  if (srcEnd == null && srcStart != null) {
    srcEnd = srcStart
    srcStart = dstStart
    dstStart = 0
  }

  if (typeof srcStart != 'number' || srcStart < 0)
    srcStart = 0
  if (typeof srcEnd != 'number' || srcEnd > this.length)
    srcEnd = this.length
  if (srcStart >= this.length)
    return dst || new AudioBuffer(null, {length: 0})
  if (srcEnd <= 0)
    return dst || new AudioBuffer(null, {length: 0})

  var copy   = !!dst
    , off    = this.offset(srcStart)
    , len    = srcEnd - srcStart
    , bytes  = len
    , bufoff = (copy && dstStart) || 0
    , start  = off[1]
    , l
    , i

  // copy/slice everything
  if (srcStart === 0 && srcEnd == this.length) {
    if (!copy) { // slice, but full concat if multiple buffers
      return this.buffers.length === 1
        ? util.slice(this.buffers[0])
        : util.concat(this.buffers)
    }
    // copy, need to copy individual buffers
    for (i = 0; i < this.buffers.length; i++) {
      util.copy(this.buffers[i], dst, bufoff)
      bufoff += this.buffers[i].length
    }

    return dst
  }

  // easy, cheap case where it's a subset of one of the buffers
  if (bytes <= this.buffers[off[0]].length - start) {
    return copy
      ? util.copy(util.subbuffer(this.buffers[off[0]], start, start + bytes), dst, dstStart)
      : util.slice(this.buffers[off[0]], start, start + bytes)
  }

  if (!copy) // a slice, we need something to copy in to
    dst = util.create(len, this.numberOfChannels)

  for (i = off[0]; i < this.buffers.length; i++) {
    l = this.buffers[i].length - start

    if (bytes > l) {
      util.copy(util.subbuffer(this.buffers[i], start), dst, bufoff)
    } else {
      util.copy(util.subbuffer(this.buffers[i], start, start + bytes), dst, bufoff)
      break
    }

    bufoff += l
    bytes -= l

    if (start)
      start = 0
  }

  return dst
}

//create a new list with the same data
AudioBufferList.prototype.clone = function clone (start, end) {
  var i = 0, copy = new AudioBufferList(0, this.numberOfChannels), sublist = this.slice(start, end)

  for (; i < sublist.buffers.length; i++)
    copy.append(util.clone(sublist.buffers[i]))

  return copy
}

//do superficial handle
AudioBufferList.prototype.slice = function slice (start, end) {
  start = start || 0
  end = end == null ? this.length : end

  start = nidx(start, this.length)
  end = nidx(end, this.length)

  if (start == end) {
    return new AudioBufferList(0, this.numberOfChannels)
  }

  var startOffset = this.offset(start)
    , endOffset = this.offset(end)
    , buffers = this.buffers.slice(startOffset[0], endOffset[0] + 1)

  if (endOffset[1] == 0) {
    buffers.pop()
  }
  else {
    buffers[buffers.length-1] = util.subbuffer(buffers[buffers.length-1], 0, endOffset[1])
  }

  if (startOffset[1] != 0) {
    buffers[0] = util.subbuffer(buffers[0], startOffset[1])
  }

  return new AudioBufferList(buffers, this.numberOfChannels)
}


//clean up
AudioBufferList.prototype.destroy = function destroy () {
  this.buffers.length = 0
  this.length = 0
  this.buffers = null
}


//repeat contents N times
AudioBufferList.prototype.repeat = function (times) {
  times = Math.floor(times)
  if (!times && times !== 0 || !Number.isFinite(times)) throw RangeError('Repeat count must be non-negative number.')

  if (!times) {
    this.remove(0, this.length)
    return this
  }

  if (times === 1) return this

  var data = this

  for (var i = 1; i < times; i++) {
    data = new AudioBufferList(data.copy())
    this.append(data)
  }

  return this
}

//insert new buffer/buffers at the offset
AudioBufferList.prototype.insert = function (offset, source) {
  if (source == null) {
    source = offset
    offset = 0
  }

  offset = nidx(offset, this.length)

  this.split(offset)

  offset = this.offset(offset)

  //convert any type of source to audio buffer list
  source = new AudioBufferList(source)

  this.buffers.splice.apply(this.buffers, [offset[0] + (offset[1] ? 1 : 0), 0].concat(source.buffers))

  //update params
  this.length += source.length
  this.duration += source.duration
  this.numberOfChannels = Math.max(source.numberOfChannels, this.numberOfChannels)

  return this
}

//delete N samples from any position
AudioBufferList.prototype.remove = function (offset, count) {
  if (!this.length) return null

  if (count == null) {
    count = offset
    offset = 0
  }
  if (!count) return this

  if (count < 0) {
    count = -count
    offset -= count
  }

  offset = nidx(offset, this.length)
  count = Math.min(this.length - offset, count)

  this.split(offset, offset + count)

  var offsetLeft = this.offset(offset)
  var offsetRight = this.offset(offset + count)

  if (offsetRight[1] === this.buffers[offsetRight[0]].length) {
    offsetRight[0] += 1
  }

  let deleted = this.buffers.splice(offsetLeft[0], offsetRight[0] - offsetLeft[0])
  deleted = new AudioBufferList(deleted, this.numberOfChannels)

  this.length -= deleted.length
  this.duration = this.length / this.sampleRate

  return deleted
}

//return new list via applying fn to each buffer from the indicated range
AudioBufferList.prototype.map = function map (fn, from, to) {
  let options = arguments[arguments.length - 1]
  if (!isPlainObj(options)) options = {reversed: false}

  if (typeof from != 'number') from = 0
  if (typeof to != 'number') to = this.length
  from = nidx(from, this.length)
  to = nidx(to, this.length)

  this.split(from, to)

  let fromOffset = this.offset(from)
  let toOffset = this.offset(to)

  if (options.reversed) {
    let offset = to - toOffset[1]
    for (let i = toOffset[0], l = fromOffset[0]; i >= l; i--) {
      let buf = this.buffers[i]
      let res = fn.call(this, buf, i, offset, this.buffers, this)
      if (res === false) break
      if (res !== undefined) this.buffers[i] = res
      offset -= buf.length
    }
  }
  else {
    if (toOffset[1]) {
      toOffset[0] += 1
      toOffset[1] = 0
    }
    let offset = from - fromOffset[1]
    for (let i = fromOffset[0], l = toOffset[0]; i < l; i++) {
      let buf = this.buffers[i]
      let res = fn.call(this, buf, i, offset, this.buffers, this)
      if (res === false) break
      if (res !== undefined) {
        this.buffers[i] = res
      }
      offset += buf.length
    }
  }

  this.buffers = this.buffers.filter(buf => {
    return buf ? !!buf.length : false
  })

  let l = 0
  for (let i = 0; i < this.buffers.length; i++) {
    this.numberOfChannels = Math.max(this.buffers[i].numberOfChannels, this.numberOfChannels)
    l += this.buffers[i].length
  }
  this.length = l
  this.duration = this.length / this.sampleRate

  return this
}


//split at the indicated indexes
AudioBufferList.prototype.split = function split () {
  let args = arguments;

  for (let i = 0; i < args.length; i++ ) {
    let arg = args[i]
    if (Array.isArray(arg)) {
      this.split.apply(this, arg)
    }
    else if (typeof arg === 'number') {
      let offset = this.offset(arg)
      let buf = this.buffers[offset[0]]

      if (offset[1] > 0 && offset[1] < buf.length) {
        let left = util.subbuffer(buf, 0, offset[1])
        let right = util.subbuffer(buf, offset[1])

        this.buffers.splice(offset[0], 1, left, right)
      }
    }
  }

  return this
}


//join buffers within the subrange
AudioBufferList.prototype.join = function join (from, to) {
  if (from == null) from = 0
  if (to == null) to = this.length

  from = nidx(from, this.length)
  to = nidx(to, this.length)

  let fromOffset = this.offset(from)
  let toOffset = this.offset(to)

  if (toOffset[1]) {
    toOffset[0] += 1
    toOffset[1] = 0
  }

  let bufs = this.buffers.slice(fromOffset[0], toOffset[0])

  let buf = util.concat(bufs)

  this.buffers.splice.apply(this.buffers, [fromOffset[0], toOffset[0] - fromOffset[0] + (toOffset[1] ? 1 : 0)].concat(buf))

  return buf
}

},{"audio-buffer":31,"audio-buffer-utils":30,"is-audio-buffer":68,"is-plain-obj":72,"negative-index":73,"object-assign":75}],30:[function(require,module,exports){
/**
 * @module  audio-buffer-utils
 */

'use strict'

var AudioBuffer = require('audio-buffer')
var isAudioBuffer = require('is-audio-buffer')
var isBrowser = require('is-browser')
var clamp = require('clamp')
var AudioContext = require('audio-context')
var isBuffer = require('is-buffer')
var createBuffer = require('audio-buffer-from')

var isNeg = function (number) {
	return number === 0 && (1 / number) === -Infinity;
};

var nidx = function negIdx (idx, length) {
	return idx == null ? 0 : isNeg(idx) ? length : idx <= -length ? 0 : idx < 0 ? (length + (idx % length)) : Math.min(length, idx);
}

var context

var utils = {
	create: create,
	copy: copy,
	shallow: shallow,
	clone: clone,
	reverse: reverse,
	invert: invert,
	zero: zero,
	noise: noise,
	equal: equal,
	fill: fill,
	slice: slice,
	concat: concat,
	resize: resize,
	pad: pad,
	padLeft: padLeft,
	padRight: padRight,
	rotate: rotate,
	shift: shift,
	normalize: normalize,
	removeStatic: removeStatic,
	trim: trim,
	trimLeft: trimLeft,
	trimRight: trimRight,
	mix: mix,
	size: size,
	data: data,
	subbuffer: subbuffer,
	repeat: repeat
}

Object.defineProperty(utils, 'context', {
	get: function () {
		if (!context) context = AudioContext()
		return context
	}
})

module.exports = utils

/**
 * Create buffer from any argument.
 * Better constructor than audio-buffer.
 */
function create (src, options, sampleRate) {
	var length, data

	if (typeof options === 'number') {
		options = {channels: options}
	}
	else if (typeof options === 'string') {
		options = {format: options}
	}
	else if (!options) {
		options = {}
	}
	if (sampleRate) {
		options.sampleRate = sampleRate
	}
	options.context = utils.context

	return createBuffer(src, options)
}


/**
 * Copy data from buffer A to buffer B
 */
function copy (from, to, offset) {
	validate(from);
	validate(to);

	offset = offset || 0;

	for (var channel = 0, l = Math.min(from.numberOfChannels, to.numberOfChannels); channel < l; channel++) {
		to.getChannelData(channel).set(from.getChannelData(channel), offset);
	}

	return to;
}


/**
 * Assert argument is AudioBuffer, throw error otherwise.
 */
function validate (buffer) {
	if (!isAudioBuffer(buffer)) throw new Error('Argument should be an AudioBuffer instance.');
}



/**
 * Create a buffer with the same characteristics as inBuffer, without copying
 * the data. Contents of resulting buffer are undefined.
 */
function shallow (buffer) {
	validate(buffer);

	//workaround for faster browser creation
	//avoid extra checks & copying inside of AudioBuffer class
	if (isBrowser) {
		return utils.context.createBuffer(buffer.numberOfChannels, buffer.length, buffer.sampleRate);
	}

	return create(buffer.length, buffer.numberOfChannels, buffer.sampleRate);
}


/**
 * Create clone of a buffer
 */
function clone (buffer) {
	return copy(buffer, shallow(buffer));
}


/**
 * Reverse samples in each channel
 */
function reverse (buffer, target, start, end) {
	validate(buffer);

	//if target buffer is passed
	if (!isAudioBuffer(target) && target != null) {
		end = start;
		start = target;
		target = null;
	}

	if (target) {
		validate(target);
		copy(buffer, target);
	}
	else {
		target = buffer;
	}

	start = start == null ? 0 : nidx(start, buffer.length);
	end = end == null ? buffer.length : nidx(end, buffer.length);

	for (var i = 0, c = target.numberOfChannels; i < c; ++i) {
		target.getChannelData(i).subarray(start, end).reverse();
	}

	return target;
}


/**
 * Invert amplitude of samples in each channel
 */
function invert (buffer, target, start, end) {
	//if target buffer is passed
	if (!isAudioBuffer(target) && target != null) {
		end = start;
		start = target;
		target = null;
	}

	return fill(buffer, target, function (sample) { return -sample; }, start, end);
}


/**
 * Fill with zeros
 */
function zero (buffer, target, start, end) {
	return fill(buffer, target, 0, start, end);
}


/**
 * Fill with white noise
 */
function noise (buffer, target, start, end) {
	return fill(buffer, target, function (sample) { return Math.random() * 2 - 1; }, start, end);
}


/**
 * Test whether two buffers are the same
 */
function equal (bufferA, bufferB) {
	//walk by all the arguments
	if (arguments.length > 2) {
		for (var i = 0, l = arguments.length - 1; i < l; i++) {
			if (!equal(arguments[i], arguments[i + 1])) return false;
		}
		return true;
	}

	validate(bufferA);
	validate(bufferB);

	if (bufferA.length !== bufferB.length || bufferA.numberOfChannels !== bufferB.numberOfChannels) return false;

	for (var channel = 0; channel < bufferA.numberOfChannels; channel++) {
		var dataA = bufferA.getChannelData(channel);
		var dataB = bufferB.getChannelData(channel);

		for (var i = 0; i < dataA.length; i++) {
			if (dataA[i] !== dataB[i]) return false;
		}
	}

	return true;
}



/**
 * Generic in-place fill/transform
 */
function fill (buffer, target, value, start, end) {
	validate(buffer);

	//if target buffer is passed
	if (!isAudioBuffer(target) && target != null) {
		//target is bad argument
		if (typeof value == 'function') {
			target = null;
		}
		else {
			end = start;
			start = value;
			value = target;
			target = null;
		}
	}

	if (target) {
		validate(target);
	}
	else {
		target = buffer;
	}

	//resolve optional start/end args
	start = start == null ? 0 : nidx(start, buffer.length);
	end = end == null ? buffer.length : nidx(end, buffer.length);
	//resolve type of value
	if (!(value instanceof Function)) {
		for (var channel = 0, c = buffer.numberOfChannels; channel < c; channel++) {
			var targetData = target.getChannelData(channel);
			for (var i = start; i < end; i++) {
				targetData[i] = value
			}
		}
	}
	else {
		for (var channel = 0, c = buffer.numberOfChannels; channel < c; channel++) {
			var data = buffer.getChannelData(channel),
				targetData = target.getChannelData(channel);
			for (var i = start; i < end; i++) {
				targetData[i] = value.call(buffer, data[i], i, channel, data);
			}
		}
	}

	return target;
}

/**
 * Repeat buffer
 */
function repeat (buffer, times) {
	validate(buffer);

	if (!times || times < 0) return new AudioBuffer(null, {length: 0, numberOfChannels: buffer.numberOfChannels, sampleRate: buffer.sampleRate})

	if (times === 1) return buffer

	var bufs = []
	for (var i = 0; i < times; i++) {
		bufs.push(buffer)
	}

	return concat(bufs)
}

/**
 * Return sliced buffer
 */
function slice (buffer, start, end) {
	validate(buffer);

	start = start == null ? 0 : nidx(start, buffer.length);
	end = end == null ? buffer.length : nidx(end, buffer.length);

	var data = [];
	for (var channel = 0; channel < buffer.numberOfChannels; channel++) {
		var channelData = buffer.getChannelData(channel)
		data.push(channelData.slice(start, end));
	}
	return create(data, buffer.numberOfChannels, buffer.sampleRate);
}

/**
 * Create handle for a buffer from subarrays
 */
function subbuffer (buffer, start, end, channels) {
	validate(buffer);

	if (Array.isArray(start)) {
		channels = start
		start = 0;
		end = -0;
	}
	else if (Array.isArray(end)) {
		channels = end
		end = -0;
	}

	if (!Array.isArray(channels)) {
		channels = Array(buffer.numberOfChannels)
		for (var c = 0; c < buffer.numberOfChannels; c++) {
			channels[c] = c
		}
	}

	start = start == null ? 0 : nidx(start, buffer.length);
	end = end == null ? buffer.length : nidx(end, buffer.length);

	var data = [];
	for (var i = 0; i < channels.length; i++) {
		var channel = channels[i]
		var channelData = buffer.getChannelData(channel)
		data.push(channelData.subarray(start, end));
	}

	//null-context buffer covers web-audio-api buffer functions
	var buf = new AudioBuffer(null, {length: 0, sampleRate: buffer.sampleRate, numberOfChannels: buffer.numberOfChannels})

	//FIXME: not reliable hack to replace data. Mb use audio-buffer-list?
	buf.length = data[0].length
	buf._data = null
	buf._channelData = data
	buf.duration = buf.length / buf.sampleRate

	return buf
}

/**
 * Concat buffer with other buffer(s)
 */
function concat () {
	var list = []

	for (var i = 0, l = arguments.length; i < l; i++) {
		var arg = arguments[i]
		if (Array.isArray(arg)) {
			for (var j = 0; j < arg.length; j++) {
				list.push(arg[j])
			}
		}
		else {
			list.push(arg)
		}
	}

	var channels = 1;
	var length = 0;
	//FIXME: there might be required more thoughtful resampling, but now I'm lazy sry :(
	var sampleRate = 0;

	for (var i = 0; i < list.length; i++) {
		var buf = list[i]
		validate(buf)
		length += buf.length
		channels = Math.max(buf.numberOfChannels, channels)
		sampleRate = Math.max(buf.sampleRate, sampleRate)
	}

	var data = [];
	for (var channel = 0; channel < channels; channel++) {
		var channelData = new Float32Array(length), offset = 0

		for (var i = 0; i < list.length; i++) {
			var buf = list[i]
			if (channel < buf.numberOfChannels) {
				channelData.set(buf.getChannelData(channel), offset);
			}
			offset += buf.length
		}

		data.push(channelData);
	}

	return create(data, channels, sampleRate);
}


/**
 * Change the length of the buffer, by trimming or filling with zeros
 */
function resize (buffer, length) {
	validate(buffer);

	if (length < buffer.length) return slice(buffer, 0, length);

	return concat(buffer, create(length - buffer.length, buffer.numberOfChannels));
}


/**
 * Pad buffer to required size
 */
function pad (a, b, value) {
	var buffer, length;

	if (typeof a === 'number') {
		buffer = b;
		length = a;
	} else {
		buffer = a;
		length = b;
	}

	value = value || 0;

	validate(buffer);

	//no need to pad
	if (length < buffer.length) return buffer;

	//left-pad
	if (buffer === b) {
		return concat(fill(create(length - buffer.length, buffer.numberOfChannels), value), buffer);
	}

	//right-pad
	return concat(buffer, fill(create(length - buffer.length, buffer.numberOfChannels), value));
}
function padLeft (data, len, value) {
	return pad(len, data, value)
}
function padRight (data, len, value) {
	return pad(data, len, value)
}



/**
 * Shift content of the buffer in circular fashion
 */
function rotate (buffer, offset) {
	validate(buffer);

	for (var channel = 0; channel < buffer.numberOfChannels; channel++) {
		var cData = buffer.getChannelData(channel);
		var srcData = cData.slice();
		for (var i = 0, l = cData.length, idx; i < l; i++) {
			idx = (offset + (offset + i < 0 ? l + i : i )) % l;
			cData[idx] = srcData[i];
		}
	}

	return buffer;
}


/**
 * Shift content of the buffer
 */
function shift (buffer, offset) {
	validate(buffer);

	for (var channel = 0; channel < buffer.numberOfChannels; channel++) {
		var cData = buffer.getChannelData(channel);
		if (offset > 0) {
			for (var i = cData.length - offset; i--;) {
				cData[i + offset] = cData[i];
			}
		}
		else {
			for (var i = -offset, l = cData.length - offset; i < l; i++) {
				cData[i + offset] = cData[i] || 0;
			}
		}
	}

	return buffer;
}


/**
 * Normalize buffer by the maximum value,
 * limit values by the -1..1 range
 */
function normalize (buffer, target, start, end) {
	//resolve optional target arg
	if (!isAudioBuffer(target)) {
		end = start;
		start = target;
		target = null;
	}

	start = start == null ? 0 : nidx(start, buffer.length);
	end = end == null ? buffer.length : nidx(end, buffer.length);

	//for every channel bring it to max-min amplitude range
	var max = 0

	for (var c = 0; c < buffer.numberOfChannels; c++) {
		var data = buffer.getChannelData(c)
		for (var i = start; i < end; i++) {
			max = Math.max(Math.abs(data[i]), max)
		}
	}

	var amp = Math.max(1 / max, 1)

	return fill(buffer, target, function (value, i, ch) {
		return clamp(value * amp, -1, 1)
	}, start, end);
}

/**
 * remove DC offset
 */
function removeStatic (buffer, target, start, end) {
	var means = mean(buffer, start, end)

	return fill(buffer, target, function (value, i, ch) {
		return value - means[ch];
	}, start, end);
}

/**
 * Get average level per-channel
 */
function mean (buffer, start, end) {
	validate(buffer)

	start = start == null ? 0 : nidx(start, buffer.length);
	end = end == null ? buffer.length : nidx(end, buffer.length);

	if (end - start < 1) return []

	var result = []

	for (var c = 0; c < buffer.numberOfChannels; c++) {
		var sum = 0
		var data = buffer.getChannelData(c)
		for (var i = start; i < end; i++) {
			sum += data[i]
		}
		result.push(sum / (end - start))
	}

	return result
}


/**
 * Trim sound (remove zeros from the beginning and the end)
 */
function trim (buffer, level) {
	return trimInternal(buffer, level, true, true);
}

function trimLeft (buffer, level) {
	return trimInternal(buffer, level, true, false);
}

function trimRight (buffer, level) {
	return trimInternal(buffer, level, false, true);
}

function trimInternal(buffer, level, trimLeft, trimRight) {
	validate(buffer);

	level = (level == null) ? 0 : Math.abs(level);

	var start, end;

	if (trimLeft) {
		start = buffer.length;
		//FIXME: replace with indexOF
		for (var channel = 0, c = buffer.numberOfChannels; channel < c; channel++) {
			var data = buffer.getChannelData(channel);
			for (var i = 0; i < data.length; i++) {
				if (i > start) break;
				if (Math.abs(data[i]) > level) {
					start = i;
					break;
				}
			}
		}
	} else {
		start = 0;
	}

	if (trimRight) {
		end = 0;
		//FIXME: replace with lastIndexOf
		for (var channel = 0, c = buffer.numberOfChannels; channel < c; channel++) {
			var data = buffer.getChannelData(channel);
			for (var i = data.length - 1; i >= 0; i--) {
				if (i < end) break;
				if (Math.abs(data[i]) > level) {
					end = i + 1;
					break;
				}
			}
		}
	} else {
		end = buffer.length;
	}

	return slice(buffer, start, end);
}


/**
 * Mix current buffer with the other one.
 * The reason to modify bufferA instead of returning the new buffer
 * is reduced amount of calculations and flexibility.
 * If required, the cloning can be done before mixing, which will be the same.
 */
function mix (bufferA, bufferB, ratio, offset) {
	validate(bufferA);
	validate(bufferB);

	if (ratio == null) ratio = 0.5;
	var fn = ratio instanceof Function ? ratio : function (a, b) {
		return a * (1 - ratio) + b * ratio;
	};

	if (offset == null) offset = 0;
	else if (offset < 0) offset += bufferA.length;

	for (var channel = 0; channel < bufferA.numberOfChannels; channel++) {
		var aData = bufferA.getChannelData(channel);
		var bData = bufferB.getChannelData(channel);

		for (var i = offset, j = 0; i < bufferA.length && j < bufferB.length; i++, j++) {
			aData[i] = fn.call(bufferA, aData[i], bData[j], j, channel);
		}
	}

	return bufferA;
}


/**
 * Size of a buffer, in bytes
 */
function size (buffer) {
	validate(buffer);

	return buffer.numberOfChannels * buffer.getChannelData(0).byteLength;
}


/**
 * Return array with buffer’s per-channel data
 */
function data (buffer, data) {
	validate(buffer);

	//ensure output data array, if not defined
	data = data || [];

	//transfer data per-channel
	for (var channel = 0; channel < buffer.numberOfChannels; channel++) {
		if (ArrayBuffer.isView(data[channel])) {
			data[channel].set(buffer.getChannelData(channel));
		}
		else {
			data[channel] = buffer.getChannelData(channel);
		}
	}

	return data;
}

},{"audio-buffer":31,"audio-buffer-from":28,"audio-context":32,"clamp":37,"is-audio-buffer":68,"is-browser":70,"is-buffer":71}],31:[function(require,module,exports){
/**
 * AudioBuffer class
 *
 * @module audio-buffer/buffer
 */
'use strict'

var getContext = require('audio-context')

module.exports = AudioBuffer


/**
 * @constructor
 */
function AudioBuffer (context, options) {
	if (!(this instanceof AudioBuffer)) return new AudioBuffer(context, options);

	//if no options passed
	if (!options) {
		options = context
		context = options && options.context
	}

	if (!options) options = {}

	if (context === undefined) context = getContext()

	//detect params
	if (options.numberOfChannels == null) {
		options.numberOfChannels = 1
	}
	if (options.sampleRate == null) {
		options.sampleRate = context && context.sampleRate || this.sampleRate
	}
	if (options.length == null) {
		if (options.duration != null) {
			options.length = options.duration * options.sampleRate
		}
		else {
			options.length = 1
		}
	}

	//if existing context
	if (context && context.createBuffer) {
		//create WAA buffer
		return context.createBuffer(options.numberOfChannels, Math.ceil(options.length), options.sampleRate)
	}

	//exposed properties
	this.length = Math.ceil(options.length)
	this.numberOfChannels = options.numberOfChannels
	this.sampleRate = options.sampleRate
	this.duration = this.length / this.sampleRate

	//data is stored as a planar sequence
	this._data = new Float32Array(this.length * this.numberOfChannels)

	//channels data is cached as subarrays
	this._channelData = []
	for (var c = 0; c < this.numberOfChannels; c++) {
		this._channelData.push(this._data.subarray(c * this.length, (c+1) * this.length ))
	}
}


/**
 * Default params
 */
AudioBuffer.prototype.numberOfChannels = 1;
AudioBuffer.prototype.sampleRate = 44100;


/**
 * Return data associated with the channel.
 *
 * @return {Array} Array containing the data
 */
AudioBuffer.prototype.getChannelData = function (channel) {
	if (channel >= this.numberOfChannels || channel < 0 || channel == null) throw Error('Cannot getChannelData: channel number (' + channel + ') exceeds number of channels (' + this.numberOfChannels + ')');

	return this._channelData[channel]
};


/**
 * Place data to the destination buffer, starting from the position
 */
AudioBuffer.prototype.copyFromChannel = function (destination, channelNumber, startInChannel) {
	if (startInChannel == null) startInChannel = 0;
	var data = this._channelData[channelNumber]
	for (var i = startInChannel, j = 0; i < this.length && j < destination.length; i++, j++) {
		destination[j] = data[i];
	}
}


/**
 * Place data from the source to the channel, starting (in self) from the position
 */
AudioBuffer.prototype.copyToChannel = function (source, channelNumber, startInChannel) {
	var data = this._channelData[channelNumber]

	if (!startInChannel) startInChannel = 0;

	for (var i = startInChannel, j = 0; i < this.length && j < source.length; i++, j++) {
		data[i] = source[j];
	}
};


},{"audio-context":32}],32:[function(require,module,exports){
'use strict'

var cache = {}

module.exports = function getContext (options) {
	if (typeof window === 'undefined') return null
	
	var OfflineContext = window.OfflineAudioContext || window.webkitOfflineAudioContext
	var Context = window.AudioContext || window.webkitAudioContext
	
	if (!Context) return null

	if (typeof options === 'number') {
		options = {sampleRate: options}
	}

	var sampleRate = options && options.sampleRate


	if (options && options.offline) {
		if (!OfflineContext) return null

		return new OfflineContext(options.channels || 2, options.length, sampleRate || 44100)
	}


	//cache by sampleRate, rather strong guess
	var ctx = cache[sampleRate]

	if (ctx) return ctx

	//several versions of firefox have issues with the
	//constructor argument
	//see: https://bugzilla.mozilla.org/show_bug.cgi?id=1361475
	try {
		ctx = new Context(options)
	}
	catch (err) {
		ctx = new Context()
	}
	cache[ctx.sampleRate] = cache[sampleRate] = ctx

	return ctx
}

},{}],33:[function(require,module,exports){
/**
 * @module audio-format
 */
'use strict'

var rates = require('sample-rate')
var os = require('os')
var isAudioBuffer = require('is-audio-buffer')
var isBuffer = require('is-buffer')
var isPlainObj = require('is-plain-obj')
var pick = require('pick-by-alias')

module.exports = {
	parse: parse,
	stringify: stringify,
	detect: detect,
	type: getType
}

var endianness = os.endianness instanceof Function ? os.endianness().toLowerCase() : 'le'

var types = {
	'uint': 'uint32',
	'uint8': 'uint8',
	'uint8_clamped': 'uint8',
	'uint16': 'uint16',
	'uint32': 'uint32',
	'int': 'int32',
	'int8': 'int8',
	'int16': 'int16',
	'int32': 'int32',
	'float': 'float32',
	'float32': 'float32',
	'float64': 'float64',
	'array': 'array',
	'arraybuffer': 'arraybuffer',
	'buffer': 'buffer',
	'audiobuffer': 'audiobuffer',
	'ndarray': 'ndarray',
	'ndsamples': 'ndsamples'
}
var channelNumber = {
	'mono': 1,
	'stereo': 2,
	'quad': 4,
	'5.1': 6,
	'2.1': 3,
	'3-channel': 3,
	'5-channel': 5
}
var maxChannels = 32
for (var i = 6; i < maxChannels; i++) {
	channelNumber[i + '-channel'] = i
}

var channelName = {}
for (var name in channelNumber) {
	channelName[channelNumber[name]] = name
}
//parse format string
function parse (str) {
	var format = {}

	var parts = str.split(/\s*[,;_]\s*|\s+/)

	for (var i = 0; i < parts.length; i++) {
		var part = parts[i].toLowerCase()

		if (part === 'planar' && format.interleaved == null) {
			format.interleaved = false
			if (format.channels == null) format.channels = 2
		}
		else if ((part === 'interleave' || part === 'interleaved') && format.interleaved == null) {
			format.interleaved = true
			if (format.channels == null) format.channels = 2
		}
		else if (channelNumber[part]) format.channels = channelNumber[part]
		else if (part === 'le' || part === 'LE' || part === 'littleendian' || part === 'bigEndian') format.endianness = 'le'
		else if (part === 'be' || part === 'BE' || part === 'bigendian' || part === 'bigEndian') format.endianness = 'be'
		else if (types[part]) {
			format.type = types[part]
			if (part === 'audiobuffer') {
				format.endianness = endianness
				format.interleaved = false
			}
		}
		else if (rates[part]) format.sampleRate = rates[part]
		else if (/^\d+$/.test(part)) format.sampleRate = parseInt(part)
		else throw Error('Cannot identify part `' + part + '`')
	}

	return format
}


//parse available format properties from an object
function detect (obj) {
	if (!obj) return {}

	var format = pick(obj, {
		channels: 'channel channels numberOfChannels channelCount',
		sampleRate: 'sampleRate rate',
		interleaved: 'interleave interleaved',
		type: 'type dtype',
		endianness: 'endianness'
	})

	// ndsamples case
	if (obj.format) {
		format.type = 'ndsamples'
	}
	if (format.sampleRate == null && obj.format && obj.format.sampleRate) {
		format.sampleRate = obj.format.sampleRate
	}
	if (obj.planar) format.interleaved = false
	if (format.interleaved != null) {
		if (format.channels == null) format.channels = 2
	}
	if (format.type == null) {
		var type = getType(obj)
		if (type) format.type = type
	}

	if (format.type === 'audiobuffer') {
		format.endianness = endianness
		format.interleaved = false
	}

	return format
}


//convert format string to format object
function stringify (format, omit) {
	if (omit === undefined) {
		omit = {endianness: 'le'}
	} else if (omit == null) {
		omit = {}
	} else if (typeof omit === 'string') {
		omit = parse(omit)
	} else {
		omit = detect(omit)
	}

	if (!isPlainObj(format)) format = detect(format)

	var parts = []

	if (format.type != null && format.type !== omit.type) parts.push(format.type || 'float32')
	if (format.channels != null && format.channels !== omit.channels) parts.push(channelName[format.channels])
	if (format.endianness != null && format.endianness !== omit.endianness) parts.push(format.endianness || 'le')
	if (format.interleaved != null && format.interleaved !== omit.interleaved) {
		if (format.type !== 'audiobuffer') parts.push(format.interleaved ? 'interleaved' : 'planar')
	}
	if (format.sampleRate != null && format.sampleRate !== omit.sampleRate) parts.push(format.sampleRate)

	return parts.join(' ')
}


//return type string for an object
function getType (arg) {
	if (isAudioBuffer(arg)) return 'audiobuffer'
	if (isBuffer(arg)) return 'buffer'
	if (Array.isArray(arg)) return 'array'
	if (arg instanceof ArrayBuffer) return 'arraybuffer'
	if (arg.shape && arg.dtype) return arg.format ? 'ndsamples' : 'ndarray'
	if (arg instanceof Float32Array) return 'float32'
	if (arg instanceof Float64Array) return 'float64'
	if (arg instanceof Uint8Array) return 'uint8'
	if (arg instanceof Uint8ClampedArray) return 'uint8_clamped'
	if (arg instanceof Int8Array) return 'int8'
	if (arg instanceof Int16Array) return 'int16'
	if (arg instanceof Uint16Array) return 'uint16'
	if (arg instanceof Int32Array) return 'int32'
	if (arg instanceof Uint32Array) return 'uint32'
}

},{"is-audio-buffer":68,"is-buffer":34,"is-plain-obj":72,"os":83,"pick-by-alias":86,"sample-rate":88}],34:[function(require,module,exports){
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}

},{}],35:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],36:[function(require,module,exports){
(function (Buffer){(function (){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function () { return 42 } }
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species != null &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayLike(value)
  }

  if (value == null) {
    throw TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  var valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  var b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(
      value[Symbol.toPrimitive]('string'), encodingOrOffset, length
    )
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      buf = Buffer.from(buf)
    }
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  var len = string.length
  var mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  var strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
        : (firstByte > 0xBF) ? 2
          : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (var i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    var len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

}).call(this)}).call(this,require("buffer").Buffer)
},{"base64-js":35,"buffer":36,"ieee754":67}],37:[function(require,module,exports){
module.exports = clamp

function clamp(value, min, max) {
  return min < max
    ? (value < min ? min : value > max ? max : value)
    : (value < max ? max : value > min ? min : value)
}

},{}],38:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.vorbisSetup = exports.vorbisComments = exports.vorbis = exports.version = exports.totalSamples = exports.totalDuration = exports.totalBytesOut = exports.subarray = exports.streamStructureVersion = exports.streamSerialNumber = exports.streamInfo = exports.streamCount = exports.segments = exports.samples = exports.sampleRate = exports.sampleNumber = exports.rawData = exports.protection = exports.profile = exports.preSkip = exports.pageSequenceNumber = exports.pageSegmentTable = exports.pageChecksum = exports.outputGain = exports.numberAACFrames = exports.mpegVersion = exports.mpeg = exports.modeExtension = exports.mode = exports.length = exports.layer = exports.isVbr = exports.isPrivate = exports.isOriginal = exports.isLastPage = exports.isHome = exports.isFirstPage = exports.isCopyrighted = exports.isContinuedPacket = exports.inputSampleRate = exports.header = exports.hasOpusPadding = exports.frameSize = exports.framePadding = exports.frameNumber = exports.frameLength = exports.frameCount = exports.frame = exports.emphasis = exports.duration = exports.description = exports.default = exports.data = exports.crc32 = exports.crc16 = exports.crc = exports.coupledStreamCount = exports.copyrightIdStart = exports.copyrightId = exports.codecFrames = exports.codec = exports.channels = exports.channelMode = exports.channelMappingTable = exports.channelMappingFamily = exports.bufferFullness = exports.buffer = exports.blocksize1 = exports.blocksize0 = exports.blockingStrategy = exports.blockSize = exports.bitrateNominal = exports.bitrateMinimum = exports.bitrateMaximum = exports.bitrate = exports.bitDepth = exports.bandwidth = exports.absoluteGranulePosition = void 0;
var _CodecParser = _interopRequireDefault(require("./src/CodecParser.js"));
var constants = _interopRequireWildcard(require("./src/constants.js"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = _CodecParser.default;
exports.default = _default;
const absoluteGranulePosition = constants.absoluteGranulePosition;
exports.absoluteGranulePosition = absoluteGranulePosition;
const bandwidth = constants.bandwidth;
exports.bandwidth = bandwidth;
const bitDepth = constants.bitDepth;
exports.bitDepth = bitDepth;
const bitrate = constants.bitrate;
exports.bitrate = bitrate;
const bitrateMaximum = constants.bitrateMaximum;
exports.bitrateMaximum = bitrateMaximum;
const bitrateMinimum = constants.bitrateMinimum;
exports.bitrateMinimum = bitrateMinimum;
const bitrateNominal = constants.bitrateNominal;
exports.bitrateNominal = bitrateNominal;
const buffer = constants.buffer;
exports.buffer = buffer;
const bufferFullness = constants.bufferFullness;
exports.bufferFullness = bufferFullness;
const codec = constants.codec;
exports.codec = codec;
const codecFrames = constants.codecFrames;
exports.codecFrames = codecFrames;
const coupledStreamCount = constants.coupledStreamCount;
exports.coupledStreamCount = coupledStreamCount;
const crc = constants.crc;
exports.crc = crc;
const crc16 = constants.crc16;
exports.crc16 = crc16;
const crc32 = constants.crc32;
exports.crc32 = crc32;
const data = constants.data;
exports.data = data;
const description = constants.description;
exports.description = description;
const duration = constants.duration;
exports.duration = duration;
const emphasis = constants.emphasis;
exports.emphasis = emphasis;
const hasOpusPadding = constants.hasOpusPadding;
exports.hasOpusPadding = hasOpusPadding;
const header = constants.header;
exports.header = header;
const isContinuedPacket = constants.isContinuedPacket;
exports.isContinuedPacket = isContinuedPacket;
const isCopyrighted = constants.isCopyrighted;
exports.isCopyrighted = isCopyrighted;
const isFirstPage = constants.isFirstPage;
exports.isFirstPage = isFirstPage;
const isHome = constants.isHome;
exports.isHome = isHome;
const isLastPage = constants.isLastPage;
exports.isLastPage = isLastPage;
const isOriginal = constants.isOriginal;
exports.isOriginal = isOriginal;
const isPrivate = constants.isPrivate;
exports.isPrivate = isPrivate;
const isVbr = constants.isVbr;
exports.isVbr = isVbr;
const layer = constants.layer;
exports.layer = layer;
const length = constants.length;
exports.length = length;
const mode = constants.mode;
exports.mode = mode;
const modeExtension = constants.modeExtension;
exports.modeExtension = modeExtension;
const mpeg = constants.mpeg;
exports.mpeg = mpeg;
const mpegVersion = constants.mpegVersion;
exports.mpegVersion = mpegVersion;
const numberAACFrames = constants.numberAACFrames;
exports.numberAACFrames = numberAACFrames;
const outputGain = constants.outputGain;
exports.outputGain = outputGain;
const preSkip = constants.preSkip;
exports.preSkip = preSkip;
const profile = constants.profile;
exports.profile = profile;
const protection = constants.protection;
exports.protection = protection;
const rawData = constants.rawData;
exports.rawData = rawData;
const segments = constants.segments;
exports.segments = segments;
const subarray = constants.subarray;
exports.subarray = subarray;
const version = constants.version;
exports.version = version;
const vorbis = constants.vorbis;
exports.vorbis = vorbis;
const vorbisComments = constants.vorbisComments;
exports.vorbisComments = vorbisComments;
const vorbisSetup = constants.vorbisSetup;
exports.vorbisSetup = vorbisSetup;
const blockingStrategy = constants.blockingStrategy;
exports.blockingStrategy = blockingStrategy;
const blockSize = constants.blockSize;
exports.blockSize = blockSize;
const blocksize0 = constants.blocksize0;
exports.blocksize0 = blocksize0;
const blocksize1 = constants.blocksize1;
exports.blocksize1 = blocksize1;
const channelMappingFamily = constants.channelMappingFamily;
exports.channelMappingFamily = channelMappingFamily;
const channelMappingTable = constants.channelMappingTable;
exports.channelMappingTable = channelMappingTable;
const channelMode = constants.channelMode;
exports.channelMode = channelMode;
const channels = constants.channels;
exports.channels = channels;
const copyrightId = constants.copyrightId;
exports.copyrightId = copyrightId;
const copyrightIdStart = constants.copyrightIdStart;
exports.copyrightIdStart = copyrightIdStart;
const frame = constants.frame;
exports.frame = frame;
const frameCount = constants.frameCount;
exports.frameCount = frameCount;
const frameLength = constants.frameLength;
exports.frameLength = frameLength;
const frameNumber = constants.frameNumber;
exports.frameNumber = frameNumber;
const framePadding = constants.framePadding;
exports.framePadding = framePadding;
const frameSize = constants.frameSize;
exports.frameSize = frameSize;
const inputSampleRate = constants.inputSampleRate;
exports.inputSampleRate = inputSampleRate;
const pageChecksum = constants.pageChecksum;
exports.pageChecksum = pageChecksum;
const pageSegmentTable = constants.pageSegmentTable;
exports.pageSegmentTable = pageSegmentTable;
const pageSequenceNumber = constants.pageSequenceNumber;
exports.pageSequenceNumber = pageSequenceNumber;
const sampleNumber = constants.sampleNumber;
exports.sampleNumber = sampleNumber;
const sampleRate = constants.sampleRate;
exports.sampleRate = sampleRate;
const samples = constants.samples;
exports.samples = samples;
const streamCount = constants.streamCount;
exports.streamCount = streamCount;
const streamInfo = constants.streamInfo;
exports.streamInfo = streamInfo;
const streamSerialNumber = constants.streamSerialNumber;
exports.streamSerialNumber = streamSerialNumber;
const streamStructureVersion = constants.streamStructureVersion;
exports.streamStructureVersion = streamStructureVersion;
const totalBytesOut = constants.totalBytesOut;
exports.totalBytesOut = totalBytesOut;
const totalDuration = constants.totalDuration;
exports.totalDuration = totalDuration;
const totalSamples = constants.totalSamples;
exports.totalSamples = totalSamples;

},{"./src/CodecParser.js":39,"./src/constants.js":59}],39:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _utilities = require("./utilities.js");
var _constants = require("./constants.js");
var _HeaderCache = _interopRequireDefault(require("./codecs/HeaderCache.js"));
var _MPEGParser = _interopRequireDefault(require("./codecs/mpeg/MPEGParser.js"));
var _AACParser = _interopRequireDefault(require("./codecs/aac/AACParser.js"));
var _FLACParser = _interopRequireDefault(require("./codecs/flac/FLACParser.js"));
var _OggParser = _interopRequireDefault(require("./containers/ogg/OggParser.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* Copyright 2020-2023 Ethan Halsall
    
    This file is part of codec-parser.
    
    codec-parser is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    codec-parser is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>
*/

const noOp = () => {};
class CodecParser {
  constructor(mimeType, {
    onCodec,
    onCodecHeader,
    onCodecUpdate,
    enableLogging = false,
    enableFrameCRC32 = true
  } = {}) {
    this._inputMimeType = mimeType;
    this._onCodec = onCodec || noOp;
    this._onCodecHeader = onCodecHeader || noOp;
    this._onCodecUpdate = onCodecUpdate;
    this._enableLogging = enableLogging;
    this._crc32 = enableFrameCRC32 ? _utilities.crc32Function : noOp;
    this._generator = this._getGenerator();
    this._generator.next();
  }

  /**
   * @public
   * @returns The detected codec
   */
  get [_constants.codec]() {
    return this._parser[_constants.codec];
  }

  /**
   * @public
   * @description Generator function that yields any buffered CodecFrames and resets the CodecParser
   * @returns {Iterable<CodecFrame|OggPage>} Iterator that operates over the codec data.
   * @yields {CodecFrame|OggPage} Parsed codec or ogg page data
   */
  *flush() {
    this._flushing = true;
    for (let i = this._generator.next(); i.value; i = this._generator.next()) {
      yield i.value;
    }
    this._flushing = false;
    this._generator = this._getGenerator();
    this._generator.next();
  }

  /**
   * @public
   * @description Generator function takes in a Uint8Array of data and returns a CodecFrame from the data for each iteration
   * @param {Uint8Array} chunk Next chunk of codec data to read
   * @returns {Iterable<CodecFrame|OggPage>} Iterator that operates over the codec data.
   * @yields {CodecFrame|OggPage} Parsed codec or ogg page data
   */
  *parseChunk(chunk) {
    for (let i = this._generator.next(chunk); i.value; i = this._generator.next()) {
      yield i.value;
    }
  }

  /**
   * @public
   * @description Parses an entire file and returns all of the contained frames.
   * @param {Uint8Array} fileData Coded data to read
   * @returns {Array<CodecFrame|OggPage>} CodecFrames
   */
  parseAll(fileData) {
    return [...this.parseChunk(fileData), ...this.flush()];
  }

  /**
   * @private
   */
  *_getGenerator() {
    this._headerCache = new _HeaderCache.default(this._onCodecHeader, this._onCodecUpdate);
    if (this._inputMimeType.match(/aac/)) {
      this._parser = new _AACParser.default(this, this._headerCache, this._onCodec);
    } else if (this._inputMimeType.match(/mpeg/)) {
      this._parser = new _MPEGParser.default(this, this._headerCache, this._onCodec);
    } else if (this._inputMimeType.match(/flac/)) {
      this._parser = new _FLACParser.default(this, this._headerCache, this._onCodec);
    } else if (this._inputMimeType.match(/ogg/)) {
      this._parser = new _OggParser.default(this, this._headerCache, this._onCodec);
    } else {
      throw new Error(`Unsupported Codec ${mimeType}`);
    }
    this._frameNumber = 0;
    this._currentReadPosition = 0;
    this._totalBytesIn = 0;
    this._totalBytesOut = 0;
    this._totalSamples = 0;
    this._sampleRate = undefined;
    this._rawData = new Uint8Array(0);

    // start parsing out frames
    while (true) {
      const frame = yield* this._parser[_constants.parseFrame]();
      if (frame) yield frame;
    }
  }

  /**
   * @protected
   * @param {number} minSize Minimum bytes to have present in buffer
   * @returns {Uint8Array} rawData
   */
  *[_constants.readRawData](minSize = 0, readOffset = 0) {
    let rawData;
    while (this._rawData[_constants.length] <= minSize + readOffset) {
      rawData = yield;
      if (this._flushing) return this._rawData[_constants.subarray](readOffset);
      if (rawData) {
        this._totalBytesIn += rawData[_constants.length];
        this._rawData = (0, _utilities.concatBuffers)(this._rawData, rawData);
      }
    }
    return this._rawData[_constants.subarray](readOffset);
  }

  /**
   * @protected
   * @param {number} increment Bytes to increment codec data
   */
  [_constants.incrementRawData](increment) {
    this._currentReadPosition += increment;
    this._rawData = this._rawData[_constants.subarray](increment);
  }

  /**
   * @protected
   */
  [_constants.mapCodecFrameStats](frame) {
    this._sampleRate = frame[_constants.header][_constants.sampleRate];
    frame[_constants.header][_constants.bitrate] = Math.round(frame[_constants.data][_constants.length] / frame[_constants.duration]) * 8;
    frame[_constants.frameNumber] = this._frameNumber++;
    frame[_constants.totalBytesOut] = this._totalBytesOut;
    frame[_constants.totalSamples] = this._totalSamples;
    frame[_constants.totalDuration] = this._totalSamples / this._sampleRate * 1000;
    frame[_constants.crc32] = this._crc32(frame[_constants.data]);
    this._headerCache[_constants.checkCodecUpdate](frame[_constants.header][_constants.bitrate], frame[_constants.totalDuration]);
    this._totalBytesOut += frame[_constants.data][_constants.length];
    this._totalSamples += frame[_constants.samples];
  }

  /**
   * @protected
   */
  [_constants.mapFrameStats](frame) {
    if (frame[_constants.codecFrames]) {
      // Ogg container
      frame[_constants.codecFrames].forEach(codecFrame => {
        frame[_constants.duration] += codecFrame[_constants.duration];
        frame[_constants.samples] += codecFrame[_constants.samples];
        this[_constants.mapCodecFrameStats](codecFrame);
      });
      frame[_constants.totalSamples] = this._totalSamples;
      frame[_constants.totalDuration] = this._totalSamples / this._sampleRate * 1000 || 0;
      frame[_constants.totalBytesOut] = this._totalBytesOut;
    } else {
      this[_constants.mapCodecFrameStats](frame);
    }
  }

  /**
   * @private
   */
  _log(logger, messages) {
    if (this._enableLogging) {
      const stats = [`${_constants.codec}:         ${this[_constants.codec]}`, `inputMimeType: ${this._inputMimeType}`, `readPosition:  ${this._currentReadPosition}`, `totalBytesIn:  ${this._totalBytesIn}`, `${_constants.totalBytesOut}: ${this._totalBytesOut}`];
      const width = Math.max(...stats.map(s => s[_constants.length]));
      messages.push(`--stats--${"-".repeat(width - 9)}`, ...stats, "-".repeat(width));
      logger("codec-parser", messages.reduce((acc, message) => acc + "\n  " + message, ""));
    }
  }

  /**
   * @protected
   */
  [_constants.logWarning](...messages) {
    this._log(console.warn, messages);
  }

  /**
   * @protected
   */
  [_constants.logError](...messages) {
    this._log(console.error, messages);
  }
}
exports.default = CodecParser;

},{"./codecs/HeaderCache.js":42,"./codecs/aac/AACParser.js":46,"./codecs/flac/FLACParser.js":49,"./codecs/mpeg/MPEGParser.js":52,"./constants.js":59,"./containers/ogg/OggParser.js":63,"./utilities.js":66}],40:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _globals = require("../globals.js");
var _constants = require("../constants.js");
var _Frame = _interopRequireDefault(require("../containers/Frame.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* Copyright 2020-2023 Ethan Halsall
    
    This file is part of codec-parser.
    
    codec-parser is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    codec-parser is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>
*/

class CodecFrame extends _Frame.default {
  static *[_constants.getFrame](Header, Frame, codecParser, headerCache, readOffset) {
    const headerValue = yield* Header[_constants.getHeader](codecParser, headerCache, readOffset);
    if (headerValue) {
      const frameLengthValue = _globals.headerStore.get(headerValue)[_constants.frameLength];
      const samplesValue = _globals.headerStore.get(headerValue)[_constants.samples];
      const frame = (yield* codecParser[_constants.readRawData](frameLengthValue, readOffset))[_constants.subarray](0, frameLengthValue);
      return new Frame(headerValue, frame, samplesValue);
    } else {
      return null;
    }
  }
  constructor(headerValue, dataValue, samplesValue) {
    super(headerValue, dataValue);
    this[_constants.header] = headerValue;
    this[_constants.samples] = samplesValue;
    this[_constants.duration] = samplesValue / headerValue[_constants.sampleRate] * 1000;
    this[_constants.frameNumber] = null;
    this[_constants.totalBytesOut] = null;
    this[_constants.totalSamples] = null;
    this[_constants.totalDuration] = null;
    _globals.frameStore.get(this)[_constants.length] = dataValue[_constants.length];
  }
}
exports.default = CodecFrame;

},{"../constants.js":59,"../containers/Frame.js":60,"../globals.js":64}],41:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _globals = require("../globals.js");
var _constants = require("../constants.js");
/* Copyright 2020-2023 Ethan Halsall
    
    This file is part of codec-parser.
    
    codec-parser is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    codec-parser is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>
*/

class CodecHeader {
  /**
   * @private
   */
  constructor(header) {
    _globals.headerStore.set(this, header);
    this[_constants.bitDepth] = header[_constants.bitDepth];
    this[_constants.bitrate] = null; // set during frame mapping
    this[_constants.channels] = header[_constants.channels];
    this[_constants.channelMode] = header[_constants.channelMode];
    this[_constants.sampleRate] = header[_constants.sampleRate];
  }
}
exports.default = CodecHeader;

},{"../constants.js":59,"../globals.js":64}],42:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _constants = require("../constants.js");
/* Copyright 2020-2023 Ethan Halsall
    
    This file is part of codec-parser.
    
    codec-parser is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    codec-parser is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>
*/

class HeaderCache {
  constructor(onCodecHeader, onCodecUpdate) {
    this._onCodecHeader = onCodecHeader;
    this._onCodecUpdate = onCodecUpdate;
    this[_constants.reset]();
  }
  [_constants.enable]() {
    this._isEnabled = true;
  }
  [_constants.reset]() {
    this._headerCache = new Map();
    this._codecUpdateData = new WeakMap();
    this._codecHeaderSent = false;
    this._codecShouldUpdate = false;
    this._bitrate = null;
    this._isEnabled = false;
  }
  [_constants.checkCodecUpdate](bitrate, totalDuration) {
    if (this._onCodecUpdate) {
      if (this._bitrate !== bitrate) {
        this._bitrate = bitrate;
        this._codecShouldUpdate = true;
      }

      // only update if codec data is available
      const codecData = this._codecUpdateData.get(this._headerCache.get(this._currentHeader));
      if (this._codecShouldUpdate && codecData) {
        this._onCodecUpdate({
          bitrate,
          ...codecData
        }, totalDuration);
      }
      this._codecShouldUpdate = false;
    }
  }
  [_constants.getHeader](key) {
    const header = this._headerCache.get(key);
    if (header) {
      this._updateCurrentHeader(key);
    }
    return header;
  }
  [_constants.setHeader](key, header, codecUpdateFields) {
    if (this._isEnabled) {
      if (!this._codecHeaderSent) {
        this._onCodecHeader({
          ...header
        });
        this._codecHeaderSent = true;
      }
      this._updateCurrentHeader(key);
      this._headerCache.set(key, header);
      this._codecUpdateData.set(header, codecUpdateFields);
    }
  }
  _updateCurrentHeader(key) {
    if (this._onCodecUpdate && key !== this._currentHeader) {
      this._codecShouldUpdate = true;
      this._currentHeader = key;
    }
  }
}
exports.default = HeaderCache;

},{"../constants.js":59}],43:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _globals = require("../globals.js");
var _constants = require("../constants.js");
/* Copyright 2020-2023 Ethan Halsall
    
    This file is part of codec-parser.
    
    codec-parser is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    codec-parser is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>
*/

/**
 * @abstract
 * @description Abstract class containing methods for parsing codec frames
 */
class Parser {
  constructor(codecParser, headerCache) {
    this._codecParser = codecParser;
    this._headerCache = headerCache;
  }
  *[_constants.syncFrame]() {
    let frameData;
    do {
      frameData = yield* this.Frame[_constants.getFrame](this._codecParser, this._headerCache, 0);
      if (frameData) return frameData;
      this._codecParser[_constants.incrementRawData](1); // increment to continue syncing
    } while (true);
  }

  /**
   * @description Searches for Frames within bytes containing a sequence of known codec frames.
   * @param {boolean} ignoreNextFrame Set to true to return frames even if the next frame may not exist at the expected location
   * @returns {Frame}
   */
  *[_constants.fixedLengthFrameSync](ignoreNextFrame) {
    let frameData = yield* this[_constants.syncFrame]();
    const frameLength = _globals.frameStore.get(frameData)[_constants.length];
    if (ignoreNextFrame || this._codecParser._flushing || (
    // check if there is a frame right after this one
    yield* this.Header[_constants.getHeader](this._codecParser, this._headerCache, frameLength))) {
      this._headerCache[_constants.enable](); // start caching when synced

      this._codecParser[_constants.incrementRawData](frameLength); // increment to the next frame
      this._codecParser[_constants.mapFrameStats](frameData);
      return frameData;
    }
    this._codecParser[_constants.logWarning](`Missing ${_constants.frame} at ${frameLength} bytes from current position.`, `Dropping current ${_constants.frame} and trying again.`);
    this._headerCache[_constants.reset](); // frame is invalid and must re-sync and clear cache
    this._codecParser[_constants.incrementRawData](1); // increment to invalidate the current frame
  }
}
exports.default = Parser;

},{"../constants.js":59,"../globals.js":64}],44:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _constants = require("../../constants.js");
var _CodecFrame = _interopRequireDefault(require("../CodecFrame.js"));
var _AACHeader = _interopRequireDefault(require("./AACHeader.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* Copyright 2020-2023 Ethan Halsall
    
    This file is part of codec-parser.
    
    codec-parser is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    codec-parser is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>
*/

class AACFrame extends _CodecFrame.default {
  static *[_constants.getFrame](codecParser, headerCache, readOffset) {
    return yield* super[_constants.getFrame](_AACHeader.default, AACFrame, codecParser, headerCache, readOffset);
  }
  constructor(header, frame, samples) {
    super(header, frame, samples);
  }
}
exports.default = AACFrame;

},{"../../constants.js":59,"../CodecFrame.js":40,"./AACHeader.js":45}],45:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _globals = require("../../globals.js");
var _utilities = require("../../utilities.js");
var _constants = require("../../constants.js");
var _CodecHeader = _interopRequireDefault(require("../CodecHeader.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* Copyright 2020-2023 Ethan Halsall
    
    This file is part of codec-parser.
    
    codec-parser is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    codec-parser is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>
*/

/*
https://wiki.multimedia.cx/index.php/ADTS

AAAAAAAA AAAABCCD EEFFFFGH HHIJKLMM MMMMMMMM MMMOOOOO OOOOOOPP (QQQQQQQQ QQQQQQQQ)

AACHeader consists of 7 or 9 bytes (without or with CRC).
Letter  Length (bits)  Description
A  12  syncword 0xFFF, all bits must be 1
B  1   MPEG Version: 0 for MPEG-4, 1 for MPEG-2
C  2   Layer: always 0
D  1   protection absent, Warning, set to 1 if there is no CRC and 0 if there is CRC
E  2   profile, the MPEG-4 Audio Object Type minus 1
F  4   MPEG-4 Sampling Frequency Index (15 is forbidden)
G  1   private bit, guaranteed never to be used by MPEG, set to 0 when encoding, ignore when decoding
H  3   MPEG-4 Channel Configuration (in the case of 0, the channel configuration is sent via an inband PCE)
I  1   originality, set to 0 when encoding, ignore when decoding
J  1   home, set to 0 when encoding, ignore when decoding
K  1   copyrighted id bit, the next bit of a centrally registered copyright identifier, set to 0 when encoding, ignore when decoding
L  1   copyright id start, signals that this frame's copyright id bit is the first bit of the copyright id, set to 0 when encoding, ignore when decoding
M  13  frame length, this value must include 7 or 9 bytes of header length: FrameLength = (ProtectionAbsent == 1 ? 7 : 9) + size(AACFrame)
O  11  Buffer fullness // 0x7FF for VBR
P  2   Number of AAC frames (RDBs) in ADTS frame minus 1, for maximum compatibility always use 1 AAC frame per ADTS frame
Q  16  CRC if protection absent is 0 
*/

const mpegVersionValues = {
  0b00000000: "MPEG-4",
  0b00001000: "MPEG-2"
};
const layerValues = {
  0b00000000: "valid",
  0b00000010: _constants.bad,
  0b00000100: _constants.bad,
  0b00000110: _constants.bad
};
const protectionValues = {
  0b00000000: _constants.sixteenBitCRC,
  0b00000001: _constants.none
};
const profileValues = {
  0b00000000: "AAC Main",
  0b01000000: "AAC LC (Low Complexity)",
  0b10000000: "AAC SSR (Scalable Sample Rate)",
  0b11000000: "AAC LTP (Long Term Prediction)"
};
const sampleRates = {
  0b00000000: _constants.rate96000,
  0b00000100: _constants.rate88200,
  0b00001000: _constants.rate64000,
  0b00001100: _constants.rate48000,
  0b00010000: _constants.rate44100,
  0b00010100: _constants.rate32000,
  0b00011000: _constants.rate24000,
  0b00011100: _constants.rate22050,
  0b00100000: _constants.rate16000,
  0b00100100: _constants.rate12000,
  0b00101000: _constants.rate11025,
  0b00101100: _constants.rate8000,
  0b00110000: _constants.rate7350,
  0b00110100: _constants.reserved,
  0b00111000: _constants.reserved,
  0b00111100: "frequency is written explicitly"
};

// prettier-ignore
const channelModeValues = {
  0b000000000: {
    [_constants.channels]: 0,
    [_constants.description]: "Defined in AOT Specific Config"
  },
  /*
  'monophonic (mono)'
  'stereo (left, right)'
  'linear surround (front center, front left, front right)'
  'quadraphonic (front center, front left, front right, rear center)'
  '5.0 surround (front center, front left, front right, rear left, rear right)'
  '5.1 surround (front center, front left, front right, rear left, rear right, LFE)'
  '7.1 surround (front center, front left, front right, side left, side right, rear left, rear right, LFE)'
  */
  0b001000000: {
    [_constants.channels]: 1,
    [_constants.description]: _constants.monophonic
  },
  0b010000000: {
    [_constants.channels]: 2,
    [_constants.description]: (0, _constants.getChannelMapping)(2, _constants.channelMappings[0][0])
  },
  0b011000000: {
    [_constants.channels]: 3,
    [_constants.description]: (0, _constants.getChannelMapping)(3, _constants.channelMappings[1][3])
  },
  0b100000000: {
    [_constants.channels]: 4,
    [_constants.description]: (0, _constants.getChannelMapping)(4, _constants.channelMappings[1][3], _constants.channelMappings[3][4])
  },
  0b101000000: {
    [_constants.channels]: 5,
    [_constants.description]: (0, _constants.getChannelMapping)(5, _constants.channelMappings[1][3], _constants.channelMappings[3][0])
  },
  0b110000000: {
    [_constants.channels]: 6,
    [_constants.description]: (0, _constants.getChannelMapping)(6, _constants.channelMappings[1][3], _constants.channelMappings[3][0], _constants.lfe)
  },
  0b111000000: {
    [_constants.channels]: 8,
    [_constants.description]: (0, _constants.getChannelMapping)(8, _constants.channelMappings[1][3], _constants.channelMappings[2][0], _constants.channelMappings[3][0], _constants.lfe)
  }
};
class AACHeader extends _CodecHeader.default {
  static *[_constants.getHeader](codecParser, headerCache, readOffset) {
    const header = {};

    // Must be at least seven bytes. Out of data
    const data = yield* codecParser[_constants.readRawData](7, readOffset);

    // Check header cache
    const key = (0, _utilities.bytesToString)([data[0], data[1], data[2], data[3] & 0b11111100 | data[6] & 0b00000011 // frame length, buffer fullness varies so don't cache it
    ]);

    const cachedHeader = headerCache[_constants.getHeader](key);
    if (!cachedHeader) {
      // Frame sync (all bits must be set): `11111111|1111`:
      if (data[0] !== 0xff || data[1] < 0xf0) return null;

      // Byte (2 of 7)
      // * `1111BCCD`
      // * `....B...`: MPEG Version: 0 for MPEG-4, 1 for MPEG-2
      // * `.....CC.`: Layer: always 0
      // * `.......D`: protection absent, Warning, set to 1 if there is no CRC and 0 if there is CRC
      header[_constants.mpegVersion] = mpegVersionValues[data[1] & 0b00001000];
      header[_constants.layer] = layerValues[data[1] & 0b00000110];
      if (header[_constants.layer] === _constants.bad) return null;
      const protectionBit = data[1] & 0b00000001;
      header[_constants.protection] = protectionValues[protectionBit];
      header[_constants.length] = protectionBit ? 7 : 9;

      // Byte (3 of 7)
      // * `EEFFFFGH`
      // * `EE......`: profile, the MPEG-4 Audio Object Type minus 1
      // * `..FFFF..`: MPEG-4 Sampling Frequency Index (15 is forbidden)
      // * `......G.`: private bit, guaranteed never to be used by MPEG, set to 0 when encoding, ignore when decoding
      header[_constants.profileBits] = data[2] & 0b11000000;
      header[_constants.sampleRateBits] = data[2] & 0b00111100;
      const privateBit = data[2] & 0b00000010;
      header[_constants.profile] = profileValues[header[_constants.profileBits]];
      header[_constants.sampleRate] = sampleRates[header[_constants.sampleRateBits]];
      if (header[_constants.sampleRate] === _constants.reserved) return null;
      header[_constants.isPrivate] = !!privateBit;

      // Byte (3,4 of 7)
      // * `.......H|HH......`: MPEG-4 Channel Configuration (in the case of 0, the channel configuration is sent via an inband PCE)
      header[_constants.channelModeBits] = (data[2] << 8 | data[3]) & 0b111000000;
      header[_constants.channelMode] = channelModeValues[header[_constants.channelModeBits]][_constants.description];
      header[_constants.channels] = channelModeValues[header[_constants.channelModeBits]][_constants.channels];

      // Byte (4 of 7)
      // * `HHIJKLMM`
      // * `..I.....`: originality, set to 0 when encoding, ignore when decoding
      // * `...J....`: home, set to 0 when encoding, ignore when decoding
      // * `....K...`: copyrighted id bit, the next bit of a centrally registered copyright identifier, set to 0 when encoding, ignore when decoding
      // * `.....L..`: copyright id start, signals that this frame's copyright id bit is the first bit of the copyright id, set to 0 when encoding, ignore when decoding
      header[_constants.isOriginal] = !!(data[3] & 0b00100000);
      header[_constants.isHome] = !!(data[3] & 0b00001000);
      header[_constants.copyrightId] = !!(data[3] & 0b00001000);
      header[_constants.copyrightIdStart] = !!(data[3] & 0b00000100);
      header[_constants.bitDepth] = 16;
      header[_constants.samples] = 1024;

      // Byte (7 of 7)
      // * `......PP` Number of AAC frames (RDBs) in ADTS frame minus 1, for maximum compatibility always use 1 AAC frame per ADTS frame
      header[_constants.numberAACFrames] = data[6] & 0b00000011;
      {
        const {
          length,
          channelModeBits,
          profileBits,
          sampleRateBits,
          frameLength,
          samples,
          numberAACFrames,
          ...codecUpdateFields
        } = header;
        headerCache[_constants.setHeader](key, header, codecUpdateFields);
      }
    } else {
      Object.assign(header, cachedHeader);
    }

    // Byte (4,5,6 of 7)
    // * `.......MM|MMMMMMMM|MMM.....`: frame length, this value must include 7 or 9 bytes of header length: FrameLength = (ProtectionAbsent == 1 ? 7 : 9) + size(AACFrame)
    header[_constants.frameLength] = (data[3] << 11 | data[4] << 3 | data[5] >> 5) & 0x1fff;
    if (!header[_constants.frameLength]) return null;

    // Byte (6,7 of 7)
    // * `...OOOOO|OOOOOO..`: Buffer fullness
    const bufferFullnessBits = (data[5] << 6 | data[6] >> 2) & 0x7ff;
    header[_constants.bufferFullness] = bufferFullnessBits === 0x7ff ? "VBR" : bufferFullnessBits;
    return new AACHeader(header);
  }

  /**
   * @private
   * Call AACHeader.getHeader(Array<Uint8>) to get instance
   */
  constructor(header) {
    super(header);
    this[_constants.copyrightId] = header[_constants.copyrightId];
    this[_constants.copyrightIdStart] = header[_constants.copyrightIdStart];
    this[_constants.bufferFullness] = header[_constants.bufferFullness];
    this[_constants.isHome] = header[_constants.isHome];
    this[_constants.isOriginal] = header[_constants.isOriginal];
    this[_constants.isPrivate] = header[_constants.isPrivate];
    this[_constants.layer] = header[_constants.layer];
    this[_constants.length] = header[_constants.length];
    this[_constants.mpegVersion] = header[_constants.mpegVersion];
    this[_constants.numberAACFrames] = header[_constants.numberAACFrames];
    this[_constants.profile] = header[_constants.profile];
    this[_constants.protection] = header[_constants.protection];
  }
  get audioSpecificConfig() {
    // Audio Specific Configuration
    // * `000EEFFF|F0HHH000`:
    // * `000EE...|........`: Object Type (profileBit + 1)
    // * `.....FFF|F.......`: Sample Rate
    // * `........|.0HHH...`: Channel Configuration
    // * `........|.....0..`: Frame Length (1024)
    // * `........|......0.`: does not depend on core coder
    // * `........|.......0`: Not Extension
    const header = _globals.headerStore.get(this);
    const audioSpecificConfig = header[_constants.profileBits] + 0x40 << 5 | header[_constants.sampleRateBits] << 5 | header[_constants.channelModeBits] >> 3;
    const bytes = new _constants.uint8Array(2);
    new _constants.dataView(bytes[_constants.buffer]).setUint16(0, audioSpecificConfig, false);
    return bytes;
  }
}
exports.default = AACHeader;

},{"../../constants.js":59,"../../globals.js":64,"../../utilities.js":66,"../CodecHeader.js":41}],46:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _constants = require("../../constants.js");
var _Parser = _interopRequireDefault(require("../Parser.js"));
var _AACFrame = _interopRequireDefault(require("./AACFrame.js"));
var _AACHeader = _interopRequireDefault(require("./AACHeader.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* Copyright 2020-2023 Ethan Halsall
    
    This file is part of codec-parser.
    
    codec-parser is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    codec-parser is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>
*/

class AACParser extends _Parser.default {
  constructor(codecParser, headerCache, onCodec) {
    super(codecParser, headerCache);
    this.Frame = _AACFrame.default;
    this.Header = _AACHeader.default;
    onCodec(this[_constants.codec]);
  }
  get [_constants.codec]() {
    return "aac";
  }
  *[_constants.parseFrame]() {
    return yield* this[_constants.fixedLengthFrameSync]();
  }
}
exports.default = AACParser;

},{"../../constants.js":59,"../Parser.js":43,"./AACFrame.js":44,"./AACHeader.js":45}],47:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _globals = require("../../globals.js");
var _utilities = require("../../utilities.js");
var _constants = require("../../constants.js");
var _CodecFrame = _interopRequireDefault(require("../CodecFrame.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* Copyright 2020-2023 Ethan Halsall
    
    This file is part of codec-parser.
    
    codec-parser is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    codec-parser is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>
*/

class FLACFrame extends _CodecFrame.default {
  static _getFrameFooterCrc16(data) {
    return (data[data[_constants.length] - 2] << 8) + data[data[_constants.length] - 1];
  }

  // check frame footer crc
  // https://xiph.org/flac/format.html#frame_footer
  static [_constants.checkFrameFooterCrc16](data) {
    const expectedCrc16 = FLACFrame._getFrameFooterCrc16(data);
    const actualCrc16 = (0, _utilities.flacCrc16)(data[_constants.subarray](0, -2));
    return expectedCrc16 === actualCrc16;
  }
  constructor(data, header, streamInfoValue) {
    header[_constants.streamInfo] = streamInfoValue;
    header[_constants.crc16] = FLACFrame._getFrameFooterCrc16(data);
    super(header, data, _globals.headerStore.get(header)[_constants.samples]);
  }
}
exports.default = FLACFrame;

},{"../../constants.js":59,"../../globals.js":64,"../../utilities.js":66,"../CodecFrame.js":40}],48:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _constants = require("../../constants.js");
var _utilities = require("../../utilities.js");
var _CodecHeader = _interopRequireDefault(require("../CodecHeader.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* Copyright 2020-2023 Ethan Halsall
    
    This file is part of codec-parser.
    
    codec-parser is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    codec-parser is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>
*/

/*
https://xiph.org/flac/format.html

AAAAAAAA AAAAAABC DDDDEEEE FFFFGGGH 
(IIIIIIII...)
(JJJJJJJJ|JJJJJJJJ)
(KKKKKKKK|KKKKKKKK)
LLLLLLLLL

FLAC Frame Header
Letter  Length (bits)  Description
A   13  11111111|11111
B   1   Reserved 0 - mandatory, 1 - reserved
C   1   Blocking strategy, 0 - fixed, 1 - variable
D   4   Block size in inter-channel samples
E   4   Sample rate
F   4   Channel assignment
G   3   Sample size in bits
H   1   Reserved 0 - mandatory, 1 - reserved
I   ?   if(variable blocksize)
           <8-56>:"UTF-8" coded sample number (decoded number is 36 bits) [4]
        else
           <8-48>:"UTF-8" coded frame number (decoded number is 31 bits) [4]
J   ?   if(blocksize bits == 011x)
            8/16 bit (blocksize-1)
K   ?   if(sample rate bits == 11xx)
            8/16 bit sample rate
L   8   CRC-8 (polynomial = x^8 + x^2 + x^1 + x^0, initialized with 0) of everything before the crc, including the sync code
        
*/

const getFromStreamInfo = "get from STREAMINFO metadata block";
const blockingStrategyValues = {
  0b00000000: "Fixed",
  0b00000001: "Variable"
};
const blockSizeValues = {
  0b00000000: _constants.reserved,
  0b00010000: 192
  // 0b00100000: 576,
  // 0b00110000: 1152,
  // 0b01000000: 2304,
  // 0b01010000: 4608,
  // 0b01100000: "8-bit (blocksize-1) from end of header",
  // 0b01110000: "16-bit (blocksize-1) from end of header",
  // 0b10000000: 256,
  // 0b10010000: 512,
  // 0b10100000: 1024,
  // 0b10110000: 2048,
  // 0b11000000: 4096,
  // 0b11010000: 8192,
  // 0b11100000: 16384,
  // 0b11110000: 32768,
};

for (let i = 2; i < 16; i++) blockSizeValues[i << 4] = i < 6 ? 576 * 2 ** (i - 2) : 2 ** i;
const sampleRateValues = {
  0b00000000: getFromStreamInfo,
  0b00000001: _constants.rate88200,
  0b00000010: _constants.rate176400,
  0b00000011: _constants.rate192000,
  0b00000100: _constants.rate8000,
  0b00000101: _constants.rate16000,
  0b00000110: _constants.rate22050,
  0b00000111: _constants.rate24000,
  0b00001000: _constants.rate32000,
  0b00001001: _constants.rate44100,
  0b00001010: _constants.rate48000,
  0b00001011: _constants.rate96000,
  // 0b00001100: "8-bit sample rate (in kHz) from end of header",
  // 0b00001101: "16-bit sample rate (in Hz) from end of header",
  // 0b00001110: "16-bit sample rate (in tens of Hz) from end of header",
  0b00001111: _constants.bad
};

/* prettier-ignore */
const channelAssignments = {
  /*'
  'monophonic (mono)'
  'stereo (left, right)'
  'linear surround (left, right, center)'
  'quadraphonic (front left, front right, rear left, rear right)'
  '5.0 surround (front left, front right, front center, rear left, rear right)'
  '5.1 surround (front left, front right, front center, LFE, rear left, rear right)'
  '6.1 surround (front left, front right, front center, LFE, rear center, side left, side right)'
  '7.1 surround (front left, front right, front center, LFE, rear left, rear right, side left, side right)'
  */
  0b00000000: {
    [_constants.channels]: 1,
    [_constants.description]: _constants.monophonic
  },
  0b00010000: {
    [_constants.channels]: 2,
    [_constants.description]: (0, _constants.getChannelMapping)(2, _constants.channelMappings[0][0])
  },
  0b00100000: {
    [_constants.channels]: 3,
    [_constants.description]: (0, _constants.getChannelMapping)(3, _constants.channelMappings[0][1])
  },
  0b00110000: {
    [_constants.channels]: 4,
    [_constants.description]: (0, _constants.getChannelMapping)(4, _constants.channelMappings[1][0], _constants.channelMappings[3][0])
  },
  0b01000000: {
    [_constants.channels]: 5,
    [_constants.description]: (0, _constants.getChannelMapping)(5, _constants.channelMappings[1][1], _constants.channelMappings[3][0])
  },
  0b01010000: {
    [_constants.channels]: 6,
    [_constants.description]: (0, _constants.getChannelMapping)(6, _constants.channelMappings[1][1], _constants.lfe, _constants.channelMappings[3][0])
  },
  0b01100000: {
    [_constants.channels]: 7,
    [_constants.description]: (0, _constants.getChannelMapping)(7, _constants.channelMappings[1][1], _constants.lfe, _constants.channelMappings[3][4], _constants.channelMappings[2][0])
  },
  0b01110000: {
    [_constants.channels]: 8,
    [_constants.description]: (0, _constants.getChannelMapping)(8, _constants.channelMappings[1][1], _constants.lfe, _constants.channelMappings[3][0], _constants.channelMappings[2][0])
  },
  0b10000000: {
    [_constants.channels]: 2,
    [_constants.description]: `${_constants.stereo} (left, diff)`
  },
  0b10010000: {
    [_constants.channels]: 2,
    [_constants.description]: `${_constants.stereo} (diff, right)`
  },
  0b10100000: {
    [_constants.channels]: 2,
    [_constants.description]: `${_constants.stereo} (avg, diff)`
  },
  0b10110000: _constants.reserved,
  0b11000000: _constants.reserved,
  0b11010000: _constants.reserved,
  0b11100000: _constants.reserved,
  0b11110000: _constants.reserved
};
const bitDepthValues = {
  0b00000000: getFromStreamInfo,
  0b00000010: 8,
  0b00000100: 12,
  0b00000110: _constants.reserved,
  0b00001000: 16,
  0b00001010: 20,
  0b00001100: 24,
  0b00001110: _constants.reserved
};
class FLACHeader extends _CodecHeader.default {
  // https://datatracker.ietf.org/doc/html/rfc3629#section-3
  //    Char. number range  |        UTF-8 octet sequence
  //    (hexadecimal)    |              (binary)
  // --------------------+---------------------------------------------
  // 0000 0000-0000 007F | 0xxxxxxx
  // 0000 0080-0000 07FF | 110xxxxx 10xxxxxx
  // 0000 0800-0000 FFFF | 1110xxxx 10xxxxxx 10xxxxxx
  // 0001 0000-0010 FFFF | 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
  static _decodeUTF8Int(data) {
    if (data[0] > 0xfe) {
      return null; // length byte must have at least one zero as the lsb
    }

    if (data[0] < 0x80) return {
      value: data[0],
      length: 1
    };

    // get length by counting the number of msb that are set to 1
    let length = 1;
    for (let zeroMask = 0x40; zeroMask & data[0]; zeroMask >>= 1) length++;
    let idx = length - 1,
      value = 0,
      shift = 0;

    // sum together the encoded bits in bytes 2 to length
    // 1110xxxx 10[cccccc] 10[bbbbbb] 10[aaaaaa]
    //
    //    value = [cccccc] | [bbbbbb] | [aaaaaa]
    for (; idx > 0; shift += 6, idx--) {
      if ((data[idx] & 0xc0) !== 0x80) {
        return null; // each byte should have leading 10xxxxxx
      }

      value |= (data[idx] & 0x3f) << shift; // add the encoded bits
    }

    // read the final encoded bits in byte 1
    //     1110[dddd] 10[cccccc] 10[bbbbbb] 10[aaaaaa]
    //
    // value = [dddd] | [cccccc] | [bbbbbb] | [aaaaaa]
    value |= (data[idx] & 0x7f >> length) << shift;
    return {
      value,
      length
    };
  }
  static [_constants.getHeaderFromUint8Array](data, headerCache) {
    const codecParserStub = {
      [_constants.readRawData]: function* () {
        return data;
      }
    };
    return FLACHeader[_constants.getHeader](codecParserStub, headerCache, 0).next().value;
  }
  static *[_constants.getHeader](codecParser, headerCache, readOffset) {
    // Must be at least 6 bytes.
    let data = yield* codecParser[_constants.readRawData](6, readOffset);

    // Bytes (1-2 of 6)
    // * `11111111|111110..`: Frame sync
    // * `........|......0.`: Reserved 0 - mandatory, 1 - reserved
    if (data[0] !== 0xff || !(data[1] === 0xf8 || data[1] === 0xf9)) {
      return null;
    }
    const header = {};

    // Check header cache
    const key = (0, _utilities.bytesToString)(data[_constants.subarray](0, 4));
    const cachedHeader = headerCache[_constants.getHeader](key);
    if (!cachedHeader) {
      // Byte (2 of 6)
      // * `.......C`: Blocking strategy, 0 - fixed, 1 - variable
      header[_constants.blockingStrategyBits] = data[1] & 0b00000001;
      header[_constants.blockingStrategy] = blockingStrategyValues[header[_constants.blockingStrategyBits]];

      // Byte (3 of 6)
      // * `DDDD....`: Block size in inter-channel samples
      // * `....EEEE`: Sample rate
      header[_constants.blockSizeBits] = data[2] & 0b11110000;
      header[_constants.sampleRateBits] = data[2] & 0b00001111;
      header[_constants.blockSize] = blockSizeValues[header[_constants.blockSizeBits]];
      if (header[_constants.blockSize] === _constants.reserved) {
        return null;
      }
      header[_constants.sampleRate] = sampleRateValues[header[_constants.sampleRateBits]];
      if (header[_constants.sampleRate] === _constants.bad) {
        return null;
      }

      // Byte (4 of 6)
      // * `FFFF....`: Channel assignment
      // * `....GGG.`: Sample size in bits
      // * `.......H`: Reserved 0 - mandatory, 1 - reserved
      if (data[3] & 0b00000001) {
        return null;
      }
      const channelAssignment = channelAssignments[data[3] & 0b11110000];
      if (channelAssignment === _constants.reserved) {
        return null;
      }
      header[_constants.channels] = channelAssignment[_constants.channels];
      header[_constants.channelMode] = channelAssignment[_constants.description];
      header[_constants.bitDepth] = bitDepthValues[data[3] & 0b00001110];
      if (header[_constants.bitDepth] === _constants.reserved) {
        return null;
      }
    } else {
      Object.assign(header, cachedHeader);
    }

    // Byte (5...)
    // * `IIIIIIII|...`: VBR block size ? sample number : frame number
    header[_constants.length] = 5;

    // check if there is enough data to parse UTF8
    data = yield* codecParser[_constants.readRawData](header[_constants.length] + 8, readOffset);
    const decodedUtf8 = FLACHeader._decodeUTF8Int(data[_constants.subarray](4));
    if (!decodedUtf8) {
      return null;
    }
    if (header[_constants.blockingStrategyBits]) {
      header[_constants.sampleNumber] = decodedUtf8.value;
    } else {
      header[_constants.frameNumber] = decodedUtf8.value;
    }
    header[_constants.length] += decodedUtf8[_constants.length];

    // Byte (...)
    // * `JJJJJJJJ|(JJJJJJJJ)`: Blocksize (8/16bit custom value)
    if (header[_constants.blockSizeBits] === 0b01100000) {
      // 8 bit
      if (data[_constants.length] < header[_constants.length]) data = yield* codecParser[_constants.readRawData](header[_constants.length], readOffset);
      header[_constants.blockSize] = data[header[_constants.length] - 1] + 1;
      header[_constants.length] += 1;
    } else if (header[_constants.blockSizeBits] === 0b01110000) {
      // 16 bit
      if (data[_constants.length] < header[_constants.length]) data = yield* codecParser[_constants.readRawData](header[_constants.length], readOffset);
      header[_constants.blockSize] = (data[header[_constants.length] - 1] << 8) + data[header[_constants.length]] + 1;
      header[_constants.length] += 2;
    }
    header[_constants.samples] = header[_constants.blockSize];

    // Byte (...)
    // * `KKKKKKKK|(KKKKKKKK)`: Sample rate (8/16bit custom value)
    if (header[_constants.sampleRateBits] === 0b00001100) {
      // 8 bit
      if (data[_constants.length] < header[_constants.length]) data = yield* codecParser[_constants.readRawData](header[_constants.length], readOffset);
      header[_constants.sampleRate] = data[header[_constants.length] - 1] * 1000;
      header[_constants.length] += 1;
    } else if (header[_constants.sampleRateBits] === 0b00001101) {
      // 16 bit
      if (data[_constants.length] < header[_constants.length]) data = yield* codecParser[_constants.readRawData](header[_constants.length], readOffset);
      header[_constants.sampleRate] = (data[header[_constants.length] - 1] << 8) + data[header[_constants.length]];
      header[_constants.length] += 2;
    } else if (header[_constants.sampleRateBits] === 0b00001110) {
      // 16 bit
      if (data[_constants.length] < header[_constants.length]) data = yield* codecParser[_constants.readRawData](header[_constants.length], readOffset);
      header[_constants.sampleRate] = ((data[header[_constants.length] - 1] << 8) + data[header[_constants.length]]) * 10;
      header[_constants.length] += 2;
    }

    // Byte (...)
    // * `LLLLLLLL`: CRC-8
    if (data[_constants.length] < header[_constants.length]) data = yield* codecParser[_constants.readRawData](header[_constants.length], readOffset);
    header[_constants.crc] = data[header[_constants.length] - 1];
    if (header[_constants.crc] !== (0, _utilities.crc8)(data[_constants.subarray](0, header[_constants.length] - 1))) {
      return null;
    }
    {
      if (!cachedHeader) {
        const {
          blockingStrategyBits,
          frameNumber,
          sampleNumber,
          samples,
          sampleRateBits,
          blockSizeBits,
          crc,
          length,
          ...codecUpdateFields
        } = header;
        headerCache[_constants.setHeader](key, header, codecUpdateFields);
      }
    }
    return new FLACHeader(header);
  }

  /**
   * @private
   * Call FLACHeader.getHeader(Array<Uint8>) to get instance
   */
  constructor(header) {
    super(header);
    this[_constants.crc16] = null; // set in FLACFrame
    this[_constants.blockingStrategy] = header[_constants.blockingStrategy];
    this[_constants.blockSize] = header[_constants.blockSize];
    this[_constants.frameNumber] = header[_constants.frameNumber];
    this[_constants.sampleNumber] = header[_constants.sampleNumber];
    this[_constants.streamInfo] = null; // set during ogg parsing
  }
}
exports.default = FLACHeader;

},{"../../constants.js":59,"../../utilities.js":66,"../CodecHeader.js":41}],49:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _globals = require("../../globals.js");
var _constants = require("../../constants.js");
var _Parser = _interopRequireDefault(require("../Parser.js"));
var _FLACFrame = _interopRequireDefault(require("./FLACFrame.js"));
var _FLACHeader = _interopRequireDefault(require("./FLACHeader.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* Copyright 2020-2023 Ethan Halsall
    
    This file is part of codec-parser.
    
    codec-parser is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    codec-parser is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>
*/

const MIN_FLAC_FRAME_SIZE = 2;
const MAX_FLAC_FRAME_SIZE = 512 * 1024;
class FLACParser extends _Parser.default {
  constructor(codecParser, headerCache, onCodec) {
    super(codecParser, headerCache);
    this.Frame = _FLACFrame.default;
    this.Header = _FLACHeader.default;
    onCodec(this[_constants.codec]);
  }
  get [_constants.codec]() {
    return "flac";
  }
  *_getNextFrameSyncOffset(offset) {
    const data = yield* this._codecParser[_constants.readRawData](2, 0);
    const dataLength = data[_constants.length] - 2;
    while (offset < dataLength) {
      // * `11111111|111110..`: Frame sync
      // * `........|......0.`: Reserved 0 - mandatory, 1 - reserved
      const firstByte = data[offset];
      if (firstByte === 0xff) {
        const secondByte = data[offset + 1];
        if (secondByte === 0xf8 || secondByte === 0xf9) break;
        if (secondByte !== 0xff) offset++; // might as well check for the next sync byte
      }

      offset++;
    }
    return offset;
  }
  *[_constants.parseFrame]() {
    // find the first valid frame header
    do {
      const header = yield* _FLACHeader.default[_constants.getHeader](this._codecParser, this._headerCache, 0);
      if (header) {
        // found a valid frame header
        // find the next valid frame header
        let nextHeaderOffset = _globals.headerStore.get(header)[_constants.length] + MIN_FLAC_FRAME_SIZE;
        while (nextHeaderOffset <= MAX_FLAC_FRAME_SIZE) {
          if (this._codecParser._flushing || (yield* _FLACHeader.default[_constants.getHeader](this._codecParser, this._headerCache, nextHeaderOffset))) {
            // found a valid next frame header
            let frameData = yield* this._codecParser[_constants.readRawData](nextHeaderOffset);
            if (!this._codecParser._flushing) frameData = frameData[_constants.subarray](0, nextHeaderOffset);

            // check that this is actually the next header by validating the frame footer crc16
            if (_FLACFrame.default[_constants.checkFrameFooterCrc16](frameData)) {
              // both frame headers, and frame footer crc16 are valid, we are synced (odds are pretty low of a false positive)
              const frame = new _FLACFrame.default(frameData, header);
              this._headerCache[_constants.enable](); // start caching when synced
              this._codecParser[_constants.incrementRawData](nextHeaderOffset); // increment to the next frame
              this._codecParser[_constants.mapFrameStats](frame);
              return frame;
            }
          }
          nextHeaderOffset = yield* this._getNextFrameSyncOffset(nextHeaderOffset + 1);
        }
        this._codecParser[_constants.logWarning](`Unable to sync FLAC frame after searching ${nextHeaderOffset} bytes.`);
        this._codecParser[_constants.incrementRawData](nextHeaderOffset);
      } else {
        // not synced, increment data to continue syncing
        this._codecParser[_constants.incrementRawData](yield* this._getNextFrameSyncOffset(1));
      }
    } while (true);
  }
  [_constants.parseOggPage](oggPage) {
    if (oggPage[_constants.pageSequenceNumber] === 0) {
      // Identification header

      this._headerCache[_constants.enable]();
      this._streamInfo = oggPage[_constants.data][_constants.subarray](13);
    } else if (oggPage[_constants.pageSequenceNumber] === 1) {
      // Vorbis comments
    } else {
      oggPage[_constants.codecFrames] = _globals.frameStore.get(oggPage)[_constants.segments].map(segment => {
        const header = _FLACHeader.default[_constants.getHeaderFromUint8Array](segment, this._headerCache);
        if (header) {
          return new _FLACFrame.default(segment, header, this._streamInfo);
        } else {
          this._codecParser[_constants.logWarning]("Failed to parse Ogg FLAC frame", "Skipping invalid FLAC frame");
        }
      }).filter(frame => !!frame);
    }
    return oggPage;
  }
}
exports.default = FLACParser;

},{"../../constants.js":59,"../../globals.js":64,"../Parser.js":43,"./FLACFrame.js":47,"./FLACHeader.js":48}],50:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _constants = require("../../constants.js");
var _CodecFrame = _interopRequireDefault(require("../CodecFrame.js"));
var _MPEGHeader = _interopRequireDefault(require("./MPEGHeader.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* Copyright 2020-2023 Ethan Halsall
    
    This file is part of codec-parser.
    
    codec-parser is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    codec-parser is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>
*/

class MPEGFrame extends _CodecFrame.default {
  static *[_constants.getFrame](codecParser, headerCache, readOffset) {
    return yield* super[_constants.getFrame](_MPEGHeader.default, MPEGFrame, codecParser, headerCache, readOffset);
  }
  constructor(header, frame, samples) {
    super(header, frame, samples);
  }
}
exports.default = MPEGFrame;

},{"../../constants.js":59,"../CodecFrame.js":40,"./MPEGHeader.js":51}],51:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _constants = require("../../constants.js");
var _utilities = require("../../utilities.js");
var _ID3v = _interopRequireDefault(require("../../metadata/ID3v2.js"));
var _CodecHeader = _interopRequireDefault(require("../CodecHeader.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* Copyright 2020-2023 Ethan Halsall
    
    This file is part of codec-parser.
    
    codec-parser is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    codec-parser is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>
*/

// http://www.mp3-tech.org/programmer/frame_header.html

const bitrateMatrix = {
  // bits | V1,L1 | V1,L2 | V1,L3 | V2,L1 | V2,L2 & L3
  0b00000000: [_constants.free, _constants.free, _constants.free, _constants.free, _constants.free],
  0b00010000: [32, 32, 32, 32, 8],
  // 0b00100000: [64,   48,  40,  48,  16,],
  // 0b00110000: [96,   56,  48,  56,  24,],
  // 0b01000000: [128,  64,  56,  64,  32,],
  // 0b01010000: [160,  80,  64,  80,  40,],
  // 0b01100000: [192,  96,  80,  96,  48,],
  // 0b01110000: [224, 112,  96, 112,  56,],
  // 0b10000000: [256, 128, 112, 128,  64,],
  // 0b10010000: [288, 160, 128, 144,  80,],
  // 0b10100000: [320, 192, 160, 160,  96,],
  // 0b10110000: [352, 224, 192, 176, 112,],
  // 0b11000000: [384, 256, 224, 192, 128,],
  // 0b11010000: [416, 320, 256, 224, 144,],
  // 0b11100000: [448, 384, 320, 256, 160,],
  0b11110000: [_constants.bad, _constants.bad, _constants.bad, _constants.bad, _constants.bad]
};
const calcBitrate = (idx, interval, intervalOffset) => 8 * ((idx + intervalOffset) % interval + interval) * (1 << (idx + intervalOffset) / interval) - 8 * interval * (interval / 8 | 0);

// generate bitrate matrix
for (let i = 2; i < 15; i++) bitrateMatrix[i << 4] = [i * 32,
//                V1,L1
calcBitrate(i, 4, 0),
//  V1,L2
calcBitrate(i, 4, -1),
// V1,L3
calcBitrate(i, 8, 4),
//  V2,L1
calcBitrate(i, 8, 0) //  V2,L2 & L3
];

const v1Layer1 = 0;
const v1Layer2 = 1;
const v1Layer3 = 2;
const v2Layer1 = 3;
const v2Layer23 = 4;
const bands = "bands ";
const to31 = " to 31";
const layer12ModeExtensions = {
  0b00000000: bands + 4 + to31,
  0b00010000: bands + 8 + to31,
  0b00100000: bands + 12 + to31,
  0b00110000: bands + 16 + to31
};
const bitrateIndex = "bitrateIndex";
const v2 = "v2";
const v1 = "v1";
const intensityStereo = "Intensity stereo ";
const msStereo = ", MS stereo ";
const on = "on";
const off = "off";
const layer3ModeExtensions = {
  0b00000000: intensityStereo + off + msStereo + off,
  0b00010000: intensityStereo + on + msStereo + off,
  0b00100000: intensityStereo + off + msStereo + on,
  0b00110000: intensityStereo + on + msStereo + on
};
const layersValues = {
  0b00000000: {
    [_constants.description]: _constants.reserved
  },
  0b00000010: {
    [_constants.description]: "Layer III",
    [_constants.framePadding]: 1,
    [_constants.modeExtension]: layer3ModeExtensions,
    [v1]: {
      [bitrateIndex]: v1Layer3,
      [_constants.samples]: 1152
    },
    [v2]: {
      [bitrateIndex]: v2Layer23,
      [_constants.samples]: 576
    }
  },
  0b00000100: {
    [_constants.description]: "Layer II",
    [_constants.framePadding]: 1,
    [_constants.modeExtension]: layer12ModeExtensions,
    [_constants.samples]: 1152,
    [v1]: {
      [bitrateIndex]: v1Layer2
    },
    [v2]: {
      [bitrateIndex]: v2Layer23
    }
  },
  0b00000110: {
    [_constants.description]: "Layer I",
    [_constants.framePadding]: 4,
    [_constants.modeExtension]: layer12ModeExtensions,
    [_constants.samples]: 384,
    [v1]: {
      [bitrateIndex]: v1Layer1
    },
    [v2]: {
      [bitrateIndex]: v2Layer1
    }
  }
};
const mpegVersionDescription = "MPEG Version ";
const isoIec = "ISO/IEC ";
const mpegVersions = {
  0b00000000: {
    [_constants.description]: `${mpegVersionDescription}2.5 (later extension of MPEG 2)`,
    [_constants.layer]: v2,
    [_constants.sampleRate]: {
      0b00000000: _constants.rate11025,
      0b00000100: _constants.rate12000,
      0b00001000: _constants.rate8000,
      0b00001100: _constants.reserved
    }
  },
  0b00001000: {
    [_constants.description]: _constants.reserved
  },
  0b00010000: {
    [_constants.description]: `${mpegVersionDescription}2 (${isoIec}13818-3)`,
    [_constants.layer]: v2,
    [_constants.sampleRate]: {
      0b00000000: _constants.rate22050,
      0b00000100: _constants.rate24000,
      0b00001000: _constants.rate16000,
      0b00001100: _constants.reserved
    }
  },
  0b00011000: {
    [_constants.description]: `${mpegVersionDescription}1 (${isoIec}11172-3)`,
    [_constants.layer]: v1,
    [_constants.sampleRate]: {
      0b00000000: _constants.rate44100,
      0b00000100: _constants.rate48000,
      0b00001000: _constants.rate32000,
      0b00001100: _constants.reserved
    }
  },
  length: _constants.length
};
const protectionValues = {
  0b00000000: _constants.sixteenBitCRC,
  0b00000001: _constants.none
};
const emphasisValues = {
  0b00000000: _constants.none,
  0b00000001: "50/15 ms",
  0b00000010: _constants.reserved,
  0b00000011: "CCIT J.17"
};
const channelModes = {
  0b00000000: {
    [_constants.channels]: 2,
    [_constants.description]: _constants.stereo
  },
  0b01000000: {
    [_constants.channels]: 2,
    [_constants.description]: "joint " + _constants.stereo
  },
  0b10000000: {
    [_constants.channels]: 2,
    [_constants.description]: "dual channel"
  },
  0b11000000: {
    [_constants.channels]: 1,
    [_constants.description]: _constants.monophonic
  }
};
class MPEGHeader extends _CodecHeader.default {
  static *[_constants.getHeader](codecParser, headerCache, readOffset) {
    const header = {};

    // check for id3 header
    const id3v2Header = yield* _ID3v.default.getID3v2Header(codecParser, headerCache, readOffset);
    if (id3v2Header) {
      // throw away the data. id3 parsing is not implemented yet.
      yield* codecParser[_constants.readRawData](id3v2Header[_constants.length], readOffset);
      codecParser[_constants.incrementRawData](id3v2Header[_constants.length]);
    }

    // Must be at least four bytes.
    const data = yield* codecParser[_constants.readRawData](4, readOffset);

    // Check header cache
    const key = (0, _utilities.bytesToString)(data[_constants.subarray](0, 4));
    const cachedHeader = headerCache[_constants.getHeader](key);
    if (cachedHeader) return new MPEGHeader(cachedHeader);

    // Frame sync (all bits must be set): `11111111|111`:
    if (data[0] !== 0xff || data[1] < 0xe0) return null;

    // Byte (2 of 4)
    // * `111BBCCD`
    // * `...BB...`: MPEG Audio version ID
    // * `.....CC.`: Layer description
    // * `.......D`: Protection bit (0 - Protected by CRC (16bit CRC follows header), 1 = Not protected)

    // Mpeg version (1, 2, 2.5)
    const mpegVersionValues = mpegVersions[data[1] & 0b00011000];
    if (mpegVersionValues[_constants.description] === _constants.reserved) return null;

    // Layer (I, II, III)
    const layerBits = data[1] & 0b00000110;
    if (layersValues[layerBits][_constants.description] === _constants.reserved) return null;
    const layerValues = {
      ...layersValues[layerBits],
      ...layersValues[layerBits][mpegVersionValues[_constants.layer]]
    };
    header[_constants.mpegVersion] = mpegVersionValues[_constants.description];
    header[_constants.layer] = layerValues[_constants.description];
    header[_constants.samples] = layerValues[_constants.samples];
    header[_constants.protection] = protectionValues[data[1] & 0b00000001];
    header[_constants.length] = 4;

    // Byte (3 of 4)
    // * `EEEEFFGH`
    // * `EEEE....`: Bitrate index. 1111 is invalid, everything else is accepted
    // * `....FF..`: Sample rate
    // * `......G.`: Padding bit, 0=frame not padded, 1=frame padded
    // * `.......H`: Private bit.
    header[_constants.bitrate] = bitrateMatrix[data[2] & 0b11110000][layerValues[bitrateIndex]];
    if (header[_constants.bitrate] === _constants.bad) return null;
    header[_constants.sampleRate] = mpegVersionValues[_constants.sampleRate][data[2] & 0b00001100];
    if (header[_constants.sampleRate] === _constants.reserved) return null;
    header[_constants.framePadding] = data[2] & 0b00000010 && layerValues[_constants.framePadding];
    header[_constants.isPrivate] = !!(data[2] & 0b00000001);
    header[_constants.frameLength] = Math.floor(125 * header[_constants.bitrate] * header[_constants.samples] / header[_constants.sampleRate] + header[_constants.framePadding]);
    if (!header[_constants.frameLength]) return null;

    // Byte (4 of 4)
    // * `IIJJKLMM`
    // * `II......`: Channel mode
    // * `..JJ....`: Mode extension (only if joint stereo)
    // * `....K...`: Copyright
    // * `.....L..`: Original
    // * `......MM`: Emphasis
    const channelModeBits = data[3] & 0b11000000;
    header[_constants.channelMode] = channelModes[channelModeBits][_constants.description];
    header[_constants.channels] = channelModes[channelModeBits][_constants.channels];
    header[_constants.modeExtension] = layerValues[_constants.modeExtension][data[3] & 0b00110000];
    header[_constants.isCopyrighted] = !!(data[3] & 0b00001000);
    header[_constants.isOriginal] = !!(data[3] & 0b00000100);
    header[_constants.emphasis] = emphasisValues[data[3] & 0b00000011];
    if (header[_constants.emphasis] === _constants.reserved) return null;
    header[_constants.bitDepth] = 16;

    // set header cache
    {
      const {
        length,
        frameLength,
        samples,
        ...codecUpdateFields
      } = header;
      headerCache[_constants.setHeader](key, header, codecUpdateFields);
    }
    return new MPEGHeader(header);
  }

  /**
   * @private
   * Call MPEGHeader.getHeader(Array<Uint8>) to get instance
   */
  constructor(header) {
    super(header);
    this[_constants.bitrate] = header[_constants.bitrate];
    this[_constants.emphasis] = header[_constants.emphasis];
    this[_constants.framePadding] = header[_constants.framePadding];
    this[_constants.isCopyrighted] = header[_constants.isCopyrighted];
    this[_constants.isOriginal] = header[_constants.isOriginal];
    this[_constants.isPrivate] = header[_constants.isPrivate];
    this[_constants.layer] = header[_constants.layer];
    this[_constants.modeExtension] = header[_constants.modeExtension];
    this[_constants.mpegVersion] = header[_constants.mpegVersion];
    this[_constants.protection] = header[_constants.protection];
  }
}
exports.default = MPEGHeader;

},{"../../constants.js":59,"../../metadata/ID3v2.js":65,"../../utilities.js":66,"../CodecHeader.js":41}],52:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _constants = require("../../constants.js");
var _Parser = _interopRequireDefault(require("../Parser.js"));
var _MPEGFrame = _interopRequireDefault(require("./MPEGFrame.js"));
var _MPEGHeader = _interopRequireDefault(require("./MPEGHeader.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* Copyright 2020-2023 Ethan Halsall
    
    This file is part of codec-parser.
    
    codec-parser is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    codec-parser is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>
*/

class MPEGParser extends _Parser.default {
  constructor(codecParser, headerCache, onCodec) {
    super(codecParser, headerCache);
    this.Frame = _MPEGFrame.default;
    this.Header = _MPEGHeader.default;
    onCodec(this[_constants.codec]);
  }
  get [_constants.codec]() {
    return _constants.mpeg;
  }
  *[_constants.parseFrame]() {
    return yield* this[_constants.fixedLengthFrameSync]();
  }
}
exports.default = MPEGParser;

},{"../../constants.js":59,"../Parser.js":43,"./MPEGFrame.js":50,"./MPEGHeader.js":51}],53:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _constants = require("../../constants.js");
var _CodecFrame = _interopRequireDefault(require("../CodecFrame.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* Copyright 2020-2023 Ethan Halsall
    
    This file is part of codec-parser.
    
    codec-parser is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    codec-parser is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>
*/

class OpusFrame extends _CodecFrame.default {
  constructor(data, header) {
    super(header, data, header[_constants.frameSize] * header[_constants.frameCount] / 1000 * header[_constants.sampleRate]);
  }
}
exports.default = OpusFrame;

},{"../../constants.js":59,"../CodecFrame.js":40}],54:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _constants = require("../../constants.js");
var _utilities = require("../../utilities.js");
var _CodecHeader = _interopRequireDefault(require("../CodecHeader.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* Copyright 2020-2023 Ethan Halsall
    
    This file is part of codec-parser.
    
    codec-parser is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    codec-parser is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>
*/

/*
https://tools.ietf.org/html/rfc7845.html
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|      'O'      |      'p'      |      'u'      |      's'      |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|      'H'      |      'e'      |      'a'      |      'd'      |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|  Version = 1  | Channel Count |           Pre-skip            |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                     Input Sample Rate (Hz)                    |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|   Output Gain (Q7.8 in dB)    | Mapping Family|               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+               :
|                                                               |
:               Optional Channel Mapping Table...               :
|                                                               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+

Letter  Length (bits)  Description
A  64  Magic Signature - OpusHead
B  8   Version number - 00000001
C  8   Output channel count (unsigned)
D  16  Pre-skip (unsigned, little endian)
E  32  Sample rate (unsigned, little endian)
F  16  Output Gain (signed, little endian)
G  8   Channel Mapping family (unsigned)

// if(channel mapping !== 0)
H  8   Stream count (unsigned)
I  8   Coupled Stream Count (unsigned)
J  8*C Channel Mapping
*/

/* prettier-ignore */
const channelMappingFamilies = {
  0b00000000: _constants.vorbisOpusChannelMapping.slice(0, 2),
  /*
  0: "monophonic (mono)"
  1: "stereo (left, right)"
  */
  0b00000001: _constants.vorbisOpusChannelMapping
  /*
  0: "monophonic (mono)"
  1: "stereo (left, right)"
  2: "linear surround (left, center, right)"
  3: "quadraphonic (front left, front right, rear left, rear right)"
  4: "5.0 surround (front left, front center, front right, rear left, rear right)"
  5: "5.1 surround (front left, front center, front right, rear left, rear right, LFE)"
  6: "6.1 surround (front left, front center, front right, side left, side right, rear center, LFE)"
  7: "7.1 surround (front left, front center, front right, side left, side right, rear left, rear right, LFE)"
  */
  // additional channel mappings are user defined
};

const silkOnly = "SILK-only";
const celtOnly = "CELT-only";
const hybrid = "Hybrid";
const narrowBand = "narrowband";
const mediumBand = "medium-band";
const wideBand = "wideband";
const superWideBand = "super-wideband";
const fullBand = "fullband";

//  0 1 2 3 4 5 6 7
// +-+-+-+-+-+-+-+-+
// | config  |s| c |
// +-+-+-+-+-+-+-+-+
// prettier-ignore
const configTable = {
  0b00000000: {
    [_constants.mode]: silkOnly,
    [_constants.bandwidth]: narrowBand,
    [_constants.frameSize]: 10
  },
  0b00001000: {
    [_constants.mode]: silkOnly,
    [_constants.bandwidth]: narrowBand,
    [_constants.frameSize]: 20
  },
  0b00010000: {
    [_constants.mode]: silkOnly,
    [_constants.bandwidth]: narrowBand,
    [_constants.frameSize]: 40
  },
  0b00011000: {
    [_constants.mode]: silkOnly,
    [_constants.bandwidth]: narrowBand,
    [_constants.frameSize]: 60
  },
  0b00100000: {
    [_constants.mode]: silkOnly,
    [_constants.bandwidth]: mediumBand,
    [_constants.frameSize]: 10
  },
  0b00101000: {
    [_constants.mode]: silkOnly,
    [_constants.bandwidth]: mediumBand,
    [_constants.frameSize]: 20
  },
  0b00110000: {
    [_constants.mode]: silkOnly,
    [_constants.bandwidth]: mediumBand,
    [_constants.frameSize]: 40
  },
  0b00111000: {
    [_constants.mode]: silkOnly,
    [_constants.bandwidth]: mediumBand,
    [_constants.frameSize]: 60
  },
  0b01000000: {
    [_constants.mode]: silkOnly,
    [_constants.bandwidth]: wideBand,
    [_constants.frameSize]: 10
  },
  0b01001000: {
    [_constants.mode]: silkOnly,
    [_constants.bandwidth]: wideBand,
    [_constants.frameSize]: 20
  },
  0b01010000: {
    [_constants.mode]: silkOnly,
    [_constants.bandwidth]: wideBand,
    [_constants.frameSize]: 40
  },
  0b01011000: {
    [_constants.mode]: silkOnly,
    [_constants.bandwidth]: wideBand,
    [_constants.frameSize]: 60
  },
  0b01100000: {
    [_constants.mode]: hybrid,
    [_constants.bandwidth]: superWideBand,
    [_constants.frameSize]: 10
  },
  0b01101000: {
    [_constants.mode]: hybrid,
    [_constants.bandwidth]: superWideBand,
    [_constants.frameSize]: 20
  },
  0b01110000: {
    [_constants.mode]: hybrid,
    [_constants.bandwidth]: fullBand,
    [_constants.frameSize]: 10
  },
  0b01111000: {
    [_constants.mode]: hybrid,
    [_constants.bandwidth]: fullBand,
    [_constants.frameSize]: 20
  },
  0b10000000: {
    [_constants.mode]: celtOnly,
    [_constants.bandwidth]: narrowBand,
    [_constants.frameSize]: 2.5
  },
  0b10001000: {
    [_constants.mode]: celtOnly,
    [_constants.bandwidth]: narrowBand,
    [_constants.frameSize]: 5
  },
  0b10010000: {
    [_constants.mode]: celtOnly,
    [_constants.bandwidth]: narrowBand,
    [_constants.frameSize]: 10
  },
  0b10011000: {
    [_constants.mode]: celtOnly,
    [_constants.bandwidth]: narrowBand,
    [_constants.frameSize]: 20
  },
  0b10100000: {
    [_constants.mode]: celtOnly,
    [_constants.bandwidth]: wideBand,
    [_constants.frameSize]: 2.5
  },
  0b10101000: {
    [_constants.mode]: celtOnly,
    [_constants.bandwidth]: wideBand,
    [_constants.frameSize]: 5
  },
  0b10110000: {
    [_constants.mode]: celtOnly,
    [_constants.bandwidth]: wideBand,
    [_constants.frameSize]: 10
  },
  0b10111000: {
    [_constants.mode]: celtOnly,
    [_constants.bandwidth]: wideBand,
    [_constants.frameSize]: 20
  },
  0b11000000: {
    [_constants.mode]: celtOnly,
    [_constants.bandwidth]: superWideBand,
    [_constants.frameSize]: 2.5
  },
  0b11001000: {
    [_constants.mode]: celtOnly,
    [_constants.bandwidth]: superWideBand,
    [_constants.frameSize]: 5
  },
  0b11010000: {
    [_constants.mode]: celtOnly,
    [_constants.bandwidth]: superWideBand,
    [_constants.frameSize]: 10
  },
  0b11011000: {
    [_constants.mode]: celtOnly,
    [_constants.bandwidth]: superWideBand,
    [_constants.frameSize]: 20
  },
  0b11100000: {
    [_constants.mode]: celtOnly,
    [_constants.bandwidth]: fullBand,
    [_constants.frameSize]: 2.5
  },
  0b11101000: {
    [_constants.mode]: celtOnly,
    [_constants.bandwidth]: fullBand,
    [_constants.frameSize]: 5
  },
  0b11110000: {
    [_constants.mode]: celtOnly,
    [_constants.bandwidth]: fullBand,
    [_constants.frameSize]: 10
  },
  0b11111000: {
    [_constants.mode]: celtOnly,
    [_constants.bandwidth]: fullBand,
    [_constants.frameSize]: 20
  }
};
class OpusHeader extends _CodecHeader.default {
  static [_constants.getHeaderFromUint8Array](dataValue, packetData, headerCache) {
    const header = {};

    // get length of header
    // Byte (10 of 19)
    // * `CCCCCCCC`: Channel Count
    header[_constants.channels] = dataValue[9];
    // Byte (19 of 19)
    // * `GGGGGGGG`: Channel Mapping Family
    header[_constants.channelMappingFamily] = dataValue[18];
    header[_constants.length] = header[_constants.channelMappingFamily] !== 0 ? 21 + header[_constants.channels] : 19;
    if (dataValue[_constants.length] < header[_constants.length]) throw new Error("Out of data while inside an Ogg Page");

    // Page Segment Bytes (1-2)
    // * `AAAAA...`: Packet config
    // * `.....B..`:
    // * `......CC`: Packet code
    const packetMode = packetData[0] & 0b00000011;
    const packetLength = packetMode === 3 ? 2 : 1;

    // Check header cache
    const key = (0, _utilities.bytesToString)(dataValue[_constants.subarray](0, header[_constants.length])) + (0, _utilities.bytesToString)(packetData[_constants.subarray](0, packetLength));
    const cachedHeader = headerCache[_constants.getHeader](key);
    if (cachedHeader) return new OpusHeader(cachedHeader);

    // Bytes (1-8 of 19): OpusHead - Magic Signature
    if (key.substr(0, 8) !== "OpusHead") {
      return null;
    }

    // Byte (9 of 19)
    // * `00000001`: Version number
    if (dataValue[8] !== 1) return null;
    header[_constants.data] = _constants.uint8Array.from(dataValue[_constants.subarray](0, header[_constants.length]));
    const view = new _constants.dataView(header[_constants.data][_constants.buffer]);
    header[_constants.bitDepth] = 16;

    // Byte (10 of 19)
    // * `CCCCCCCC`: Channel Count
    // set earlier to determine length

    // Byte (11-12 of 19)
    // * `DDDDDDDD|DDDDDDDD`: Pre skip
    header[_constants.preSkip] = view.getUint16(10, true);

    // Byte (13-16 of 19)
    // * `EEEEEEEE|EEEEEEEE|EEEEEEEE|EEEEEEEE`: Sample Rate
    header[_constants.inputSampleRate] = view.getUint32(12, true);
    // Opus is always decoded at 48kHz
    header[_constants.sampleRate] = _constants.rate48000;

    // Byte (17-18 of 19)
    // * `FFFFFFFF|FFFFFFFF`: Output Gain
    header[_constants.outputGain] = view.getInt16(16, true);

    // Byte (19 of 19)
    // * `GGGGGGGG`: Channel Mapping Family
    // set earlier to determine length
    if (header[_constants.channelMappingFamily] in channelMappingFamilies) {
      header[_constants.channelMode] = channelMappingFamilies[header[_constants.channelMappingFamily]][header[_constants.channels] - 1];
      if (!header[_constants.channelMode]) return null;
    }
    if (header[_constants.channelMappingFamily] !== 0) {
      // * `HHHHHHHH`: Stream count
      header[_constants.streamCount] = dataValue[19];

      // * `IIIIIIII`: Coupled Stream count
      header[_constants.coupledStreamCount] = dataValue[20];

      // * `JJJJJJJJ|...` Channel Mapping table
      header[_constants.channelMappingTable] = [...dataValue[_constants.subarray](21, header[_constants.channels] + 21)];
    }
    const packetConfig = configTable[0b11111000 & packetData[0]];
    header[_constants.mode] = packetConfig[_constants.mode];
    header[_constants.bandwidth] = packetConfig[_constants.bandwidth];
    header[_constants.frameSize] = packetConfig[_constants.frameSize];

    // https://tools.ietf.org/html/rfc6716#appendix-B
    switch (packetMode) {
      case 0:
        // 0: 1 frame in the packet
        header[_constants.frameCount] = 1;
        break;
      case 1:
      // 1: 2 frames in the packet, each with equal compressed size
      case 2:
        // 2: 2 frames in the packet, with different compressed sizes
        header[_constants.frameCount] = 2;
        break;
      case 3:
        // 3: an arbitrary number of frames in the packet
        header[_constants.isVbr] = !!(0b10000000 & packetData[1]);
        header[_constants.hasOpusPadding] = !!(0b01000000 & packetData[1]);
        header[_constants.frameCount] = 0b00111111 & packetData[1];
        break;
      default:
        return null;
    }

    // set header cache
    {
      const {
        length,
        data: headerData,
        channelMappingFamily,
        ...codecUpdateFields
      } = header;
      headerCache[_constants.setHeader](key, header, codecUpdateFields);
    }
    return new OpusHeader(header);
  }

  /**
   * @private
   * Call OpusHeader.getHeader(Array<Uint8>) to get instance
   */
  constructor(header) {
    super(header);
    this[_constants.data] = header[_constants.data];
    this[_constants.bandwidth] = header[_constants.bandwidth];
    this[_constants.channelMappingFamily] = header[_constants.channelMappingFamily];
    this[_constants.channelMappingTable] = header[_constants.channelMappingTable];
    this[_constants.coupledStreamCount] = header[_constants.coupledStreamCount];
    this[_constants.frameCount] = header[_constants.frameCount];
    this[_constants.frameSize] = header[_constants.frameSize];
    this[_constants.hasOpusPadding] = header[_constants.hasOpusPadding];
    this[_constants.inputSampleRate] = header[_constants.inputSampleRate];
    this[_constants.isVbr] = header[_constants.isVbr];
    this[_constants.mode] = header[_constants.mode];
    this[_constants.outputGain] = header[_constants.outputGain];
    this[_constants.preSkip] = header[_constants.preSkip];
    this[_constants.streamCount] = header[_constants.streamCount];
  }
}
exports.default = OpusHeader;

},{"../../constants.js":59,"../../utilities.js":66,"../CodecHeader.js":41}],55:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _globals = require("../../globals.js");
var _constants = require("../../constants.js");
var _Parser = _interopRequireDefault(require("../Parser.js"));
var _OpusFrame = _interopRequireDefault(require("./OpusFrame.js"));
var _OpusHeader = _interopRequireDefault(require("./OpusHeader.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* Copyright 2020-2023 Ethan Halsall
    
    This file is part of codec-parser.
    
    codec-parser is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    codec-parser is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>
*/

class OpusParser extends _Parser.default {
  constructor(codecParser, headerCache, onCodec) {
    super(codecParser, headerCache);
    this.Frame = _OpusFrame.default;
    this.Header = _OpusHeader.default;
    onCodec(this[_constants.codec]);
    this._identificationHeader = null;
  }
  get [_constants.codec]() {
    return "opus";
  }

  /**
   * @todo implement continued page support
   */
  [_constants.parseOggPage](oggPage) {
    if (oggPage[_constants.pageSequenceNumber] === 0) {
      // Identification header

      this._headerCache[_constants.enable]();
      this._identificationHeader = oggPage[_constants.data];
    } else if (oggPage[_constants.pageSequenceNumber] === 1) {
      // OpusTags
    } else {
      oggPage[_constants.codecFrames] = _globals.frameStore.get(oggPage)[_constants.segments].map(segment => {
        const header = _OpusHeader.default[_constants.getHeaderFromUint8Array](this._identificationHeader, segment, this._headerCache);
        if (header) return new _OpusFrame.default(segment, header);
        this._codecParser[_constants.logError]("Failed to parse Ogg Opus Header", "Not a valid Ogg Opus file");
      });
    }
    return oggPage;
  }
}
exports.default = OpusParser;

},{"../../constants.js":59,"../../globals.js":64,"../Parser.js":43,"./OpusFrame.js":53,"./OpusHeader.js":54}],56:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _CodecFrame = _interopRequireDefault(require("../CodecFrame.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* Copyright 2020-2023 Ethan Halsall
    
    This file is part of codec-parser.
    
    codec-parser is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    codec-parser is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>
*/

class VorbisFrame extends _CodecFrame.default {
  constructor(data, header, samples) {
    super(header, data, samples);
  }
}
exports.default = VorbisFrame;

},{"../CodecFrame.js":40}],57:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _constants = require("../../constants.js");
var _utilities = require("../../utilities.js");
var _CodecHeader = _interopRequireDefault(require("../CodecHeader.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* Copyright 2020-2023 Ethan Halsall
    
    This file is part of codec-parser.
    
    codec-parser is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    codec-parser is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>
*/

/*

1  1) [packet_type] : 8 bit value
2  2) 0x76, 0x6f, 0x72, 0x62, 0x69, 0x73: the characters ’v’,’o’,’r’,’b’,’i’,’s’ as six octets

Letter bits Description
A      8    Packet type
B      48   Magic signature (vorbis)
C      32   Version number
D      8    Channels
E      32   Sample rate
F      32   Bitrate Maximum (signed)
G      32   Bitrate Nominal (signed)
H      32   Bitrate Minimum (signed)
I      4    blocksize 1
J      4    blocksize 0
K      1    Framing flag
*/

const blockSizes = {
  // 0b0110: 64,
  // 0b0111: 128,
  // 0b1000: 256,
  // 0b1001: 512,
  // 0b1010: 1024,
  // 0b1011: 2048,
  // 0b1100: 4096,
  // 0b1101: 8192
};
for (let i = 0; i < 8; i++) blockSizes[i + 6] = 2 ** (6 + i);
class VorbisHeader extends _CodecHeader.default {
  static [_constants.getHeaderFromUint8Array](dataValue, headerCache, vorbisCommentsData, vorbisSetupData) {
    // Must be at least 30 bytes.
    if (dataValue[_constants.length] < 30) throw new Error("Out of data while inside an Ogg Page");

    // Check header cache
    const key = (0, _utilities.bytesToString)(dataValue[_constants.subarray](0, 30));
    const cachedHeader = headerCache[_constants.getHeader](key);
    if (cachedHeader) return new VorbisHeader(cachedHeader);
    const header = {
      [_constants.length]: 30
    };

    // Bytes (1-7 of 30): /01vorbis - Magic Signature
    if (key.substr(0, 7) !== "\x01vorbis") {
      return null;
    }
    header[_constants.data] = _constants.uint8Array.from(dataValue[_constants.subarray](0, 30));
    const view = new _constants.dataView(header[_constants.data][_constants.buffer]);

    // Byte (8-11 of 30)
    // * `CCCCCCCC|CCCCCCCC|CCCCCCCC|CCCCCCCC`: Version number
    header[_constants.version] = view.getUint32(7, true);
    if (header[_constants.version] !== 0) return null;

    // Byte (12 of 30)
    // * `DDDDDDDD`: Channel Count
    header[_constants.channels] = dataValue[11];
    header[_constants.channelMode] = _constants.vorbisOpusChannelMapping[header[_constants.channels] - 1] || "application defined";

    // Byte (13-16 of 30)
    // * `EEEEEEEE|EEEEEEEE|EEEEEEEE|EEEEEEEE`: Sample Rate
    header[_constants.sampleRate] = view.getUint32(12, true);

    // Byte (17-20 of 30)
    // * `FFFFFFFF|FFFFFFFF|FFFFFFFF|FFFFFFFF`: Bitrate Maximum
    header[_constants.bitrateMaximum] = view.getInt32(16, true);

    // Byte (21-24 of 30)
    // * `GGGGGGGG|GGGGGGGG|GGGGGGGG|GGGGGGGG`: Bitrate Nominal
    header[_constants.bitrateNominal] = view.getInt32(20, true);

    // Byte (25-28 of 30)
    // * `HHHHHHHH|HHHHHHHH|HHHHHHHH|HHHHHHHH`: Bitrate Minimum
    header[_constants.bitrateMinimum] = view.getInt32(24, true);

    // Byte (29 of 30)
    // * `IIII....` Blocksize 1
    // * `....JJJJ` Blocksize 0
    header[_constants.blocksize1] = blockSizes[(dataValue[28] & 0b11110000) >> 4];
    header[_constants.blocksize0] = blockSizes[dataValue[28] & 0b00001111];
    if (header[_constants.blocksize0] > header[_constants.blocksize1]) return null;

    // Byte (29 of 30)
    // * `00000001` Framing bit
    if (dataValue[29] !== 0x01) return null;
    header[_constants.bitDepth] = 32;
    header[_constants.vorbisSetup] = vorbisSetupData;
    header[_constants.vorbisComments] = vorbisCommentsData;
    {
      // set header cache
      const {
        length,
        data,
        version,
        vorbisSetup,
        vorbisComments,
        ...codecUpdateFields
      } = header;
      headerCache[_constants.setHeader](key, header, codecUpdateFields);
    }
    return new VorbisHeader(header);
  }

  /**
   * @private
   * Call VorbisHeader.getHeader(Array<Uint8>) to get instance
   */
  constructor(header) {
    super(header);
    this[_constants.bitrateMaximum] = header[_constants.bitrateMaximum];
    this[_constants.bitrateMinimum] = header[_constants.bitrateMinimum];
    this[_constants.bitrateNominal] = header[_constants.bitrateNominal];
    this[_constants.blocksize0] = header[_constants.blocksize0];
    this[_constants.blocksize1] = header[_constants.blocksize1];
    this[_constants.data] = header[_constants.data];
    this[_constants.vorbisComments] = header[_constants.vorbisComments];
    this[_constants.vorbisSetup] = header[_constants.vorbisSetup];
  }
}
exports.default = VorbisHeader;

},{"../../constants.js":59,"../../utilities.js":66,"../CodecHeader.js":41}],58:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _globals = require("../../globals.js");
var _utilities = require("../../utilities.js");
var _constants = require("../../constants.js");
var _Parser = _interopRequireDefault(require("../Parser.js"));
var _VorbisFrame = _interopRequireDefault(require("./VorbisFrame.js"));
var _VorbisHeader = _interopRequireDefault(require("./VorbisHeader.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* Copyright 2020-2023 Ethan Halsall
    
    This file is part of codec-parser.
    
    codec-parser is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    codec-parser is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>
*/

class VorbisParser extends _Parser.default {
  constructor(codecParser, headerCache, onCodec) {
    super(codecParser, headerCache);
    this.Frame = _VorbisFrame.default;
    onCodec(this[_constants.codec]);
    this._identificationHeader = null;
    this._mode = {
      count: 0
    };
    this._prevBlockSize = 0;
    this._currBlockSize = 0;
  }
  get [_constants.codec]() {
    return _constants.vorbis;
  }
  [_constants.parseOggPage](oggPage) {
    const oggPageSegments = _globals.frameStore.get(oggPage)[_constants.segments];
    if (oggPage[_constants.pageSequenceNumber] === 0) {
      // Identification header

      this._headerCache[_constants.enable]();
      this._identificationHeader = oggPage[_constants.data];
    } else if (oggPage[_constants.pageSequenceNumber] === 1) {
      // gather WEBM CodecPrivate data
      if (oggPageSegments[1]) {
        this._vorbisComments = oggPageSegments[0];
        this._vorbisSetup = oggPageSegments[1];
        this._mode = this._parseSetupHeader(oggPageSegments[1]);
      }
    } else {
      oggPage[_constants.codecFrames] = oggPageSegments.map(segment => {
        const header = _VorbisHeader.default[_constants.getHeaderFromUint8Array](this._identificationHeader, this._headerCache, this._vorbisComments, this._vorbisSetup);
        if (header) {
          return new _VorbisFrame.default(segment, header, this._getSamples(segment, header));
        }
        this._codecParser[_constants.logError]("Failed to parse Ogg Vorbis Header", "Not a valid Ogg Vorbis file");
      });
    }
    return oggPage;
  }
  _getSamples(segment, header) {
    const byte = segment[0] >> 1;
    const blockFlag = this._mode[byte & this._mode.mask];

    // is this a large window
    if (blockFlag) {
      this._prevBlockSize = byte & this._mode.prevMask ? header[_constants.blocksize1] : header[_constants.blocksize0];
    }
    this._currBlockSize = blockFlag ? header[_constants.blocksize1] : header[_constants.blocksize0];
    const samplesValue = this._prevBlockSize + this._currBlockSize >> 2;
    this._prevBlockSize = this._currBlockSize;
    return samplesValue;
  }

  // https://gitlab.xiph.org/xiph/liboggz/-/blob/master/src/liboggz/oggz_auto.c
  // https://github.com/FFmpeg/FFmpeg/blob/master/libavcodec/vorbis_parser.c
  /*
   * This is the format of the mode data at the end of the packet for all
   * Vorbis Version 1 :
   *
   * [ 6:number_of_modes ]
   * [ 1:size | 16:window_type(0) | 16:transform_type(0) | 8:mapping ]
   * [ 1:size | 16:window_type(0) | 16:transform_type(0) | 8:mapping ]
   * [ 1:size | 16:window_type(0) | 16:transform_type(0) | 8:mapping ]
   * [ 1:framing(1) ]
   *
   * e.g.:
   *
   * MsB         LsB
   *              <-
   * 0 0 0 0 0 1 0 0
   * 0 0 1 0 0 0 0 0
   * 0 0 1 0 0 0 0 0
   * 0 0 1|0 0 0 0 0
   * 0 0 0 0|0|0 0 0
   * 0 0 0 0 0 0 0 0
   * 0 0 0 0|0 0 0 0
   * 0 0 0 0 0 0 0 0
   * 0 0 0 0|0 0 0 0
   * 0 0 0|1|0 0 0 0 |
   * 0 0 0 0 0 0 0 0 V
   * 0 0 0|0 0 0 0 0
   * 0 0 0 0 0 0 0 0
   * 0 0 1|0 0 0 0 0
   *
   * The simplest way to approach this is to start at the end
   * and read backwards to determine the mode configuration.
   *
   * liboggz and ffmpeg both use this method.
   */
  _parseSetupHeader(setup) {
    const bitReader = new _utilities.BitReader(setup);
    const failedToParseVorbisStream = "Failed to read " + _constants.vorbis + " stream";
    const failedToParseVorbisModes = ", failed to parse " + _constants.vorbis + " modes";
    let mode = {
      count: 0
    };

    // sync with the framing bit
    while ((bitReader.read(1) & 0x01) !== 1) {}
    let modeBits;
    // search in reverse to parse out the mode entries
    // limit mode count to 63 so previous block flag will be in first packet byte
    while (mode.count < 64 && bitReader.position > 0) {
      const mapping = (0, _utilities.reverse)(bitReader.read(8));
      if (mapping in mode && !(mode.count === 1 && mapping === 0) // allows for the possibility of only one mode
      ) {
        this._codecParser[_constants.logError]("received duplicate mode mapping" + failedToParseVorbisModes);
        throw new Error(failedToParseVorbisStream);
      }

      // 16 bits transform type, 16 bits window type, all values must be zero
      let i = 0;
      while (bitReader.read(8) === 0x00 && i++ < 3) {} // a non-zero value may indicate the end of the mode entries, or invalid data

      if (i === 4) {
        // transform type and window type were all zeros
        modeBits = bitReader.read(7); // modeBits may need to be used in the next iteration if this is the last mode entry
        mode[mapping] = modeBits & 0x01; // read and store mode -> block flag mapping
        bitReader.position += 6; // go back 6 bits so next iteration starts right after the block flag
        mode.count++;
      } else {
        // transform type and window type were not all zeros
        // check for mode count using previous iteration modeBits
        if ((((0, _utilities.reverse)(modeBits) & 0b01111110) >> 1) + 1 !== mode.count) {
          this._codecParser[_constants.logError]("mode count did not match actual modes" + failedToParseVorbisModes);
          throw new Error(failedToParseVorbisStream);
        }
        break;
      }
    }

    // mode mask to read the mode from the first byte in the vorbis frame
    mode.mask = (1 << Math.log2(mode.count)) - 1;
    // previous window flag is the next bit after the mode mask
    mode.prevMask = (mode.mask | 0x1) + 1;
    return mode;
  }
}
exports.default = VorbisParser;

},{"../../constants.js":59,"../../globals.js":64,"../../utilities.js":66,"../Parser.js":43,"./VorbisFrame.js":56,"./VorbisHeader.js":57}],59:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rate8000 = exports.rate7350 = exports.rate64000 = exports.rate48000 = exports.rate44100 = exports.rate32000 = exports.rate24000 = exports.rate22050 = exports.rate192000 = exports.rate176400 = exports.rate16000 = exports.rate12000 = exports.rate11025 = exports.protection = exports.profileBits = exports.profile = exports.preSkip = exports.parseOggPage = exports.parseFrame = exports.pageSequenceNumber = exports.pageSegmentTable = exports.pageSegmentBytes = exports.pageChecksum = exports.outputGain = exports.numberAACFrames = exports.none = exports.mpegVersion = exports.mpeg = exports.monophonic = exports.modeExtension = exports.mode = exports.mapFrameStats = exports.mapCodecFrameStats = exports.logWarning = exports.logError = exports.lfe = exports.length = exports.layer = exports.isVbr = exports.isPrivate = exports.isOriginal = exports.isLastPage = exports.isHome = exports.isFirstPage = exports.isCopyrighted = exports.isContinuedPacket = exports.inputSampleRate = exports.incrementRawData = exports.header = exports.hasOpusPadding = exports.getHeaderFromUint8Array = exports.getHeader = exports.getFrame = exports.getChannelMapping = exports.free = exports.frameSize = exports.framePadding = exports.frameNumber = exports.frameLength = exports.frameCount = exports.frame = exports.fixedLengthFrameSync = exports.enable = exports.emphasis = exports.duration = exports.description = exports.dataView = exports.data = exports.crc32 = exports.crc16 = exports.crc = exports.coupledStreamCount = exports.copyrightIdStart = exports.copyrightId = exports.codecFrames = exports.codec = exports.checkFrameFooterCrc16 = exports.checkCodecUpdate = exports.channels = exports.channelModeBits = exports.channelMode = exports.channelMappings = exports.channelMappingTable = exports.channelMappingFamily = exports.bufferFullness = exports.buffer = exports.blocksize1 = exports.blocksize0 = exports.blockingStrategyBits = exports.blockingStrategy = exports.blockSizeBits = exports.blockSize = exports.bitrateNominal = exports.bitrateMinimum = exports.bitrateMaximum = exports.bitrate = exports.bitDepth = exports.bandwidth = exports.bad = exports.absoluteGranulePosition = void 0;
exports.vorbisSetup = exports.vorbisOpusChannelMapping = exports.vorbisComments = exports.vorbis = exports.version = exports.uint8Array = exports.totalSamples = exports.totalDuration = exports.totalBytesOut = exports.syncFrame = exports.subarray = exports.streamStructureVersion = exports.streamSerialNumber = exports.streamInfo = exports.streamCount = exports.stereo = exports.sixteenBitCRC = exports.setHeader = exports.segments = exports.samples = exports.sampleRateBits = exports.sampleRate = exports.sampleNumber = exports.reset = exports.reserved = exports.readRawData = exports.rawData = exports.rate96000 = exports.rate88200 = void 0;
const symbol = Symbol;

// prettier-ignore
/*
[
  [
    "left, right",
    "left, right, center",
    "left, center, right",
    "center, left, right",
    "center"
  ],
  [
    "front left, front right",
    "front left, front right, front center",
    "front left, front center, front right",
    "front center, front left, front right",
    "front center"
  ],
  [
    "side left, side right",
    "side left, side right, side center",
    "side left, side center, side right",
    "side center, side left, side right",
    "side center"
  ],
  [
    "rear left, rear right",
    "rear left, rear right, rear center",
    "rear left, rear center, rear right",
    "rear center, rear left, rear right",
    "rear center"
  ]
]
*/

const mappingJoin = ", ";
const channelMappings = (() => {
  const front = "front";
  const side = "side";
  const rear = "rear";
  const left = "left";
  const center = "center";
  const right = "right";
  return ["", front + " ", side + " ", rear + " "].map(x => [[left, right], [left, right, center], [left, center, right], [center, left, right], [center]].flatMap(y => y.map(z => x + z).join(mappingJoin)));
})();
exports.channelMappings = channelMappings;
const lfe = "LFE";
exports.lfe = lfe;
const monophonic = "monophonic (mono)";
exports.monophonic = monophonic;
const stereo = "stereo";
exports.stereo = stereo;
const surround = "surround";
const getChannelMapping = (channelCount, ...mappings) => `${[monophonic, stereo, `linear ${surround}`, "quadraphonic", `5.0 ${surround}`, `5.1 ${surround}`, `6.1 ${surround}`, `7.1 ${surround}`][channelCount - 1]} (${mappings.join(mappingJoin)})`;

// prettier-ignore
exports.getChannelMapping = getChannelMapping;
const vorbisOpusChannelMapping = [monophonic, getChannelMapping(2, channelMappings[0][0]), getChannelMapping(3, channelMappings[0][2]), getChannelMapping(4, channelMappings[1][0], channelMappings[3][0]), getChannelMapping(5, channelMappings[1][2], channelMappings[3][0]), getChannelMapping(6, channelMappings[1][2], channelMappings[3][0], lfe), getChannelMapping(7, channelMappings[1][2], channelMappings[2][0], channelMappings[3][4], lfe), getChannelMapping(8, channelMappings[1][2], channelMappings[2][0], channelMappings[3][0], lfe)];

// sampleRates
exports.vorbisOpusChannelMapping = vorbisOpusChannelMapping;
const rate192000 = 192000;
exports.rate192000 = rate192000;
const rate176400 = 176400;
exports.rate176400 = rate176400;
const rate96000 = 96000;
exports.rate96000 = rate96000;
const rate88200 = 88200;
exports.rate88200 = rate88200;
const rate64000 = 64000;
exports.rate64000 = rate64000;
const rate48000 = 48000;
exports.rate48000 = rate48000;
const rate44100 = 44100;
exports.rate44100 = rate44100;
const rate32000 = 32000;
exports.rate32000 = rate32000;
const rate24000 = 24000;
exports.rate24000 = rate24000;
const rate22050 = 22050;
exports.rate22050 = rate22050;
const rate16000 = 16000;
exports.rate16000 = rate16000;
const rate12000 = 12000;
exports.rate12000 = rate12000;
const rate11025 = 11025;
exports.rate11025 = rate11025;
const rate8000 = 8000;
exports.rate8000 = rate8000;
const rate7350 = 7350;

// header key constants
exports.rate7350 = rate7350;
const absoluteGranulePosition = "absoluteGranulePosition";
exports.absoluteGranulePosition = absoluteGranulePosition;
const bandwidth = "bandwidth";
exports.bandwidth = bandwidth;
const bitDepth = "bitDepth";
exports.bitDepth = bitDepth;
const bitrate = "bitrate";
exports.bitrate = bitrate;
const bitrateMaximum = bitrate + "Maximum";
exports.bitrateMaximum = bitrateMaximum;
const bitrateMinimum = bitrate + "Minimum";
exports.bitrateMinimum = bitrateMinimum;
const bitrateNominal = bitrate + "Nominal";
exports.bitrateNominal = bitrateNominal;
const buffer = "buffer";
exports.buffer = buffer;
const bufferFullness = buffer + "Fullness";
exports.bufferFullness = bufferFullness;
const codec = "codec";
exports.codec = codec;
const codecFrames = codec + "Frames";
exports.codecFrames = codecFrames;
const coupledStreamCount = "coupledStreamCount";
exports.coupledStreamCount = coupledStreamCount;
const crc = "crc";
exports.crc = crc;
const crc16 = crc + "16";
exports.crc16 = crc16;
const crc32 = crc + "32";
exports.crc32 = crc32;
const data = "data";
exports.data = data;
const description = "description";
exports.description = description;
const duration = "duration";
exports.duration = duration;
const emphasis = "emphasis";
exports.emphasis = emphasis;
const hasOpusPadding = "hasOpusPadding";
exports.hasOpusPadding = hasOpusPadding;
const header = "header";
exports.header = header;
const isContinuedPacket = "isContinuedPacket";
exports.isContinuedPacket = isContinuedPacket;
const isCopyrighted = "isCopyrighted";
exports.isCopyrighted = isCopyrighted;
const isFirstPage = "isFirstPage";
exports.isFirstPage = isFirstPage;
const isHome = "isHome";
exports.isHome = isHome;
const isLastPage = "isLastPage";
exports.isLastPage = isLastPage;
const isOriginal = "isOriginal";
exports.isOriginal = isOriginal;
const isPrivate = "isPrivate";
exports.isPrivate = isPrivate;
const isVbr = "isVbr";
exports.isVbr = isVbr;
const layer = "layer";
exports.layer = layer;
const length = "length";
exports.length = length;
const mode = "mode";
exports.mode = mode;
const modeExtension = mode + "Extension";
exports.modeExtension = modeExtension;
const mpeg = "mpeg";
exports.mpeg = mpeg;
const mpegVersion = mpeg + "Version";
exports.mpegVersion = mpegVersion;
const numberAACFrames = "numberAAC" + "Frames";
exports.numberAACFrames = numberAACFrames;
const outputGain = "outputGain";
exports.outputGain = outputGain;
const preSkip = "preSkip";
exports.preSkip = preSkip;
const profile = "profile";
exports.profile = profile;
const profileBits = symbol();
exports.profileBits = profileBits;
const protection = "protection";
exports.protection = protection;
const rawData = "rawData";
exports.rawData = rawData;
const segments = "segments";
exports.segments = segments;
const subarray = "subarray";
exports.subarray = subarray;
const version = "version";
exports.version = version;
const vorbis = "vorbis";
exports.vorbis = vorbis;
const vorbisComments = vorbis + "Comments";
exports.vorbisComments = vorbisComments;
const vorbisSetup = vorbis + "Setup";
exports.vorbisSetup = vorbisSetup;
const block = "block";
const blockingStrategy = block + "ingStrategy";
exports.blockingStrategy = blockingStrategy;
const blockingStrategyBits = symbol();
exports.blockingStrategyBits = blockingStrategyBits;
const blockSize = block + "Size";
exports.blockSize = blockSize;
const blocksize0 = block + "size0";
exports.blocksize0 = blocksize0;
const blocksize1 = block + "size1";
exports.blocksize1 = blocksize1;
const blockSizeBits = symbol();
exports.blockSizeBits = blockSizeBits;
const channel = "channel";
const channelMappingFamily = channel + "MappingFamily";
exports.channelMappingFamily = channelMappingFamily;
const channelMappingTable = channel + "MappingTable";
exports.channelMappingTable = channelMappingTable;
const channelMode = channel + "Mode";
exports.channelMode = channelMode;
const channelModeBits = symbol();
exports.channelModeBits = channelModeBits;
const channels = channel + "s";
exports.channels = channels;
const copyright = "copyright";
const copyrightId = copyright + "Id";
exports.copyrightId = copyrightId;
const copyrightIdStart = copyright + "IdStart";
exports.copyrightIdStart = copyrightIdStart;
const frame = "frame";
exports.frame = frame;
const frameCount = frame + "Count";
exports.frameCount = frameCount;
const frameLength = frame + "Length";
exports.frameLength = frameLength;
const Number = "Number";
const frameNumber = frame + Number;
exports.frameNumber = frameNumber;
const framePadding = frame + "Padding";
exports.framePadding = framePadding;
const frameSize = frame + "Size";
exports.frameSize = frameSize;
const Rate = "Rate";
const inputSampleRate = "inputSample" + Rate;
exports.inputSampleRate = inputSampleRate;
const page = "page";
const pageChecksum = page + "Checksum";
exports.pageChecksum = pageChecksum;
const pageSegmentBytes = symbol();
exports.pageSegmentBytes = pageSegmentBytes;
const pageSegmentTable = page + "SegmentTable";
exports.pageSegmentTable = pageSegmentTable;
const pageSequenceNumber = page + "Sequence" + Number;
exports.pageSequenceNumber = pageSequenceNumber;
const sample = "sample";
const sampleNumber = sample + Number;
exports.sampleNumber = sampleNumber;
const sampleRate = sample + Rate;
exports.sampleRate = sampleRate;
const sampleRateBits = symbol();
exports.sampleRateBits = sampleRateBits;
const samples = sample + "s";
exports.samples = samples;
const stream = "stream";
const streamCount = stream + "Count";
exports.streamCount = streamCount;
const streamInfo = stream + "Info";
exports.streamInfo = streamInfo;
const streamSerialNumber = stream + "Serial" + Number;
exports.streamSerialNumber = streamSerialNumber;
const streamStructureVersion = stream + "StructureVersion";
exports.streamStructureVersion = streamStructureVersion;
const total = "total";
const totalBytesOut = total + "BytesOut";
exports.totalBytesOut = totalBytesOut;
const totalDuration = total + "Duration";
exports.totalDuration = totalDuration;
const totalSamples = total + "Samples";

// private methods
exports.totalSamples = totalSamples;
const readRawData = symbol();
exports.readRawData = readRawData;
const incrementRawData = symbol();
exports.incrementRawData = incrementRawData;
const mapCodecFrameStats = symbol();
exports.mapCodecFrameStats = mapCodecFrameStats;
const mapFrameStats = symbol();
exports.mapFrameStats = mapFrameStats;
const logWarning = symbol();
exports.logWarning = logWarning;
const logError = symbol();
exports.logError = logError;
const syncFrame = symbol();
exports.syncFrame = syncFrame;
const fixedLengthFrameSync = symbol();
exports.fixedLengthFrameSync = fixedLengthFrameSync;
const getHeader = symbol();
exports.getHeader = getHeader;
const setHeader = symbol();
exports.setHeader = setHeader;
const getFrame = symbol();
exports.getFrame = getFrame;
const parseFrame = symbol();
exports.parseFrame = parseFrame;
const parseOggPage = symbol();
exports.parseOggPage = parseOggPage;
const checkCodecUpdate = symbol();
exports.checkCodecUpdate = checkCodecUpdate;
const reset = symbol();
exports.reset = reset;
const enable = symbol();
exports.enable = enable;
const getHeaderFromUint8Array = symbol();
exports.getHeaderFromUint8Array = getHeaderFromUint8Array;
const checkFrameFooterCrc16 = symbol();
exports.checkFrameFooterCrc16 = checkFrameFooterCrc16;
const uint8Array = Uint8Array;
exports.uint8Array = uint8Array;
const dataView = DataView;
exports.dataView = dataView;
const reserved = "reserved";
exports.reserved = reserved;
const bad = "bad";
exports.bad = bad;
const free = "free";
exports.free = free;
const none = "none";
exports.none = none;
const sixteenBitCRC = "16bit CRC";
exports.sixteenBitCRC = sixteenBitCRC;

},{}],60:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _globals = require("../globals.js");
var _constants = require("../constants.js");
/* Copyright 2020-2023 Ethan Halsall
    
    This file is part of codec-parser.
    
    codec-parser is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    codec-parser is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>
*/

/**
 * @abstract
 */
class Frame {
  constructor(headerValue, dataValue) {
    _globals.frameStore.set(this, {
      [_constants.header]: headerValue
    });
    this[_constants.data] = dataValue;
  }
}
exports.default = Frame;

},{"../constants.js":59,"../globals.js":64}],61:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _globals = require("../../globals.js");
var _constants = require("../../constants.js");
var _Frame = _interopRequireDefault(require("../Frame.js"));
var _OggPageHeader = _interopRequireDefault(require("./OggPageHeader.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* Copyright 2020-2023 Ethan Halsall
    
    This file is part of codec-parser.
    
    codec-parser is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    codec-parser is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>
*/

class OggPage extends _Frame.default {
  static *[_constants.getFrame](codecParser, headerCache, readOffset) {
    const header = yield* _OggPageHeader.default[_constants.getHeader](codecParser, headerCache, readOffset);
    if (header) {
      const frameLengthValue = _globals.headerStore.get(header)[_constants.frameLength];
      const headerLength = _globals.headerStore.get(header)[_constants.length];
      const totalLength = headerLength + frameLengthValue;
      const rawDataValue = (yield* codecParser[_constants.readRawData](totalLength, 0))[_constants.subarray](0, totalLength);
      const frame = rawDataValue[_constants.subarray](headerLength, totalLength);
      return new OggPage(header, frame, rawDataValue);
    } else {
      return null;
    }
  }
  constructor(header, frame, rawDataValue) {
    super(header, frame);
    _globals.frameStore.get(this)[_constants.length] = rawDataValue[_constants.length];
    this[_constants.codecFrames] = [];
    this[_constants.rawData] = rawDataValue;
    this[_constants.absoluteGranulePosition] = header[_constants.absoluteGranulePosition];
    this[_constants.crc32] = header[_constants.pageChecksum];
    this[_constants.duration] = 0;
    this[_constants.isContinuedPacket] = header[_constants.isContinuedPacket];
    this[_constants.isFirstPage] = header[_constants.isFirstPage];
    this[_constants.isLastPage] = header[_constants.isLastPage];
    this[_constants.pageSequenceNumber] = header[_constants.pageSequenceNumber];
    this[_constants.samples] = 0;
    this[_constants.streamSerialNumber] = header[_constants.streamSerialNumber];
  }
}
exports.default = OggPage;

},{"../../constants.js":59,"../../globals.js":64,"../Frame.js":60,"./OggPageHeader.js":62}],62:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _globals = require("../../globals.js");
var _constants = require("../../constants.js");
/* Copyright 2020-2023 Ethan Halsall
    
    This file is part of codec-parser.
    
    codec-parser is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    codec-parser is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>
*/

/*
https://xiph.org/ogg/doc/framing.html

AAAAAAAA AAAAAAAA AAAAAAAA AAAAAAAA BBBBBBBB 00000CDE

(LSB)                                                             (MSB)
FFFFFFFF FFFFFFFF FFFFFFFF FFFFFFFF FFFFFFFF FFFFFFFF FFFFFFFF FFFFFFFF
GGGGGGGG GGGGGGGG GGGGGGGG GGGGGGGG
HHHHHHHH HHHHHHHH HHHHHHHH HHHHHHHH
IIIIIIII IIIIIIII IIIIIIII IIIIIIII

JJJJJJJJ
LLLLLLLL...

Ogg Page Header
Letter  Length (bits)  Description
A   32  0x4f676753, "OggS"
B   8   stream_structure_version
C   1   (0 no, 1 yes) last page of logical bitstream (eos)
D   1   (0 no, 1 yes) first page of logical bitstream (bos)
E   1   (0 no, 1 yes) continued packet

F   64  absolute granule position
G   32  stream serial number
H   32  page sequence no
I   32  page checksum
J   8   Number of page segments in the segment table
L   n   Segment table (n=page_segments+26).
        Segment table values sum to the total length of the packet.
        Last value is always < 0xFF. Last lacing value will be 0x00 if evenly divisible by 0xFF.
        
*/

class OggPageHeader {
  static *[_constants.getHeader](codecParser, headerCache, readOffset) {
    const header = {};

    // Must be at least 28 bytes.
    let data = yield* codecParser[_constants.readRawData](28, readOffset);

    // Bytes (1-4 of 28)
    // Frame sync (must equal OggS): `AAAAAAAA|AAAAAAAA|AAAAAAAA|AAAAAAAA`:
    if (data[0] !== 0x4f ||
    // O
    data[1] !== 0x67 ||
    // g
    data[2] !== 0x67 ||
    // g
    data[3] !== 0x53 //    S
    ) {
      return null;
    }

    // Byte (5 of 28)
    // * `BBBBBBBB`: stream_structure_version
    header[_constants.streamStructureVersion] = data[4];

    // Byte (6 of 28)
    // * `00000CDE`
    // * `00000...`: All zeros
    // * `.....C..`: (0 no, 1 yes) last page of logical bitstream (eos)
    // * `......D.`: (0 no, 1 yes) first page of logical bitstream (bos)
    // * `.......E`: (0 no, 1 yes) continued packet
    const zeros = data[5] & 0b11111000;
    if (zeros) return null;
    header[_constants.isLastPage] = !!(data[5] & 0b00000100);
    header[_constants.isFirstPage] = !!(data[5] & 0b00000010);
    header[_constants.isContinuedPacket] = !!(data[5] & 0b00000001);
    const view = new _constants.dataView(_constants.uint8Array.from(data[_constants.subarray](0, 28))[_constants.buffer]);

    // Byte (7-14 of 28)
    // * `FFFFFFFF|FFFFFFFF|FFFFFFFF|FFFFFFFF|FFFFFFFF|FFFFFFFF|FFFFFFFF|FFFFFFFF`
    // * Absolute Granule Position

    /**
     * @todo Safari does not support getBigInt64, but it also doesn't support Ogg
     */
    try {
      header[_constants.absoluteGranulePosition] = view.getBigInt64(6, true);
    } catch {}

    // Byte (15-18 of 28)
    // * `GGGGGGGG|GGGGGGGG|GGGGGGGG|GGGGGGGG`
    // * Stream Serial Number
    header[_constants.streamSerialNumber] = view.getInt32(14, true);

    // Byte (19-22 of 28)
    // * `HHHHHHHH|HHHHHHHH|HHHHHHHH|HHHHHHHH`
    // * Page Sequence Number
    header[_constants.pageSequenceNumber] = view.getInt32(18, true);

    // Byte (23-26 of 28)
    // * `IIIIIIII|IIIIIIII|IIIIIIII|IIIIIIII`
    // * Page Checksum
    header[_constants.pageChecksum] = view.getInt32(22, true);

    // Byte (27 of 28)
    // * `JJJJJJJJ`: Number of page segments in the segment table
    const pageSegmentTableLength = data[26];
    header[_constants.length] = pageSegmentTableLength + 27;
    data = yield* codecParser[_constants.readRawData](header[_constants.length], readOffset); // read in the page segment table

    header[_constants.frameLength] = 0;
    header[_constants.pageSegmentTable] = [];
    header[_constants.pageSegmentBytes] = _constants.uint8Array.from(data[_constants.subarray](27, header[_constants.length]));
    for (let i = 0, segmentLength = 0; i < pageSegmentTableLength; i++) {
      const segmentByte = header[_constants.pageSegmentBytes][i];
      header[_constants.frameLength] += segmentByte;
      segmentLength += segmentByte;
      if (segmentByte !== 0xff || i === pageSegmentTableLength - 1) {
        header[_constants.pageSegmentTable].push(segmentLength);
        segmentLength = 0;
      }
    }
    return new OggPageHeader(header);
  }

  /**
   * @private
   * Call OggPageHeader.getHeader(Array<Uint8>) to get instance
   */
  constructor(header) {
    _globals.headerStore.set(this, header);
    this[_constants.absoluteGranulePosition] = header[_constants.absoluteGranulePosition];
    this[_constants.isContinuedPacket] = header[_constants.isContinuedPacket];
    this[_constants.isFirstPage] = header[_constants.isFirstPage];
    this[_constants.isLastPage] = header[_constants.isLastPage];
    this[_constants.pageSegmentTable] = header[_constants.pageSegmentTable];
    this[_constants.pageSequenceNumber] = header[_constants.pageSequenceNumber];
    this[_constants.pageChecksum] = header[_constants.pageChecksum];
    this[_constants.streamSerialNumber] = header[_constants.streamSerialNumber];
  }
}
exports.default = OggPageHeader;

},{"../../constants.js":59,"../../globals.js":64}],63:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _globals = require("../../globals.js");
var _utilities = require("../../utilities.js");
var _constants = require("../../constants.js");
var _Parser = _interopRequireDefault(require("../../codecs/Parser.js"));
var _OggPage = _interopRequireDefault(require("./OggPage.js"));
var _OggPageHeader = _interopRequireDefault(require("./OggPageHeader.js"));
var _FLACParser = _interopRequireDefault(require("../../codecs/flac/FLACParser.js"));
var _OpusParser = _interopRequireDefault(require("../../codecs/opus/OpusParser.js"));
var _VorbisParser = _interopRequireDefault(require("../../codecs/vorbis/VorbisParser.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* Copyright 2020-2023 Ethan Halsall
    
    This file is part of codec-parser.
    
    codec-parser is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    codec-parser is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>
*/

class OggParser extends _Parser.default {
  constructor(codecParser, headerCache, onCodec) {
    super(codecParser, headerCache);
    this._onCodec = onCodec;
    this.Frame = _OggPage.default;
    this.Header = _OggPageHeader.default;
    this._codec = null;
    this._continuedPacket = new _constants.uint8Array();
    this._pageSequenceNumber = 0;
  }
  get [_constants.codec]() {
    return this._codec || "";
  }
  _updateCodec(codec, Parser) {
    if (this._codec !== codec) {
      this._headerCache[_constants.reset]();
      this._parser = new Parser(this._codecParser, this._headerCache, this._onCodec);
      this._codec = codec;
    }
  }
  _checkForIdentifier({
    data
  }) {
    const idString = (0, _utilities.bytesToString)(data[_constants.subarray](0, 8));
    switch (idString) {
      case "fishead\0":
      case "fisbone\0":
      case "index\0\0\0":
        return false;
      // ignore ogg skeleton packets
      case "OpusHead":
        this._updateCodec("opus", _OpusParser.default);
        return true;
      case /^\x7fFLAC/.test(idString) && idString:
        this._updateCodec("flac", _FLACParser.default);
        return true;
      case /^\x01vorbis/.test(idString) && idString:
        this._updateCodec(_constants.vorbis, _VorbisParser.default);
        return true;
    }
  }
  _checkPageSequenceNumber(oggPage) {
    if (oggPage[_constants.pageSequenceNumber] !== this._pageSequenceNumber + 1 && this._pageSequenceNumber > 1 && oggPage[_constants.pageSequenceNumber] > 1) {
      this._codecParser[_constants.logWarning]("Unexpected gap in Ogg Page Sequence Number.", `Expected: ${this._pageSequenceNumber + 1}, Got: ${oggPage[_constants.pageSequenceNumber]}`);
    }
    this._pageSequenceNumber = oggPage[_constants.pageSequenceNumber];
  }
  *[_constants.parseFrame]() {
    const oggPage = yield* this[_constants.fixedLengthFrameSync](true);
    this._checkPageSequenceNumber(oggPage);
    const oggPageStore = _globals.frameStore.get(oggPage);
    const headerData = _globals.headerStore.get(oggPageStore[_constants.header]);
    let offset = 0;
    oggPageStore[_constants.segments] = headerData[_constants.pageSegmentTable].map(segmentLength => oggPage[_constants.data][_constants.subarray](offset, offset += segmentLength));
    if (headerData[_constants.pageSegmentBytes][headerData[_constants.pageSegmentBytes][_constants.length] - 1] === 0xff) {
      // continued packet
      this._continuedPacket = (0, _utilities.concatBuffers)(this._continuedPacket, oggPageStore[_constants.segments].pop());
    } else if (this._continuedPacket[_constants.length]) {
      oggPageStore[_constants.segments][0] = (0, _utilities.concatBuffers)(this._continuedPacket, oggPageStore[_constants.segments][0]);
      this._continuedPacket = new _constants.uint8Array();
    }
    if (this._codec || this._checkForIdentifier(oggPage)) {
      const frame = this._parser[_constants.parseOggPage](oggPage);
      this._codecParser[_constants.mapFrameStats](frame);
      return frame;
    }
  }
}
exports.default = OggParser;

},{"../../codecs/Parser.js":43,"../../codecs/flac/FLACParser.js":49,"../../codecs/opus/OpusParser.js":55,"../../codecs/vorbis/VorbisParser.js":58,"../../constants.js":59,"../../globals.js":64,"../../utilities.js":66,"./OggPage.js":61,"./OggPageHeader.js":62}],64:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.headerStore = exports.frameStore = void 0;
const headerStore = new WeakMap();
exports.headerStore = headerStore;
const frameStore = new WeakMap();
exports.frameStore = frameStore;

},{}],65:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _constants = require("../constants.js");
/* Copyright 2020-2023 Ethan Halsall
    
    This file is part of codec-parser.
    
    codec-parser is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    codec-parser is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>
*/

// https://id3.org/Developer%20Information

const unsynchronizationFlag = "unsynchronizationFlag";
const extendedHeaderFlag = "extendedHeaderFlag";
const experimentalFlag = "experimentalFlag";
const footerPresent = "footerPresent";
class ID3v2 {
  static *getID3v2Header(codecParser, headerCache, readOffset) {
    const headerLength = 10;
    const header = {};
    let data = yield* codecParser[_constants.readRawData](3, readOffset);
    // Byte (0-2 of 9)
    // ID3
    if (data[0] !== 0x49 || data[1] !== 0x44 || data[2] !== 0x33) return null;
    data = yield* codecParser[_constants.readRawData](headerLength, readOffset);

    // Byte (3-4 of 9)
    // * `BBBBBBBB|........`: Major version
    // * `........|BBBBBBBB`: Minor version
    header[_constants.version] = `id3v2.${data[3]}.${data[4]}`;

    // Byte (5 of 9)
    // * `....0000.: Zeros (flags not implemented yet)
    if (data[5] & 0b00001111) return null;

    // Byte (5 of 9)
    // * `CDEF0000`: Flags
    // * `C.......`: Unsynchronisation (indicates whether or not unsynchronisation is used)
    // * `.D......`: Extended header (indicates whether or not the header is followed by an extended header)
    // * `..E.....`: Experimental indicator (indicates whether or not the tag is in an experimental stage)
    // * `...F....`: Footer present (indicates that a footer is present at the very end of the tag)
    header[unsynchronizationFlag] = !!(data[5] & 0b10000000);
    header[extendedHeaderFlag] = !!(data[5] & 0b01000000);
    header[experimentalFlag] = !!(data[5] & 0b00100000);
    header[footerPresent] = !!(data[5] & 0b00010000);

    // Byte (6-9 of 9)
    // * `0.......|0.......|0.......|0.......`: Zeros
    if (data[6] & 0b10000000 || data[7] & 0b10000000 || data[8] & 0b10000000 || data[9] & 0b10000000) return null;

    // Byte (6-9 of 9)
    // * `.FFFFFFF|.FFFFFFF|.FFFFFFF|.FFFFFFF`: Tag Length
    // The ID3v2 tag size is encoded with four bytes where the most significant bit (bit 7)
    // is set to zero in every byte, making a total of 28 bits. The zeroed bits are ignored,
    // so a 257 bytes long tag is represented as $00 00 02 01.
    const dataLength = data[6] << 21 | data[7] << 14 | data[8] << 7 | data[9];
    header[_constants.length] = headerLength + dataLength;
    return new ID3v2(header);
  }
  constructor(header) {
    this[_constants.version] = header[_constants.version];
    this[unsynchronizationFlag] = header[unsynchronizationFlag];
    this[extendedHeaderFlag] = header[extendedHeaderFlag];
    this[experimentalFlag] = header[experimentalFlag];
    this[footerPresent] = header[footerPresent];
    this[_constants.length] = header[_constants.length];
  }
}
exports.default = ID3v2;

},{"../constants.js":59}],66:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reverse = exports.flacCrc16 = exports.crc8 = exports.crc32Function = exports.concatBuffers = exports.bytesToString = exports.BitReader = void 0;
var _constants = require("./constants.js");
/* Copyright 2020-2023 Ethan Halsall
    
    This file is part of codec-parser.
    
    codec-parser is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    codec-parser is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>
*/

const getCrcTable = (crcTable, crcInitialValueFunction, crcFunction) => {
  for (let byte = 0; byte < crcTable[_constants.length]; byte++) {
    let crc = crcInitialValueFunction(byte);
    for (let bit = 8; bit > 0; bit--) crc = crcFunction(crc);
    crcTable[byte] = crc;
  }
  return crcTable;
};
const crc8Table = getCrcTable(new _constants.uint8Array(256), b => b, crc => crc & 0x80 ? 0x07 ^ crc << 1 : crc << 1);
const flacCrc16Table = [getCrcTable(new Uint16Array(256), b => b << 8, crc => crc << 1 ^ (crc & 1 << 15 ? 0x8005 : 0))];
const crc32Table = [getCrcTable(new Uint32Array(256), b => b, crc => crc >>> 1 ^ (crc & 1) * 0xedb88320)];

// build crc tables
for (let i = 0; i < 15; i++) {
  flacCrc16Table.push(new Uint16Array(256));
  crc32Table.push(new Uint32Array(256));
  for (let j = 0; j <= 0xff; j++) {
    flacCrc16Table[i + 1][j] = flacCrc16Table[0][flacCrc16Table[i][j] >>> 8] ^ flacCrc16Table[i][j] << 8;
    crc32Table[i + 1][j] = crc32Table[i][j] >>> 8 ^ crc32Table[0][crc32Table[i][j] & 0xff];
  }
}
const crc8 = data => {
  let crc = 0;
  const dataLength = data[_constants.length];
  for (let i = 0; i !== dataLength; i++) crc = crc8Table[crc ^ data[i]];
  return crc;
};
exports.crc8 = crc8;
const flacCrc16 = data => {
  const dataLength = data[_constants.length];
  const crcChunkSize = dataLength - 16;
  let crc = 0;
  let i = 0;
  while (i <= crcChunkSize) {
    crc ^= data[i++] << 8 | data[i++];
    crc = flacCrc16Table[15][crc >> 8] ^ flacCrc16Table[14][crc & 0xff] ^ flacCrc16Table[13][data[i++]] ^ flacCrc16Table[12][data[i++]] ^ flacCrc16Table[11][data[i++]] ^ flacCrc16Table[10][data[i++]] ^ flacCrc16Table[9][data[i++]] ^ flacCrc16Table[8][data[i++]] ^ flacCrc16Table[7][data[i++]] ^ flacCrc16Table[6][data[i++]] ^ flacCrc16Table[5][data[i++]] ^ flacCrc16Table[4][data[i++]] ^ flacCrc16Table[3][data[i++]] ^ flacCrc16Table[2][data[i++]] ^ flacCrc16Table[1][data[i++]] ^ flacCrc16Table[0][data[i++]];
  }
  while (i !== dataLength) crc = (crc & 0xff) << 8 ^ flacCrc16Table[0][crc >> 8 ^ data[i++]];
  return crc;
};
exports.flacCrc16 = flacCrc16;
const crc32Function = data => {
  const dataLength = data[_constants.length];
  const crcChunkSize = dataLength - 16;
  let crc = 0;
  let i = 0;
  while (i <= crcChunkSize) crc = crc32Table[15][(data[i++] ^ crc) & 0xff] ^ crc32Table[14][(data[i++] ^ crc >>> 8) & 0xff] ^ crc32Table[13][(data[i++] ^ crc >>> 16) & 0xff] ^ crc32Table[12][data[i++] ^ crc >>> 24] ^ crc32Table[11][data[i++]] ^ crc32Table[10][data[i++]] ^ crc32Table[9][data[i++]] ^ crc32Table[8][data[i++]] ^ crc32Table[7][data[i++]] ^ crc32Table[6][data[i++]] ^ crc32Table[5][data[i++]] ^ crc32Table[4][data[i++]] ^ crc32Table[3][data[i++]] ^ crc32Table[2][data[i++]] ^ crc32Table[1][data[i++]] ^ crc32Table[0][data[i++]];
  while (i !== dataLength) crc = crc32Table[0][(crc ^ data[i++]) & 0xff] ^ crc >>> 8;
  return crc ^ -1;
};
exports.crc32Function = crc32Function;
const concatBuffers = (...buffers) => {
  const buffer = new _constants.uint8Array(buffers.reduce((acc, buf) => acc + buf[_constants.length], 0));
  buffers.reduce((offset, buf) => {
    buffer.set(buf, offset);
    return offset + buf[_constants.length];
  }, 0);
  return buffer;
};
exports.concatBuffers = concatBuffers;
const bytesToString = bytes => String.fromCharCode(...bytes);

// prettier-ignore
exports.bytesToString = bytesToString;
const reverseTable = [0x0, 0x8, 0x4, 0xc, 0x2, 0xa, 0x6, 0xe, 0x1, 0x9, 0x5, 0xd, 0x3, 0xb, 0x7, 0xf];
const reverse = val => reverseTable[val & 0b1111] << 4 | reverseTable[val >> 4];
exports.reverse = reverse;
class BitReader {
  constructor(data) {
    this._data = data;
    this._pos = data[_constants.length] * 8;
  }
  set position(position) {
    this._pos = position;
  }
  get position() {
    return this._pos;
  }
  read(bits) {
    const byte = Math.floor(this._pos / 8);
    const bit = this._pos % 8;
    this._pos -= bits;
    const window = (reverse(this._data[byte - 1]) << 8) + reverse(this._data[byte]);
    return window >> 7 - bit & 0xff;
  }
}
exports.BitReader = BitReader;

},{"./constants.js":59}],67:[function(require,module,exports){
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],68:[function(require,module,exports){
/**
 * @module  is-audio-buffer
 */
'use strict';

module.exports = function isAudioBuffer (buffer) {
	//the guess is duck-typing
	return buffer != null
	&& typeof buffer.length === 'number'
	&& typeof buffer.sampleRate === 'number' //swims like AudioBuffer
	&& typeof buffer.getChannelData === 'function' //quacks like AudioBuffer
	// && buffer.copyToChannel
	// && buffer.copyFromChannel
	&& typeof buffer.duration === 'number'
};

},{}],69:[function(require,module,exports){
(function(root) {
  'use strict';

  function isBase64(v, opts) {
    if (v instanceof Boolean || typeof v === 'boolean') {
      return false
    }
    if (!(opts instanceof Object)) {
      opts = {}
    }
    if (opts.hasOwnProperty('allowBlank') && !opts.allowBlank && v === '') {
      return false
    }

    var regex = '(?:[A-Za-z0-9+\\/]{4})*(?:[A-Za-z0-9+\\/]{2}==|[A-Za-z0-9+\/]{3}=)?';

    if (opts.mime) {
      regex = '(data:\\w+\\/[a-zA-Z\\+\\-\\.]+;base64,)?' + regex
    }

    if (opts.paddingRequired === false) {
      regex = '(?:[A-Za-z0-9+\\/]{4})*(?:[A-Za-z0-9+\\/]{2}(==)?|[A-Za-z0-9+\\/]{3}=?)?'
    }

    return (new RegExp('^' + regex + '$', 'gi')).test(v);
  }

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = isBase64;
    }
    exports.isBase64 = isBase64;
  } else if (typeof define === 'function' && define.amd) {
    define([], function() {
      return isBase64;
    });
  } else {
    root.isBase64 = isBase64;
  }
})(this);

},{}],70:[function(require,module,exports){
module.exports = true;
},{}],71:[function(require,module,exports){
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

module.exports = function isBuffer (obj) {
  return obj != null && obj.constructor != null &&
    typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

},{}],72:[function(require,module,exports){
'use strict';
var toString = Object.prototype.toString;

module.exports = function (x) {
	var prototype;
	return toString.call(x) === '[object Object]' && (prototype = Object.getPrototypeOf(x), prototype === null || prototype === Object.getPrototypeOf({}));
};

},{}],73:[function(require,module,exports){
/** @module negative-index */
var isNeg = require('negative-zero');

module.exports = function negIdx (idx, length) {
	return idx == null ? 0 : isNeg(idx) ? length : idx <= -length ? 0 : idx < 0 ? (length + (idx % length)) : Math.min(length, idx);
}

},{"negative-zero":74}],74:[function(require,module,exports){
'use strict';
module.exports = x => Object.is(x, -0);

},{}],75:[function(require,module,exports){
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],76:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "OggOpusDecoder", {
  enumerable: true,
  get: function () {
    return _OggOpusDecoder.default;
  }
});
Object.defineProperty(exports, "OggOpusDecoderWebWorker", {
  enumerable: true,
  get: function () {
    return _OggOpusDecoderWebWorker.default;
  }
});
var _OggOpusDecoder = _interopRequireDefault(require("./src/OggOpusDecoder.js"));
var _OggOpusDecoderWebWorker = _interopRequireDefault(require("./src/OggOpusDecoderWebWorker.js"));
var _common = require("@wasm-audio-decoders/common");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
(0, _common.assignNames)(_OggOpusDecoder.default, "OggOpusDecoder");
(0, _common.assignNames)(_OggOpusDecoderWebWorker.default, "OggOpusDecoderWebWorker");

},{"./src/OggOpusDecoder.js":77,"./src/OggOpusDecoderWebWorker.js":78,"@wasm-audio-decoders/common":19}],77:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _common = require("@wasm-audio-decoders/common");
var _opusDecoder = require("opus-decoder");
var _codecParser = _interopRequireWildcard(require("codec-parser"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
class DecoderState {
  constructor(instance) {
    this._instance = instance;
    this._decoderOperations = [];
    this._errors = [];
    this._decoded = [];
    this._channelsDecoded = 0;
    this._totalSamples = 0;
  }
  get decoded() {
    return this._instance.ready.then(() => Promise.all(this._decoderOperations)).then(() => [this._errors, this._decoded, this._channelsDecoded, this._totalSamples, this._instance._sampleRate || 48000]);
  }
  async _instantiateDecoder(header) {
    this._instance._decoder = new this._instance._decoderClass({
      channels: header[_codecParser.channels],
      streamCount: header[_codecParser.streamCount],
      coupledStreamCount: header[_codecParser.coupledStreamCount],
      channelMappingTable: header[_codecParser.channelMappingTable],
      preSkip: header[_codecParser.preSkip],
      sampleRate: this._instance._sampleRate,
      forceStereo: this._instance._forceStereo
    });
    this._instance._ready = this._instance._decoder.ready;
  }
  async _sendToDecoder(frames) {
    const {
      channelData,
      samplesDecoded,
      errors
    } = await this._instance._decoder.decodeFrames(frames);
    this._decoded.push(channelData);
    this._errors = this._errors.concat(errors);
    this._totalSamples += samplesDecoded;
    this._channelsDecoded = channelData.length;
  }
  async _decode(codecFrames) {
    if (codecFrames.length) {
      if (!this._instance._decoder && codecFrames[0][_codecParser.header]) this._instantiateDecoder(codecFrames[0][_codecParser.header]);
      await this._instance.ready;
      this._decoderOperations.push(this._sendToDecoder(codecFrames.map(f => f.data)));
    }
  }
}
class OggOpusDecoder {
  constructor(options = {}) {
    this._sampleRate = options.sampleRate;
    this._forceStereo = options.forceStereo !== undefined ? options.forceStereo : false;
    this._onCodec = codec => {
      if (codec !== "opus") throw new Error("ogg-opus-decoder does not support this codec " + codec);
    };

    // instantiate to create static properties
    new _common.WASMAudioDecoderCommon();
    this._decoderClass = _opusDecoder.OpusDecoder;
    this._init();
  }
  _init() {
    if (this._decoder) this._decoder.free();
    this._decoder = null;
    this._ready = Promise.resolve();
    this._codecParser = new _codecParser.default("application/ogg", {
      onCodec: this._onCodec,
      enableFrameCRC32: false
    });
  }
  get ready() {
    return this._ready;
  }
  async reset() {
    this._init();
  }
  free() {
    this._init();
  }
  async _flush(decoderState) {
    for (const frame of this._codecParser.flush()) {
      decoderState._decode(frame[_codecParser.codecFrames]);
    }
    const decoded = await decoderState.decoded;
    this._init();
    return decoded;
  }
  async _decode(oggOpusData, decoderState) {
    for (const frame of this._codecParser.parseChunk(oggOpusData)) {
      decoderState._decode(frame[_codecParser.codecFrames]);
    }
    return decoderState.decoded;
  }
  async decode(oggOpusData) {
    return _common.WASMAudioDecoderCommon.getDecodedAudioMultiChannel(...(await this._decode(oggOpusData, new DecoderState(this))));
  }
  async decodeFile(oggOpusData) {
    const decoderState = new DecoderState(this);
    return _common.WASMAudioDecoderCommon.getDecodedAudioMultiChannel(...(await this._decode(oggOpusData, decoderState).then(() => this._flush(decoderState))));
  }
  async flush() {
    return _common.WASMAudioDecoderCommon.getDecodedAudioMultiChannel(...(await this._flush(new DecoderState(this))));
  }
}
exports.default = OggOpusDecoder;

},{"@wasm-audio-decoders/common":19,"codec-parser":38,"opus-decoder":79}],78:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _opusDecoder = require("opus-decoder");
var _OggOpusDecoder = _interopRequireDefault(require("./OggOpusDecoder.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class OggOpusDecoderWebWorker extends _OggOpusDecoder.default {
  constructor(options) {
    super(options);
    this._decoderClass = _opusDecoder.OpusDecoderWebWorker;
  }
  async free() {
    super.free();
  }
}
exports.default = OggOpusDecoderWebWorker;

},{"./OggOpusDecoder.js":77,"opus-decoder":79}],79:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "OpusDecoder", {
  enumerable: true,
  get: function () {
    return _OpusDecoder.default;
  }
});
Object.defineProperty(exports, "OpusDecoderWebWorker", {
  enumerable: true,
  get: function () {
    return _OpusDecoderWebWorker.default;
  }
});
var _OpusDecoder = _interopRequireDefault(require("./src/OpusDecoder.js"));
var _OpusDecoderWebWorker = _interopRequireDefault(require("./src/OpusDecoderWebWorker.js"));
var _common = require("@wasm-audio-decoders/common");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
(0, _common.assignNames)(_OpusDecoder.default, "OpusDecoder");
(0, _common.assignNames)(_OpusDecoderWebWorker.default, "OpusDecoderWebWorker");

},{"./src/OpusDecoder.js":81,"./src/OpusDecoderWebWorker.js":82,"@wasm-audio-decoders/common":19}],80:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = EmscriptenWASM;
/* **************************************************
 * This file is auto-generated during the build process.
 * Any edits to this file will be overwritten.
 ****************************************************/

function EmscriptenWASM(WASMAudioDecoderCommon) {
  var Module = Module;
  function ready() {}
  Module = {};
  function abort(what) {
    throw what;
  }
  for (var base64ReverseLookup = new Uint8Array(123), i = 25; i >= 0; --i) {
    base64ReverseLookup[48 + i] = 52 + i;
    base64ReverseLookup[65 + i] = i;
    base64ReverseLookup[97 + i] = 26 + i;
  }
  base64ReverseLookup[43] = 62;
  base64ReverseLookup[47] = 63;
  function base64Decode(b64) {
    var b1,
      b2,
      i = 0,
      j = 0,
      bLength = b64.length,
      output = new Uint8Array((bLength * 3 >> 2) - (b64[bLength - 2] == "=") - (b64[bLength - 1] == "="));
    for (; i < bLength; i += 4, j += 3) {
      b1 = base64ReverseLookup[b64.charCodeAt(i + 1)];
      b2 = base64ReverseLookup[b64.charCodeAt(i + 2)];
      output[j] = base64ReverseLookup[b64.charCodeAt(i)] << 2 | b1 >> 4;
      output[j + 1] = b1 << 4 | b2 >> 2;
      output[j + 2] = b2 << 6 | base64ReverseLookup[b64.charCodeAt(i + 3)];
    }
    return output;
  }
  if (!EmscriptenWASM.wasm) Object.defineProperty(EmscriptenWASM, "wasm", {
    get: () => String.raw`dynEncode0159cc2cadd5ÍêÞî5i à=}^Hw#Tºñn¿¿9ñrxuQ«¢³Íé+c!1LuçJPðß^¼t¤aYQbT¦vî­qå V¿[n¶Ã~Vs^©Gä*7·
®ªÂ7ß
ê=}«¥ó×:J+Åÿ±jKy×ìY-ß¼©.HÑWöY+H}a¨¨âYY}])e-_1·{åjµ¯ËNgÇdÚÜ'y[î2ïáDjû{{_o@u¬þk±CÇGâqÓôôõµ¬4=}Û7WQR\þýå¬]f¬\,dö= hYwpjHh½Cöy ÷Çx!¤>Î¬dPÒÁç®)ÕíÇ5?TËlwkºEB/x8K=}J]n©4øùVÌIUgÊêQOG³ÇxÛA58É¨D¹Wa]k¡å#Ú#üïvÚåÓ[Nqf]sKÚ*8ÚWS)X \vvA=M*R@æ^½Í)FE//òWs=}6L|6ïðÎUÓìÕ[S¬"(_>JÐ¼$M÷WÊëÑ^)áYrJn9øm.	?QLÒÑ×ñ4Uo~NùìÃ	 F¾Elö?ÉkÒ@dÒfÏû@MÞÉçè<1+FGÂóBGªÔ|!/ã/¯!ÏÇÕv= öÏÆg¿?0p=}¡·çhðD %$%Aïòòòò"HTCíÓ½= O@åC-ú­.vË÷£È_^üp÷¡©Pº=Màg°ÚÙfyõçæùJ5)kÙ§Ü\jY^åp<Ïx<ÑÈ_L«2s	\T;±áÞ5,ng0_óµ *üv9jÆ3-3íY¾<ÐýDGü{<4&êD\û7ÄÎà^¨MçÁ¬ÄìÄ;[yk´?ÐD²SÐ!OÍ,yftÁ.l=}m'ð¼¡>gBva_K^´Ýÿ&;: ÷9¦·Ñ}ë¹?E	|WmQ´mÇXÊdßã%N8¬eX·d¦p8ìÝ"7\Z-»ÔD§ÇR¹l(6aQH~ñf= ÊÈqgü:$ÜfØ23ÅñºØñ_^÷^(ªØ©n6Y	=MÔ+1CÊqaÅfnÜXK°IY
Ò>9Æ°]ý6® #W4Ûà0Úï¾×\Ëæa\®»W{1i¼ìAyÚ¼éYÇ³/ÞæD,&§è¢Ì¢Ì_)âÏ)o%´-ç¦3?àÛ/12ýb×à5¡Þ±ÁZM&ôGto½äÛÐ}Nºûbj[8!­ÒÖ_¤$=}úk¿ÈÙ[ª³O7k¨ÅiM4Ìf	ÇÈýe8k¶A]Aãüê0%|dT'<çñ~ BNermÁ3i#CóiÒÌb´½£À4Öß]Ø)@÷ß¦Öòh°Jm*¿^GSëkG-Jôñ|>-­Çþd>Á^m1'» ·eNHvs¤4&À¶ù¤üxHS	¸\Þ­
­Êgþ3
¾lë©ÕÞæ-ª~²)Lh|íê¹*íê)e!¤|\éÑ=M¶Ë24$ÁYÕ¡cñ=})íEÌº"îÿuhl[[-ci~]ä«ÙDd^Û°¸\ö~	Û¢ðÖá1SPÛÐ¹õJ¹^ü8¶û= [tñÙ!Çòæ@OiÍ.&TÀ¶@?îùbLß±Ýëù¾èlCæÌ¬¼àjýþ]L%i¨Dm^pñhX÷}7Q]Õ[Xãw(½9D=Mÿ}ªþ¯Ì¡f×Õ	ë¶×¤$Ø²Öc
QésøM0\IJ¿ÓD-ßBê,+ÌTQý¶F3û·oñ1f6XÝ­krÝ¸±
2½à¤ó'pÄÒËeNø*ê{®§MÞXFd¥gÕhl«éNõ!m¯K4íKßÑ_fÑ 2ÔÆ4eI­pOÕc0¶7ÈD¦°­/ÞâóHd)Mó8dób+?Âaf_%Æ´U )ð¥þâò1ÆH¾Å§èz]åÂ5ç1Òê9Ý»BèøªÃE&ç0fìJú¦ìù"ZÃ	º=}øÄ¶³*¼0¹b¼b´/]eöÙì¥I¹q3t0íµ§ZâaØ³ïa=Mj)á&ÙRÉ¯UG£­G¾xc!%g0Boyów»£­N®O«IMÐ%Ù&Þ ç&¡>úû= °Â É²¢bÏT=Mm0D.pFù×¡üà= ®&þÅº´FBÁÆ¤mU	²´åî´4®¡­ëÓ­EÒ­Þ­{%ÛÔº"Ü¡$íZ5\ØÞïÅ V!÷9éûàgô.ïüÈââ= Ü 3Ó=U«áñUÌöÐº=M±YÉ1âr	" ¥1ø¼¯1ç¦"ÿ¹¯¹IÔâhl?yî¡4öòõMÌþ¦#ú/ÿ&3ý4_²ÓK[';pÇÜ!ãOí%¢Pn¬'Å¢Á;Â¾½ìØâüÐ4õ&¦â8oÓù$°iõL	°²êEu
z»Û²Ã¬ëm:n ñ;hS´¬"´/§ghª0ëµÖoaã~¸ÒsÖ= Å¾û|ì!ùébÁþFTy­kC)ÈÂÜ3eTÃº\1åF0h2'õñz|ç¸M
h:\,PÂÚóO)½4¦×vÆH_	E}+ ÍêÙÉ>¸>)zS|²7¥J]DÚ3æ§Nksq¢YxósÌ?ôTAí6U	º^<ÓÃ_C¤GÜ÷Sáî	çu§ÿkU¦¯ÖÖòÕm<;¥;vA{:Û?}2o©=Ml{O2?o?hê=}Ì·Q?ÈÓB;;a6M*×AJèR5#ëLèÓyÞÇ5«d' åªä·ÁÞ÷¥W&ÆÌqíT÷vÄÖîdª?fíõ1ü/Õmú·Vôù=MK¢1x«RZÞf¢iâfâ<ÌEã5û- =}5¾çI!ÜnÖYêSm{ú±ú8§^Y!oQ7kJ]«4â¥Ç8k¡¦]Ìé)¤#¬cRÇ2¼goÚúBË= PcZð\g<è¼1zFºÕ4wf»±¼aJXo1e7çË¨qoU¬câ¡¯^aúeôÔ©ôÑWï3Û´ër$zwá¥ín.î ´ùeáRëâëüºùò/7È³«Üë·¨Q
±¶Þù¿ÙÝ:{Øfe5\ÐjiÚÀ£X3-> §U1äu<Yý\aòQÀ´iÊ^ùÕfAÚtEÌ¤ÌëT	Ò+ÛÔéÓÃd²Ùù¤1Ý¡Äè5:ÝtÌÑVè^ú± øê#.eÝNLEzÔSA½¼¢\gLÅÝª\»ª#?åfß5¹ÀöSrìÜýR%8;ÈZ=Mq8ºi'&ÙÞ_èRÚ·{8ÂOsþ¶ÒOéf¯¢.¬¬ÓÇ^hj¡H
[ä^d¤g¸ÄnfcY~ÙÉçÔ¡a3ÁnzPñºôÓ Ðc-²Â,£SW©¯¤È"&°Uò
òEÌ;&46¢X¾\æöÙz{=MZý02FÈ(¥^æ6­ÛÞP¤ÿQïÙ¨òGÜ&ëWøP+ÖÉ5:h/â 7o>PS@Öl·"ökã|äëDâL¢¯qeOBÂÙãzeq·8_^C>Ë(å¼\¼,¥\(¹ 5;ù:£72ÆàhÿÈNÖæÁ¯7Ö/²Ö¨üÐrg ¿Ð©ááÀyª¹ê!Ù4qs9é®´æ¨L(ð£ÂÔ¡g*O-^ð4´Iàì ¬ImnPûgvC/üqH×'VDcÄ±Èø¿Na/a¨nV;@UÆ-Ñþ«(ã³t¬jÏÄOËÐxnT0Jó0¤GjM±#ÇAÔ½nf¼>>ãS×<®I%Q.î[w(<³][4aÙ=}ýNáUC = = Z¼[D:SyÉcý1g;ã¡ÙÐXÓè¦¨buBÚ÷½]	VØºíExãwöÏNãÅpK\ØÐ>*ÿ"ÓR¬¼iL µÓG½Æ¼ñ+drL;ÆìdÆ1Ðâ7]!Oöºj	XâE6ÔfGhÝ1;l¼ËVÐcú|ß0@ôTI·¹¬³ÝÆËMKÄ¬ìÚsNP]Xq7Óüâ¸ÌÆ/U£)c0ùG¼Aõi'õfTZ|HÂºü¨XÉôVr®2= 2M¦o'X<&Ô\v×6Â/ÿHùÈl÷ y¡Ö/®fæÆ5#ºÕËÙDãDÓÇ@ö&+Yç5öûfA«Q:iä£Iã]¯V|WH'Rdô¶cWuíB ¦ãÙ§OzªSÚXèêGy ÝÓ,¤g<©^&¨_y+¢*Ü¸ÝöÐx]^Ï7§0À4SeÙº°j5k¿mÐ<vh·Aë©!çkäu
ç§ y{ZàajþQîÒH>~>ÒVg¥u¢¸gFÕ;rJqBçBO«LçÐ4¦È0"eºC2|ð¦=MÄwÜ] 86M?ÏáWÉÌ£*wÜ,´Vükqq QþÓ´± ìdÅ)½?TþWåöµÌt¯0æÁud9íÏÒxXx$²W NãA ²Ú%a°½údÝÝ»Ð6³ÑÍ­ÂL×ë!ádlÌ%c7UµÏhAò<Ï=}¢_3êÉCÛW<}Y±ãÄg>xxX¾© [mOcgnµ¾$I§¦¡÷\90Zý>»©âwõôP\+ÐÙ.M{iÀOjLÝw©Gýa$Z>B78æ}c'LW)'\nº_ôªV¿isàac´upÔB<½è202bU×"ÔíÜÛ¨PóG¤°5|÷£gQÌigÌvUö·¦FOÛcç0N¸9IºEL5
¢\ÈÄ#LUð»\POÐ55U¼rg95@ôÈ'rûÄÑ¡óXÈG0+h\®=M¦6ó|èÝbðpK¡wúbæñ= }H½"Ù¸\ VQ½¿xÛËw Axö!Rò!jS¿cS|é¤PÈÃrø½?ÚÄ}BÚ[Ü0;NM¼ð}þÒ0ÙÄD ÷ûzëiÉùü¹¦'ðuQAj.Ëþ+¹K¶ù¥¯C1=MRU0&iL±¯r$ÉTr¸ÉÕfyù^Ó(y?ü2)¿ÕÅrÏèfï-4\ÐöµêEÕÍô¿í÷èÈ-Õê| ]$¿	Äÿñfìç<iôõ1ô·256= ðëyÇ¾-#òøèWL¡ß ¹©9æ@ññôü7ð¾¡^))RQê=}iÜ2¦5øØ³­ éÔ('ô¹HB b&O®[¡75V|°?gä¢ÍÁ¸'H3Lþzð£#þÐÔ4yJ÷L*ØèéÍ\Üiu#óuÿû>f¡³ÕÆÿQ6Áô´ÜOêYßK|/ëqÌd¤"6Äs¡¤ìánæQáözQ= )<á=}W¦z+ÛTRAì{}$´¡ïÀøáÇÐ¡Ëÿç;Yâ¸ad© ýÜSHÞàSPÙHÞm=}'!X×|¡?Â~¡7ýÌSá¡Õ¬	¹ÜÒ©à5¼".çeÊ6É0%kÀô:Nv"8f6ñvÂÐ_%Yµã½ÈJ´rÈCdÏL<v²Ðahòs{H¿¥á@üuRP|ÈèÊRVqÚàJnô¥ôÀô¸"­ïôUcû1æµöcõ®÷á±O¢ ô8Ómixå;iYOÂlehó³QI &ö2×= ¹bpdåñ.U³«Êï}X8à#Sz Ûh
ø¹= ÿNÎÅXYÈíÌýÎÓw+ù¶ß^¼Ò¦ÄspýE×,ÜÃ½_CNZ¼ä{¿ù= Ë__x=}ÇCr¥Õ¡¬",P¶+O41×+oØ  Õ©½ÜQß^a±çoÿceõýX'ó¸éHÌZ¶] M»@ßGéYãúh½ta¸Ó¡óHtDgùÆL¬ü¯wÁs£e-ëÚr3_F'(V3Á¸er³"ÕéÒË¡t*ÈæDèÓÂ¤ø8Yc¯ïçrd}°u^éiy­@\½I²À±YLDh­ßR5*Ê-¶Wv½ykE<Yg
Öã5þ{(:%Æ-çàÚ»ôXÕþ§«.l!%Q#1Ê½ð´¬ª±%xéìÝ"ô4aÈdr×h!
?¿+/Ø®%SÚè¸Ìc~Ë}!z&>ùaÝfèV0]ØLÝºlöÈJv¹VOum¤þËmhEê+¡­:ZÃu Sü(ê%Â(FcIñ/eïC,:¶x6¥=MXvAXä]ltÙ=}äÔ.OÎê­ZÖàý×ãg:íVÂhÔp­øQþ_UNw ¤ØVÏq5<>ÙÙVËGÒUnç8ÂßYXPü­OøÃ¾É	gtóà]Hhn	ùü>eÁÙx+µ)98KÜ Ê!äOØúí)Ùle5w"cÌÆeáö»½É²¶ ¾|,= WÚT\Z}Ó5ÔO¾YTÌ:Ûln\#¬"ÉË±?öe>{$Óù«OÁårØFG62(!/iqT1×/*'íåMÂ£O~3©¸æbvéÒ¬µ¿*±Z9Éa=Mx+mk¶ÍOµSePÏEýÿXºÄËìð+2Wù± S	}v·ç½ÇÿÕæÝÃx=}JÝAêö?!a¥JÕêb5?Ò8ÿ£µOÈöc¬§Z>J×ZfÎ -b:xÖ®"L®ÝÊfèõff±º¨G1®çuHÚ=}&©2Rç0òóõ5Â6=}&¿¯
Õ·=M^E¡ÈBÌrÄ1ò+3ÎÌ\'nÝ¼U©P^ÔkS2aÉLü&~ÚÇôóÙÒA;·ô®"¨à
2Ê³P®ñä­;eÊáóç*U¥lWÕøÙ­H­²é¶Q¨{¤Gõ
/jL8ÆZKáÂå=M¿¶ÝKY¸2ê¬¡[ÐðK«þé6¢"´¬	Îþ¾;*2å'ô:ç½¿P6ÿ!¥ìF=Mä°^.ËGßSPrJ¸»Ò¦§yg.îç5b1ôZnx°JiÆóîáÏ³Ú÷ÞEÅN×É°!#¾¼¢gmrÒ6ÁV[Ê²ü¿¿Ï¼dtY´ôóµùiÏcxÛþ-Ö(ÒÂá¹¦¯*¹º»
>Ô³SÈ^÷Å0õt¼¹ycÂåS&Yà K¨ÞA%qÕëÆ#VLU}#h¿Î\5ÛÉpKr ÿíw;|IõíÄþp= Ìã?²¦îY>³l&%¼_áÆì{ÆbAÌ¹2ùc»MÆûýfIàF§AXòçÞ÷DÑzè¢îbÐØfÖÔ_AJ©!Ýk§s@Â5@°5Â{@§¤GRÞz>%¡%Bq§uD×'o1]gK²cÈ·´í)}''Â= êk8?#rîÓÅvcsõ4©Çh!Ó¼#º6ëkàP
-TÙ&rTä±îÏØÿwBÖC	²ÿ©¢>!(OÎ¹$2UY"uVaAö5±>Dâ)-IPÒv
dnÒVa_ý.HKÝ«³Ìµâøc.£GÛç5v¶^ÊÕÇ¥ÔYîíuîÆL¢|É¯ò«~ ýóJ½k69l÷ãLµ{¬"D Mñ^yZf3Ñ¾ö:,vú8JÄS*ÇþÔ½3,%!m¡8ÊU>A×ì$ìe:bò% «^T
RñÜUÕÕXïå@óÍãI= Æa¿Å¬ËuåKrO[=Mä6eæNÇóÐ8èöíÇçi¡3Ñ²c&Òåyy¥ÈÞxv\­ãÊbplq¹|Y,C?í"ØÕ?¡)Õâ&â"#T{í
ªÒ÷ãiÅ4@i_þ$}5+¡¥r¿ØU×Lóvíh)Ú7ÕûÖOÖÀÄ¥°Õ5S uÞûA Æ%S ÿ©1BªÌëç¸á¾ar_¦Ä{pfåÈ!bÒç¥Ê;ì&O  qÀV/ø¤PÖ§¬Á®ÞúÀ èËn>bÊîGCH)~õ}WÜ÷h¤K|-ÏÌlWêÈ§vâ­)¿é8X>àÜÒLä¸L,ø.yº©kõâ©¬þc$¥cÑFLeÅ¸ÇG]ÎÅåSm&ìiVòN¸*ô?nðIq?mQÈW'ÏDó\Àïâ¦ÞÒxðLÇ#rk°Ðº}úV¼S?Å .|ÏKÇÈ	ÑYÁYù"µcû¡µ+M©,{¦¸Mô1¯sYEU7[o9¹YÐÈ;<"%?X'ËéîÝí"­Z?s®ã6ßç{Ñ½a'0j¬£tðiéDk!¾lî¾"ëÜÑWvY	g9Y7FYl/¹Óÿ¥È´¦§Ø3DðçØQXÄYïïÑÂnËzùá>UÊ¿þ§#?"öíìÞíç4n>ýìë=MïÛ§ói-Z{}Ã2ås ¦:x°/BÂòá^¸;Qê ÆêÕ7'>ÐÎò»©8/Á2:há³6ô ¬*;GYJ¼îXü º.|¨àX«Sp|ôRä[gûçÄéè6.ot1¬B÷««Ù=MóÚÀQiú sùcH{Ylà¦mãÞ]ì§|âõïÊþã7s¥ç540<ó)rP·,°-ÿN3¥
ðF6æÈ-ÿ¸^¹ûÒØv T%§3²Ú-È­ByËcß/Ï;d)%½« 5JÍQ:ú¦õZiÆÀê¹.mÞãpQbì¡¸DÏã2pÌ\Qÿ¶zø0y9b¤f#òlpÅË^y·	U³dRÞ_,lë&	¯/3e#÷Ø»X!=}ÅWÚ¢2U'?Hñ®÷µJºqSÐ³ö$ãl^ËZ3Jô¶ø×s¶öÿ,Í¶ÿLÍ¶ÿÍ?ÿV®\õÇoÌ-aÃ^ìÕK+¡w¬SVã0°MÞ²n ÂÉ?=Mç7ôèÒî¾Bb9 Ãô¼?ô|?Ê?¢¼Lmôêÿ¨róÀ1í?²\Luô5õÀìóp1?¶Å{Ìò¦¹Ñ¤U}WÀAÐÁ/¦'?j?õ"1¼k°b.Ì¾ØN ³Vr6äGCKÛökG-®$cîÊQ¶6Çq¤'³Pàô´;IRÕ´º65Ì6uÇ@ILo4jæ-(?÷*í¨¼.: ~ ô,&ú$ìòD/°ÓØÿ6¤]rDó oÄ÷CI.P½àGWµÌè?wH?Ëöñ6&ÀpÌô=}5#4
n(Øúx'Ht5=}Øª=M2õKD_Q
µÅâÆFÖ×*@]Æå	éNT{ Ì	böûíbÖ= ,ú~CYÔ®r³½!UTjËÍPG= È§gÇ5ÎgîJmh4õóEpQ°A= ü« Ô£~wwl³Ðá!kÈ$wfÒ»Û·o<0?ë¾3]N®BLcHçÁTÎ|%I¯çyàdD'TãôÚclpü&~0¼}Naº·çñOô<
¶{dYðbÐ>'S£¸ ( ¸^äØ= KÎ¶ÉÐ8§¤±©ýÄgèîýWáàa§¤*U)6¹G¦"N_Åh·CÍX¤ç¡ùÝ³1AÜB«älsÅ»d]¼.íÒ«ÏÔ
GÀD¯ªÅ³xÌü	  I5 «hÐ¹F¢äÚ^Û(lìÍ ³óÌÔ_ÏéºÆ»I+´­½ª»ñïcZ±}5ðVD]Mï$ ÀôÀcÇë;ü	ý·FÜÑÐ/ÜÿÏ= 0ØÈ-"Õ*¿.È3úÌ¸÷Ê/µ/xTÉq@¾¼«GLÒ=MoT-ôë*Üð6>Ê­¬?½Àÿâôa'¿×}.à/8ì¢m®dÙý<fÍ±;@= ÞSnîcà|n77fpÈÈqsÔ_XTDa= }ÃÕ²CaÑ2OpOäó¯ïÖKîíÜ¤+ .Ðp}n÷Ød·I=Mwìlo7J¢Ó"{¢ü¢SýB®¦+l¦+¢t¦+ ¢Âë7)}VñBÎ\¦NÿS­¬Ö+­xy.T¤;(âÁëoBë&|¼Ì'=}Å÷î°®þ" ÷L_¡(]ç(m7¨<Ô+©ráöÜr»ãÏÌ Íp²6FïÅÁ¯¸²%AµÒÙö^Ak
ÇG
Çg6ã7±ýæÇâ¨*Ääø;Á'ÜMUÿ@ã"R²Æ õ°Q¬vø÷&[ðB?ÕÓ
ñ*&>²%¦ø÷°pÌ6µùÌpÌ8 ó÷*MeÌéõöÀ ø*u&Ô¸ç&*ÿëL«*çSÉ_Ï0~ÄÀ ,­ë¬óÏ"3XÀF=}ç8CCGC÷÷óehÙ[yëyyªm¶ìmaµ£DYëË5ÐÄÔß^]Ju¢I7C/KF£9Á*Ð7P·ÕÔW§+ÊPP7TLÐ.TX{Ôa;r9ô'£xrròròrjÒN»¦RFðTZCõ¶gõ
.Õù9p~{;.Ø"ñÖÖa¬µ)TÁNj:Ë×±î3.4àpó~)ç!«;JÌn¤FKÙsÿP/ýõ2^Pf¥±¼·Yá&(F½±zõEÆ4¤<TºãzôM=}ÞÒD5Lª£0/|~H×§6
ÜßÚ'´°4Í ù×´6ùü#àÝ¶
y3Ò(·@Õ@Ý~=}9xÆÏJÙeÈ6¬@-U¿ñôè_´dõVÂçPJöð¢¿á²j%F©yê?+OÇ¤Î
ÁZh&¤¿8T §HP@YI"ÚÇÁD= ¥ÿç-= P7Q¤Òç,/Dl}1GþK+hÓ¼SZ" W1[À³¢ÿ<¸¸vËL­Ù}dÉy 6ì´hÍ&WZ±¯ÒHÂ°ÉøÆÄùÍÖÎ!ôîë-ôì­CÕ&µE®MZ¤ÐÞÕ/GÏQ,!aª;|}= ÉS=M®zMýª)zÊ}[ªûcÇÍãa-¡3³PãL¤lÒä¤<ÀXÍÅFúÇ/O}»w=}MíEü£/òöçGÓf¾T¤RÌUca&²XYo#%¬y_BÑu;=M
;ì³ù¿_3îÄ9·sárYsó4Å!ÛÂÈ,ÿp~Ïx¦K°7e¹Pá:ÑÖë3U(Õe@¹(®'ÖyG°Uvì5ç¢)joíà«Î¼þ8öI%ÜnÆz:ëï¨ôðÝüY?Ë§5R0RÁGa&[úErýÉz9sêäÓ)ý 9»ø6SbÜ,ÿ(¶½Ý¼9{=Mnêè9SÂeØÀæmìp-åífÓÿéïú<>4íþZMÚtô¶r¸Ü¡y3Ù^_^Ý{Ô6Nb}ÛwhIÖS\§èkÉwmo?CÇ¬Ð»ÎPÖ´i¯¾3­2ÇMÐi]\ÿºÅ¨ú4Þ¯,Ûö~ÎfÑÕí×ÿÓu>ÀÌfæXºgIc+µ.$ì®½ -Îý\ò³¶ÍGÃÁ¶@¯âmºµf¨ëp÷1ÝkuÓ"éÈ®ÿøa¨°D aÅèÄè®xNb¬4'Å2=}= "þuJóâs¯[2µ.*hÑcÝ° ­ZgNW6Ý8È§#7Q!Ñ²+0óñ{3?ÃTzdN¾è&ûaMÑ©ÏDÐº°j£-'iÔ^ºUÅ³Gª®>YåÝG¨%êG¥ ëlÂÅÙVÑïâ6£$ã+Å/tÎ= ôÓ­sªîV×ÒSKe«ÝIó³t¨w½>~u*ó,#¼§C½7Îú·Ý#è$/À¾Dä5Q\;k@nµ!Õñ¢OÆn<N½dõYÃSó3Íh´ªÁ«ºbvLNxP<2½«g+^2ØXB[*wiñHIÎ½	¸ =Mì¿y³¢Ù!)O§Âµ&Ý¤ þ¹hÍ¥òeÝöt].TTQäºs7x8ä÷/îaã¬k²² ¤¥¹mç3¡Ez×øÊs0¦õf2úý|ªÅÙ}Ñ³ZþËÄ\sgQN"ÔkÈ;÷3Þ"íäûs*ò¢,'Â³Õ»c>bsêó2íPágLÄ
*d;;NEÈ?ñ.-ÿþE³"ÒVaX6§ÜDáv½º(ð$­\oÜYQ\yYÙ*}ÅwPäúâ±1exâ\¶§Úº·ÍøñÇ5ÝwÙAá8Á÷éÞt>2¨Òa5ºA!iAÃp!	~UzÊ{åuî*Ô´Ànlú&ãó9Õq#J¯Õ]&-$FüQçßÖav»þ#nðZÍ[ó°bëvpr<fVçç°¹¯·O¯Á(®/8·=MDi©yìuòm½HÏMOFxX¨·P8W;7ô×TG¶­økÊëXíHÎ= Íòø= ¶k"u¡«Ò
«Ð{ÖÒàõìÈa_ÐHÀß$F¶*Ë VÂúxOùåGpÞ¡åf£J¢$Sz0,+}FO{*µh(2ìOK¡öóç·!£Eú}>«¡Ü%ü±Ãöâ´ko³Ák&ù(N{ýÉðµç£QµÀAÈÇ.*¹Q§úô´Æ«ÅÝ/¿jÆ5n8íÿòÝße¿nöI4ï%nkäé¼9zÃÂ;¿ýÓ«h¶¢´÷Ó	®r­òEL·óYà5bTfök7Ä2Û
y5VC¨40nS¸üsË÷y>Q1Y1d]#r³ÈÐ«a§ª¦²ÀµÁËÞ±0"V@F¶GFo&ÓE4?uçôV<*ª&µA»«rå'>%ÑA×ùP{.èé4EËþÿ,rJäzJ+êt=}aìK)@Ã
ª_,Fý¼·ãKty¨µ£ÛÄ=}þD¨óA>Æ,¶c¾±2gõóÊ¹[ìº¡öS-÷E	>)\4çÒÒ[¿9rs°á2«ØûÈ¥	Iä<ÚüÂ¿ÀiÞGC¤y¶L2pýÄ4º=}Á©ë)ÑLÂCëM¥#Ð¯^Þ¾»¤c¹xõ,7¸%ÕJÙÕ ¨s¶úþ=}/{« Ê0=}á|ûÔÑÓçF/uëÔ[¶*­h}¬^Æõ=MZ¹®ó87«Ø{¨ºhdàM>Ø¼¤W½wT ·±ñÁ°ÛVì½¬¢!9
¨ß^=}×­J¢¢sfðEü¸Y
&Eêòr©çU²ôRõâ<';s'CÏ VÉxMçòÏÁ%?MBµ	ùÛÈPUò| ìôF§Ý¿ i?àÖdêmçíHÓ²Ñ~.Í5? 1
½1WCB!=MoJ&)Î°Â%EÇ#e.iz ¿D¤eTä:½%»ÑË4ùÐ÷õ­öòì&²Û3is¿ë®×¦J½!íàùOaÎíÈÅ¢]eâîtÌY= DÝ£ )Áv/.{7®ymÎ?.m#¯ì¹Ù²I¶I¹'û¢JìÂ+oj*féÑ$É»ÂYìõªú¦"Ý±ë2¬Ïûíçt%I[_ËÄ?¯´Ñ´×_ h£±yë%ægÕ$ ª@vBí%pb£,$­_½X ÍU®)6ãvXo îdÿßg9YVÑÄâs«ùÕ¾LCPÛW´I«ã:tþñGÑÒ ¶ÃìpQêÈ'º§q~´¢&=  ÆªU*@7ÕÑÒ£S°à|¬Î­ýx||{.óÌ·ëmàÉ¶ÞùHvçi¶ã39d=}!&2Öýc.zu°F¾¯2Öâ·îÙ*BèbëVùKÂ<VPi=MÃ~=}¬:Ïe/7OÉ#e»	×®Jþ! M5NDyþc.Z5D â7ùebØ³ëG.Ûr±Ú&¸N.+N"}q^·Ëg'JX±#ézÖO÷¦û¦ÔüÍï8¹sD7±÷mØ+¸xO§À øÄ¯Ø8A
Gt¦,=MbKÝÃbË)¡0 ´bíö ñ­-änÐ-[Õj©þ¢büC÷¿½ô¢ÕTå@­¶çy*øU2G|= 9÷6¯4i·¨¡lýµÎZÍ¹-ÀµèsÃZü#ñFñ8kpEð
8<Æó-d µÍ(Üh$Ð×·íüCõLJ¥¦%ò¿¯»l´É4Såý"å!O@:5LN|:ÕÑ=}Fü4¿aK~ÇYßfØÃ«ðß·Kôfgu®@ÃóQï²ó¦ú|jµáãÑÉ¬·Ïåfü¦0üßÄÝ*·Mê6ìnõw¯É?t¦&Ò³ëê2¨Þ[7!Stà¶ÏåºÜ )_W	ôí3×_¥¨ô¦­ÛòIY<Ò7ø~t 2YõW©ü?¯:mÉGÇL(Õ±èRóDLæMAY©},ýÕDÌì½'?÷8NÐ-8÷N¾ZÐfi¡¥ïÕsÀ>X^Bx¦¨5PD2Ìjº{âÜ>ã­
öHH=MG1xfèßÌ4'»%äð¸ñÑR²Rð58üø:ª
!IAÖøV2øÖ^ªUOµr>­ú@/Zâé¼NüÝYÂrGGz?ÉÖg§×À9N]Z= $É,ÙèÌçÝ¾N¯õNõÓ§¯\ÀúÓ52iÅßê ÝêßÅàÞ 4ÞçIçI!ÏÑõ8gè¶:x¹³~õwfèûL.|:
CÕ½ÖôW³áÓw¶ß8Ìº«àm±Èmf»W:Th2?;2l°º*¯µtÛJà«#~þW.·ìTËØ C±: lnWýðânOVà>t¿È@àhz­T8Ö¤¦ö¯ø?*Ó*0=}Û½
æ"Ey×7êò2e¬ª¦]ïk,Pj$ìJ°$Tzþh×nM4V/£k!0ð·Ç¹ä±f<H£ªaÇ}Û¦qmö<BLR©!¾KÕW´Ç>GFjö0Ýsw*¨eHü V¼Ö lP©".­Üv1ßn5üÜt^¿~¥@.w|mÚéÓ­iQ*Öêå¹(Æáê»¼x;>&C$=M²ÆÝÎ&µÏìò	ãTÖH2ßz}Ý°³ÖÜ¿<Ñ¯N:mt^îñ¡lGTupwKdhø{ôT¸ðR³Á/D
÷ÙWâ¥÷Ù2íWÃüE-%ÜÝN#çßPc7ÛÊ¶,'Ó±°÷¿3ª¸× õüÊTüVH8³õß1_I=M÷[ ã3ËßÎîWðaLÛï5ÿ_+øS%¨d8zO¿$rjÊúr :zÂ¤¤qç£ïñò=M¥èl?C»K»ß=}pD¶wK½É
Ez´y¿¼¬©Ë×ø¢2guCÑ,%LGÅ÷b+âÈÎqa$³
Æ,äéO
xðNL
J][¬ñ÷y!§9RvaaÀäÅ2p¹©bæ¸´¿*[D!xbÔóþXµ1sHÄ(*ÚC1 Õ¼s×õ°Q|
¸<Zn ~êº³°·©x"GJTjá£¬­[(l'XÖNRFCµå_ýÁÙ|ì<¯öë÷ÀGC§ygêZaÔÛÿ?áìÿJ®°î=MöFÜTÓ¥ÕÑ½wC§]õ =})ì{CglKGuf÷º}D°È´@)±ÊõÁÖO°$0H&¦= |Á²sï$FRÕæJíÇmó:úÄ6Ì°Äð¬àj­rJ©	Ú Ze= õ&CCtØ5Ïq§9zeß\ÊÑaÜ:¿}º°qú&í*ùfÞS5Ìí2¾YÒIÀ\ðAõ@DL(ªõáÍ£x<ºÿÝè ¶Ý óÝP
ñ)Ì½¦çµs0Ò.åÉq=MôsuvxÄ
V¤!ÅÙÖ ZóvAª¦Î×~DÅÙ,~È[7Ò|~qgàìÄª«;|KJk8¹SyÃ'¬¼â^CØâ+¡ßiÄ»1Ä*ïNj¢?XÖf]÷y¿GÊ÷í±:DiäqZLVÚ¥Þ68²!¿äþrÙ³9·ÓÔ= îÞå¼$Tøü]yUÈÒ¤JMûV%ì*à]j½ßMâ¨S-p3b0<'¡ºø\vÈE0óv¤ÂÍCÆ¸G¬§ÞÎÆú.¼ZÈÞi§Z¹âçð?*IOiEbl&:ÍÖ^@Í²T¬µñY>ñGHi^EÌ:á|jà°&ï±!N:!íw®!üÚåÀY ûr°Ù!Ê#÷{«Ï(0Hý°¶b«ïÍòØ t»«NÁ#H%¸NmyeP&'^3ÝËFÔx+}¡,ÚÜD2
%(­>wÔ þíß¡)×ì%Tn7«R§O)ÐÇÄ§7ä®B¥IºKè8ÌT45.L°ÏjI¹à6ÆVHf÷®Ð¬ÀÁÈ·N¢Qi>ì)c§[Û¾¾ð¹EzÎ@h~2,PÕN73'¾<hUÕÊÇtØØpCð×qöÊ/¥¡/A Wqwh$ûå*I*ÊÆ!bã;¯Rì§8çØUÀkgM9txTö°/¥§¯=M[á¤%PT6K.b QCµ¯×Ï}/jÔöB¾¸ÜjÉ{ÝEö}½u3$ô_ÁúâãåØn*&ëGÜ}VH¢ÊEWÜ|·ºÅ@Èµ¥jAðÛãô«°0ú[Í^q5Äç¢ ~ö_Ïk\>-¥Ù6XÚk½é±æÚûYÖec8øÆÆfI¿;µp¹ÊÏ©ä<p×ÚÍO	Âº8®~Wy©ûÍå+ô®«Á¥F¶×=MNã&Xle=M ÛS5ÀKXVÜUÈAÓÞÊA´E×µîì¤ÌÅå¾ø0ÝuòK= N×wG;zà¢AÑ
føHVÃbzÙfâ.Ã8d6SQ¿«Èù²¿ö½üú?Söô%¦jïÍ~Et´a=}¹ðºÁúEßÐ.Ä²ü1ËÀ0ÅL­Îôöt¼ì}æ]4Q4j5{2£* Z5à AßüÕà©¶Fx×wô£Ø¾E¯	+ú­,LÂý(sYø= ±åÓ¸Õ*F<Ï2·gÑ6ÄF´= 0e3 c<ÅíiJ®ßlÃ'e áðË×aczcsÙ'è*t0Ð= ¿ÙÇÛJôºR«1¾À¡~ Ãà/ªò|Ì9g­:Ùÿt3ª²¤C²K+s¿ÇÿsfµICÞþ·6¯éþj.aC}ëdlUövz
àÁ·x¾ÿæ¢ S=M¬>)ô(¬ðZÆ%¥=M]zù§jÅx/éð±L¥UÃAÉ=}_µ8Þª³èçEMüó·,ìÌÜºýÃg43¬¶±×jÔP$ÇxÐ¤{s±6)C«©&µÄ×
4l4!>º®M¹)a|9?)öxÎv¢!A<	íh³¸.ðVç­ë,Ó5ðÿUÜN9gvUËKÉöAüÍþýQíCT¡T/ùÐ"ÞÊ!úæ24@;é^CWÕ[ÞbâÔ±OÁwH²Kï	}#ÄÎ,-§Ð=M:_ÚÖ¡æ-·Ùí«¿Ø-ÅÁ¯Ñ³[³½[àl<m¬fõS2±	}=}ÿ!wñ]WþL@ Á°Qá_3\tòem>æq½mªÝí«Ó ñÅÊt¸h6¹¾¤ËÓ=M¢#§|Y)âSÇ8½ØPô5ÏÇ¬|ª?Ó&Ú0ÙâÔÌ§®¼YÞ3áË)²ójÐI¢oÛÈj'K[Åe6§¢Ø<ÜKçß=MÒzüJËåá{uy£B¼½>)¯Zl?Uå´Ûµ®¡8ÝznÇ/ ÙlÒ^A{,,iGFÂÍsÎ%¢åÃú|l,ò|½aÒÎ1¨cÖ6AÆ/ &ãßÒ³¾¹.4¬Lÿ¬àôÚäÜùþ¹_yÿsyesG_V¯ñü> Þ¾h=}>Üð{kâRZzË®RN
ÀàÒV®Þ³T:
­i>àt=MXÊ¾°vç/[ÀÎÌë²ÔÞÕç1Ý.«fÖzÀb$Ô³èhâ¼<::gq°°vN:~\,à/½-òÒÀKYbë[×	ËAÒ·hyG¿´saìÝ½µñm=}0}Ü9ä &.«ÙÄÐ»}\@Z$³o,²±Þ½%Ñ§QM>ÑòÐ*Oê´ØYO~¿jÐðugÈëSÓ|Ô_æ´:pDµbnlY ¢ª¯¿9*ð"J,òÄ"Ye±rdDáñ%ëyBVð¾Ä¯J?ó·>xÊÌ4¿¾7$3»Yfoi½k¤²3©Lò(ìn¡§¨çsýkYhF[Þ®C°;k±¤ÊßÎýPÍÇ^{èq·ÆÉ°»ïËGav»þÊ°Àjn¤EbÃàQe}7ñ¯ÕÝYÞÔ¥âNyÄénïHHy¿®ãKOº= *úâ{Lt®µw=}ùaoØÂÎ£·	þk!z[>çjßÓ¡N÷	GöÿÄ§ª·MÌ%1Ï_Í9åpF§NÞ=Muì7ÂªÄ!Ð= Ù×Â{H«­Ïól®_=M'¹í4àÀN·$¯¥ÑGaD
'ô.fJCÑâã_!±--<««ÿ¯¸þö!Á/ÇæÂâ"ZJú²ðüo½îÔfoSËÐe5Ñ¥~ß§ðèrevî;3C«Iº´ÞÁeÜèdCZ0*²&E?ÞË?:©Os#ì¶»5Ø»ÓAÚ9Nq¢Û´]|ýdT¯þói5wçÏZí¾¸;ÎBÜêÓ¨SÇ¾þÔMoÃ]G½Æ¸ïµÞúÙÔá)¡\ÝÚuDÉÙËÇZ&áë\qÝFz@ãÍÏr|¨ÎGùt­ó¥_£Ä>ý"=}2ÿ"Û/òÚÚ8'uaÞcluÛ¦L#¶§erÜÜâß	V¯ðª¢ 7;ûU;2ÄÐºé§·p×ïAFGÊ¼¿ø9É!¤o°*.[½ýr£ 65H§9²Ö@ ÝJIL+H/%?	2d84Ò2e®ä%¤AxfùÒbåv{ÐÃhÐ½2	â+3¬üEM¶vráøÿÞ×ÅÅ¯Àb"É0ìe­¶B3
lkëFãÎÒ|$ %_¼F	ïroN Næ}àÞ+ã¼i¬d{·hn/*ê:#Íð¢P<|G¹í~JuÏùç¼Ë«æg;ÿ$·ÚõÕb÷5ÐðDå}0.ViùÖNÓa
V¦'rw9
+¨ûÚlrtj×(±_"éÅ­N³wåê,6 í=MòÌKÁ(úëô§ùóìÕÝóÆ>Ê¤õ}S¢ªáE/Îº*)?³ÔÑ@Ojntgü0(²/ 2· ªJGÿCo§àÉ¥tßCÚ)Î1ÛÄ½^HÖ1f/QÇ«JêäÕyE¾åÄ/bS,|ø"ý,À/Öëø®íÈ¥dÚ«ÁÀÐrïQtÞ÷«= à¨0Vêv0à=}eX+(	c"Ý¼/+o°ÔúÄL¦Kõö±®:²A²¥0É2¼^TE»<c5ÙFJé&J?©ÙFìÜ;Ò= ÄÈV?	8= hÈÄFu½¿MMâPõÑ´ôÖâ³I®	¼Wj"oJä×cNÏ§!·)7âËqáuîÂÐ7£ñBöNÔ"W]ÌccW@rü5q@·Âqô5:' â7µ¢cpEíÆÓu2o	ppÓq><oQ äÝ?o4*:°WÙAS.9¥ÏØY|.r¦wÇghJ
Ôz= IÐð1©¬ÜÉr(*?Ù×. BôN"ÉK¨N[ø'" üv+±Â <yweú­V·¦giÿÌ&4¨½º/èÜ4«/ù±8ph[èleX®ÇTp2î¦r@}64Ã}(ÌÛ?h3?ªÒàÄÕè;´cõC;¡þÞ¶Ãøs-lØn{*Ó?VÂüS,
â-nü¹T2dôúiÖM ß¨Ð
ÎýifØ#r®}E<,P§WÂÈùÞN
­úæ#3fýÌ×þµ=}¢_»åßË»tÊLÔáé¬9$Ùøà
^2ü-êýJ½ýi-@_ÐÙæ0<ÕÒ(¢¾s= ÑzmªÔC@@£#m&z|
à¬C9+¸bK_!	÷Q=M ÖàÕÂgDÊò¼¼« oQÉýÛzÅÞg9nõ5etèF$72vãA+8VÂðUG«;@^e¸¢Îd®(£°NïÖ#Ð¡nP¾ùdã{Ï]¬cúæ4r4Ìì d­Ðiöqw96	~¤Ø×ßXqëlT¼Û)­ÎôX#ohB¿åØÌ[a½ù,Ö}A@ªÖlï¸(¸xH¬w5ØT4ñ¥®üüøVgm'ýHÿ;,7/ 7PWCÕÍ.@¼Ï¶Ý£Y¦ù÷ÜÀ*¢l7;0Ä-n7Ë^¨°N@HqãIçÃå¬>=}NÓJ(¶öÎÙvhGWÿ«6NÒw¹wÁñ·ÎÝ§b¶of»øhB©aûB)wÜ(h§òÓ@­|ÀÑ,'²	|©'7u:Ylð'PþÌ+E53í£þO©ZD#{D£î°OÌ>&²­h(¦:&À¾,úÉ³Ól,¬<Mö ½ÀÎz>D4zõÎU3Ð¡-4%~Îq4¾=MLÍ=M«Ûæ¥¢>0âL'G&})rÐèâ%ÊDÍ}@9BÃ>T'&ÿzzpPçÊâ¦:«hcjm¤Lä.'i¦çéïëãØ+/Ýx67K¿$vD[T%ÑMé¬Â·ÄèÊÓKôÅ=}Qð^% r£'= »°1´7j4\ºSEudTaáæÕÂQ½xU4Þ1··µ9ïÕPàu@GÆ¡ÝÉàJVõ¦çó¯ÀÁj§a_ÄCAX.BÂ(>F0Ôÿ«xËÖ'Zöãbò¹¬zZD¸ÆÏO5Î<<ïÔ7v}us&àU[¬f$·íÇ½	<Ò;­aÌNbbù:§sHLpüY[³¸J-õÿöí¢Úä£~f1ÉEß­$É RrJEn[Gi.^VÂö£©¸)Ô?¬- Æ= Mð»³sº>ÁÓßøT"Q¿×w«Ý£¶zýl>n
ê.fPàië¦(Qá@ÓF¸
Ì¸Bé[= "ÌcÑ=}½¦¼ònt·Ô£²jH^u:×ó\YiÿwÊ¨*)Ãzê+píU&Û<ãÊèùsûæ¸¡¿iÐ{EäY¥¶Cyé"çh>Eÿf¶è××öËógcNA¯¡(uäõcÈi÷ilXÛ4.bxùGL°)\ëZ^ú _^§»j¸PK(¹BÆ J=M~fä=M?lÌ±KÓÕ}ý¯âÀW0äkZm¡bqÁó£öaqm%/Ìë¬¢øîB¶ ½ñºÆ×}zµËh8 ù= ,éyq!åk=}Äð}ÂKÍÏòp=}@bæDåÚÓâ^4c0ü¨¦$#~2Î2äPw7ÆøF(àÞq9söL¯zäÝRã®¥­ßóøp9L¤ÿ¶¢9C1}ÙIíèíPIù<ÀXÛ= ÎîHûQ^E¦¸-(¹»ìÆÃ;Ü¯P
¤µn}¾øÂ9I1¤eBüßþÂSÊ­D¼UXÕAý¥SV*ómdâA+.«#ÅZß%þüY¾/ÑynäXíOÀ¨TZ)ã©fµSrwë¨+°ÈÝçê²Ê¶Ëta[ ²ð Ô½,È'2ÿf¦ÓUR< ÛcÑã[ÍaqïM´×ÿ6>ÉëDWIÌßH¥«¨KÎ©XäL ¸N"¦¢½UúÝâô^
Çë;<C3A"î¿à®(£5HBVHÖîÁxluæÈ&¯MbðÄ0Û$úêr= aWWUMK6°ûÏ$ÖuBÄ4¹'#}÷\ÙòØaÄH¬ÔÄîM³Û?4NGPV"î@¾¨4Ó7gãÓ	M!èÑ8\çËkÖ¸TUûíÆUSç<«v
((CÖTöc×XLFð$à3O^Ä¦×ôUÕR¥O@ä;SNBÆdVKÓF$QÓ,4zGxgëÁ³Ò/h ³.müZ@ºo·C^,ªÅÊow´º7}ù·®iC ÿa0bcm&A¢wïó¸aÞ_(Û¸Íð|1ÇzuÜ²'.FÔ¥X4íÈ¶©gÑ­ì×ðÃ:Î¶Ý = ø}Â¼(IÖ=MY4;bæ¨Í©F}(ªæ±OõÊMéù=MÀ®/oK= ânt³l¦ÃW5}ßaKÎÈ½ó]Ðî!è7ÆjÑ=}Ú¯¯ùÓ²ý7,!|ªË3-'¹Ýã¬n°@°º,Ó­ÇF£¼ì<ZÏé}f5	þÀv­æôïôM21ËýYÔ*mÏÞ?ómµñ´aH÷3A©ÚÂÒý[ø6Þà_i÷uÈpSÌsð·>y¾¤·£ùÝÀ= = BÁñ$=}í²©z1íõõÀEpù= Ç3=}ØlûË..¦(XCµ5û¾í/Åx!¦¾ËÚ	ájZæJ04Ý²bÉùçnÂL/£õ?6l#Ñéýoÿ¨¯ºÃäÊMfò}búâkíÎÂ©7rËäî1¸	=M¼Nï²¥¢÷Ô(5 ¤Yï:»Ó®dÙ4Iw)+O$VPgóXí©Í.íLEP,= Oßn¸Þ½äÍgÓ7/I¨/ºFqPªã÷l.ßvùÁØÿÁSáÆì9Äò¦FiëBER}Ç¥d)oqËÍOFï¬D»àÄ[wç½§ÓæGZ,j3ò§,ýÆd¶ªqÇ¦@ü Û÷&¶±bQ]plÆ[#Ô¢ÛÌûBÜM°&(&T:]ÌZÿd7§fú¿Íï:®nåé=uå¸h¾Î0°Xo'S=}æò£á·Z,&¢!E"v2V!£%
é¢Jx>ut$vÆÒïuªoñµsüt^Þ[5¤F>t7ýI·þ=M~|O(=}@ÊÜ&Ê¤,MÓ[äÈ¤´ò±þM¼k¢%³¾KöÿtW&ø¨µÞkLVq²N>ÆG1CV¾«fõEfËô S$¿~§y´aW1§¯ÁE0I·Æ=M­e¢ühÞ2hVÒýP/ö@iKT7Tµ.ÜÔñ«¥Æ5ý|TºýB+¹c65ËØds5øîT= "	§¼É5xó÷²´ªø=  ðÐëUÃörßäÿmOH^(>Â ^Qõ÷^ÍDt8¡ÙòT.½¨qµRQ=MVáôE¯=MëBôo !ÄÈúÛÃÆ#l= ¤à9¦6{%-1fAûÃ<ÕP»YéÆRVþ0,
ÖÞ0¼HÝ4Q×úp½4ò!-ÏßÍÂ%³Áp´M¢}ävÞ­ÏõÃttþ²¥&·¢.Ð+oöÜ¿Â6¬BìÙêfFx6Ö}Ca:ÂûÁòÃQ*èÕù§M¼1HÜ|Rß¥sóÖ¤Âé*Ö»Um9Å­	Shàq/6±ùà@ùö/Ûª%ÒáÕ+ár=M/ñ&2® øÕEÇÇuVz_X$ØS%»XÄÿ1çs,/ÄÀ^gsA&j©×K{âï¨Z{÷bbÆ&/ïBôYîlPV.&1¢Ë-âE- jòKuQ6jhªæÇHZÃ/Gs´çÆêÃ]Ln½\ûöÆ³?ÎY/}¶ÑÂO»ÿ¸îÆúéû«*Ï\kÈ=MëO*õq>¡¦½Êþ¯f?Ï2©nÈ	ÉUÊÁ#íÜËÞï|RÓ´	ëÌ.ùââpààñ.òU= ºzî| ë|12§»¯ýAqêMH¦8¹=}L&Óqª#ÿ	]¼ìK^Ú	(ðï½ rr<Uµ;¡uyu9Ö$YæÃ¸ZDI²3d	afUiò.ÁÝÂå)é¼Ø¡ §6a¦ì|Siá¦âÆå)}ì%rú¢s|;Á;mOÁ·Ê:³Áb«²Jæ%*ÖJ«q²êýªÄáÅF½äó4#î3Oÿº¤Ö¤7¤j4åÅÚ1Üøçÿâr1¥ÖC³ è¡¿õÑÿ4/úéïnëÝ1Ü ÝÀj:2e:òi÷e_:2$zn¬ ÑtÝ f:ùv:|õzÇ¹q»Ñ4j§ÔÁg½¨QÖ&%Èáiãô»WÇ$ÜdO¡¤éb©qøë¸¶Ø@ãâvTqÌîë¹<^tdð½¥Kb/ødSÆÌ¦ÇÂâ¢M?Ç%'K=M7
~îï{µ{ªJüÆ²´sFÈ3GV1tæ¸=MpWo fáE¬GÕ1äJH'çê4n¢W?-85eNBê5/Ñâ·hg¬TOéÈr.êì¡µ3þÇ¬®Ô3yË8wR#ÖD*»ÿU1:t$4Aa°{2 Xë;øòäÀG Dy½ÿ°Îr#FÓRÒçiõÄ¼S¾å ¸TÔ4a¸bÕK¹q«³jËTûHTè	Ö 2| ¥Bòz§èµâÚ[ÌhÅåÉÂqcKú³ '×W³}ýÁÛÒ( ÷Pµsè/rãÚô¦½9Ê®0»ºãÙ2Ö/^Â!ÀÆàÕ= 'ß':=MüQÒõh'Úy= LÈÜ~zhÍÎÝ­«02-lnô5ª~Æm­RköoôÍ"¹ZWKo8î6ïxþHVz6O<³o(òÏm#ØK²Õ/ÊbZ	ü´¾µAù=M x¦±x4î­¸= += ³¸±,©­³Å7WÉ6ÌÒ<Âðª²Ç%ÏNÜ÷rÕAÙ.÷ÌÌã	EeàÌDq_æÜºÕÎ.Ô3ùéSgè©3	Ã¬GUÀÁ.EÔÌb\Û¥¨'úäm%õ93ü>2Ö¬ºáör¨5àlC3= ÞFfTAèE
²°ºò 6ºè&DV00t íG  £Ì rÝº<Rq måÝÈ3l.ßÀDj'ó#§%±§²÷fCÄøî¬ÓÎà@gà@®= (Æ÷¿IÅ]àMÜg(v¬ÿéàm¶ß¶å+ÿ5©
ü:¤.¬gl8ÛFªIÁ¾!èëC\¾¶¸ªV©ÐaÀÑ¹î§á[L÷|lc³=MÒ8îIõfzú7¨DîÇý7©¼¾:FRÓ½I¤k-(çEÖ7£·°1Y\ÜÂv¶QEÆJÑÌÌÈkÏ W74Yæ°5ö*3ËÖoºÍæ¼m	/ã{Ð=}páêóèÆæãK)ºÒ®Añ¹=M³zPÚdnvd0ÆàZ¸T¶ëÁ¿çàgø¶hàå·îÂ¬Ï¡j¦ç:%)ÿ¬Oz~¾÷9ÜT¢±(£n-îbfi[g ~ñz¬dT-t<&4:¡q"à4:¹1(S$?beÜvA*ÓÇª] BjDñên¡:Máª»B¯Aj$$|
ÊGªlô0Õo¸}¿øÆèDÞPo(×'¬=}ËOuÝ21ëÎc¡x+Ì¤¦(~§$-ºeF3ÅôÍÐBjBßÉTOÞ¨!'Ê1lï¤ûÜìØv=}&y× ü2(¶ÁðóÞ³¯*M;¡q7vùTÎoé$s
¦"ÅqBúØ´ÎÎômþñÜCdxN°pðê*pssÍd>Å£w.C?Í÷Ð»= Lv	= í/ZüÅ>vaÆmb+ÊjöÉº ë!·lÓ-ÈMºB¿MBâ¹}A¶Ñq¯ÔC®v¾Ë/õcxÞ«cÀ¯êIÃ.6= ÜÈöKúMÆxÉ0Zèh¼¯¤"zÅ?µÒhÔH?N¢¤4ÃckÅwáNù 6ÀîÝFºÉ£û=}V÷i{Íþ>£µâ§Á=M÷3/9»!ÇÝ:QÏ" É]3 é.9g4ú»UÔwk= DNuº±= .ªÞ°¤N=}Ï5{×¿½ã¨Mú= avL
É±òz³®6¥faÚS%Ûã(!Â­r[Âh[CêÇIÕ!m;èø©ë}úø¡+pöÖ·tóL }6©Z''@ã	Û¨â¨7÷xÏÛ2$y°UF}B·Ùí¬uAQNÊp= zsqfJ=}âðÖj/Ï|3	Ï¡ð{wPtQá¿ª&R»o¹)ÚPì´³kî§ÕJ7­£æò«éÇ.]Øÿ$(érc]ï!J{ÖE½´®÷rFaìºex BÆÈ32ÊÏØ*§TÑ¾\ÙØÎôÔò0/ÞÌÿcE´®Ø3WXKòBPQk¾·Ô "¹®vÈ·ãsÜç/µéc¾\ªáâuX?%ÿN Hmi¬H}}°¬H¿J¯çýëJ®Â@ðõ= =MD\h¹±2¶&í\¸- h]°Ôx~×¦én¸é} ÔW2d©»@NxÉá"Ý!îPÒ­î¬Öäv MV¤ö*r¿ À{}çÅtÅ¤ÁLnÚ}zé#[âN_=}e5©î5¦¿DÉþÀbD	;-ðòðbù¾P@¢N5 %CØ#~£;È=MûJÆc<÷QÆ:þ9D	;÷ö}ñÉî}Ïùç,ã-ìë+iÉì½û]Qe!µÀ´|n¬mßüùi?>¶Ç¦k;À§ÊKÑðí³nDâqæ0¡å¡!0oñu¬RçgÓeB®¨6er ôÕÕC¿IGy'¯vËÌñçìKêsòk}hiÉÅçàÔdÂ"õæ(xÈÙ6Oú2ÏþÃ/xWÙuåÇðèPþ§¢HïÚÌOó,de}¦*Ñev#÷'á
«¨¦P,<Rýò3pÏÎÏ&·:_ÎJ¾ýØ1êM¨XBBÞz­3iòNxÐ-ø¯¡BKyt	=M¡
y¥ê:=}.c§¯FÜßìúò¤ë6/¶%DÆÕ¡å¾B£ývÏL_#îÓjÒ°JG«H»Æs7K£¶
F~Àïx NðÛvâFÂ­·^ÖÊ¦$_uþ9'ðí¤J0@£r-¾A<E7÷ÁîLþ:æþy¼7+þ¹¤´Ê	ÚózùAo;-Íí³{â50ÿ«ÑE<U»j¼¥¯§päMû6Ón61®ÄL®E2²Gö®'°êz¥ËûnÌ¾³2í¥Y£í£~í£ò­
£ò'[Ýa¦_Ø/QÌP@æØ9WZWwáØoí)ÄçÓªCøú~ ®7Øù 4®eW óOi¤qg\)õõrcëH9	¦ÉËõe7á}VÑÅ?à®!>9m»-rÁ¡FúÝ)«VýàÌþGìô<F·7åË#"ô«;d,«¯E=Míníõ«ÉÓLþ=}¤Ïï+íZþ9M@¤BF~8²£^È	ÙUy= Üé¨koBßìQQã~wòK¦ëf2áÿîþÀ*MöLä $mÚêÄnü·åã{m¼¨âWò ´¡Ë.ä÷,âTà×Qt¥4Óôª§ñÜÚzá[í$RQyÈB1¿´¯uhæ©ÝnìÒÉÜ	NØsO®e?m»õãÓ¿í×Õ!UÂ6/ïÏ 2óN,*=}¢Ô´uÕyëÎ.#C¦Jp±ë²ÏÔ?ä(/M"Â'§%2ò$ô¢OÂ¿S$³ëò=MJhPÿ= (Ý^wmÞÕÖn8þ@»i7þXS#Ð^¢cÂ,ÅGé;\µKa>½Ç¸2FäA½åëÊàÎbÁ÷£8ùÓø¢µTvÙqXÒñÁF¥×WV2@(Ø×»M>í2r8ºúíú Ãèõ4Ew3}bôF¾kÇ­V5¦ff@:R7'PT¡rÀ/Î*7°øâ®ÎpÉÉÇxÜR ºìÑe)KÐ| ¨H;6~j¯ìÒá9êàÌhy.Ø«s·¨ör²ÕÕ9=M2ÁSuã­åÃBªd<-é1DºæbiO	¸M?à¤êñz7¥Î}A(ÆH?P]ÐT¥=}ÑæT¼ÃC¤æ,¿~:jprØ=}7¸ Ñz,d®;Ö¾¥hX2ØÄî ÆÆgaÊ±i"dç¥ðÁUæRQÈ@z7]ºï]îF=  W?ÿrv+2£ikTäZÁ KZ¬ÔNHµ¼"T§jx7tQÐÎà¨¯DªC>@^4¥îøµw°&½÷ËÝ~_WdüÕ"Óf3~È¢.Á¥K² ,W	kàcå=Mm¿¨2w£IUaÓj×bU(Slgä'ÿX}¹XC§êÇ¢EFÈTÐÖ§ö4T,rÂz ³ù¡%¥"ËEÛû&U-!
y«|^úé¸úÕ)=Mñù«úOjJçç@1#8~ÈbâÏéöv
³á¿´ðU¶~r= 6°¦ÀxYÕkÊ+Ü)«.À4]#	qß¥Jñî)ÁöbÍC¡@µ5èK3¬ t·pæÛë¬ZOwHàE¥
n@Þ5g.0z;G'Ý\¿tÓÒëéTÀ. VB©9W½Ï:Wß_C=M¼ûjÀì]%Ç^ÈÁç$Û±ÞÓ1@A¶A¶¦M¹oä·Âû$²ÍØo6È·ï7W÷W!Bù;hWÈÖoOÄ</Ä%ìÂ6µ"=MO³û3fø
 RäÃÞè+Rã
§àÇ@ÁNZ¼=}WãªÃ»;<MhÃdãÁîr2¦â.ÓÌ9	ÓÂr¼CdÔïÖvÜ,$£2lO·½×Áo'ò ¦¢¶.ú³©FêC'è·9EÏ:¯õîÃ§²¢¯òm@É.¯¾ o'v®{ãî2El/Û2ÂÉyèN0kÆ¦}?ÓCöÚ 2DÂ³fvÏ+jã\äfjGyûz÷ÅJÉ¹ëíìFùõ&kC¯ÒJâÀÒ¦$,D6/´,O/þe4âl;÷ªârÌQ7âßõ6Qr$¿G¾ô;Ê3 ¸´¹5*Hé¢CG9'òêb$xy~~ùiL¢zE{º¿18M3a¤LÛPÉÂ/A#Yï¼í¼lkUtó¿,(´
yOéÞ.û½·£e/O#*1e-*ó	0ÈTNËÉn >§= ¿ÂÕ÷Îçî5/¸§ñ=}2VÚ<hº¸îÚQ(£À6¿?¾íä0àJÃÿ¿Oty®èNhé
öi:"§pã~=MuhÆ³h3á ¯è¨A/@fñÃwî(0èÎËÌK¨ËÞ}ètt¢ã¡{èY¥iìnðT8Ôz9»%À£,Ø¡[¯ù(øeCøMÌñÌË=MÆ5wØ=}ág²-BxW£V§â ªFB%ñÉI¿kå¿vý	Ä´"Á&§õ°rðòÌïñLx+÷@öç¨Y­Xùc@MEÃ8pÔ@DõBc¨)ëÏUf3xËß+¼aà]éÌv¯9T6x´ñÔh÷Eú;4´¢øDâ¥#ß~ósxõ7¨i×s·ô?W§2Æèr7ô¯Â4 !éJ W>iaq¡ÄkßÂõ\oøÓj÷	WâÚä»= ?q®À3ÀÆÂ)AraÜT"X¨¨VvU¯!i~'à@" õDØÙØwOh2Ñ1ñvô°E°%rìÎº²øÒè= tÙ'ât
ÿ)?Á"¦²8éKD= ô4Ç« ãgÍX »E"¸$jÛåÇmØÈ°=}p£$zã­è÷D'Èzî1eMÌêï2^¥¡Øñ/\Ø;/èÎÊêm¡YØCº®ßz&É.?Î¢.Ê@¶ofàÂæû= ñÊ/«óCr/éCe¦Eô é>«
qÈéùMJZèê¯vòcmAæå°w¢'ÎÐgÖ&Ç	Âök¹(Í]	£ÐÑVAÐÚê!p°8çç­ßx²¥¶?B7¼BKÄ DÑÀ693BË¨Pm>ìN2¸>ÀN3"_÷EkD0§M½ø((ìî÷ÅäøÉF½÷EÌRÕF½÷ERW3"ÏÔ RÏF½D÷EUõÏÖ÷Ej×§¶2ßT×ÇÏ\÷E&U5ÊF½ì(0§¯0Æ«õ:@×j$?ñ[4&.çe&N1­ôø ¸ÐÖ÷+{ts" xsÈÖ|<ê°FîæäºJ)toÀ·2	XîfäÔ·2	<îfä4·2	Nbà4¡6àXº»:}1Þ= ê
À},««âÿRî¾ÝçEÃÏi ;¯rcåÑ×ËÎÛ%l=}0¥)J]ÜÄ!Ò&]Ö¨	Ó&]\¨	×&]¨	Ê&]¾6~Ñ¢ÛÇE)P ã¿aEtª}ÒØß¨É(l½÷9çÄAÑÛ4òyP] òùHb§µlu¿ÛúWób{3gÝÿ°*Í0ÁÔÆóÇ,FrüÝª<4ÆÂ fj~¯«Þf's¿Ä%3#'µègHäøÄ~·dÈ1 ®p¢Ö=  ^öä¿à-Ê´¦Æì^A­XkÂ¦xXä0àèÕËÍQûB\kXèWÎ+¥(ÕÔãúò×³zâÓÆ$Lø<Kh89mvV·Ü-%éó«
Q8]«V3aÒ]Got9Q=M$ðúl<MbQOm$aMOÑk1ÚC]¤T¨<ò8j'e÷Z.äÎÿrP#gußqc$I^¨5½ÆË\L»´;¶ÅýFsòDSOUæG§½¨ÆNZ1?)2ÔßDÝö%·)ÐOãôpÕê(b8ÍàqPÏ=}&À7µ7W%4ðÐ¹·µt@jG	;=M¡=}·åÚ¶&«VÉÇ;4_dYz~>xp¡! p2Hrò·lÑUGkbþ #âà¯gQï3¼CùvL[j½ã/@þfìKJ°ÛjdfïC²p©7<:dØfÔ zq¾øÚy;Ø+oWÛíjÞ4^ÒIHñE#W¼6ðD3§rô¬å[e3k!¥+âÔ]»©câé³Hü¿F ¼VÈ= úL&(5MP¨6ôÕJ1åÄÇepBÇAH9ÌTñÖÌq¨$®£c*°©¿§få ,òÓG¾¤Áö>'§Ìû®´Òc8Ù*§ Î  ¦HtÃfoc¾RçÇ³µ'÷:2Ëzðï!rRç%ÚM¥mm¸Ñ¹'õðduô02ð"Ø.:i­°	xíØ<Õ¥T3xW*è¢¾(²wÔÂLôDºqÌÈ©D­!IXYJí7QèXÞ÷¤~%¶ZgPÎÄk³DÂ¢Aûô8Üh,ù/E_V6>_á^£=M 0BE3àª-µgºmé´bQQ=M;J¶iFå~ÀÏlýíÐ2¦©b+úghKôyy=MtbS¿­#é¡¤íð-¥#ÑÍ´ha¥rvÁý/û*øàyÞvX¶Ú3LêK[ÜEiOô+CþÀÛÐó>K7=}dQRû CDUÔÂ(+ðµO~®û¨îÊ2£Øà7¥Í¯¾= mßKä­ï°.3W±D=Mï;ÃIÃ?ÎÇm¨W¿g±A!=M£ AÀçñÐé¯°IÀFçíÝ}òª:Ø£d¸IM:ä;íòùGê9ª.ÎÖTÀ¢+ßÓÑó°ÝH§8=}ú@«¿©5tNrê44ø±ÜõskÃÁ&"QÑfÌ=M·³Jª~ÀbÊ²Û$®wáØEüJ©QÞÈJSBANøVxS¯1Ë<×:RkCàþ¦àkìÆÒôÞWObÐiU2ÞpµÆa-õÚ>IÂ® ¦ÿ@- ]»ÐÚp<X·¬æîöÓ$,9=}=MrªPVN(=}Â¢u9ÇÀ¾SfÖ)4Õ©hÈgOzÛS0]õ6÷ÿðgQ#_álPf¯³Tu}¢î½5;ù<ý$kdüc#l§¬Dxê ¹ÙjD= l|æ«5:'

÷ëR+4ç»øG.Ã?WEèÂFKÏÊÉW;MôPoø÷½Çúÿ³ïÁÀAÒ©m¼ å3 z/?MU .ÔêüC;omI-ÿÀ<PW8Q¬LT.>Ä0p|KÔz
ôHÙ'-_øzºÃ¡¨}&ÅV·wçOE·gÔ)æìÒÊ<^Ö.ñÎ6ÚÊÁ1P7'$wIëóZâÑ²ÎæK5ekVþËcX´pI';z1NÔ^\%åGº~%çLÅ¾5»¨0°Ï4<yMKp¹9OofÊüjFë,¦Yª"]ìªªºÐýë&Áª Qªh¨å<4=MoG ¹îX|ÈäRxÍõ@ºÅãûxªûW¦w¿å|<ø´¿J\LWÄLoqÙ1ð6!ò5Øö#ûÑv YâÕTsòöc0ÊVÚôây/kXî¶^¥aæ°¢WÇ¥+á¦ã÷²¾Jò¡88¨sÛÒfÔ[þÈoçÕÑfÙV<¢vNÐð ¼¯>ËFÐÀyñ¢Vß@Ãq±3ÂØnê4
?Åz	Ä³Á¹÷qõ/ç£ôÏUo,rd/Ë=M´eTÎTó­ÙÌÚÀAÀé¼Dp°Q]ïhõyì24LLOQ8©ÉéÇL£ý 
ü²[¡ÿ.ª)ÌC·ì]­Zx³J²Æõ#p=}WCãKØa-ìCnHzÔ*SEðaÂaþÆF[w h<H¾,j5-UBk-Hó!.Wp0mu9Øµ8~<xÌ³aAR#9µIûÈn×í:e	¸í§gqX$îx¯¿Fçáú}~Üp§³Ðô
ý¥?Íæý¢-¯âk®ÔNÝ  E<WJrõw®*¤À$Öosøçì¸<!ï(QÈ¬ªå¦8Ë= Úú5ARoÄáö¹¬=Möaã]Y½ÿåï<fÂ YÒ:/ëFMõ¼ÚEÏxÑf:ã¢Óé÷«©Íÿ=ML¢éÇ%M,âúàã±äè2Ð E<õ=MVñÄ£qiåúvh&øïÔy'x$¶È#º~ÿ&ôË°b6vTf½\£qkO~ìÏ¸¥Á£1yMevkñÁVìjÎÀ6ö+ö1J-êìÍI¶
l¨[M7Úä*R»!FûÐá¼ª~r9ìþ8æÏ<>ô@þÃG4Ië	¡d\kòb=M§AÿLÓåÍj5
}Õð¿Ú·f=M°-R0Û1â½Û¦ßfÙó¥n	yT9!>ßàÌ^êÜ2)aÚÏcò<ïÉªÇP!Ú?½Ãn
7Ê7 z%ÙWßCÄÖä= ÿÎÀ¬¯r¥ð>Ì
Àe¿TÏsýV»}÷àÞ}Æn^Ó>ÜQ¥ÆÍ²=}¿R99~"(×5=}À= B'=}ÈU"8a*¦lôU+ÉÝ&*oDpan (+EBw°?¥<$,E©=}é#¿®?c¿*Þû0vßæÖ/|¨¥ØrºdHJÔXOûMºWÃd£^^°4¦ÑG:+64¯v§71Ý¥¼àÄ*?£BrlW}a[o÷_é75îX{ÌøÚD¨¦ydF	{µ9ÁÃrÏÐêD1ÑÌn2=Mdµ»3ãhð§K0ÇEyö1@ìpk*ÙÄãäÛíªôÓ.âõLþº(-;^ÂzÆ^£æ°ª:µÍª[= Í_¸u\;'B¸¥½´ébÞºÏyYotÏ!7´ÓÍrC\´ò,°¶ÄyÙÖØþLZk¦;,}¨JZET%·ÇTy_£ó4Ï¾OyáÜC= ôE+Vü[ýàüYT«±ã¶eWç/Ðì	v¸·{ÀÍ®N6¥"	-ân®>°r
<uño­/Ò.å	ÞÚI¿>¬.k¹@¶ñ=}µLp¢þm¿á¸¬~ýoCäÆÞ¬Ì!V8ËG];Ô;nñôel"5Öúob½)åÿ?<Àâ*¦Çç4lËcUÚ=}L1®xÙ*çÿOL+±Ë;3?r­bÁð/ÔaaÅ.0ðßØ»ç¡º5RÔUbQ¼Ë-Ì1nÈHPÚ8P, =}¿weÔ9·î@)½)A^ÓÝ·×}
-ø!SÌÆÍïYß´C©Ú©¹#Õ¢fÍ¬ÃPÞ¤¶ÆtüW¥4ÁnMÖ:Àó¼á¢&{½_ö.ÐC&rÙt÷Å°¹äj¼hþa-ï¢=M_û,1oeË= ¬:&A­nÝêèXÔè0®Ú½ÂFËêßb·â72oÍ ¬Úù_vH1s­Ã§ß¸7YÐºóp80Ï=}*%uÝ7~*%rLê¤@Ç¼ß:'ÂòaBPíÓë¾^Y^l,¤ÎµíÛc¨­«äâæ$:©íÔ2û¾ajCÙ=} èø£GT½õÏ.µ¯7úÌ=}>ß9EkÀóÈÊïÔ^RûJÝ,× rÔQQÄ1º³æ%º,É7%5Ò¯58¯ÀD!{³ä)§ú´Ô¾óËÛ¶ªôÎ¸I¶®Cw0 ézýÅ |K¶åÌ>þ\üë·ZO¦×g¼SÃæ(@TaG)þeH(Þ1øT=}îÓð/¡,'>]FCÀÜAº;?±ýø[¾¯P±s¬¸²2äÇEf%tãÆ0´VqÏÁ®ó±;Ï³HfÖ ÍW¨®ÿ0²¼3¨JÂ!î³^½îì=M:QÍËªðá¾r·4²ÕÁÍ«
#ÇÚüBïk{n¹=  8Z ¶nxhß#ç4¸ü¬O4ÉlÓêã	¡cJùù]9vMw=Mf¨g½hÊªÈÅa ´·Ìi,·ÒM8¸PeÜ%¹ª
Xæó~uÀ¦¦Î BóÛCtR,Ó9Ý.JÀc6lZÊ%ÖÔûüÖÛLçé	A+f"l Ãøa÷³lNÌXØÿh§6ÁLFï»ô°§íHtX¡XIh&k6TV½Õ­xr$¾Óà@°×0µFém.Ù¼óH§m=M!FUV£þ¬Õe;B×Þ§VÑïy&?ï²0C¥°óöQäÐý9§P¼â«ß­øúD=  ¶ù'=}Y÷üóäNbBTçì¿%@¼.ït,õø¥j°}åh¯K+ÇËÓ¹å \éh,wS{*!ùrw0t/nÏHÎªø2êµ§¼ÞU-¹ÜË>ì¨5Ù=M¿ÏDìñüØÎçåuí7%³§¯_ÒM^:.½|	
A[lÞd¥ÍU_¼9[l*Å8ëmXfÝW$_<úC¡%ctJQñÓJlÉXMçV^gÿû]9¼xAà´¦¾©¨qÓ ëé¬ î%b
íG<=M= $/^tïÑ:gïÈYÔø9úâ­e¿9 B³Lã¯¶ÃÖÇÖp¤A»ß¹( canÊì8à¼¢§AdYCÏ,áÀl]4<1=MHõ4³$dBS+g<eÄhù»=Mù¾¬ùÌv'Î/<Î´.&{j¤¿ë@Æ²>ùËZnTç²eHT:I J	ãx¥¥ëj¶>º
åº°Ò=}´Î´P£L¯Ï¯
rmöo¡hÇó¾ô~¦K¬õHóLñs5 !Iï½$£0jpCË6ç0f= háVC^Ý¾Î(?t¬
wO]DüÚ²fh9/§Üe?6fH+oú&= éÀ@)ÓIX kÇqsWßýGåÅ\¿ÙjgG¸O8Ðµ1T9¨Öz/ ¿4ñ;ÜnÏ4(¢!Ñm)íúÜf)¾]ö
dFßÁkS@ú§ÖøzCÄô¶AUBÒ¡¥pC LJä¿OWÁ¿ïpcèBîË«1c53BæÖn"åÖZ27¥¶J= q¡îTàËÐäÙ\~½_ãÉüþôÄÜ$_Î$~FD=}¨b= 8vX÷%>ÏÀ¹a{ÙxR¬åTEº¶7bIFÁ­Ø@·/³ð÷éFò{ÂéóÙ-Ú­ä[cÏÂ¤Úe²0UÑ%@IïLé¬dö~v1ê¼±Í%À¹8¦ýº,¼©F§'ÞéÃðçd9'å,éÂe:VK«^o'ÊÀ»Ò{Ón¢ínÐ³
ßåszLsëÿ_Å²!»~^îé·ìÿkªÙûú°[ÌTbÃJ?§·Ò"o
o	Êl¯¿jÜ6Õg4!öæä¢Æ5³O<yãÊ"	ûÁ¤âý«ÝÿF¤±yß&2í\ïc¸¥+?âgj*-gO4Æ´½ÿr+¹!mâ÷nØt½J±-@õÝG89ßkê´>¡UJ³6ûrsÐJ×=}¹-13ÀÃàÛ%VÌ|'®|pò³$1hê4j»èPäló¾QÓ¦ÜG+e¦~lÔW·K×¾qIÊútæõÄ= æQgÌ&»¿x÷ªdíîïå8|noä¥n¯*Ôº1ÉÈ|¸à×2l@¹b~a"e²Ç­ßÌâ4Ý'ÞâÆeøyhM¼ô4¹üZÅvÆüHá¯Âç­¶¤Î®Ôd¬Öõï7Mç>V@µA,gØ¯ÿ®ãÁ¨öQÙ5ÐL58ÿO·jöÌ>  Ö7Ý0,Á#Lt~PXúP|"Îd<òp@ðKÇ¯e³B»6BfìÞ· îL=}XËsÙ}²ÛÁ¯®Ð¨èÇÆôÊÆ4Æ4Æ4ææº¨@ñæX+§ÒSQ<$¨×[YbY]eá¬Üy«îÑç!¶îÍ²ø{Ko·Ég-AshÉp
¿tÉp-òºãy1ô¶£ûÅWXkÀkýõÒ£R¦\Ú(fµJ'í{¬®îJ&¡ò#ÌÛ9ivãý¡û¶2³ZYÁ^æY%ù*V×0Q ×äÆf9;·ÙñÝ°ÜØ b¹Õg	¯ÒDT´»Udn%ýô{Dû³ÀÅ¢Çî3o/¿åÝ]u¶ÂÜ!§öe<gLíE£ÙDãÿ9­Ã¥ºeàxIÞ I¢&Íaû9.[Ë³ÖY¨I= j+JÀ­	ve= fX¨ø	x|-~tâz;_n±Ý>¡hûí:ÝP	ëMpä¨É;9åx6YiºZ¿¹s0ekº{µÞ£Á¯ê´}òÙl9¼sö½jåxEKßIµõùt!÷UvóA'¤üG;­sÉc»D¤ÐÝ"Å ²¥ä¼ïæ¶TkãE4*:(É[ÀCV\·|@ÅhNißñc×dÒxË½Ä!Qé?zé8Û(_èhghWÁÈ©TùëÚ&\ØdñxùdBxHX)8¤8ïèÖÃTõNÏN·Fî@24Là ÅPm¹Þ¢7lÄ6³eÆftNöÏõýúó/+«J©2ÉøÕZYæÊÓ2Jè;MÈï?ï? ¬Î,Cî®È>#Wn$d#óðF&Â³È*V8N^¾R¼LØ!D÷P¼Ç«§(õ¸¿ôÏÀ¿~¾§(Í(Õö|<øM,B¼,¼,¦Â¢Â ,ïÿf¦Äöoô?öÿ¤üÂéO¹[ÍÂóiE¾éÙ|R+7îgE+Õèäe>BÌJ1Gæ?¨t=MÈ0&Cà^RÓs=M{Þ sÙµ<[uÛ=}jZÙz'ñ¶;VÃjÎõ2m.§ºú;³3j_§q¼Õeq2¿.¢É|G7!µ.ýÀîE¹ü[mXño%úð·ÄJ§=MÂ»W¥ÄNõ½nñ~7x#«x¢Æ.ÞúðÄõù®å±v­yÃ$ÏëÛOÇ¦â2¼Íérel}÷µëª|ü3Ú¶¤Ä¨é6üDS²@ZÞÓ
Óê?ã$ñ=}+¾cû= S?«¼¤Â³tû¨þà6©ÌÞ )·ÿM¹þûÊýÞÞ1®âvµn[þ¦W¥µ=}NlN¥tc¶X
ÂnÉª¿¶Xi(k1c¡=MýkÏ\«o[¡¼ÂÕ£¡q¼[äâ;£¢Å	TãíÕ@gLOÔ(H'ÌG@÷L@ÿjfnp3-×ª¡5ðËæÆÕ8ð³Kæ.ÎO=}¤¸X§DcöK=MÈT#Fâp#Ã3qR= #Ã×>C§Ð·<Á×.= ç<ª-âU= H=MåÝWZª^.Ás%Éb3Ô	.É?fç?5ÒVt¸Ðï óI¼>æÓçLõ!0vÈD
Ã4
õo¦l¤f¨m¯Ö)i'²LÑWü¿|d0Î¨ÛhöJï:b@$÷ÃçL±o=MP¥¾7Ñ@,ã·=MBôdâ"×,ÿú@Â´ÅB,ìÂg×ÄÀ·R¦4Ó7í$0¸X¿*Ï%RÄ¨f¿2ËMË= Öd8ÙQL0×WÕGÿþèô ¨ÎI²Q®ôÚ.¢r^PÃØ*õOÅGöC8±gå!SEP^m"-¤Mk}Ôñ)_'ä+y°öùöqüìY¡ÿäéc2 Bð}?
·jÊÚ\ÏZ!¯çjÉZy¦¾ýí! ÅºÎt3ö·÷!÷]Ë~i¨ò´1ìO}wÞ DjMn3â¶e	h#Û"µ½Ë"ìvÑlÛ/^ãi231Õ¾ZX|À_@y^EÐqUy;ö§ ìß-)wßú8øÑ¡X£°éV=}® Úwç#ú¢hw§8lð§Hü¢föáY)s0ðZ·ÒÅ5B ÍoôÚ¯nQ^!<âD%tó½xðêUW?nLÚë«Ò.{ÒÏÕñâ%};YÂ ¹Ù6>µ½'ã!^­ä²ÙLNmUÓª¾½i:h÷GYûuÈ§ C®)e½R¡ýð!üp>bY$l{ëyàz.ÃÜ¿%iéfákl4ôeY
xÝ%0"{nYsÌAV¶úTÈZ1ÝÄm<\q\çìEÝ2,Ù?ÉGi¿J^ò¤Ç|¸Îë$Bµ	Ä¡ßåÝÊJ4Ä ¼/²AHD4'/Ëÿå¬¨mñqÚ£m)Að'SC= þ~XÐÂ8ÏJ^÷Oÿòç,9,í÷ËQÍCòM-$:Ìo'·F~³
s-Cªvc]¾ì¹{Ú!¶$}µE:?¯ÏÌÊ²;±i×}F©564Hì<_K~à[{Äfk¢8TÐdSG7Æ¥b!¢gîòïm°ØTÏÏÖº?úxÇ¤c8ýÏzH¡«¿×£¬<úE@HìLHM¤gÞ¤s~{ªÛ¡Å;?Ë$ÇÇ!($¡cM!G¥íõ2)ÑÁM4¡hàþaj×tÇv¼_ÄÀ"ñW£¨k¶ok?¬2£%ÕÆ5¹ÝÎã/¦©®><w_÷Í
ÊB³¶¼pBÓ¼?ëâD~Q2H&añÀTa¥Çñö¼9ô**úÇûª}ÜáÞ­ù»«ëØÄmi}+l±	j3£{}þj¹ió(Yh.òÜ)Ê3l6ðá¼¨¶¯ª4+$A§
Ê¸=MÊDÚü@cH¯ÎÊ:ÍI´v=M¨«,~^XÎºTèõ¸,5ÿË8ã9bÀÈ0=M£¢
>õ^Du¸ÍX¬pú+Ø<VòR0$¸)µlt¾zj
 L}.æ¶
/Ø®¡«:öp¦6-Â8&¶
JÅ§².¨FØIô2(´vD= "ìÐÆm8ÉvE£¥T:'Lßè8%'ÌGÍ'&H.=M¦&ÅÖ°= F¢YÍÌ-¿±&´j|I7$¿ôÀ2/ÌÒ½Ë:Vóh6'À2?áÒë@f¶=MóÚ@ÛÚTì'½8Õ/5&vÀGAº %*%U#3ïwÛ¼*ÈFï\ ííÃB®õBAG;= óÊQÛrgÏþ½µZT=M*eÔø®Ô«cHÁG»-åÿ²Òc1wÔ_;ÈC¯,öSö8ó	ÖàdGÅîkµl:õôÏ÷ÝRÑ63$IÿÓ¶~RE>´4W­,ö$Â7ÃÊ½5Jä~h8ÏIæ¿kFåNØÐø/VKÎü²Ç$\ÏG¨ÌR ÐI²rmbcþ¹¨#.nÑ6iorÌý=}ÊíS¸Ícíýç,eö¢Ú:×Q&Û#iðõ(??©âÍ{vZßíiZ'wçèí Eü|s!Æ\PÐyxIxI|åvµeæh÷>9hx¶EcÕ-Ñà"cd»­NFÙØZ ósÀ Nì«4ZæÍ|öN)~­	²×pô½wÏÙä¹ËÕxÙ\)é3/L­.Ö-1dgá¼\ÖÙ|ÊÍy= ¦zF^jXÄ¯Vìh;~Û|á*¤oºo9iZåÐxÆ îË£°Á|)«AèY$1/pêu!¸{æoZW
ß ¡Ü­?£_%dê£qýgAïeßi
ßzö¯?Ç¼)d~%w_¸4y_é7q·f jËs 0bkµ¾aüwK8.°ÁõXÁá½Zµ®ñcÔç° ôg0²{½'Ûº*Q£
ØIëdOþi¿#yüd¹=Mx)Ê!ûmn),¯ô#^8:ä³7Ñ«áFå|½mc¯<Ò¯wó(9ÕÔ"Måga=}hÀ¸{½ËrùÃ{®.´-)4q¤dh9\|ÝÌÉñ=M;nß½lâêº81[/o{ÒF¥^R¨=}XMß!³ç¸ ]õ­ß(qó¤¾Uyà²ÉÞ°S8Õ(jÌÙdücÜàÌ¼@8À]½õr­yäÿElüý[òÓY(m'Ø.ù
Y3qÐåîF­ê|ö(ý	X<Í|©l2_èÑÑëÂé?½4äÀÈîõ(¡¨å5
Í,ÎWÇÝoÿrtBìMBP(Ç?>·§¦2to+( 6Çßâçþû~ ï·'³µÎLÊR¦ °Ôö¤¯}þwÑl5ó£îáÉðd¥/À= øðí¢gâö¶: càç¥ì½_e%näÊcacèà?àS^¤g^Õ¸TO!úûMZ[}co¼¸¼êêZGt6[û{{÷tlë'6ò×úXDT Ï^t(ZTÃãÈv3|¢7õ	IÿA¯ºÛ!&..}/°EÙ´ZÊÈT(xcg·oG4öujiÒÌºé)}T6ê¼ë-¶Z>¼WÄ@7¦qég$á±OÖ=}P¡jb]ÇÿD{Z«uøð«o¯­m^ cwByÑM*KD¿AöëåBT*¶eVÊÔ
 ÓÀ M·´¾e%0¸ãQ)<kÜþYHÙþåªµ×jÌ°$ñ·¶ñD7BvÕxEKö¿|Z?¤@=M2à	/®AsµbèáÉxtÖüü¡·áÞýå}ûÙitÐîEv;âÞcuÝÃÒ©¹Ûj®dúÁ©ÊÂ6öä¼U/¶w@ú]èúO¥= £j·¿­ø9ðè.÷l¦ trå,0,.*/+Ýúsè$ºÁã½lÑÉÒ²VUTôrF² ÎFGÔäî~J»Üì_WCX+PJ&LÀ¨xnõÆÄ¼ÆÿÞ&{À­ÖoVU¼G	Þa£ú©ü©=MS<â× øô$ÈM«½eO![rp>y"i´ûA~,©ÄRAN'ùò #[­|ÜÖöÈÈ÷ææc4$×?½¼¶ðúWbT¦F$CnKè_'ö¸Ü:)(c(Ç>þþE6ÊàüÉS}¬|Öv¦Îwàbn29Ôþòêt?¥,|ª§=}Õ= Ì¬¯4õiTN-Xïü ôÀÁVÔ¨6þI rDÙ{tS±ãPÇQEÊØ.rUF·;«¤kK÷Ú¨ÎëAÙ¯¬ DÂ}SIB¾ÏÝòè­v,rvrAÆÓñnÇÛp ^V6.0,OÇõÀ2ìäpS¸¦ðÛ?¥v §Ê¡ié«TL¾Ì É©¤Ïì-JX «nû*A¬=MCFúHû ûÆ^LÎî*©0<V/C1L,ÞÞÿµ¾1ªöx5£°^fPðõgJõÝ"æ·ÂÀ	)W'§ÞÓ¨0Z3ù=M>¡t(¬Ô<&æìºL%ÍÂ¾u"0÷?EA.OÿC]¤o28×r?¼ú(ìeXw)ù°-nüÚ¡¡©p®^fX	¥¸bfÎ¯wÍ-©Ü¶Ç°ÜLª³ØÏmcH3'ÀpÛvÉ_¸onÃ[1¬Ø@Íá }ÎåÀQÌT¬ÀÄ!:/ðç01þ}06±ÒÓæ<]e64Ä÷1;ÈÂ!® rÃÄMtÖF¦ûø¼ÿü:ãïC	)áMÂå°jæM.Àö¡ùêFP<N®ÚDH	2¯tÜQSGÓUkÌOJK§èb=M{ÇÕV±dÄ8äé_þ¦P(](jI­g(\E_å5X
g@ÖóoÝ*î´\ÜABÐ<ùw%hæ_7võÿÛ*AWç>Õ@~m¹VªÊ)tqCVB+ÿrµ~%×ÇlÐë~AP@@4B!IåUNB6N,RËÍ®pd¼Ayðþ¢ÄÅM/±ÔKU§øCE+ÇÊnî2ufÖ,B/\|lºÆ c8¿'J¶¿,¼£¶ ¡¼-%.È23³çÿJ­¤0*Úú´ÐÕËøÕöqæn^^^oäNPã±0+7U pýøà n=}ÃR°jG¬îî=}nÒµàðlË¶³PXE1\Í¶dl_)¬4FO2Ã4Æ4Æ4Æ4Gï&x¶" 8¥î¡HâSGUaHæKGáÈGJFG¨|VI&ïxlVJ¨ô{Ì$å³×ieXQÿ°)¸^TL°Dè®ØÕv]4ÕVÅkdr=MÁ/	Óe
{WÄMÀê£e7XÓj{a:ÌI=}úÕÆî}aU2qLp<×3÷a;ÀcÛÎ²ÛyÌyØ´¨;mg ¢æè/c{v¥þú9¸XSÈnãÝ|[êá»iä|Zâ¡«éãý|\ò!ËéähRñ¨RõRóÈR÷xRò¸RöRô5=}~^¥ªã¬ë+íþn¥®¬ì3-þfÂ¥¬ó,ë/=MþvB¥°,ì7Mþ\r%©ßë*å¾lò%­ÿì2%¾d²%«ïë.¾t2%¯ì6E¾= %ªçÌë,õ>p%®Ìì45>hÒ%¬÷Lëiz%øÝ|[êá»iä|Zâ¡«éãý|\ò!ËéähRñ¨RõRóÈR÷xRò¸RöRô5=}~^¥ªã¬ëÚó!ð=} òèõM=}­À ¢j+'ö Us#¥¨G)?õOÝ$mgÄUq'%QòJÀ]úËò+ë÷|ôtNü!ò+ó¥ûôlü¼14ñä¾§çÆH;Aõ;"
¸¼$l3O
ö¥»¨ì32½}PÖcHþÍîÌ«æÄ+öÔa=}åGò"Ôo(#Cò2àsË~ðó­4 ÃU±øRØàNKî÷/4ÓU§AR XÜ¸½Jô¥×ð&øS¤¯X!èEK#d!=MéÅä!ä$ýE¤ôrÀn%ÿër®¿¯6EÃóúz?ÄÿN&úrDÿO=MöÆ¢Ä8N·Ô  ÌÿÄÔ ÈPCD÷V6ÔéÀeJº÷ º³Âû3Êó³ÀÒï3@Cº·oBÂâ7ïBÊþ·°DÒö7!¹#½àÅÏ"ÁO$EéEç#I¨"MÅ($Që#UEÈ2Ve¡<i·àÍ¨0=M×E2$É· ÍSE§$±'t:kÇG,#yä<µXRo[âæX8¥ë"ä.©ðyt_9F:Gí»Bú pÐ¶v½×¤eGGGNÐ´ðOÕ?æÔxªþvp['ªÙnÉØ^²[Ñ\ýe9OYUWYéYÇt
¹pb7]jI8iÑjáàb5hb7Ar¬q¡örÉ¬rItqOyr²m¾:ó2#»Ooèc'/ëcG­Ñ¬ Û´ff³fWsOs¡LÉø*ùÛÜÖu= ª:4°d×ÝowdÝî;&ÒcÀg+vîwUÁµpMyfÉ°r©õÁÝÄìj£ébðôTò:µÇOÉÈ9¦ûn÷Ã¡ÄtIlÕ¹0TS*pGo××9= ÔY%lY×ÂyÑáxÑÜI¿»õ²zé·àÙ4rc××ÓÞÚ}Þ¦{©Õ[C¡ûÔ¯QúÉÏâÞ+gG5Ñ¢n9¢¥Iï¨]ðï]rO¿éÿf«EDyVÀÚ>,yp;ñ$ ôDN:eÄaÂ¹|É4\Xg°tj½¬l8Êø?É³âÈ>öØÄI=Mõ~FùÐ\7	ö9²1r}KÇ94PÙV¢¨¡äÓ¶ÐWV¹¸Y»P%OvaWyÑgÚÏq5¦9¦I8çß¡YòZs©=MÙÁ[yà\£cAb)"Ù=M+ÄÐ\=Mgia!e[>ÚõÙÇ½yß
©×ºyD-iz.ÃyE9(ÂåéÚÓ)¤_aì¥éiÜÅélÕàSraÊÍÁÓét òrfK°uÝÆâù8ÿóbØw)a<yÝ«9ÙdAþ·io2m=M,±!¦ãyÇÉs= ¨äTZòP¡'ùÜWÙix«P,iüÇWUbÁJvjtKÝ3]{Øì¨ívÆa²,ðaÂ¼bî+;>sî©Ýr@b2NíåÕ|åúÔKrÊª°Êå¼ÀZ|È2á6hkPÙjO©ï§½¢ªÔïm¨¹BSnIïîß8¾iì£/>ÁÜÚþ­~§®*îè®~­ÃÂøÞîÃÃ×ûïû+ö×sÇþØç3þÌÀ§²*W@J¾é¯Â¯þV½5=}î¯UIrîïùÛ>cþ¬ìÎ=}¥âç}ö,*"Ó:R0ÓÂ-ÇÅéÐÆ)FurÅmlçqB
ìÌÜ¢*r&ý»ß²I-¥v\«¤oBÑp×5Õ27gu¾¶Õ=}çðÕA¨\Ö6(ÕîUA¡äT7¸µ3÷hio¥cý÷Å?¢àZë_d*î+Ùzz;­7Ë{íwø°¨B/¥Å¦ÂR*ÉÒ<aÞå}bÂªnóqÎä²KPØÆ[%zÙlA,\]ã[RgÛÚPaïîa¬±Ý
N_°rc¥èÜx¦!M1ÉPÑY«¤ê7sHcë	V(Å1-qËv¹ØDÜEÿü¹èÎµmÆ¨È%á\áÑhhU6îÕNýpBiðÍsµ¤/ñCá¼×g¬.Ó_¬µÔÙRÏaÔO@{ÏC¾É½¤.üð­úÖt´6 ÿÆTÁß0eî
= Ã £ûfc±6ì°hÍ@(7)×8)M~¼óU°2Ò¾õ³( OPË8újvUÞ¥ùèÑÛ84	Í@øúä´ºð WTN0*Î&NÊD×pÇhôî=}pÎK5å¦:ENRV»§õÉÒ</5Û¿¾= ØÈÑåJ$G.ö×4ùTMÀÖT}³³i	³=}»6Ø×
ÔTQcWÏê8)¹\±=MoQi¤19jä®ô.!O7@=}Ê5<Üá6zÑ«nè"äL)î\4úáÒpæOðü¬EU?ì÷óÓÒæuE5æ¢&QR¹v3¾¶ÿÍ*u¶
í´Ù+UûÃ¶Dwr-àÇñSRå	ÿ Õ¨W}ù®IPà"$;üvUÿÌCA\PVé8©E4ÕTßÛOn¨ÔN=}pOv½/1¸õö:^!¨]þ|²±Ú#Yþêx£üI;ÖöSÙöhL=}ìqH#yO..óxxç¸·>ò7¡Á¤00EÂXÿEfvõ®HÞ=}tDÒP¼²´ÚR¸ê ØðÖ7@üî÷}no©±ìÕyæÚ1ú~oÚG¡äâÝG&±¢Ôà³VªÃçr
g{¬»¡Ä*SwDnáëûR¼HSe]-å¹=}5æ@|l|ß+%ªÂ?ôdUÊ§Q:McÐø)û)Å¥Ö:Í% ìU>VòWp­n\äA&QÖ/aÕË(L¿OAª9CLd|¶á,-Ö28Q9<O¹@U «.6ºZE³Ñ¥R|ã=}øÃ¦¦µøÒìÏ¶x!¶bÑ= ­n)LLÙKIì!À"x­Y×X±G¾ X®âVÈTVl× ËÓY:rÙ~lÁE~5 UIÅÈÕÇ]ikI@iùýl©)rÑ7^X[_­©\g³A¹ÙboQ{izQøíqÙBe×ªÎ ¨q^Ñ3´qÃ"ãaÊ¥"¤âcJÌÐ=M/®°ék:Úaï>þ ß^Ñ³ôCÄ!äLÙ]D#d;|ÜVõÅ%M.n}^ÒÙ'Ã£¨ågÞáÃ$ãdÉ§AÅ%§æèaKÊÌ	]ó(¼»°¤ÎÂ×¿«¥±Ùðúãa<û2¬S³DäÌ+kûÕ6ÚOB"²ÈØÀÌÆ²¯£µÑy!*{ù914¶
Ñ7%ær3Hr\PÕog_amYªyí¹é^_Úc-ì²o>H±fG¥7½&Ã¼É +¿ä¶æ%;ÒpvR0O*¿OÃZ´/³à5ÅÜøþ1cÏ2(øÅÔÓ,«4äTÏ1³F¼tWú¡0Ð´®Ïô¸ÝE;f>FÄ4Î	aËô{x»8"H±Ú6ßBNÏ*FÏbUVÏ÷§(96t+DF×Ål58'¦VÝ6OpE=MÇ3¦2V)çQî6øE1Ø4Fl¹[½gÙÊªY¦r/OâÆ4?±¥rDôÆ4&	JOµ}=M||@Â:ÖlÓPúhü«= éÌaÀD)±ß]aö*S6;øò¿AP	;¡fÞEj¿'å"É<Åfþ£P /}áíïiuøëtkÊuó$¢Í÷RÂ½¾96äÎs4?	{ðzdK1Ðøù ^È=}ä³®¥Ç§b¼!ÂÀ§ý[ cWhª@ùë+zG#­3ÿ;5´nü b£\]Ô¤]ØW|ª)Lñ¹9å Û¨^´8acçØjµV©Xz±{R¿"ØìMËfLxëBùoÖäú+ )é¡Ô"£eB¯FçLVþmÂý%bìx«8³" ×pUO®ùW²ó< ÄÚGÌÇïKhþK4«V¾3Â6zÚ3§÷ÎÛ¼ä^ÜýHopÛ 2ÛÛÚôy,·É°¸IHÉûÛ(8­%Â®ªÌ®\[°ñU cú;Áëã«ntÑ©8Æ®-Í£¢;~ç"$¬K"Ç|~°Ó
Ñ9N¾^HÉ°I}¶À^\±J¶§2Îô!*íL§x¬!
ÅÒÀbdÄ¤Iáî+ß~U·ÛGæ»_=Mýñoð»çP?¬¼jK&Ñ§{0üá/ÅÕ­!òÞñnoKâ=Mc"°dñk·N	[sL
·ò(¸rR1C?¼Lè8>º÷ðà
w¾ÈËòð*µc>+à÷¤Ìáè"Ä¹gv¿l­ðæóÌ×!a1üÆÿåç|¾7!û°ÆoÆñNlïÀ;pó"×F¥£ÐÀ	}Ü\ÑÊöZBqö'=M¤ÂEkÂÑ¨¡SÃ.,«*tøã:þm×ì 9{ÞQì"µð~Ð°Ï~jvöÝÌT}Cï~ûHóá*,]W¢yÁË[ÞÀ<Òðj(¾öÑã¼ÜÌõMW¼B|ïdÜ»Òßqøs(z*ÝÆä;íÀmÌt{{è/ë%þjµä98:uæb=}ÆqþºFl'K©?ñÝRÑa¼ÛÄaqúo¥øóySOd»;[ ]K4çY%E[ÉF(ØØ/7Oü¦xT³ÖÂêR{7TGDx7õôB¦ØÎÈ¯ÑJ²4äSs¨×HEâ¿ö= (Ô¹¬D§à§Gñ°Jæ¨¶ò2/núË:RÀ'>KÞl(ëöqP)êôúç¶Ë9°= ¯x	 (÷ÄF±çóÆÒú¼$JÂMØÄ¦û¼ÈÜe1ÆBâ¯ÕQ8ëïEî´i7Ã§×	³ &qýÈóÒÿE+)]øà5Í?*¯|+ßsê°º!°_àsI4ZÖ?è. §h4Ð¬wî°TÍv$K]ö%Í"AÆõ£(¢åñ¡3bqô¥ùCHJ}Öu BùÊE5o·¼*(vLüÂîü±/ëq4êñ[> :5Lv'.IAå	úÕ5Ýª¶àIÂT_*Pyÿ h½/ZMHYåWvEà¨H×qþO¾÷uA3àý73+ä[N·aG"<niø",WF¬¤°ó¦dÍÿÏÀ$ú°à¦³Õg-?7;÷Ä«Ãâ$f¯ø®À¶¸ÎU¼K8g%Õ4÷ïF
õ6çÀ3«3d3i©æø]\Ùq°Y^³À4X.ãÆ4ÏËÆ4Æ4Æ'1G|UCwAÐ©MÓt¾ô98z5°JÜc{ð9áòÝÒ&zÌ_l-KjRT]1ã )X@×rß<øQ«Ùã8SJzpQzüd¼öéèÈ ­tÜ´ù$0åÀÇæúÈÙ²vóÏÄùTÿs÷¬îéªZ"/QX¸c5»%oúYµERq(Þ5¿ox¿\äX znÌk©É¤+â)ÓrèHS»ÊG©em+û9ymâ¨:ñ¸dUæiÕcÛ£y×LJ  HUI0lx]Ôª4lEÚG©U*fÜ¨µy.=}]sf ñÔ4È8oÈ4y%cç«ïi=M â¬aøÚÔûjkñf*ÿà!I(XZckÈSk8ÞDôèJñÉâSl0¦Ìr~@ÿÔ_è.¨;C5ª=}àwÛ,îØ*Up5×öÚÚ;-Ê.¤^ nJ °Ë)¦ëxÐ:!ÛÀ¾[A× äÊÆ¼ÜàyÄá_Bg:eà$M0±©5~±êðLÔëuÐu{N<6}î=MëÈöD¡Ñ²+}O²ýÑòªä~7?º=}Å JðO}Óøö!³ú:~?F¸!H÷ì¡´;rëÒE¸&½"È[ðâ}öXçýg(«óÐàs¶¸£7á3§FâË¬+eî÷:K= ]\¾ªY^Æ4ÆÔÆ4Æ4?4VÅ4Ï&­~ïØé¥gÇÃ¨O¡Â·¿þ³eè´-{AU³ÇÛvê±x1¨¥í(é"âÐ(âXp;ÞÚâIkm¤êÜs=}Áwrí~pÆaÐîl²-J}pG_é3ï4ï=}ú!«°b#|(¤"÷KêQFyvÖ#½í7öz§Î¤=}¨CsE2ÙèôÊ×tëF|<·]v85ºí×çè§ IüP³x·Iü¶= F-ÆÁä7Å;IØcD¸IRñ8º=}%#ØÞ¥Ch	ÇSÜAøXzÆ Yð_¿µçüUµif?"ºZµ|[trÊUäìÛ)=MÁhnº[Î!Â;VºÆ}DùMweN*ÃºáDé!Úhør½/±ù2.kvèú¢õvù&j.èö·G[zõ¶<Z ¨µ>f.ÅxÉ	QúÑ-x2ÓÚQÑq)Keìî:páAµmôEÑuÏÞ</äím~úèÞÛ¯Úæ»c§Ç¥²ôÍø#Ý¾¡o¿w?Ùï÷ä8L*¯®ÙuáFï7%í:f3DJ/cûÃ	Å¬ä2N¹ÍÂJì¦Q92e3ò¯ýÒº0glÞÀJ!= §O:õ¤gf"¿a É0ÁmÔ/æ<ÜC]£j}æ3çr(:«2¯aÛ= i]ÙÛ
Æ4Æ4FÕÿF·æL.ÆÄBL7Efïº0X½¦ïæÊË×í|ÕìÈ3m!¬}X{@jëýå>¾×1ù*®¿óJEÃõù'Û¹fWXÜ¯Â;éüáõPÂ<0Üâê¤çA×¡èÓÖ/÷/À7\Vf
Ç!
2qÌR÷ä¥¡â>+|¬mïó
'uF ?´ÅÖå~PR(c Ä¶×ófxÆ¼¤÷!ç¬O5»è=M6Ú¸v1=}!{³7cÀäÍVd¸þáÆ5ñ	(f6sÐõÌÁî= PòØ7ìÜ·åCÔÒöVBÅ<ÜÍõXP¼2ow½R@Ó¼Z5g}Ó¶y¢Í¶c{
ñî#zMe:	¨ähÞË åæhQ}c@Ù¯]K8	8ëhT{Rãä°üñ)n&(øûâòwÊ0×å>ïÐu;!¨ãÀHX;²¶ïôôbuA¡JÎ{¢5ì¨¿3M½¯Bý9^tL­¿¢þ4æVý2ö6Øÿ¬HòÚ¹Æ_Ë7òÕ±ô¢ö°oúØÀzÊ(XPÅcöËLgË"²÷ääºwöÌK	«&ÕÕ= =}Yü= ^µHÅzDã1a@ù»½W'Ý Ì£Q{´#¡Øþ£Rúùå5¾RðÌ<TËgÃ°ù¹4Vcçn¯kklèãp°JWÄn¸´ÂRØWú-Ö°¤þ³ÇÐ-kÏûïÀÎ¼E¤vþN%±èà¼\çìté5Âyêøt8K3WâL¿àô²×ûò](o+ =M	O³d6ú%ñ0ãV¯' úæÞh4i=MÔºþP3"gH9²vý¸Fy4 ì ÂU¸Ü/¶µFE;T¶¶E«B	ôÐ8Î¼WôèNPÑh3Ó5FXT·ï5Fþ0èHSSÉ3/àE UûS2/(\VuëxyºYâ\=}uu9ÝEyhË¡'çÅ¸hëA÷zÿWðàs?Õ?¨g¬Äq6@±æytÆOaGT iu/ÊmüûªèK»$pÇæû ¹ÒåÙW§Zïb9C¬ZH¥Þ-dDi»©á¹ðiôtå®­ÑãÑï;=}ùa¾{HkªÑ²Xpj°èkL¼þñhÄïâò®%"l»C÷áâ¯î)Ã:ÓÝÝ¸d~EEí¹¢JnkgÆéùÒ­hp~¥ÓºäõmøõýAà¡r£ê;µ{ú²£0ùmb«G&ê»«#ûÈe¥¾n6oÂj¢bÂ	néôGç¤Ð¤5sJ2æ6âxÏÀ4ÍÜ¦2ã^RUÓî	q×òEËox¹Ê®äÞè±ÅÀMä% oðÖ¾J.Ðo¨V¿
X8ÇáTXQaäV|ñfÉCdÖ%Ñ(Û/Ìo[Ä±ÌìÞ9<AÆ¹öÞyÈoÉwdZ<±ñV·eßéF»åj;[±æáü«]ä6´]{ÈmfÉn0[Ùhz[	r|ÙOÕwàÿªÕÙÓô[5îhQR9óh«~Òy¾ïPHp·T?çuQnô\xt»Ô9²ÕouH'ÝZò¹¯ðZKéZd( 2íÍf·PýÓ(­1×^ÿ´Ã­~æ²¢©îeõlÅ«{Eè¦Ù=MäJ©SgÝ}gÇo36qïáÚyäÁ#â[0ê	[[®|9®mþßÚ=}7©él[ 7_ÜÕEaÛZ qãbÙ»ØÑì= æ VyóLÞüÎ	JALÛõÈ÷©I4\ogòºAuÏÞ/p1Q rMÚP=  áFÉYàÔq¼= 3ô\Äæñ ²¤©\ÑÞ3×d)Òm·àô%9åÁóÚFãäÌza(ÙÛR	ºw¥¯òdÐøñYÔ!qÑª9ÆaNºDAb,Þå"²t=}0ÂÚo*Ýõ7²yÎÕÔ(Ù0k,ÚnV ä½ñÕË{µÎôY Ô.ºÁsµ·c#9òú]/ã<ù½anùG
E¤êÜhü½Ú4zfìÎýKSÁi4çÛÂ  ¡ÃByBX¤×ê0¸lÈ½ã%p;ù1­7ì(ÃÈ¡÷3¤ìÁyZë¨â8«Uò-édT¯n<h"IßÔ½«?ÆÚ jb,«+J_:×·z ôëöÀ'ê¼X¦s[¤á¢Êímv}çE|ö"ov=}á½jò«â¡È¸¨ë[/i7=Mîý¼g[ûå2ýÅÂo¨5å|¢9
yûG¤¯êAHO5ë¯òêCd!/¶}Ø²jìð¨{¬®bô£êBzÜ¥ÿ;°ôâ¤Á¾5®q+´%&I%£"%låV£Þ:¤Tí'ò'e÷w&­ÌfoÖoê<õwíí¾Q«ÒT7.OAË(N~>¯3F>>ÆÇ0N¶h=}Kà/É/#ù¼5CDpØ¾çôé©&F@wÌPí8ÉâêÖµEÞj'²}lmÂXS¿cê+ùÀèC«xÝ·¡ô¬ð+.«/ÍKw ³ùHÐ5MüiÓzãL¨ýè·ý*>:¬¡Ö(p+÷î-­Ð&å5PÆÿÏ¦=M§¿»à×¢7¨hwû¥FªÃRñ¿ÂøýfÇÀ¬'ÒSÅ8~ó¨+¶ÁB¡Îò§ÂÞBv4Tf§ùê;ÃçïxÆýkp´ÁÈ2|?¬³³TÛoÎ+ïïðM­$t38Q÷ËM<X¯æTÜGIô§´8¨àÁãâ]£wvÞëQ©cæ¢¼Øá¯#:åR¼Òø['xþá"Ê<É»kst92æ f4u ¼ÇJ]%q÷áÒìC5mMsf0T¦ Rër±LÄ/3ÃùÕêcøÄúOÅu³ÿÜüC;5HÓËúZOÀr;ï¤aøæª¯Ðgcôäæ?ºÎ>ÕH¸Ù(eo:TÙQÔ>kuÖm¾xôú=}éO'_Ä_PjM±gQº~µà/Cþf§UÂäëOÑ¸6ZÒsçÑ6)bp¼òdÇ»µªw5)ï|-\Kyl)O@¢±HäXQ»VtÍÄ=}ºS¦ØµËYhm_;êy}¯ñ]×à9
S©5Êe.Ìª,[¤.{JÂ }~ªÑ~sÖ@ù_Îû¬£u*â FJÕ´[cÅlJVPÐ½rçÎ¢4Ö¢1
r¼%¬)L²cw"¤x.åöß¨zv¨ ¼´­__Ø$Ì¿¡¿:)3E©!îæ2¤= ì¯?9ïuí!%GÎM&¢ÐLIªÇ8êè¾ØLªýYøïn¹6}ç';¼x@%mùÏßY\Çd	ÃiÌÒen6E+mº·ýavgã)<êaènüíþqÿäÊ4z÷k<(·?¥½ª8õ>yofL±%»J(¢o¨ÌÇÂ¹J= äøqPÜîÚØÕñè|RØÈ²»ÑÝÞö"mq¹M£eðâ±eÉ ]7'{ÉmÛ7«zUYÇÝh$Q9 Y¿=M?ÜÍr?ÚÖõ>>ÙÔ¡ñSÀrÀÍM}n§u£Z$ù½i}+>ñEêY<ùo!TÁ1ik^xxãÇAáq¯æd[x Y÷(ÜfàÖºo@f¦÷ÉUÞÉvIU
®ÛIÛñÅ^qÄøÀbø×ÉN#«	§ÜÌC¤R/±FxM'ÚJÒiÁYäQÓÉM4ÅÑq^¿²rÉÃ­ÁÆô]'ólyfðÊð{a-m%«gß;ý:6ó*¹ÅÛWë68âÏ"À»ÐRv
+¦µ¨þ4¡îùÚ©·nB- +T#"æ0"K«<2¯Òõ½~v}""Ü\´¢Þ:ÓËDCX¡søÁ}þiîéaûÈ<ß¿2ì²¥â'«Ï_Ï©zW|ë}SÌðÄ¿÷æ"ÍQx½_O¹#(Ó
,ÿÔ ­²qíìX-1ü5XJË0¶Çà«7Òvp}¬%þíª§:@IÜÔ>~¤@Eª xÄ)l#ÌAØ¯o¿òlÎ´(üÎ û@ÍÃÐnÖ¯*îtûBÓÍhæì¥E]ÖËRe¦ufÆÈ+$ÏøHÿ}ô6M  öOÑÌ@×ù+¦¼×+VHSÂ¤á]ó³£;LBX u_®9HÆ<)^¼¶]´rtæÿ:íÿrñëÚÀý=MJÏv%÷ènTfÊbïóä¸@<f(AÐÓbsÀd¥¶¦Éb³;ß/A*gÌo9°¥cË>Ék=}Ú&dPOlULhxí_9§Êióß¹-à©6sçïêqØch¹Ö¾OJQC½[ï!6á}MôåýyØÏs_Ñ <òEeå8ñâE7ÕtÐÇ(JKµ5nîà¿R ÿYh®m9xÐAd©
³ÙUÉzÖi;ýjëÏj³3äÊ³
qÄØâ*æ	ÑÙ(;NGÆ»*?lä°= ±UÈÝÞv±	èÞ³Æo¥°áºAa9ßiea9x³¤Lh×"Ú²yøZð«:H5½1j?µâ\øt*	ËÔ]ßÛ6üé}µGf
= 6zÅð-2r/IP\ï%¾z%= /õÙ÷ZÀãJ­árhãw#éÉÄe}¡Ü"º+73 ÓT7kOVK8æÓCÊHeÕ¨j= !©VoëK¿^£{ªà!µ(~ýþÄsBNt¦ûksqúÔêò³µ¿Jè°oMïð6ç?;¤ÎG^y ±Iväæ\çÔ®.µ¦0¢È dtg,:²¹EIÙ_°*F-LD= ³JI6Ó¤[Îc½©´¼ÇÛÊl
=MÉsGüÚ<8AùÌèzK³?»IÚQÌu|)_$du©=M8^°GNò²Ñ­0xü= :rº{kîQQ}w¾pòÆ"Ñ#~fðE"+íÜlÒQÄZÃE9ü¸Y\TÞ1XªÝ<á4÷þ¤Wø
ÔYç~æ5X30Ï+l4Æ4Æ4Æ4æ§ðþÖ7KR#?B2
VhaÜØ¡Y&k£Û3ùra¡]HßZÏÕbÆhÓ= ÕdÉA>8²»F6àÇ7ZZv¹\ÕYUÔÚOk5 àc½Úc)[1>8d*à½*eÙr	ZçPh°ë¾ÈW¨Ià¸×P<VÚÓU=}B@(¸kjìéëêì¬«ª,)+*,|]¿o¯¯QøJ¡Âra%EõµÕ[û;ë«Ëc#Có³Ó_ÿ?ï¯ÏIð»sÏ·ª¢rÒ~nÎ¦¶lÌtÔ °¨xXùéI!1íMõU¸ÔâIáÃsñ2ÒT= à À?nî°0Ïhç¦&Fw¸×Wn÷Ô©Í£§¢Î¼ÔHQ;?:> +äÁ±Óß~@°På%Å¸ÕV| ý
ö Õ³§ªÒ¦´8A%K?7JF z;Ï×
2>¦<dt= pH;­FÃT@PÈ8×%<ê±*ÑKwç®*+ý¾½ÂXSFUSÂÎ|ôÈí	æöÖÜ±/~üÌ<&@ûïê¾4Èé!@MF§j³SÇ¥ :D=}ÚîÌ,A Põß±=}'Á´Zº?ÊKKKÛÛp38@Ô777ïï«[uà .00ðï¿ÒU
àBÎÎÎ.0pRk9Ë¥c´{·¥p(ôY0X²²ÛD=Mü³³³ÌaÝ}ýÜÐ$JËÐ]\Ùq_YýÆ4ÆtÆÌÆ4ÆF2Ê |ã!{;ÖóÑ!u[8JêÂq&##;Ì3Ñ#õ{æüÖ¾oln²Þ¦Õ¨p2Þ¤½Êz?º-ÊðÎ1HMJïÖwÀt¼cßLåk]$Qñow^ ¡:ÉøòÚJ]©Î¯¹v¸,ÌÏ9uruÈÙñ§]5¿fJ¿hêB±ÙR})Ö¹xØÔg9w^õÈÛÝ mÎ
²%= N	¦ågJ
ÂrÄ#3?d3Ó3õ¼ÕÆ¯ÿi£®´î&U°4î$½Îãú?¾g
-ÎÎ2&xMNÖ¦·@qÄ£Iõë}$RÝïw~ ¢Baøôêb]«*N¯½8)*LÏ=}rö¹ùò}6Ç¦LdÇ¨ì,r³é^}+)V½X)Tg=}^¶¹û"q#lã»:óÒ¿uzòÖ»KßË
uÄQëÏ÷
vÀ¡@±8ñæÝª&¯¼d+&Ï<c2õÃñRñ¤uN5¼OIV¼Gé(òãêùícþîÅb«+p¿»{­ËÜî1ÍKÛös½¿kÐ±ävU£È1ät=}Ëÿªo»z¢KÙæeKÚÜÑzpó½ËßJí;¤Rá?w ¢Gøó÷ÊþÄ(³ûÀÆ(²+'¿Às:­Ð.2#¨ÍP6£Ï rÇ×?j¨ÖP³øUØH3ø=}Ð÷Jÿ¿mF£¤ë(ÁF¢´Ìë-çKþòòî6Á¾KvöÁÀë2¢_ôô²¬4ö/¿*4ôO?ö¾=MÞÒðPÁEtÌéXqE= LéW¨û]1n¼4Æ¨Ã4VEÐÄ4ÆX@-Æ4ÏtE#SìÇ²U@)#MDI= Ìº®<¶|ø¡Éí¶5þz:*"ÉêºD»Û04;¤çÝLÝ@dFmÿòºFÎªE
NÁÍ#Ý¾$ÅA±lÏKýñ=M¥h åQ)ÞÿÆ96%{È\OwÐAÊ;ºË± ÙøFQÞoõT)ù¿rBÂ¾f·guógÃí×vn­6 ¬ªâó@ ë¥ÙÈg²Îð¼DMewùÖªÐUCfd<¯«xEÞ¦4^w1lO*üõwrÍíÈÏjõ¨¼°¥Á×ê'Îw0¢l¯Gë !½èÂMñO	DMë;µFPM	tå¤W£ðSTx²)Ö¤÷°ÔÆÑ§XÿQ÷ßÿðlÀµÄá^UC¤VÔhGB¯h 2ä©vQDÕRÌÁõ¡c9EÙsÓáà¯t¼åAùaÌ{Èá;¨$$ü	Õ¨-ïüJ£¤j¬â ×\uúYoRB¦w!=}Ð/Q,8e)¢ZYaÀ­ÓÚ2(¶7?¨W§¦Ã  Ó¦(M÷ròÔ}$½£"ñì2àzmºeDàÖuâôÊm°<Gºµw ÊÔu NÊwP(viYY[a?¸ÎeåÂéo,}Æÿª³¦=MôßÂ¦,Ïs N¨Tid¼{¡åò1r
ÿ»Äå3ñäqä¼ Áç21v
ÿ¼Ôå SñèVÒy%lÒ¼w"@òÌw#¤@Îw$Ä@Ðw%ä@"Ró°øÀTm5°ú\e\ÚbÙi¬GF*¿±8?(8¾0HESw(@ÄÏ(V1'L
DEGT
DE?R	Ä·Eóx?"RÄ7EóK¹°E#ä¶R
¨Ï>$2îS×	EChS×
ÈECxS!×ECS%×HEC	$= 	$h
$p
$x$D,(W?Øw<
÷</	ïÆhÔ2,7'9'=}Å'A'EEG9G=}ÇGAGEG¿¹o¿»¿½¯¿¿Ï¿Áï¿Ã¿Å/¿ÇOéÞ¥½||²"¥Ïíþ¥¾¼²$µOùdútûüý¤þ´ÿÄ Ôäô$4DTe	]tå	ee
m´å
uÔe!}ôå#Bd·väMªY©eí±WWÕGï%èV<U5øP?VRÈWøÓÿ-ôS,¨S¤BÒ}ø=}îUëÀK¦7"èQkØ;¬UãÈJH¿
gÁYYºy_;{)áp½¤'W5¼GPóT&@ÌHXEzT!·øET#7ET%·8ET'7XÑix;UáJ~7øÑmø;®UãÀJ7Ñqx<¾Uå J78Ñuø<ÎUç@J7 XMyÖ¡+èM}Ö¢È+øMÖ£+MÖ¤H+MÖ¥,(MÖ¦ÈXVúNÖ§,HMÖ¨H,XºgcYYÚyanLÏSKdá= ;ÜÑz×á;äÑ|Wá ;ìÑ~×âÀ;ôÑWâà;üÑ×ã ;ÑWã ;Ñ×ä@;ÑWä= <Ñ×å<$ÑWå <,Ñ×æÀ<4ÑWæà<<Ñ×ç <DÑWç <LÑ×è@<TÑW(= KÜÕzØ!KäÕ|X! ?LîR$Õ¿×8òX%à? LþR,ÕÃ×8óØ& ?ÀLR4ÕÇ×8ôX&= @àLR<ÕË×8Xx¸ØøÖT,OeyßZºQt4v4Æåö-ÇÃ¦ÆôºÆT«ÄÕ,,U¬ÀïÌ~·µFÒ2;Çøa/½÷d¢DµH{<EÉøÝÄ!~·ë¿é¦ÇOçìEJéÈD%z"%BÇPÚ,uIñx]4÷/¦È¶<áÕüÆÎè¨ÞÁ8Þ÷ðNÇÉ
JÏ8ð{=M´E«¤1ÇJËìFN	ÈAÇ4ÉÀà¦Ð)<×mu@ÒÛ//ª^1?	(ÝÃ
·é»ÙfÇÍ«âbÏÒ°{Î±;!ÇN÷c¬ELáHCºÞz aÀ, Ã%ÉïU}¡ü'PÖÎö¼cæ6pÿ.pÔªÚ"4£¦=M4Üoþ,«ðÔ®ÿú§ÌôP®óÃ Ö§¨¶>¦3Ex,2÷M¸	Ð(÷'YÝl}·IQ(h \ûÀUdX2ÏyÃÈ¹óÜ%k¨ôªoâ°ÿð¢¯bïþ"L+¾õ¾ë­BÀóÎ[ý1ÅjKtÆ
Ç#N2ÃztÇqtÈ½.SôÇrse ý[v±{Þÿ±|­ço|ihléûYÅi}¬üú?ã«,±¤~-0­ÄÞ".ÃýÞ;íCÂûî«.sÁÿæº(÷IÝ¡lMØC)â802QÎgXg_¤¬ý§	Ñ²#bð}¨îZ»ý¯2#äé¸ÏÚ»¾*y­Ûun³£ªùàyÊîÃmª£ûý­¬0¸xÏ^z=MùØkwR´rPY|°i_YÑ'Æ4÷Ð(Æ41Æ4Û33Æ­&XCÏëRáËsÎ´ApW±@raö}OkDâ>Õ»z|okâB=}xR¥»;èr!@WA0VèÒJßõ´Ò§ø. E¼MºÛ*ð~#kÀâ¦Çæf??,MïÂÇ®8ÿºÐ{ÑÑÁ}Í½½zèð¨¤>þ2j®WÆv§Rw{Xª«ÕsÞðsð&?¾L¶tuôFôF A¦,øÇ	µÌîSÏî#à®òÅhÇý£±^ÞM¥Çÿë#¿ííï= ÏÓ§e4=}dû|$66ÃóõDöDõ%àe½ßd=MðA/¸¦VÙCª>Ã¤-æ -þIììk²Â5­§oÙ¬w·r5q1i«p3x=}4§¿®9yÍÐÈ(¼®Ò-ÔÏ33N3æ1¤æ¿ñ%µÅ8Õ*6³Ô.ÀÄ¢Îå¬fÝýÝ«õ "¼pÌNzÚ6ÚÚ&zü×<äÅ ²>4b¶júiki']û)¡~Þe­Ðaüä[ex¶ ºþÄ¹½»ÃÇºÂ¾Æ¼ÄÄÀÈH9AA=}ýLTôËsÿøs¡²X_i,?ª+®"¢ð¹õªÍY<OóøC¥§ :SÓæÖã&Ieyßób ðØ_}ß¬"=M£Þw°ôÛZ©LôPm¤ÂiXAP=}S=}å÷)P¯»Y-ÞÖ6$ÂiòO@uòxè,JEFe×/ Å[áX$Ø&TG$Â¡}8Y`
  });
  var HEAP8, HEAP16, HEAP32, HEAPU8, HEAPU16, HEAPU32, HEAPF32, HEAPF64;
  var wasmMemory, buffer, wasmTable;
  function updateGlobalBufferAndViews(b) {
    buffer = b;
    HEAP8 = new Int8Array(b);
    HEAP16 = new Int16Array(b);
    HEAP32 = new Int32Array(b);
    HEAPU8 = new Uint8Array(b);
    HEAPU16 = new Uint16Array(b);
    HEAPU32 = new Uint32Array(b);
    HEAPF32 = new Float32Array(b);
    HEAPF64 = new Float64Array(b);
  }
  function JS_cos(x) {
    return Math.cos(x);
  }
  function JS_exp(x) {
    return Math.exp(x);
  }
  function _emscripten_memcpy_big(dest, src, num) {
    HEAPU8.copyWithin(dest, src, src + num);
  }
  function abortOnCannotGrowMemory(requestedSize) {
    abort("OOM");
  }
  function _emscripten_resize_heap(requestedSize) {
    var oldSize = HEAPU8.length;
    requestedSize = requestedSize >>> 0;
    abortOnCannotGrowMemory(requestedSize);
  }
  var asmLibraryArg = {
    "b": JS_cos,
    "a": JS_exp,
    "d": _emscripten_memcpy_big,
    "c": _emscripten_resize_heap
  };
  function initRuntime(asm) {
    asm["f"]();
  }
  var imports = {
    "a": asmLibraryArg
  };
  var _opus_frame_decoder_create, _malloc, _opus_frame_decode_float_deinterleaved, _opus_frame_decoder_destroy, _free;
  this.setModule = data => {
    WASMAudioDecoderCommon.setModule(EmscriptenWASM, data);
  };
  this.getModule = () => WASMAudioDecoderCommon.getModule(EmscriptenWASM);
  this.instantiate = () => {
    this.getModule().then(wasm => WebAssembly.instantiate(wasm, imports)).then(instance => {
      var asm = instance.exports;
      _opus_frame_decoder_create = asm["g"];
      _malloc = asm["h"];
      _opus_frame_decode_float_deinterleaved = asm["i"];
      _opus_frame_decoder_destroy = asm["j"];
      _free = asm["k"];
      wasmTable = asm["l"];
      wasmMemory = asm["e"];
      updateGlobalBufferAndViews(wasmMemory.buffer);
      initRuntime(asm);
      ready();
    });
    this.ready = new Promise(resolve => {
      ready = resolve;
    }).then(() => {
      this.HEAP = buffer;
      this.malloc = _malloc;
      this.free = _free;
      this.opus_frame_decoder_create = _opus_frame_decoder_create;
      this.opus_frame_decode_float_deinterleaved = _opus_frame_decode_float_deinterleaved;
      this.opus_frame_decoder_destroy = _opus_frame_decoder_destroy;
    });
    return this;
  };
}

},{}],81:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = OpusDecoder;
var _common = require("@wasm-audio-decoders/common");
var _EmscriptenWasm = _interopRequireDefault(require("./EmscriptenWasm.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function OpusDecoder(options = {}) {
  // static properties
  if (!OpusDecoder.errors) {
    // prettier-ignore
    Object.defineProperties(OpusDecoder, {
      errors: {
        value: new Map([[-1, "OPUS_BAD_ARG: One or more invalid/out of range arguments"], [-2, "OPUS_BUFFER_TOO_SMALL: Not enough bytes allocated in the buffer"], [-3, "OPUS_INTERNAL_ERROR: An internal error was detected"], [-4, "OPUS_INVALID_PACKET: The compressed data passed is corrupted"], [-5, "OPUS_UNIMPLEMENTED: Invalid/unsupported request number"], [-6, "OPUS_INVALID_STATE: An encoder or decoder structure is invalid or already freed"], [-7, "OPUS_ALLOC_FAIL: Memory allocation has failed"]])
      }
    });
  }

  // injects dependencies when running as a web worker
  // async
  this._init = () => new this._WASMAudioDecoderCommon(this).instantiate(this._EmscriptenWASM, this._module).then(common => {
    this._common = common;
    this._inputBytes = 0;
    this._outputSamples = 0;
    this._frameNumber = 0;
    this._input = this._common.allocateTypedArray(this._inputSize, Uint8Array);
    this._output = this._common.allocateTypedArray(this._outputChannels * this._outputChannelSize, Float32Array);
    const mapping = this._common.allocateTypedArray(this._channels, Uint8Array);
    mapping.buf.set(this._channelMappingTable);
    this._decoder = this._common.wasm.opus_frame_decoder_create(this._sampleRate, this._channels, this._streamCount, this._coupledStreamCount, mapping.ptr, this._preSkip, this._forceStereo);
  });
  Object.defineProperty(this, "ready", {
    enumerable: true,
    get: () => this._ready
  });

  // async
  this.reset = () => {
    this.free();
    return this._init();
  };
  this.free = () => {
    this._common.free();
    this._common.wasm.opus_frame_decoder_destroy(this._decoder);
    this._common.wasm.free(this._decoder);
  };
  this._decode = opusFrame => {
    if (!(opusFrame instanceof Uint8Array)) throw Error("Data to decode must be Uint8Array. Instead got " + typeof opusFrame);
    this._input.buf.set(opusFrame);
    let samplesDecoded = this._common.wasm.opus_frame_decode_float_deinterleaved(this._decoder, this._input.ptr, opusFrame.length, this._output.ptr);
    let error;
    if (samplesDecoded < 0) {
      error = "libopus " + samplesDecoded + " " + (OpusDecoder.errors.get(samplesDecoded) || "Unknown Error");
      console.error(error);
      samplesDecoded = 0;
    }
    return {
      outputBuffer: this._common.getOutputChannels(this._output.buf, this._outputChannels, samplesDecoded),
      samplesDecoded: samplesDecoded,
      error: error
    };
  };
  this.decodeFrame = opusFrame => {
    let errors = [];
    const decoded = this._decode(opusFrame);
    if (decoded.error) this._common.addError(errors, decoded.error, opusFrame.length, this._frameNumber, this._inputBytes, this._outputSamples);
    this._frameNumber++;
    this._inputBytes += opusFrame.length;
    this._outputSamples += decoded.samplesDecoded;
    return this._WASMAudioDecoderCommon.getDecodedAudioMultiChannel(errors, [decoded.outputBuffer], this._outputChannels, decoded.samplesDecoded, this._sampleRate);
  };
  this.decodeFrames = opusFrames => {
    let outputBuffers = [],
      errors = [],
      samplesDecoded = 0,
      i = 0;
    while (i < opusFrames.length) {
      const opusFrame = opusFrames[i++];
      const decoded = this._decode(opusFrame);
      outputBuffers.push(decoded.outputBuffer);
      samplesDecoded += decoded.samplesDecoded;
      if (decoded.error) this._common.addError(errors, decoded.error, opusFrame.length, this._frameNumber, this._inputBytes, this._outputSamples);
      this._frameNumber++;
      this._inputBytes += opusFrame.length;
      this._outputSamples += decoded.samplesDecoded;
    }
    return this._WASMAudioDecoderCommon.getDecodedAudioMultiChannel(errors, outputBuffers, this._outputChannels, samplesDecoded, this._sampleRate);
  };

  // injects dependencies when running as a web worker
  this._isWebWorker = OpusDecoder.isWebWorker;
  this._WASMAudioDecoderCommon = OpusDecoder.WASMAudioDecoderCommon || _common.WASMAudioDecoderCommon;
  this._EmscriptenWASM = OpusDecoder.EmscriptenWASM || _EmscriptenWasm.default;
  this._module = OpusDecoder.module;
  const MAX_FORCE_STEREO_CHANNELS = 8;
  const isNumber = param => typeof param === "number";
  const sampleRate = options.sampleRate;
  const channels = options.channels;
  const streamCount = options.streamCount;
  const coupledStreamCount = options.coupledStreamCount;
  const channelMappingTable = options.channelMappingTable;
  const preSkip = options.preSkip;
  const forceStereo = options.forceStereo ? 1 : 0;

  // channel mapping family >= 1
  if (channels > 2 && (!isNumber(streamCount) || !isNumber(coupledStreamCount) || !Array.isArray(channelMappingTable))) {
    throw new Error("Invalid Opus Decoder Options for multichannel decoding.");
  }

  // libopus sample rate
  this._sampleRate = [8e3, 12e3, 16e3, 24e3, 48e3].includes(sampleRate) ? sampleRate : 48000;

  // channel mapping family 0
  this._channels = isNumber(channels) ? channels : 2;
  this._streamCount = isNumber(streamCount) ? streamCount : 1;
  this._coupledStreamCount = isNumber(coupledStreamCount) ? coupledStreamCount : this._channels - 1;
  this._channelMappingTable = channelMappingTable || (this._channels === 2 ? [0, 1] : [0]);
  this._preSkip = preSkip || 0;
  this._forceStereo = channels <= MAX_FORCE_STEREO_CHANNELS && channels != 2 ? forceStereo : 0;
  this._inputSize = 32000 * 0.12 * this._channels; // 256kbs per channel
  this._outputChannelSize = 120 * 48;
  this._outputChannels = this._forceStereo ? 2 : this._channels;
  this._ready = this._init();
  return this;
}

},{"./EmscriptenWasm.js":80,"@wasm-audio-decoders/common":19}],82:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _common = require("@wasm-audio-decoders/common");
var _EmscriptenWasm = _interopRequireDefault(require("./EmscriptenWasm.js"));
var _OpusDecoder = _interopRequireDefault(require("./OpusDecoder.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class OpusDecoderWebWorker extends _common.WASMAudioDecoderWorker {
  constructor(options) {
    super(options, "opus-decoder", _OpusDecoder.default, _EmscriptenWasm.default);
  }
  async decodeFrame(data) {
    return this.postToDecoder("decodeFrame", data);
  }
  async decodeFrames(data) {
    return this.postToDecoder("decodeFrames", data);
  }
}
exports.default = OpusDecoderWebWorker;

},{"./EmscriptenWasm.js":80,"./OpusDecoder.js":81,"@wasm-audio-decoders/common":19}],83:[function(require,module,exports){
exports.endianness = function () { return 'LE' };

exports.hostname = function () {
    if (typeof location !== 'undefined') {
        return location.hostname
    }
    else return '';
};

exports.loadavg = function () { return [] };

exports.uptime = function () { return 0 };

exports.freemem = function () {
    return Number.MAX_VALUE;
};

exports.totalmem = function () {
    return Number.MAX_VALUE;
};

exports.cpus = function () { return [] };

exports.type = function () { return 'Browser' };

exports.release = function () {
    if (typeof navigator !== 'undefined') {
        return navigator.appVersion;
    }
    return '';
};

exports.networkInterfaces
= exports.getNetworkInterfaces
= function () { return {} };

exports.arch = function () { return 'javascript' };

exports.platform = function () { return 'browser' };

exports.tmpdir = exports.tmpDir = function () {
    return '/tmp';
};

exports.EOL = '\n';

exports.homedir = function () {
	return '/'
};

},{}],84:[function(require,module,exports){
/**
 * @module pcm-convert
 */
'use strict'

var assert = require('assert')
var isBuffer = require('is-buffer')
var format = require('audio-format')
var extend = require('object-assign')
var isAudioBuffer = require('is-audio-buffer')

module.exports = convert

function convert (buffer, from, to, target) {
	assert(buffer, 'First argument should be data')
	assert(from, 'Second argument should be format string or object')

	//quick ignore
	if (from === to) {
		return buffer
	}

	//2-containers case
	if (isContainer(from)) {
		target = from
		to = format.detect(target)
		from = format.detect(buffer)
	}
	//if no source format defined, just target format
	else if (to === undefined && target === undefined) {
		to = getFormat(from)
		from = format.detect(buffer)
	}
	//if no source format but container is passed with from as target format
	else if (isContainer(to)) {
		target = to
		to = getFormat(from)
		from = format.detect(buffer)
	}
	//all arguments
	else {
		var inFormat = getFormat(from)
		var srcFormat = format.detect(buffer)
		srcFormat.dtype = inFormat.type === 'arraybuffer' ? srcFormat.type : inFormat.type
		from = extend(inFormat, srcFormat)

		var outFormat = getFormat(to)
		var dstFormat = format.detect(target)
		if (outFormat.type) {
			dstFormat.dtype = outFormat.type === 'arraybuffer' ? (dstFormat.type || from.dtype) : outFormat.type
		}
		to = extend(outFormat, dstFormat)
	}

	if (to.channels == null && from.channels != null) {
		to.channels = from.channels
	}

	if (to.type == null) {
		to.type = from.type
		to.dtype = from.dtype
	}

	if (to.interleaved != null && from.channels == null) {
		from.channels = 2
	}

	//ignore same format
	if (from.type === to.type &&
		from.interleaved === to.interleaved &&
		from.endianness === to.endianness) return buffer

	normalize(from)
	normalize(to)

	//audio-buffer-list/audio types
	if (buffer.buffers || (buffer.buffer && buffer.buffer.buffers)) {
		//handle audio
		if (buffer.buffer) buffer = buffer.buffer

		//handle audiobufferlist
		if (buffer.buffers) buffer = buffer.join()
	}

	var src
	//convert buffer/alike to arrayBuffer
	if (isAudioBuffer(buffer)) {
		if (buffer._data) src = buffer._data
		else {
			src = new Float32Array(buffer.length * buffer.numberOfChannels)
			for (var c = 0, l = buffer.numberOfChannels; c < l; c++) {
				src.set(buffer.getChannelData(c), buffer.length * c)
			}
		}
	}
	else if (buffer instanceof ArrayBuffer) {
		src = new (dtypeClass[from.dtype])(buffer)
	}
	else if (isBuffer(buffer)) {
		if (buffer.byteOffset != null) src = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
		else src = buffer.buffer;

		src = new (dtypeClass[from.dtype])(src)
	}
	//typed arrays are unchanged as is
	else {
		src = buffer
	}

	//dst is automatically filled with mapped values
	//but in some cases mapped badly, e. g. float → int(round + rotate)
	var dst = to.type === 'array' ? Array.from(src) : new (dtypeClass[to.dtype])(src)

	//if range differ, we should apply more thoughtful mapping
	if (from.max !== to.max) {
		var fromRange = from.max - from.min, toRange = to.max - to.min
		for (var i = 0, l = src.length; i < l; i++) {
			var value = src[i]

			//ignore not changed range
			//bring to 0..1
			var normalValue = (value - from.min) / fromRange

			//bring to new format ranges
			value = normalValue * toRange + to.min

			//clamp (buffers do not like values outside of bounds)
			dst[i] = Math.max(to.min, Math.min(to.max, value))
		}
	}

	//reinterleave, if required
	if (from.interleaved != to.interleaved) {
		var channels = from.channels
		var len = Math.floor(src.length / channels)

		//deinterleave
		if (from.interleaved && !to.interleaved) {
			dst = dst.map(function (value, idx, data) {
				var offset = idx % len
				var channel = ~~(idx / len)

				return data[offset * channels + channel]
			})
		}
		//interleave
		else if (!from.interleaved && to.interleaved) {
			dst = dst.map(function (value, idx, data) {
				var offset = ~~(idx / channels)
				var channel = idx % channels

				return data[channel * len + offset]
			})
		}
	}

	//ensure endianness
	if (to.dtype != 'array' && to.dtype != 'int8' && to.dtype != 'uint8' && from.endianness && to.endianness && from.endianness !== to.endianness) {
		var le = to.endianness === 'le'
		var view = new DataView(dst.buffer)
		var step = dst.BYTES_PER_ELEMENT
		var methodName = 'set' + to.dtype[0].toUpperCase() + to.dtype.slice(1)
		for (var i = 0, l = dst.length; i < l; i++) {
			view[methodName](i*step, dst[i], le)
		}
	}

	if (to.type === 'audiobuffer') {
		//TODO
	}


	if (target) {
		if (Array.isArray(target)) {
			for (var i = 0; i < dst.length; i++) {
				target[i] = dst[i]
			}
		}
		else if (target instanceof ArrayBuffer) {
			var
			targetContainer = new dtypeClass[to.dtype](target)
			targetContainer.set(dst)
			target = targetContainer
		}
		else {
			target.set(dst)
		}
		dst = target
	}

	if (to.type === 'arraybuffer' || to.type === 'buffer') dst = dst.buffer

	return dst
}

function getFormat (arg) {
	return typeof arg === 'string' ? format.parse(arg) : format.detect(arg)
}

function isContainer (arg) {
	return typeof arg != 'string' && (Array.isArray(arg) || ArrayBuffer.isView(arg) || arg instanceof ArrayBuffer)
}


var dtypeClass = {
	'uint8': Uint8Array,
	'uint8_clamped': Uint8ClampedArray,
	'uint16': Uint16Array,
	'uint32': Uint32Array,
	'int8': Int8Array,
	'int16': Int16Array,
	'int32': Int32Array,
	'float32': Float32Array,
	'float64': Float64Array,
	'array': Array,
	'arraybuffer': Uint8Array,
	'buffer': Uint8Array,
}

var defaultDtype = {
	'float32': 'float32',
	'audiobuffer': 'float32',
	'ndsamples': 'float32',
	'ndarray': 'float32',
	'float64': 'float64',
	'buffer': 'uint8',
	'arraybuffer': 'uint8',
	'uint8': 'uint8',
	'uint8_clamped': 'uint8',
	'uint16': 'uint16',
	'uint32': 'uint32',
	'int8': 'int8',
	'int16': 'int16',
	'int32': 'int32',
	'array': 'array'
}

//make sure all format properties are present
function normalize (obj) {
	if (!obj.dtype) {
		obj.dtype = defaultDtype[obj.type] || 'array'
	}

	//provide limits
	switch (obj.dtype) {
		case 'float32':
		case 'float64':
		case 'audiobuffer':
		case 'ndsamples':
		case 'ndarray':
			obj.min = -1
			obj.max = 1
			break;
		case 'uint8':
			obj.min = 0
			obj.max = 255
			break;
		case 'uint16':
			obj.min = 0
			obj.max = 65535
			break;
		case 'uint32':
			obj.min = 0
			obj.max = 4294967295
			break;
		case 'int8':
			obj.min = -128
			obj.max = 127
			break;
		case 'int16':
			obj.min = -32768
			obj.max = 32767
			break;
		case 'int32':
			obj.min = -2147483648
			obj.max = 2147483647
			break;
		default:
			obj.min = -1
			obj.max = 1
			break;
	}

	return obj
}

},{"assert":23,"audio-format":33,"is-audio-buffer":68,"is-buffer":85,"object-assign":75}],85:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"dup":34}],86:[function(require,module,exports){
'use strict'


module.exports = function pick (src, props, keepRest) {
	var result = {}, prop, i

	if (typeof props === 'string') props = toList(props)
	if (Array.isArray(props)) {
		var res = {}
		for (i = 0; i < props.length; i++) {
			res[props[i]] = true
		}
		props = res
	}

	// convert strings to lists
	for (prop in props) {
		props[prop] = toList(props[prop])
	}

	// keep-rest strategy requires unmatched props to be preserved
	var occupied = {}

	for (prop in props) {
		var aliases = props[prop]

		if (Array.isArray(aliases)) {
			for (i = 0; i < aliases.length; i++) {
				var alias = aliases[i]

				if (keepRest) {
					occupied[alias] = true
				}

				if (alias in src) {
					result[prop] = src[alias]

					if (keepRest) {
						for (var j = i; j < aliases.length; j++) {
							occupied[aliases[j]] = true
						}
					}

					break
				}
			}
		}
		else if (prop in src) {
			if (props[prop]) {
				result[prop] = src[prop]
			}

			if (keepRest) {
				occupied[prop] = true
			}
		}
	}

	if (keepRest) {
		for (prop in src) {
			if (occupied[prop]) continue
			result[prop] = src[prop]
		}
	}

	return result
}

var CACHE = {}

function toList(arg) {
	if (CACHE[arg]) return CACHE[arg]
	if (typeof arg === 'string') {
		arg = CACHE[arg] = arg.split(/\s*,\s*|\s+/)
	}
	return arg
}

},{}],87:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],88:[function(require,module,exports){
module.exports={
"8000": 8000,
"11025": 11025,
"16000": 16000,
"22050": 22050,
"44100": 44100,
"48000": 48000,
"88200": 88200,
"96000": 96000,
"176400": 176400,
"192000": 192000,
"352800": 352800,
"384000": 384000
}

},{}],89:[function(require,module,exports){
/**
 * @module  string-to-arraybuffer
 */

'use strict'

var atob = require('atob-lite')
var isBase64 = require('is-base64')

module.exports = function stringToArrayBuffer (arg) {
	if (typeof arg !== 'string') throw Error('Argument should be a string')

	//valid data uri
	if (/^data\:/i.test(arg)) return decode(arg)

	//base64
	if (isBase64(arg)) arg = atob(arg)

	return str2ab(arg)
}

function str2ab (str) {
	var array = new Uint8Array(str.length);
	for(var i = 0; i < str.length; i++) {
		array[i] = str.charCodeAt(i);
	}
	return array.buffer
}

function decode(uri) {
	// strip newlines
	uri = uri.replace(/\r?\n/g, '');

	// split the URI up into the "metadata" and the "data" portions
	var firstComma = uri.indexOf(',');
	if (-1 === firstComma || firstComma <= 4) throw new TypeError('malformed data-URI');

	// remove the "data:" scheme and parse the metadata
	var meta = uri.substring(5, firstComma).split(';');

	var base64 = false;
	var charset = 'US-ASCII';
	for (var i = 0; i < meta.length; i++) {
		if ('base64' == meta[i]) {
			base64 = true;
		} else if (0 == meta[i].indexOf('charset=')) {
			charset = meta[i].substring(8);
		}
	}

	// get the encoded data portion and decode URI-encoded chars
	var data = unescape(uri.substring(firstComma + 1));

	if (base64) data = atob(data)

	var abuf = str2ab(data)

	abuf.type = meta[0] || 'text/plain'
	abuf.charset = charset

	return abuf
}

},{"atob-lite":27,"is-base64":69}]},{},[1])(1)
});
