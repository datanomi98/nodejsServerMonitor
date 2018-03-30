var socket = io.connect('http://localhost:4000');

var user = "browser";
var showusers = [];
var array = [];
var checkarray;
socket.emit('front', user);

socket.on('frontdata', function(data) {
  //make the site empty
  document.getElementById("content").innerHTML = " ";
  //empty the array
  array = [];
  array = data;
  if (array.length == 0) {
    document.getElementById("content").innerHTML = "waiting for the servers ";
  } else {
    //loop throught the array
    for (var i = 0; i < array.length; i++) {
      document.getElementById("waiting").innerHTML = " ";
      document.getElementById("content").innerHTML += "<br><a href = data.html?ip=" + array[i] + ">" + array[i] + "</a>";
    }
  }
});