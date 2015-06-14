import React from 'react';

const _INDICATOR_PADDING = 2;

class TextSubNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      indicatorWidth: '0px',
      indicatorLeft: 0,
    };
    this._moveIndicator = this._moveIndicator.bind(this);
  }

  render() {
    return (
      <nav className='TextSubNav shadow'>
        <ul ref='ul' className='TextSubNav-ul list-unstyled'>
          {this.props.children}
        </ul>
        <div ref='indicator' className='TextSubNav-indicator' style={ {marginLeft: this.state.indicatorLeft, width: this.state.indicatorWidth} }></div>
      </nav>
    );
  }

  componentDidMount() {
    this._moveIndicator();
  }

  componentDidUpdate(prevProps, prevState) {
    this._moveIndicator();
  }

  _moveIndicator() {
    var ul = this.refs.ul.getDOMNode();
    var active = ul.querySelector('.active');
    if (active) {
      var ulWidth = ul.getBoundingClientRect().width;
      var rect = active.getBoundingClientRect();
      var width = Math.round(rect.width) + _INDICATOR_PADDING * 2 + 'px';
      var left = Math.round(rect.left - ulWidth / 2) - _INDICATOR_PADDING + 'px';
      if (width != this.state.indicatorWidth || left != this.state.indicatorLeft) {
        this.setState({indicatorWidth: width, indicatorLeft: left});
      }
    } else if (this.state.indicatorWidth != 0) {
      this.setState({indicatorWidth: 0});
    }
  }
}

export default TextSubNav;
