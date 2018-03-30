var socket = require('socket.io-client');
var os = require('os');
var ip = require('ip');
var mysocket = socket.connect('http://192.168.1.64:4000');
var user = "server";
var datasending;
var cpuUsage = 0;
var usercount = 0;
var os2 = require('os-utils');
var osType = os.platform();
var spawn = require('child_process').spawn;
var child;
var usedmem;
var totalmemory;
var totalusage = [];
var tcpp = require('tcp-ping');
var net = require('net');
mysocket.on('connect', function() {
  //when connected to the main server send socket ipaddress
  mysocket.emit('server');
});

mysocket.on('server', function() {
  console.log('server knows im here');
  connection();
  csharpcon();
});

function csharpcon() {
  try {
    tcpp.probe('127.0.0.1', 11000, function(err, available) {
      console.log(available);
      if (available == true) {
        var client = new net.Socket();
        client.connect(11000, '127.0.0.1', function() {
          console.log('Connected');
          var datasending2 = setInterval(function() {
            //start the function which takes the cpu usage.
            client.write('testing connection');
          }, 2000);
        });

        client.on('data', function(data) {
          console.log('Received: ' + data);
          //lient.destroy(); // kill client after server's response

        });
        client.on('close', function() {
          console.log('Connection closed');
        });
      } else {
        console.log("csharp db is not available");
      }
    });
  } catch (err2) {
    console.log(err2.message);
  }

}

function connection() {
  var io = require('socket.io');
  var serversocket = io.listen(5000);
  var clients = [];
  var spawn = require('child_process').spawn;
  //if user connects
  serversocket.on("connection", function(client) {
    usercount++;
    getCpuUsage();
    //when user asks for data
    client.on("data", function(data) {
      datasending = setInterval(function() {
        //start the function which takes the cpu usage.
        totalusage = [];
        getCpuUsage();
      }, 2000);
    });

    //if user disconnects then take one out of the userCount variable
    client.on('disconnect', function() {
      usercount--;
      console.log(usercount);
      console.log('client leave');

    });
  });

  function getCpuUsage() {
    try {
      if (usercount == 0) {
        clearInterval(datasending);
        console.log('stopped sending');
      }
      usedmem = os.freemem();
      totalmemory = os.totalmem();
      totalusage.push(usedmem);
      totalusage.push(totalmemory);
      if (osType == "win32") {
        //run cpu get load command at the windows commandline.
        child = spawn(
          'CMD', [
            '/C',
            'wmic cpu get loadpercentage'
          ]
        );
      } else if (osType == "linux") {
        var exec = require('child_process').exec;
        exec('echo $(vmstat 1 2|tail -1|awk \'{print $15}\')', function(error, stdout, stderr) {
          cpuUsage = (100 - stdout);
          console.log(cpuUsage);
          if (error !== null) {
            console.log('exec error: ' + error);
          }
        });

      }
      if (osType == "win32") {
        child.stdout.on('data', function(data) {
          var txt = new Buffer(data).toString('utf8', 0, data.length);
          if (osType == "win32") {
            cpuUsage = parseInt(txt.split('  ')[1]);
            totalusage.push(cpuUsage);
            //socket.emit sends message to every client.
            serversocket.emit('datatofront', totalusage);
            console.log('sent');
          }
        });
      }
    } catch (err) {
      console.log(err.message);
    }

  }
}