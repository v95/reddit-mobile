import React from 'react';
import moment from 'moment';

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextProps !== this.props || nextState !== this.state);
  }

  render() {
    var props = this.props;
    var userProfile = props.userProfile;
    var created = moment(userProfile.created * 1000);
      //TODO trophy case items can look like this when we get that data
              /*<li className='UserProfile-trophy clearfix'>
                <span className='icon-crown-circled'/>
                <div className='pull-left'>
                  <p className='UserProfile-trophy-title'>Gold Membership</p>
                  <p className='UserProfile-trophy-date'>Since December 2014</p>
                </div>
              </li>
              <li className='UserProfile-trophy clearfix'>
                <span className='icon-crown-circled'/>
                <div className='pull-left'>
                  <p className='UserProfile-trophy-title'>Gold Membership</p>
                  <p className='UserProfile-trophy-date'>Since December 2014</p>
                </div>
              </li>
              <li className='UserProfile-trophy clearfix'>
                <span className='icon-crown-circled'/>
                <div className='pull-left'>
                  <p className='UserProfile-trophy-title'>Gold Membership</p>
                  <p className='UserProfile-trophy-date'>Since December 2014</p>
                </div>
              </li>
              <li className='UserProfile-trophy clearfix'>
                <span className='icon-crown-circled'/>
                <div className='pull-left'>
                  <p className='UserProfile-trophy-title'>Gold Membership</p>
                  <p className='UserProfile-trophy-date'>Since December 2014</p>
                </div>
              </li>*/
    return (
      <article className={ 'UserProfile' }>
        <ul className='UserProfile-ul list-unstyled'>
          <li className='UserProfile-li h1'>
            <span className='icon-crown-circled'/>
            { userProfile.link_karma } Karma
          </li>
          <li className='UserProfile-li h1'>
            <span className='icon-crown-circled'/>
            Created { created.format('ll') }
          </li>
          <li className='UserProfile-li h1'>
            <span className='icon-crown-circled'/>
            Trophy Case
            <ul className='UserProfile-trophies list-unstyled'>
            </ul>
          </li>
        </ul>
      </article>
    );
  }
}

export default UserProfile;
