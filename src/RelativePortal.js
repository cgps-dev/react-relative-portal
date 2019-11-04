import React from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash.throttle';
import { canUseDOM } from 'exenv';
import Portal from './Portal';

const listeners = {};

function fireListeners() {
  Object.keys(listeners).forEach(key => listeners[key]());
}

function getPageOffset() {
  return {
    x: (window.pageXOffset !== undefined)
      ? window.pageXOffset
      : (document.documentElement || document.body.parentNode || document.body).scrollLeft,
    y: (window.pageYOffset !== undefined)
      ? window.pageYOffset
      : (document.documentElement || document.body.parentNode || document.body).scrollTop,
  };
}

function initDOMListener() {
  document.body.addEventListener('mousewheel', throttle(fireListeners, 100, {
    leading: true,
    trailing: true,
  }));
  window.addEventListener('resize', throttle(fireListeners, 50, {
    leading: true,
    trailing: true,
  }));
}

if (canUseDOM) {
  if (document.body) {
    initDOMListener();
  } else {
    document.addEventListener('DOMContentLoaded', initDOMListener);
  }
}

let listenerIdCounter = 0;
function subscribe(fn) {
  listenerIdCounter += 1;
  const id = listenerIdCounter;
  listeners[id] = fn;
  return () => delete listeners[id];
}

export default class RelativePortal extends React.Component {
  static propTypes = {
    right: PropTypes.number,
    left: PropTypes.number,
    fullWidth: PropTypes.bool,
    top: PropTypes.number,
    bottom: PropTypes.number,
    fullHeight: PropTypes.bool,
    children: PropTypes.any,
    onOutClick: PropTypes.func,
    component: PropTypes.string.isRequired,
  };

  static defaultProps = {
    left: 0,
    top: 0,
    component: 'span',
  };

  state = {
    right: 0,
    left: 0,
    bottom: 0,
    top: 0,
  };

  componentDidMount() {
    this.handleScroll = () => {
      if (this.element) {
        const rect = this.element.getBoundingClientRect();
        const pageOffset = getPageOffset();

        const bottom = document.documentElement.clientHeight - rect.bottom - pageOffset.y;
        const top = pageOffset.y + rect.top;
        const right = document.documentElement.clientWidth - rect.right - pageOffset.x;
        const left = pageOffset.x + rect.left;

        if (top !== this.state.top || bottom !== this.state.bottom || left !== this.state.left || right !== this.state.right) {
          this.setState({ left, top, right, bottom });
        }
      }
    };
    this.unsubscribe = subscribe(this.handleScroll);
    this.handleScroll();
  }

  componentDidUpdate() {
    this.handleScroll();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const { component: Comp, left, right, fullWidth, top, bottom, fullHeight, ...props } = this.props;

    const fromLeftOrRight = right !== undefined ?
      { right: this.state.right + right } :
      { left: this.state.left + left };

    const horizontalPosition = fullWidth ?
      { right: this.state.right + right, left: this.state.left + left } : fromLeftOrRight;

    const fromTopOrBottom = bottom !== undefined ?
      { bottom: this.state.bottom + bottom } :
      { top: this.state.top + top };

    const verticalPosition = fullHeight ?
      { bottom: this.state.bottom + bottom, top: this.state.top + top } : fromTopOrBottom;

    return (
      <Comp
        ref={element => {
          this.element = element;
        }}
      >
        <Portal {...props}>
          <div
            style={{
              position: 'absolute',
              ...horizontalPosition,
              ...verticalPosition,
            }}
          >
            {this.props.children}
          </div>
        </Portal>
      </Comp>
    );
  }
}
