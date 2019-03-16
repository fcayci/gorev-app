var express = require('express');
var path = require('path');
var http = require('http');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var home = require('./server/routes/home.js');
var kadro = require('./server/routes/FacultyRoutes.js');
var angarya = require('./server/routes/TaskRoutes.js');
var mesgul  = require('./server/routes/BusyRoutes.js');

const port = 3000;

var app = express();

// Cross Origin Request (CORS)
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "http://localhost:4200");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   next();
// });

var mongoDB = 'mongodb://127.0.0.1:27017/gtuee';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

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
app.use('/api/angarya', angarya);
app.use('/api/kadro', kadro);
app.use('/api/mesgul', mesgul);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(port, function(){
  console.log('[server.js] Server started on port ' + port);
})

