var HTTPS = require('https');
var cool = require('cool-ascii-faces');

var botID = process.env.BOT_ID;

good = false;

function respond() {
  var request = JSON.parse(this.req.chunks[0]),
      botRegex = /^\/give cookie to /, botRegexAlt = /^\/take cookie from /;

  if(request.text && botRegex.test(request.text)) {
    this.res.writeHead(200);
    postMessage(request.text.substr(16), good, true);
    this.res.end();
    good = !good;
  }
  if (request.text && botRegexAlt.test(request.text)) {
    this.res.writeHead(200);
    postMessage(request.text.substr(18), good, false);
    this.res.end();
    good = !good;
  }
  else {
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }
}

function postMessage(name, good, give) {
  var botResponse, options, body, botReq, cookieType;

  if (give == true) {
    if(good == true) {
      cookieType = "well-deserved";
    } else {
      cookieType = "goddamn"
    }
    botResponse = "*Giving " + name + " a "+ cookieType +" cookie*";
  }
  if (give == false) {
    if(good==true) {
      numCookies = "one of"
    } else {
      numCookies = "all of"
    }
    botResponse = "*Taking " + numCookies + " " + name + "'s cookies away*";
  }


  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
    "text" : botResponse
  };

  console.log('sending ' + botResponse + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}


exports.respond = respond;
