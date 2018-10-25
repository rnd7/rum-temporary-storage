'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var rumStorage = require('@rnd7/rum-storage');

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);

      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(receiver);
      }

      return desc.value;
    };
  }

  return _get(target, property, receiver || target);
}

var TEMPORARY_STORAGE_DEFAULTS = {
  scheduler: true,
  ttl: 1000 * 60 * 60 * 24,
  touchOnFind: true,
  touchOnList: true
};
var TemporaryStorage =
/*#__PURE__*/
function (_Storage) {
  _inherits(TemporaryStorage, _Storage);

  function TemporaryStorage(opts) {
    var _this;

    _classCallCheck(this, TemporaryStorage);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TemporaryStorage).call(this, Object.assign({}, TEMPORARY_STORAGE_DEFAULTS, opts)));
    _this._touched = {};
    _this._wipe = _this.wipe.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._nextWipe = 0;
    _this._lastWipe = 0;
    return _this;
  }

  _createClass(TemporaryStorage, [{
    key: "schedule",
    value: function schedule(time) {
      if (!this._scheduler) return;

      if (!this._nextWipe || this._nextWipe > time) {
        var now = Date.now();
        this._nextWipe = time; //Math.max(this._lastWipe + this.minWipeInterval, time)

        if (this._scheduled) this._scheduled = clearTimeout(this._scheduled);
        this._scheduled = setTimeout(this._wipe, this._nextWipe - now);
      }
    }
  }, {
    key: "wipe",
    value: function wipe() {
      var now = Date.now();
      var limit = now - this.ttl;
      var next = 0;

      for (var sid in this._touched) {
        var t = this._touched[sid];
        if (t <= limit) this.remove(sid);else if (next == 0 || t < next) next = t;
      }

      this._nextWipe = 0;
      this._lastWipe = now;
      if (next) this.schedule(next + this.ttl);
    }
  }, {
    key: "touch",
    value: function touch(sid) {
      var now = Date.now();
      this._touched[sid] = now;
      this.schedule(now + this.ttl);
    }
  }, {
    key: "insert",
    value: function insert(record) {
      var _this2 = this;

      return _get(_getPrototypeOf(TemporaryStorage.prototype), "insert", this).call(this, record).then(function (result) {
        _this2.touch(_this2.indexIn(record));

        return result;
      });
    }
  }, {
    key: "list",
    value: function list() {
      var _this3 = this;

      return _get(_getPrototypeOf(TemporaryStorage.prototype), "list", this).call(this).then(function (result) {
        if (_this3.touchOnList) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = result[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var index = _step.value;

              _this3.touch(index);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }

        return result;
      });
    }
  }, {
    key: "find",
    value: function find(recordOrIndex) {
      var _this4 = this;

      return _get(_getPrototypeOf(TemporaryStorage.prototype), "find", this).call(this, recordOrIndex).then(function (result) {
        if (_this4.touchOnFind) {
          var index;
          if (typeof recordOrIndex === "string") index = recordOrIndex;else index = _this4.indexIn(recordOrIndex);

          _this4.touch(index);
        }

        return result;
      });
    }
  }, {
    key: "update",
    value: function update(record) {
      var _this5 = this;

      return _get(_getPrototypeOf(TemporaryStorage.prototype), "update", this).call(this, record).then(function (result) {
        _this5.touch(_this5.indexIn(record));

        return result;
      });
    }
  }, {
    key: "upsert",
    value: function upsert(record) {
      var index = this.indexIn(record);
      if (this._cache.hasOwnProperty(index)) return this.update(record);
      return this.insert(record);
    }
  }, {
    key: "replace",
    value: function replace(record) {
      var _this6 = this;

      return _get(_getPrototypeOf(TemporaryStorage.prototype), "replace", this).call(this, record).then(function (result) {
        _this6.touch(_this6.indexIn(record));

        return result;
      });
    }
  }, {
    key: "remove",
    value: function remove(recordOrIndex) {
      var _this7 = this;

      var index;
      if (typeof recordOrIndex === "string") index = recordOrIndex;else index = this.indexIn(recordOrIndex);
      return _get(_getPrototypeOf(TemporaryStorage.prototype), "remove", this).call(this, recordOrIndex).then(function (result) {
        delete _this7._touched[index];
        return result;
      });
    }
  }, {
    key: "scheduler",
    set: function set(val) {
      this._scheduler = val;

      if (!this._scheduler && this._scheduled) {
        this._scheduled = clearTimeout(this._scheduled);
      } else if (!this._scheduled) {
        this.wipe();
      }
    },
    get: function get$$1() {
      return this._scheduler;
    }
  }]);

  return TemporaryStorage;
}(rumStorage.Storage);

exports.TEMPORARY_STORAGE_DEFAULTS = TEMPORARY_STORAGE_DEFAULTS;
exports.TemporaryStorage = TemporaryStorage;
//# sourceMappingURL=rum-temporary-storage-cjs.js.map
