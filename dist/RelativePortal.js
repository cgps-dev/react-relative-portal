'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lodash = require('lodash.throttle');

var _lodash2 = _interopRequireDefault(_lodash);

var _exenv = require('exenv');

var _Portal = require('./Portal');

var _Portal2 = _interopRequireDefault(_Portal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var listeners = {};

function fireListeners() {
  Object.keys(listeners).forEach(function (key) {
    return listeners[key]();
  });
}

function getPageOffset() {
  return {
    x: window.pageXOffset !== undefined ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft,
    y: window.pageYOffset !== undefined ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop
  };
}

function initDOMListener() {
  document.body.addEventListener('mousewheel', (0, _lodash2.default)(fireListeners, 100, {
    leading: true,
    trailing: true
  }));
  window.addEventListener('resize', (0, _lodash2.default)(fireListeners, 50, {
    leading: true,
    trailing: true
  }));
}

if (_exenv.canUseDOM) {
  if (document.body) {
    initDOMListener();
  } else {
    document.addEventListener('DOMContentLoaded', initDOMListener);
  }
}

var listenerIdCounter = 0;
function subscribe(fn) {
  listenerIdCounter += 1;
  var id = listenerIdCounter;
  listeners[id] = fn;
  return function () {
    return delete listeners[id];
  };
}

var RelativePortal = function (_React$Component) {
  _inherits(RelativePortal, _React$Component);

  function RelativePortal() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, RelativePortal);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = RelativePortal.__proto__ || Object.getPrototypeOf(RelativePortal)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      right: 0,
      left: 0,
      bottom: 0,
      top: 0
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(RelativePortal, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      this.handleScroll = function () {
        if (_this2.element) {
          var rect = _this2.element.getBoundingClientRect();
          var pageOffset = getPageOffset();

          var bottom = document.documentElement.clientHeight - rect.bottom - pageOffset.y;
          var top = pageOffset.y + rect.top;
          var right = document.documentElement.clientWidth - rect.right - pageOffset.x;
          var left = pageOffset.x + rect.left;

          if (top !== _this2.state.top || bottom !== _this2.state.bottom || left !== _this2.state.left || right !== _this2.state.right) {
            _this2.setState({ left: left, top: top, right: right, bottom: bottom });
          }
        }
      };
      this.unsubscribe = subscribe(this.handleScroll);
      this.handleScroll();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.handleScroll();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.unsubscribe();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props = this.props,
          Comp = _props.component,
          left = _props.left,
          right = _props.right,
          fullWidth = _props.fullWidth,
          top = _props.top,
          bottom = _props.bottom,
          fullHeight = _props.fullHeight,
          props = _objectWithoutProperties(_props, ['component', 'left', 'right', 'fullWidth', 'top', 'bottom', 'fullHeight']);

      var fromLeftOrRight = right !== undefined ? { right: this.state.right + right } : { left: this.state.left + left };

      var horizontalPosition = fullWidth ? { right: this.state.right + right, left: this.state.left + left } : fromLeftOrRight;

      var fromTopOrBottom = bottom !== undefined ? { bottom: this.state.bottom + bottom } : { top: this.state.top + top };

      var verticalPosition = fullHeight ? { bottom: this.state.bottom + bottom, top: this.state.top + top } : fromTopOrBottom;

      return _react2.default.createElement(
        Comp,
        {
          ref: function ref(element) {
            _this3.element = element;
          }
        },
        _react2.default.createElement(
          _Portal2.default,
          props,
          _react2.default.createElement(
            'div',
            {
              style: _extends({
                position: 'absolute'
              }, horizontalPosition, verticalPosition)
            },
            this.props.children
          )
        )
      );
    }
  }]);

  return RelativePortal;
}(_react2.default.Component);

RelativePortal.propTypes = {
  right: _propTypes2.default.number,
  left: _propTypes2.default.number,
  fullWidth: _propTypes2.default.bool,
  top: _propTypes2.default.number,
  bottom: _propTypes2.default.number,
  fullHeight: _propTypes2.default.bool,
  children: _propTypes2.default.any,
  onOutClick: _propTypes2.default.func,
  component: _propTypes2.default.string.isRequired
};
RelativePortal.defaultProps = {
  left: 0,
  top: 0,
  component: 'span'
};
exports.default = RelativePortal;

