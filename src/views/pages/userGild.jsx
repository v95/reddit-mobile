import React from 'react';
import q from 'q';
import querystring from 'querystring';
import constants from '../../constants';

import Loading from '../components/Loading';
import TrackingPixel from '../components/TrackingPixel';
import TopSubnav from '../components/TopSubnav';

class UserGildPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: props.data || {},
    };

    this.state.loaded = this.state.data && this.state.data.data;
  }

  componentDidMount() {
    UserGildPage.populateData(this.props.api, this.props, true).done((function(data) {
      this.setState({
        data: data,
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

    if (!this.state.loaded) {
      loading = (
        <Loading />
      );
    }

    var api = this.props.api;
    var token = this.props.token;
    var app = this.props.app;
    var user = this.props.user || {};

    //var userProfile = this.state.data.data || {};
    //var name = this.props.userName;
    var tracking;

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
      <div className="user-page user-gild">
        <TopSubnav
          app={ app }
          user={ user }
          hideSort={ true }
          baseUrl={ this.props.url }
          loginPath={ this.props.loginPath } />

        { loading }

        <div className='container'>
          <div className='well well-lg'>
            <p>Sorry, this isn’t ready yet!</p>
          </div>
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
    if (props.data && typeof props.data.data !== 'undefined') {
      api.hydrate('users', options, props.data);

      defer.resolve(props);
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

export default UserGildPage;
