var socket = require('socket.io-client');
var os = require('os');
var ip = require('ip');
var mysocket = socket.connect('http://192.168.1.64:4000');
var user = "server";
var datasending;
var cpuUsage = 0;
var usercount = 0;
var os = require('os-utils');
var osType = os.platform();
mysocket.on('connect', function() {
  //when connected to the main server send socket ipaddress
  mysocket.emit('server');
});

mysocket.on('server', function() {
  console.log('server knows im here');
});