import React from 'react';
import PropTypes from 'prop-types';

const styles = {
  container: {
    position: 'relative',
    display: 'inline-block',
  },
  dropdownW: {
    position: 'absolute',
    marginTop: 5,
  },
  dropdown: {
    width: 120,
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
    const dropdownStyle = {};
    if (position === 'left') {
      dropdownStyle.left = 0;
    }
    if (position === 'right') {
      dropdownStyle.right = 0;
    }
    if (direction === 'up') {
      dropdownStyle.bottom = this.height;
    }

    return (
      <div style={styles.container} ref={el => { this.el = el; }}>
        <button
          onClick={() => setTimeout(() => this.setState({ show: !show }))}
        >
          Show content
        </button>

        {show && (
          <div style={{ ...dropdownStyle, ...styles.dropdownW }}>
            <div style={styles.dropdown}>{children}</div>
          </div>
        )}
      </div>
    );
  }
}
