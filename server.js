var express = require('express');
var fs = require('fs');
var storj = require('storj-lib');
var session = require('client-sessions');
var mnemonic = require('bitcore-mnemonic');
var bitcore = require('bitcore-lib');
var dotenv = require('dotenv');
var bodyParser = require('body-parser');
var multer  = require('multer');



//Storj variables
var api = 'https://api.storj.io';
var client;
/*
var STORJ_EMAIL = process.env.STORJ_EMAIL;
var STORJ_PASSWORD = process.env.STORJ_PASSWORD;
var storjCredentials = {
  email:STORJ_EMAIL,
  password:STORJ_PASSWORD
};
*/

//Multer variables
/*
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
*/
var storage = multer.memoryStorage()
var upload = multer({
  storage: storage,
  limits: {
  files: 10,
  fields: 5,
  fileSize: 100000000
  }
});

// Key variables
//var KEYRING_PASS = process.env.KEYRING_PASS;
var USER_DIR = './.users/';

//Setup app
var app = express();
dotenv.load();
app.set('port', (process.env.PORT || 3001));
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(__dirname + '/client/public'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  cookieName: 'session',
  secret: process.env.SESSION_SECRET,
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));


//Status
app.get('/api/status', (req, res) => {

  console.log('**** Executing /api/status ****');

  var status = false;

  if (req.session.authenticated && client) {

    console.log('User is Logged In');
    status = true;

  } else {
    console.log('User is Logged Out');
  }

  res.json({isLoggedIn: status});
  return;

});

//Authentication
app.get('/api/auth', (req, res) => {

  console.log('**** Executing /api/auth ****');

  req.session.authenticated = false;
  client = null;

  var passphrase = req.query.passphrase;

  if (!passphrase) {
    res.json({isLoggedIn: false});
    return;
  }

  //Create Private Key from Mnemonic
  var value = new Buffer(passphrase);
  var hash = bitcore.crypto.Hash.sha256(value);
  var bn = bitcore.crypto.BN.fromBuffer(hash);
  var privateKey = new bitcore.PrivateKey(bn);
  //var address = privateKey.toAddress();
  //console.log('Created private key', address);

  // Login using the keypair
  var keypair = storj.KeyPair(privateKey.toWIF());
  client = storj.BridgeClient(api, { keyPair: keypair });

  //Check if Login successful
  client.getPublicKeys(function(err, keys) {
    if (err) {
      console.log('Authentication failed');
      req.session.authenticated = false;
      res.json({isLoggedIn: false});
      return;
    }
    else {
      //Login was successful
      console.log('Logged in with keypair');
      req.session.authenticated = true;
      req.session.passphrase = passphrase;
      res.json({isLoggedIn: true});
      return;
    }
  });

});

// Logoff
app.get('/api/logout', (req, res) => {

  console.log('**** Executing /api/logout ****');

  req.session.authenticated = false;
  client = null;
  res.json({isLoggedOut: true});
  return;

});

// Get buckets
app.get('/api/buckets', (req, res) => {

  console.log('**** Executing /api/buckets ****');

  client.getBuckets(function(err, buckets) {
    if (err) {
      res.json({isBuckets: false});
      return;
    }
    else {
      if (buckets) {
        res.json({buckets});
        return;
      } else {
        res.json({isBuckets: false});
        return;
      }
    }
  });

});

// Get files
app.get('/api/files', (req, res) => {

  console.log('**** Executing /api/files ****');

  var bucketid = req.query.bucketid;
  req.session.bucketid = bucketid;

  console.log(bucketid);

  if (!bucketid) {
    res.json({isFiles: false});
    return;
  }

  client.listFilesInBucket(bucketid, function(err, files) {
    if (err) {
      res.json({isFiles: false});
      return;
    }
    if (files) {
      res.json({files});
      return;
    } else {
      res.json({isFiles: false});
      return;
    }
  });

});


app.post('/api/dzupload', upload.single('file'),  (req, res) => {

  console.log('**** Executing /api/upload ****');

  if (req.file && req.file.originalname) {

    console.log(`Received file ${req.file.originalname}`);

    var bucketid = req.session.bucketid;
    var readbuffer = Buffer.alloc(Buffer.byteLength(req.file.buffer, 'hex'), req.file.buffer);

    console.log('Bucket', bucketid);
    console.log('Buffer', readbuffer);
    console.log('Buffer length', Buffer.byteLength(req.file.buffer, 'hex'));

    client.getPublicKeys(function(err, keys) {
      if (err) {
        return console.log('error', err.message);
      }

      var user = keys[0].user;
      var userdir = USER_DIR + user;
      var unencryptpath = 'uploads/' + req.file.originalname;
      var encryptpath = userdir + '/' + req.file.filename + '.crypt';

      console.log('Uploading file to', bucketid);
      console.log('Key Ring Directory', userdir);
      console.log('Key Ring Passphrase', req.session.passphrase);
      console.log('Encrypted File Path', encryptpath);

      var keyring = storj.KeyRing(userdir, req.session.passphrase);
      if (err) {
        console.log('error', err.message);
      }
      if (keyring) {
        console.log('Created keyring');
      }

      // Prepare to encrypt file for upload
      var secret = new storj.DataCipherKeyIv();
      var encrypter = new storj.EncryptStream(secret);

      // Encrypt the file to be uploaded and store it temporarily
      fs.createReadStream(readbuffer)
        .pipe(encrypter)
        .pipe(fs.createWriteStream(encryptpath))
        .on('finish', function() {
          console.log('Finished encrypting');

        // Create token for uploading to bucket by bucketId
        client.createToken(bucketid, 'PUSH', function(err, token) {
          if (err) {
            console.log('error', err.message);
          }
          if (token) {
            console.log('Created token for file');
          }

          // Store the file using the bucketId, token, and encrypted file
          console.log('Attempting to store file in bucket');
          client.storeFileInBucket(bucketid, token.token, encryptpath,
            function(err, file) {
              if (err) {
                return console.log('error', err.message);
              }
              console.log('Stored file in bucket');

              // Save key for access to download file
              keyring.set(file.id, secret);

              // Delete tmp file
              fs.unlink(encryptpath, function(err) {
                if (err) {
                  return console.log(err);
                }
                console.log('Temporary encrypted file deleted');
              })

              res.json({isUploaded: true});
              return;

          });
        });
      });
    });

  }
  else {
    res.json({isUploaded: false});
    return;
  }

});

