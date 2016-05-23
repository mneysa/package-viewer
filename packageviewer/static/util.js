// Utils

// initalize websocket
function initSocket() {
  var url = "http://" + document.domain + ":" + location.port;
  var socket = io.connect(url + "/packets");
  socket.on('packet', function(msg){
    console.debug(msg)

    // add new dataline
    addDataLine(msg);

    // auto scroll to the end of the page
    $(document).scrollTop($(document).height());
  });
}

// add a new line to the table
function addDataLine(msg) {
  $("#requests").append(getTableLine(msg));
}

function getTableLine(msg) {
  var parameters = msg.split(";");
  var tableLine = "<tr>";

  for (i = 0; i < parameters.length; i++) {
      tableLine += "<td>" + parameters[i] + "</td>";
  }

  tableLine += "</tr>";

  return tableLine;
}

function filterData() {

}
