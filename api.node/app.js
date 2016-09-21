var app = require('express')();
var bodyParser = require('body-parser');
var routes = require("./routes");

const port = 8080;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.all('/*', function(req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

/*
** Routes configuration
*/
routes.configure(app);


/*
** Server deployment
*/

var server = app.listen(port, function() {
    console.log('\033[1;32m> Server running at localhost:' + port + '/\033[0m');
});
