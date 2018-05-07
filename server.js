const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');

const home = require('./server/routes/home');
//const tasks = require('./server/routes/tasks');
//const users = require('./server/routes/users');
const gtuee = require('./server/routes/gtuee');

const port = 3000;

const app = express();

// Cross Origin Request (CORS)
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "http://localhost:4200");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   next();
// });

// view engine
//app.set('views', 'views');
//app.set('view engine', 'ejs');
//app.engine('html', require('ejs').renderFile);

// static folder for client side
app.use(express.static(path.join(__dirname, 'public')));

// body parser middleware for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

app.use('/', home);
//app.use('/api', tasks);
//app.use('/api', users);
app.use('/api', gtuee);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(port, function(){
  console.log('[server.js] Server started on port ' + port);
})