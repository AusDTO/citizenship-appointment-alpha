var express = require('express'),
    app = express(),
    path = require('path'),
    default_port = (process.env.PORT || 3000);


app.use('/', express.static(path.join(__dirname,'public')));

var server = app.listen(default_port, function () {
  var port = server.address().port;

  console.log('Example app listening on port ' + port);
});
