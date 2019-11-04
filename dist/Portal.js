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

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _exenv = require('exenv');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Portal = function (_React$Component) {
  _inherits(Portal, _React$Component);

  function Portal(props, context) {
    _classCallCheck(this, Portal);

    var _this = _possibleConstructorReturn(this, (Portal.__proto__ || Object.getPrototypeOf(Portal)).call(this, props, context));

    if (_exenv.canUseDOM) {
      _this.node = document.createElement('div');
      _this.root = null;
      _this.handleRootRef = function (root) {
        _this.root = root;
      };

      _this.handleOutClick = function (e) {
        var onOutClick = _this.props.onOutClick;

        if (typeof onOutClick === 'function') {
          if (_this.root && !_this.root.contains(e.target)) {
            onOutClick(e);
          }
          if (!_this.root) {
            onOutClick(e);
          }
        }
      };

      document.addEventListener('click', _this.handleOutClick, true);
    }
    return _this;
  }

  _createClass(Portal, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (_exenv.canUseDOM) {
        document.body.appendChild(this.node);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (_exenv.canUseDOM) {
        document.removeEventListener('click', this.handleOutClick, true);
        document.body.removeChild(this.node);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          onOutClick = _props.onOutClick,
          props = _objectWithoutProperties(_props, ['onOutClick']);

      return _reactDom2.default.createPortal(_react2.default.createElement('div', _extends({}, props, { ref: this.handleRootRef })), this.node);
    }
  }]);

  return Portal;
}(_react2.default.Component);

Portal.propTypes = {
  onOutClick: _propTypes2.default.func
};
exports.default = Portal;

