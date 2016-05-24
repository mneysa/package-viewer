// Utils

// initalize websocket
function initSocket() {
  var url = "http://" + document.domain + ":" + location.port;
  var socket = io.connect(url + "/packets");
  socket.on('packet', function(msg){
    console.debug(msg)

    if (msg.method != "M-SEARCH") {

      msg.info = filterSensitiveData(msg);
      if (msg.info == "" && msg.params != null) {
        msg.info = msg.params;
      }

      if (msg.info != "" || isUrlOfInterest(msg.url)) {
        addDataLine(msg);
        // auto scroll to the end of the page
        $(document).scrollTop($(document).height());
      }
    }
  });
}

// add a new line to the table
function addDataLine(msg) {
  $("#requests").append(jsonToTableRow(msg));
}

function jsonToTableRow(jsonData) {
  return "<tr><td>" + jsonData.time + "</td><td>" + jsonData.source + "</td><td>" + jsonData.method + "</td><td>"
  + jsonData.info + "</td><td>" + jsonData.url + "</td></tr>";
}

function filterSensitiveData(request) {
  var data =  "";
  var usernames = "";
  var passwords = "";
  var searchFormParams = "";
  if (request.params != null && request.params != "") {
    usernames = getUsernames(request.params);
    passwords = getPasswords(request.params);
    searchFormParams = getSearchFormParams(request.params);
  }
  var searchUrlParams = getSearchUrlParams(request.url);

  if (usernames != "")
    data = "Usernames: " + usernames + "<br>";

  if (passwords != "")
    data += "Passwords: " + passwords + "<br>";

  if (searchUrlParams != "")
    data += "Search url params: " + searchUrlParams;

  if (searchFormParams != "")
    data += "Search form params: " + searchFormParams;

  return data;
}

function getUsernames(params) {
  var usernames = "";
  var userRegex = /"(\w*(?:user|benutzer|mail)\w*)"\s+=\s+"([^"]+)"\s/ig;
  var match = userRegex.exec(params);

  while (match != null) {
    usernames += match[2] + " | ";
  	match = userRegex.exec(params);
  }

  return usernames;
}

function getPasswords(params) {
  var passwords = "";
  var passwordRegex = /"(\w*(?:pass|pw)\w*)"\s+=\s+"([\S]+)"\s/ig;
  var match = passwordRegex.exec(params);

  while (match != null) {
    passwords += match[2] + " | ";
  	match = passwordRegex.exec(params);
  }

  return passwords;
}

function getSearchUrlParams(params) {
  var searchUrlParams = "";
  var searchRegex = /(?:\?|&)(?:q|query|s|search|was|wo|from|to)=(.*?)(?=&|$)/img;
  var match = searchRegex.exec(params);
  while (match != null) {
    searchUrlParams += decodeURIComponent(match[1].replace(/\+/g, " ")) + " | ";
  	match = searchRegex.exec(params);
  }

  return searchUrlParams;
}

function getSearchFormParams(params) {
  var searchUrlParams = "";
  var searchRegex = /"(\w*(?:query|q|search|s)\w*)"\s+=\s+"([^"]+)"\s/ig;
  var match = searchRegex.exec(params);

  while (match != null) {
    searchUrlParams += match[2] + " | ";
  	match = searchRegex.exec(params);
  }

  return searchUrlParams;
}

function isUrlOfInterest(url) {
  var urlRegex = /(?:^https?:\/\/(?:t.co\/|e.nexac.com|font|tags|pix|ad.|trc.|[^\/]*(?:cdn|ads|adnxs|count|outbrain|pagead|ml314|gigya|syndic|advert|adingo|sharethis|scorecardresearch|lijit|wemfbox|semasio|adtechus|openx|mediamath|mathtag|addthis|adroll|mookie|symcd|nuggad|adition|pixel|tapad|track|adform|static|farm|doubleclick|yield))|(?:casalemedia|fileserv|template|adServer|beacon|modernizr|ocsp|bootstrap|jquery|adver)|\.(?:jpg|css|js|ico|gif|json|png|svg|woff2?)(?:\?|&|$))/;

  if (urlRegex.test(url)) {
  	return false;
  }
  else {
	  return true;
  }
}

$(document).ready(function() {
  initSocket();
});