//Upload
app.get('/api/upload', (req, res) => {

  console.log('**** Executing /api/upload ****');

  var bucketid = req.query.bucketid;

  // Select the file to be uploaded
  var filepath = './client/public/grumpy.jpg';

  // Path to temporarily store encrypted version of file to be uploaded
  var tmppath = filepath + '.crypt';

  client.getPublicKeys(function(err, keys) {
    if (err) {
      return console.log('error', err.message);
    }

    var user = keys[0].user

    console.log('Uploading file to', bucketid);
    console.log('Key Ring Directory', KEYRING_DIR + user);
    console.log('Key Ring Passphrase', req.session.passphrase);

    var keyring = storj.KeyRing(KEYRING_DIR + user, 'delay chuckle marine denial float pond right detect tomorrow cloud solar warrior');
    if (err) {
      console.log('error', err.message);
    }
    if (keyring) {
      console.log('Created keyring');
    }

    // Prepare to encrypt file for upload
    var secret = new storj.DataCipherKeyIv();
    var encrypter = new storj.EncryptStream(secret);

    // Encrypt the file to be uploaded and store it temporarily
    fs.createReadStream(filepath)
      .pipe(encrypter)
      .pipe(fs.createWriteStream(tmppath))
      .on('finish', function() {
        console.log('Finished encrypting');

      // Create token for uploading to bucket by bucketId
      client.createToken(bucketid, 'PUSH', function(err, token) {
        if (err) {
          console.log('error', err.message);
        }
        if (token) {
          console.log('Created token for file');
        }

        // Store the file using the bucketId, token, and encrypted file
        console.log('Attempting to store file in bucket');
        client.storeFileInBucket(bucketid, token.token, tmppath,
          function(err, file) {
            if (err) {
              return console.log('error', err.message);
            }
            console.log('Stored file in bucket');

            // Save key for access to download file
            keyring.set(file.id, secret);

            // Delete tmp file
            fs.unlink(tmppath, function(err) {
              if (err) {
                return console.log(err);
              }
              console.log('Temporary encrypted file deleted');
            })

            res.json({isUploaded: true});
            return;

        });
      });
    });
  });
});

//Download
app.get('/api/download', (req, res) => {

  console.log('**** Executing /api/download ****');

  var bucketid = req.query.bucketid;
  var fileid = req.query.fileid;

  if (!bucketid || !fileid) {
    res.json({isDownload: false});
    return;
  }

  console.log('Getting keyring');
  var keyring = storj.KeyRing(KEYRING_DIR, KEYRING_PASS);

  // Where the downloaded file will be saved
  var target = fs.createWriteStream('./public/grumpy-dwnld.jpg');

  // Get key to download file
  console.log('Get key for fileId');
  var secret = keyring.get(fileid);

  // Prepare to decrypt the encrypted file
  var decrypter = new storj.DecryptStream(secret);
  var received = 0;

  // Download the file
  console.log('Creating file stream');
  client.createFileStream(bucketid, fileid, { exclude: [] },

    function(err, stream) {
      if (err) {
        return console.log('error', err.message);
      }

    // Handle stream errors
    stream.on('error', function(err) {
      console.log('warn', 'Failed to download shard, reason: %s', [err.message]);
      // Delete the partial file
      fs.unlink(filepath, function(unlinkFailed) {
        if (unlinkFailed) {
          return console.log('error', 'Failed to unlink partial file.');
        }

        if (!err.pointer) {
            return;
        }
      });
    }).pipe(through(function(chunk) {
        received += chunk.length;
        console.log('info', 'Received %s of %s bytes', [received, stream._length]);
        this.queue(chunk);
    })).pipe(decrypter)
       .pipe(target);

  });

  // Handle Events emitted from file download stream
  target.on('finish', function() {
    console.log('Finished downloading file');
  }).on('error', function(err) {
    console.log('error', err.message);
  });

});

//Generate Key pair
app.get('/api/generate', (req, res) => {

  console.log('**** Executing /api/generate ****');

  // Create private key from passphrase
  var passphrase = new mnemonic();
  console.log('Generated passphrase', passphrase.toString());

  var value = new Buffer(passphrase.toString());
  var hash = bitcore.crypto.Hash.sha256(value);
  var bn = bitcore.crypto.BN.fromBuffer(hash);
  var privateKey = new bitcore.PrivateKey(bn);
  var wif = privateKey.toWIF();
  console.log('WIF encoded key', privateKey.toWIF());

  // Generate keypair for Storj Network
  var keypair = storj.KeyPair(privateKey.toWIF());
  console.log('Generated Storj keypair', keypair.getPublicKey());

  var dir = './.users/' + keypair.getPublicKey();
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
    //fs.writeFileSync(dir + '/private.key', keypair.getPrivateKey());
  }
  console.log('Created key ring directory');

  // Add the keypair public key to the user account for authentication
  client.addPublicKey(keypair.getPublicKey(), function(err) {
    if (err) {
      return console.log('error', err.message);
    }
    console.log('Added the keypair public key to the user account');
  });

});

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
