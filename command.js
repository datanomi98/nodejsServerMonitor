var exec = require('child_process').exec;
exec('echo $(vmstat 1 2|tail -1|awk \'{print $15}\')', function(error, stdout, stderr) {
  console.log((100 - stdout)+'%');
  if (error !== null) {
    console.log('exec error: ' + error);
  }
});
