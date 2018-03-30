var express = require('express');
var socket = require('socket.io');

//setup
var app = express();
var connections = [];
var frontsocketID;
var siteId;
//the 0.0.0.0 is because i dont want ipv6 address.
var server = app.listen(4000, '0.0.0.0', function() {
  console.log("listening");
});

app.use(express.static('frontend'));

//setupping a socket
var io = socket(server);


io.on('connection', (socket) => {

  //if the browser is connected send the array to it every 2 second
  socket.on('front', function(data) {
    socket.emit('frontdata', connections);
    frontsocketID = socket.id;
    /*setInterval(function() {
      console.log('sent');
      socket.emit('frontdata', connections);
    }, 2000);*/
  });
  //if we get ping from the server then we add ip and socketid to array
  socket.on('server', function(data) {
    console.log('server regonized');
    var socketid = socket.id;
    //ipv4 address of the client
    var name = socket.request.connection.remoteAddress;
    console.log(name, socketid);
    //send a message that the server is regonized
    socket.emit('server');
    //push ip and id to the array
    connections.push(name);
    //send the array to the browser
    io.to(frontsocketID).emit('frontdata', connections);
    //if server disconnects then delete it from the array
    socket.on('disconnect', function() {
      var clientIp = socket.request.connection.remoteAddress;
      //connections.splice(connections.indexOf(socket.id), 1);
      connections.splice(connections.indexOf(clientIp), 1);
      //send information to server that one server is disconnected
      io.to(frontsocketID).emit('frontdata', connections);

    });
  });
});