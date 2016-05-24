// Utils

// initalize websocket
function initSocket() {
  var url = "http://" + document.domain + ":" + location.port;
  var socket = io.connect(url + "/packets");
  socket.on('packet', function(msg){
    console.debug(msg)

    // add new dataline
    if (isUrlOfInterest(msg.url)) {
      addDataLine(msg);

    // auto scroll to the end of the page
      $(document).scrollTop($(document).height());
    }
  });
}

// add a new line to the table
function addDataLine(msg) {
  $("#requests").append(jsonToTableRow(msg));
}

function jsonToTableRow(jsonData) {
  return "<tr><td>" + jsonData.time + "</td><td>" + jsonData.source + "</td><td>" + jsonData.method + "</td><td>"
  + filterSensitiveData(jsonData.params) + "</td><td>" + jsonData.url + "</td></tr>";
}

function filterSensitiveData(params) {
  var data = "";
  var usernames = getUsernames(params);
  var passwords = getPasswords(params);
  var searchUrlParams = getSearchUrlParams(params);

  if (usernames != "")
    data = "Usernames: " + usernames + "\n";

  if (passwords != "")
    data += "Passwords: " + passwords + "\n";

  if (searchUrlParams != "")
    data += "Search url params: " + searchUrlParams;

  return data;
}

function getUsernames(params) {
  var usernames = "";
  var userRegex = /"(\w*(?:user|benutzer|mail)\w*)"\s+=\s+"([^"]+)"\s/ig;
  var match = userRegex.exec(params);

  while (match != null) {
    usernames += match[2] + "\t";
  	match = userRegex.exec(params);
  }

  return usernames;
}

function getPasswords(params) {
  var passwords = "";
  var passwordRegex = /"(\w*(?:pass|pw)\w*)"\s+=\s+"([\S]+)"\s/ig;
  var match = passwordRegex.exec(params);

  while (match != null) {
    passwords += match[2] + "\t";
  	match = passwordRegex.exec(params);
  }

  return passwords;
}

function getSearchUrlParams(params) {
  var searchUrlParams = "";
  var searchRegex = /(?:\?|&)(?:q|query|s|search)=(.*?)(?=&|$)/img;
  var match = searchRegex.exec(params);
  while (match != null) {
    searchUrlParams += match[2] + "\t";
  	match = searchRegex.exec(params);
  }

  return searchUrlParams;
}

function isUrlOfInterest(url) {
  var urlRegex = /(?:^https?:\/\/(?:t.co\/|e.nexac.com|font|tags|pix|ad.|trc.|[^\/]*(?:cdn|ads|adnxs|advert|adingo|sharethis|scorecardresearch|lijit|wemfbox|semasio|adtechus|openx|mediamath|mathtag|addthis|adroll|mookie|symcd|nuggad|adition|pixel|tapad|track|adform|static|farm|doubleclick|yield))|(?:casalemedia|fileserv|template|modernizr|ocsp|bootstrap|jquery|adver)|\.(?:jpg|css|js|ico|gif|json|png|svg|woff2?)(?:\?|&|$))/;

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
