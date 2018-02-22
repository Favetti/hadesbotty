/*

// var request-promise = require('request-promise-native')
var request = require('request')
var _accessToken = null

var _newAccessToken = () => {
  return new Promise((resolve, reject) => {
    var options = {
      url: 'https://www.reddit.com/api/v1/access_token', 
      method: 'POST',
      form: {grant_type: 'client_credentials'},
      auth: {user: process.env.CLIENT_ID, pass: process.env.REDDIT_BOT_SECRET}
    }
    request(options, function(err, response, body) {
      if (err) {
        reject(err)
      }
      var oBody = JSON.parse(body)
      setTimeout(() => {
        _accessToken = null
      }, (Number(oBody.expires_in) * 1000) - 60000)
      // Token removed 1 minute before it expires

      _accessToken = oBody.access_token

      resolve(_accessToken)
    })
  })
}

var access_token = () => {
  // Check to see if valid token already stored
  return new Promise((resolve, reject) => {
    if (!_accessToken) {
      // Request a new token from Reddit, the old one expired or will do in a minute
      resolve(_newAccessToken())
    } else {
      // Token already requested from Reddit, still valid
      resolve(_accessToken)
    }
  })
}

var _apiRequest = (which, cb) => {
  access_token().then((token)=>{
    var options = {
      url: 'https://oauth.reddit.com' + which,
      auth: {bearer: token},
      headers: {'User-Agent': 'hadesbotty.glitch.me'}
    }

    request(options, (err, res, body)=>{
      cb(JSON.parse(body), err)
    })
  }).catch((err) => {
    cb(null, err)
  })
}

var getWikiPage = (page, cb) => {
  _apiRequest('/r/HadesStar/wiki/' + page + "?raw_json=1", (res, err)=>{
    cb(res, err)
  })
}

module.exports = {access_token, getWikiPage}
*/