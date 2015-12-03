var express = require('express'),
    app = express(),
    consolidate = require('consolidate'),
    hogan = require('hogan.js'),
    uuid = require('node-uuid'),
    qr = require('qr-image'),
    path = require('path'),
    querystring = require('querystring'),
    default_port = (process.env.PORT || 3000);

app.engine('mustache', consolidate.hogan); // set templating engine for .mustache files
app.set('view engine', 'mustache');  // default extension for template names when used with res.render
app.set('views', path.join(__dirname, 'templates')); // default template location

if (app.settings.env !== 'production') {
  app.use(require('connect-livereload')());  // runs livereload server and serves livereload.js
  require('express-livereload')(app);  // inserts <script> reference to livereload.js
}

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
    'dates': '20151204T130000/20151204T150000',
    'czt': 'Australia/Melbourne',
    'location': '2 Lonsdale Street, Melbourne VIC 3000, Australia',
    'details': 'Australian Citizenship Appointment\nplease bring all the required documents and make sure you are prepared to sit the test',
    'trp': 'false'
  });
  res.redirect('http://www.google.com/calendar/event?' + calendar_event);
});

app.get('/yahoocalendar', function(req, res) {
  var calendar_event = querystring.stringify({
    'v':'60',
    'DUR': '0200',
    'TITLE': 'Citizenship Appointment',
    'ST': '20151204T130000',
    'in_loc': '2 Lonsdale Street, Melbourne VIC 3000, Australia',
    'DESC': 'Australian Citizenship Appointment\nplease bring all the required documents and make sure you are prepared to sit the test'
  });
  res.redirect('http://calendar.yahoo.com/?' + calendar_event);
});

app.get('/outlookonline', function(req, res) {
  var calendar_event = querystring.stringify({
    'rru': 'addevent',
    'summary': 'Citizenship Appointment',
    'dtstart': '20151204T130000',
    'dtend': '20151204T150000',
    'location': '2 Lonsdale Street, Melbourne VIC 3000, Australia',
    'description': 'Australian Citizenship Appointment\nplease bring all the required documents and make sure you are prepared to sit the test',
  });
  res.redirect('http://calendar.live.com/calendar/calendar.aspx?' + calendar_event);
});

app.get('/qrcode', function(req, res) {
  var code = qr.image(
    "Welcome to our awesome Alpha! Your client id is: 9281112121",
    { type: 'svg' }
  );
  res.type('svg');
  code.pipe(res);
});

var server = app.listen(default_port, function () {
  var port = server.address().port;
  console.log('Listening on port ' + port);
});
