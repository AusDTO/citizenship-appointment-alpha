var express = require('express'),
    app = express(),
    consolidate = require('consolidate'),
    hogan = require('hogan.js'),
    uuid = require('node-uuid'),
    path = require('path'),
    querystring = require('querystring'),
    default_port = (process.env.PORT || 3000);

app.engine('mustache', consolidate.hogan); // set templating engine for .mustache files
app.set('view engine', 'mustache');  // default extension for template names when used with res.render
app.set('views', path.join(__dirname, 'templates')); // default template location

app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/calendar.ics', function(req, res) {
  res.type('text/calendar');
  res.render('calendar', {
    id: uuid.v4()
  })
});

app.get('/googlecalendar', function(req, res) {
  var calendar_event = querystring.stringify({
    'action': 'TEMPLATE',
    'text': 'Citizenship Appointment',
    'dates': '20151126T132000/20151126T140000',
    'czt': 'Australia/Melbourne',
    'location': '2 Lonsdale Street, Melbourne VIC 3000, Australia',
    'details': 'Line 1\nLine2',
    'trp': 'false'
  });
  res.redirect('http://www.google.com/calendar/event?' + calendar_event);
});

var server = app.listen(default_port, function () {
  var port = server.address().port;
  console.log('Listening on port ' + port);
});
