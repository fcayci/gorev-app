const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');

const home = require('./server/routes/home');
//const tasks = require('./server/routes/tasks');
const people = require('./server/routes/people');
const dummy = require('./server/routes/dummy');

const port = 3000;

const app = express();

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
app.use('/api', people);
app.use('/api', dummy);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(port, function(){
  console.log('[server.js] Server started on port ' + port);
})