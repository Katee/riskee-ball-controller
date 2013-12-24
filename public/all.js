$(function() {
  var socket = io.connect();

  // Start single lane
  $('[href^=#lane]').on('click', function(){
    var id = $(this).attr('href').replace('#lane', '');
    showMessage('Starting ' + $(this).text());
    socket.emit('start', id);
    return false;
  });

  // Start all lanes
  $('#all').on('click', function(){
    for (var i = 0; i < 10; i++) {
      socket.emit('start', indexToLaneId(i));
    }
    showMessage('Starting All Lanes');
    return false;
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
