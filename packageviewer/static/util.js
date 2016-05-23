// Utils

// initalize websocket
function initSocket() {
  var url = "http://" + document.domain + ":" + location.port;
  var socket = io.connect(url + "/dd");
  socket.on('dump', function(msg){

    // add new dataline
    addDataLine(msg);

    // auto scroll to the end of the page
    $(document).scrollTop($(document).height());
  });
}

// add a new line to the table
function addDataLine(msg) {
  $("#requests").append(jsonToTableRow(msg));
}

function jsonToTableRow(msg) {
  var jsonData = jQuery.parseJSON(msg);

  return "<tr><td>" + jsonData.time + "</td><td>" + jsonData.source + "</td><td>" + jsonData.method + "</td><td>"
  + jsonData.url + "</td><td>" + jsonData.params + "</td></tr>";
}

function filterSensitiveData(sensitiveData) {
  // sensitiveData.search(/user|username|name/i);
  // var password = sensitiveData.search(/password|pw/i);

}
