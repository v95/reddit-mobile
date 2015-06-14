import superagent from 'superagent';
import crypto from 'crypto'

// set up server-only routes
var serverRoutes = function(app) {
  var router = app.router;

  router.get('/robots.txt', function * () {
    this.body = `
# 80legs
User-agent: 008
Disallow: /

User-Agent: bender
Disallow: /my_shiny_metal_ass

User-Agent: Gort
Disallow: /earth

User-Agent: *
Disallow: /*/comments/*?*sort=
Disallow: /r/*/comments/*/*/c*
Disallow: /comments/*/*/c*
Disallow: /*after=
Disallow: /*before=
Disallow: /login
Disallow: /search
Disallow: /r/*/search
Disallow: /u/*
Allow: /
    `;
  });

  router.get('/manifest.json', function * () {
    this.body = {
      name: 'reddit: the front page of the internet',
      icons: [
        {
          src: `${app.config.assetPath}/favicon/64x64.png`,
          sizes: '64x64',
          type: 'image/png'
        },
        {
          src: `${app.config.assetPath}/favicon/76x76.png`,
          sizes: '76x76',
          type: 'image/png'
        },
        {
          src: `${app.config.assetPath}/favicon/120x120.png`,
          sizes: '120x120',
          type: 'image/png'
        },
        {
          src: `${app.config.assetPath}/favicon/128x128.png`,
          sizes: '128x128',
          type: 'image/png'
        },
        {
          src: `${app.config.assetPath}/favicon/152x152.png`,
          sizes: '152x152',
          type: 'image/png'
        },
        {
          src: `${app.config.assetPath}/favicon/180x180.png`,
          sizes: '180x180',
          type: 'image/png'
        },
        {
          src: `${app.config.assetPath}/favicon/192x192.png`,
          sizes: '192x192',
          type: 'image/png'
        },
      ],
      short_name: 'reddit',
      start_url: '/',
      scope: `${app.config.origin}`,
      lang: 'en-US',
      display: 'standalone',
    };
  });

  router.post('/timings', function * () {
    var statsDomain = app.config.statsDomain;
    var timings = this.request.body.rum;

    if(!app.config.actionNameSecret) {
      console.log('returning early, no secret');
      return;
    }

    var secret = (new Buffer(app.config.actionNameSecret, 'base64')).toString();
    var algorithm = 'sha1';
    var hash;
    var hmac;

    hmac = crypto.createHmac(algorithm, secret);
    hmac.setEncoding('hex');
    hmac.write(timings.actionName);
    hmac.end();

    hash = hmac.read();

    timings.verification = hash;

    superagent
        .post(statsDomain)
        .type('json')
        .send({ rum: timings })
        .end(function(){ });
  });

  // Server-side only!
  app.router.post('vote', '/vote/:id',
    function * () {
      var endpoints = {
        '1': 'comment',
        '3': 'listing',
      }

      var id = this.params.id;
      var endpoint = endpoints[id[1]];

      var vote = new models.Vote({
        direction: parseInt(this.query.direction),
        id: id,
      });

      if (vote.get('direction') !== undefined && vote.get('id')) {
        var options = app.api.buildOptions(props.apiOptions);
        options.model = vote;

        api.votes.post(options).done(function() {
        });
      }
    });

  app.router.post('/comment', function * () {
    var ctx = this;

    var comment = new models.Comment({
      thingId: ctx.body.thingId,
      text: ctx.body.text
    });

    if (!this.token) {
      return this.redirect(this.headers.referer || '/');
    }

    var options = app.api.buildOptions(props.apiOptions);
    options.model = comment;

    api.comments.post(options).done(function() {
      this.redirect(this.headers.referer || '/');
    });
  });
}

export default serverRoutes;
