var express = require('express'),
    app = express(),
    default_port = (process.env.PORT || 3000);

app.get('/', function (req, res) {
  res.send('Hello World!');
});

var server = app.listen(default_port, function () {
  var port = server.address().port;

  console.log('Example app listening on port ' + port);
});
