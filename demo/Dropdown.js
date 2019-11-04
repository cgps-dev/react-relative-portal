import React from 'react';
import PropTypes from 'prop-types';
import RelativePortal from '../src/RelativePortal';

const styles = {
  container: {
    display: 'inline-block',
  },
  dropdown: {
    padding: 5,
    backgroundColor: '#FFF',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
  },
};

export default class Hint extends React.Component {
  static propTypes = {
    children: PropTypes.any,
    position: PropTypes.oneOf(['left', 'right']),
    direction: PropTypes.oneOf(['up', 'down']),
  };

  state = {
    show: false,
  };

  componentDidMount() {
    const { height } = this.el.getBoundingClientRect();
    this.height = height;
  }

  render() {
    const { children, position = 'left', direction = 'down' } = this.props;
    const { show } = this.state;

    const portalProps = {};
    if (position === 'right') {
      portalProps.right = 0;
    }
    if (direction === 'up') {
      portalProps.bottom = this.height;
    }

    return (
      <div style={styles.container} ref={el => { this.el = el; }}>
        <button
          onClick={() => setTimeout(() => this.setState({ show: !show }))}
        >
          Show content
        </button>

        <RelativePortal
          component="div"
          top={5}
          onOutClick={show ? () => this.setState({ show: false }) : null}
          {...portalProps}
        >
          {show && <div style={styles.dropdown}>{children}</div>}
        </RelativePortal>
      </div>
    );
  }
}
