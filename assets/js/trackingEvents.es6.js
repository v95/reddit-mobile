import querystring from 'querystring';

var events = {
  'route:start': function(ctx) {
    var fullUrl = ctx.path;
    var query = querystring.stringify(ctx.query);

    if (query) {
      fullUrl += '?' + query;
    }

    if (global && global.ga) {
      ga('set', 'page', fullUrl);
      ga('send', 'pageview');

      var loggedIn = !!window.bootstrap.user;

      var compactCookieValue = document.cookie.match(/\bcompact=(\w+)\b/);
      var compact = !!(compactCookieValue &&
                      compactCookieValue.length > 1 &&
                      compactCookieValue[1] === 'true');

      var compactTestCookieValue = document.cookie.match(/\bcompactTest=(\w+)\b/);
      var compactTest = compactTestCookieValue ? compactTestCookieValue[1] : 'undefined';


      ga('set', 'dimension2', loggedIn.toString());
      ga('set', 'dimension3', compact.toString());
      ga('set', 'dimension4', compactTest.toString());
    }
  },

  'compactToggle': function (compact) {
    ga('send', 'event', 'compactToggle', compact.toString());
    ga('set', 'dimension3', compact.toString());
  },

  'vote': function (vote) {
    ga('send', 'event', 'vote', vote.get('direction'));
  },

  'comment': function (comment) {
    ga('send', 'event', 'comment', 'words', comment.get('text').match(/\S+/g).length);
  },

  'search': function (query) {
    ga('send', 'event', 'search');
  },

  'goto': function (query) {
    ga('send', 'event', 'goto', query);
  },

  'report': function (query) {
    ga('send', 'event', 'report');
  },
};

function trackingEvents(app) {
  for (var e in events) {
    app.on(e, events[e]);
  }
}

export default trackingEvents;
