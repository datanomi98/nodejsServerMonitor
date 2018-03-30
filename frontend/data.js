var socId = getUrlParameter('ip');
var socket = io.connect('http://' + socId + ':5000');
var xVal = 1;
var yVal = 0;
var dps = [];
var updateInterval = 1000;
var dataLength = 10; // number of dataPoints visible at any point
var usedmemory;
var totalmem;
var memoryleft;
console.log(socId);
socket.on('connect', function() {
  socket.emit('data');
  //if we get data from the server.
  socket.on('datatofront', function(data) {
    var difference = Math.abs(data[1] - data[0]);
    memoryleft = formatBytes(difference);
    totalmem = formatBytes(data[1]);
    var cpuUsage = data[2];
    console.log(memoryleft);
    console.log(totalmem);
    cpuChart(cpuUsage);
    console.log(cpuUsage);
    updateram();
    socket.on('disconnect', function() {
      document.getElementById("content").innerHTML = "<br><strong><h1>Server has disconnected";
      document.getElementById("ram").innerHTML = "";
    });
  });
});
//there is a problem with the x axis
function cpuChart(data) {
  var chart = new CanvasJS.Chart("content", {
    //theme: "light2",
    title: {
      text: "Cpu data"
    },
    axisY: {
      maximum: 100
    },
    data: [{
      type: "line",
      dataPoints: dps
    }]
  });

  var updateChart = function(count) {

    count = count || 1;
    dps.push({
      x: xVal,
      y: yVal
    });
    yVal = parseInt(data);
    xVal++;
    if (dps.length > dataLength) {
      dps.shift();
    }
    chart.render();
  };

  updateChart(dataLength);

}

function updateram() {
  document.getElementById("ram").innerHTML = "<br><strong><h1>ram usage: <br>" +
    memoryleft + "/" + totalmem;

}