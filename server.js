var express = require('express');
var fs = require('fs');
var storj = require('storj-lib');
var session = require('client-sessions');
var mnemonic = require('bitcore-mnemonic');
var bitcore = require('bitcore-lib');
var dotenv = require('dotenv');


//Storj variables
var api = 'https://api.storj.io';
var client;
var STORJ_EMAIL = process.env.STORJ_EMAIL;
var STORJ_PASSWORD = process.env.STORJ_PASSWORD;
var storjCredentials = {
  email:STORJ_EMAIL,
  password:STORJ_PASSWORD
};

// Key variables
var KEYRING_PASS = process.env.KEYRING_PASS;
var KEYRING_DIR = './';

//Setup app
var app = express();
dotenv.load();
app.set('port', (process.env.PORT || 3001));
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(__dirname + '/client/public'));
}
app.use(session({
  cookieName: 'session',
  secret: process.env.SESSION_SECRET,
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));

//Authentication
app.get('/api/auth', (req, res) => {

  const param = req.query.passphrase;

  if (!param) {
    res.json({error: 'Missing request parameter'});
    return;
  }

  //Create Private Key from Mnemonic
  var value = new Buffer(param);
  var hash = bitcore.crypto.Hash.sha256(value);
  var bn = bitcore.crypto.BN.fromBuffer(hash);
  var privateKey = new bitcore.PrivateKey(bn);
  var address = privateKey.toAddress();
  console.log('Created private key', address);

  // Login using the keypair
  var keypair = storj.KeyPair(privateKey.toWIF());
  client = storj.BridgeClient(api, { keyPair: keypair });

  //Check if Login successful
  client.getPublicKeys(function(err, keys) {
    if (err) {
      console.log('Authentication failed');
      req.session.authenticated = false;
      //res.json({error: err.message});
      res.json({isLoggedIn: false});
      return;
    }
    else {
      //Login was successful
      console.log('Logged in with keypair');
      req.session.authenticated = true;
      res.json({isLoggedIn: true});
      return;
      /*
      client.getBuckets(function(err, buckets) {
        if (err) {
          res.json({error: err.message,});
          return;
        }
        else {
          if (buckets) {
            res.json({buckets,});
            return;
          } else {
            res.json({message: 'No Buckets',});
            return;
          }

        }
      });
      */
    }
  });

});

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});