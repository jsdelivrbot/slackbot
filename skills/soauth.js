Connection.prototype.authenticate = function(data, callback) {
  var self = this;
  var opts = _.defaults(this._getOpts(data, callback), {
    executeOnRefresh: false,
    oauth: {}
  });
  var resolver = promises.createResolver(opts.callback);

  opts.uri = (self.environment == 'sandbox') ? this.testLoginUri : this.loginUri;
  opts.method = 'POST';
  opts.headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };

  var bopts = {
    client_id: self.clientId,
    client_secret: self.clientSecret
  };

  if(opts.code) {
    bopts.grant_type = 'authorization_code';
    bopts.code = opts.code;
    bopts.redirect_uri = self.redirectUri;
  } else if(opts.assertion) {
    bopts.grant_type = 'assertion';
    bopts.assertion_type = 'urn:oasis:names:tc:SAML:2.0:profiles:SSO:browser';
    bopts.assertion = opts.assertion;
  } else if(opts.username || this.username) {
    bopts.grant_type = 'password';
    bopts.username = opts.username || this.getUsername();
    bopts.password = opts.password || this.getPassword();
    if(opts.securityToken || this.getSecurityToken()) {
      bopts.password += opts.securityToken || this.getSecurityToken();
    }
    if(this.mode === 'single') {
      this.setUsername(bopts.username);
      this.setPassword(bopts.password);
      this.setSecurityToken(bopts.securityToken);
    }
  }

  opts.body = qs.stringify(bopts);

  this._apiAuthRequest(opts, function(err, res) {
    console.log("\n--> sending oauth request\n", opts)
    if(err) return resolver.reject(err);
    var old = _.clone(opts.oauth);
    _.assign(opts.oauth, res);
    if(opts.assertion) opts.oauth.assertion = opts.assertion;
    if(self.onRefresh && opts.executeOnRefresh === true) {
      self.onRefresh.call(self, opts.oauth, old, function(err3){
        if(err3) return resolver.reject(err3);
        else return resolver.resolve(opts.oauth);
      });
    } else {
      resolver.resolve(opts.oauth);
    }
  });

  return resolver.promise;
};