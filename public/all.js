var reconnectInterval;
var socket;

$(function() {
  reconnectInterval = setInterval(reconnect, 200);

  // Start single lane
  $('[href^=#lane]').on('click', function(e){
    e.preventDefault();
    var id = $(this).attr('href').replace('#lane', '');
    showMessage('Starting ' + $(this).text());
    socket.emit('start', id);
  });

  // Start all lanes
  $('#all').on('click', function(e){
    e.preventDefault();
    for (var i = 0; i < 10; i++) {
      socket.emit('start', indexToLaneId(i));
    }
    showMessage('Starting All Lanes');
  });
});

function showMessage(message) {
  $('#message .text').text(message);
}

function indexToLaneId(i) {
  if (i == 9) {
    return "A";
  }
  return (i + 1).toString();
}

function reconnect() {
  socket = io.connect();
  socket.on('disconnect', function () {
    clearInterval(reconnectInterval);
    reconnectInterval = setInterval(reconnect, 200);
  });
  socket.on('connect', function () {
    clearInterval(reconnectInterval);
  });
}
