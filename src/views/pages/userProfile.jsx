import React from 'react';
import q from 'q';
import querystring from 'querystring';
import constants from '../../constants';

import Loading from '../components/Loading';
import UserProfile from '../components/UserProfile';
import TrackingPixel from '../components/TrackingPixel';
import TopSubnav from '../components/TopSubnav';

class UserProfilePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: props.data || {},
    };

    this.state.loaded = this.state.data && this.state.data.data;
  }

  componentDidMount() {
    UserProfilePage.populateData(this.props.api, this.props, true).done((function(data) {
      this.setState({
        data: data || {},
        loaded: true,
      });
    }).bind(this));

    this.props.app.emit(constants.TOP_NAV_SUBREDDIT_CHANGE, 'u/' + this.props.userName);
  }

  componentDidUpdate() {
    this.props.app.emit('page:update', this.props);
  }

  render() {
    var loading;
    var profile;

    var userProfile = (this.state.data || {}).data || {};
    var name = this.props.userName;
    var tracking;

    var app = this.props.app;
    var user = this.props.user;

    if (!this.state.loaded) {
      loading = (
        <Loading />
      );
    } else {
      profile = (
        <UserProfile
          userProfile={userProfile}
          key={'user-profile-' + name}
          user={this.props.user}
          token={this.props.token}
          api={this.props.api}
        />
      );
    }

    if (this.state.data.meta && this.props.renderTracking) {
      tracking = (
        <TrackingPixel
          url={ this.state.data.meta.tracking }
          user={ this.props.user }
          loid={ this.props.loid }
          loidcreated={ this.props.loidcreated }
          compact={ this.props.compact }
          experiments={ this.props.experiments }
        />);
    }

    return (
      <div className="user-page user-profile">
        { loading }

        <TopSubnav
          app={ app }
          user={ user }
          hideSort={ true }
          baseUrl={ this.props.url }
          loginPath={ this.props.loginPath } />

        <div>
          { profile }
        </div>

        { tracking }
      </div>
    );
  }

  static populateData(api, props, synchronous) {
    var defer = q.defer();

    // Only used for server-side rendering. Client-side, call when
    // componentedMounted instead.
    if (!synchronous) {
      defer.resolve(props.data);
      return defer.promise;
    }

    var options = api.buildOptions(props.apiOptions);

    if (props.userName) {
      options.user = props.userName;
    } else {
      defer.reject('No user name passed in');
    }

    // Initialized with data already.
    if ((props.data || {}).data) {
      api.hydrate('users', options, props.data);

      defer.resolve(props.data);
      return defer.promise;
    }

    api.users.get(options).then(function(data) {
      defer.resolve(data);
    }, function(error) {
      defer.reject(error);
    });

    return defer.promise;
  }
}

export default UserProfilePage;
