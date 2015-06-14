import React from 'react';

import SVG from '../../components/SVG';

const _DIST = 7.5;
const _DIAMETER = 2;

class SeashellIcon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this._play = this._play.bind(this);
  }

  render() {
    return (
      <SVG className='SeashellIcon' fallbackIcon='icon-seashells'>
        <g className='SVG-fill'>
          <circle ref="one" cx={SVG.ICON_SIZE / 2 - _DIST} cy={SVG.ICON_SIZE / 2} r={_DIAMETER}/>
          <circle cx={SVG.ICON_SIZE / 2} cy={SVG.ICON_SIZE / 2} r={_DIAMETER}/>
          <circle ref="three" cx={SVG.ICON_SIZE / 2 + _DIST} cy={SVG.ICON_SIZE / 2} r={_DIAMETER}/>
        </g>
      </SVG>
    );
  }

  componentDidMount() {
    if (!SVG.ENABLED) {
      return;
    }
    var one = this.refs.one.getDOMNode();
    var three = this.refs.three.getDOMNode();
    var ease = Sine;
    this._timeline = new TimelineLite({paused: true});
    this._timeline.add(TweenLite.to([one, three], 0.2, {attr: {cx: SVG.ICON_SIZE / 2}, ease: ease.easeOut, overwrite: 0}), 0);
    this._timeline.add(TweenLite.to(one, 0.2, {attr: {cy: SVG.ICON_SIZE / 2 - _DIST}, ease: ease.easeIn, overwrite: 0}), 0);
    this._timeline.add(TweenLite.to(three, 0.2, {attr: {cy: SVG.ICON_SIZE / 2 + _DIST}, ease: ease.easeIn, overwrite: 0}), 0);
  }

  componentWillReceiveProps(nextProps) {
    if (!SVG.ENABLED) {
      return;
    }
    var played = nextProps.played;
    if (typeof played !== 'undefined' && played !== this.props.played) {
      this._play(played);
    }
  }

  _play(bool) {
    if (bool) {
      this._timeline.play();
    } else {
      this._timeline.reverse();
    }
  }
}

SeashellIcon.defaultProps = {
  played: false,
};

export default SeashellIcon;
