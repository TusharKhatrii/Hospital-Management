var express = require('express');
var session = require('express-session');
var cookie = require('cookie-parser');
var path = require('path');
var ejs = require('ejs');
var multer = require('multer');
var path = require('path');
var async = require('async');
var nodmailer = require('nodemailer');
var crypto = require('crypto');
var expressValidator = require('express-validator');
var sweetalert = require('sweetalert2');
const flash = require('connect-flash');


var app = express();



var bodyParser = require('body-parser');

var login = require('./controllers/login');
var home = require('./controllers/home');
var signup = require('./controllers/signup');
var doc_controller = require('./controllers/doc_controller');
var db = require('./models/db_controller');
var reset = require('./controllers/reset_controller');
var set = require('./controllers/set_controller');
var employee = require('./controllers/employee.js');
var roles = require('./controllers/roles.js');
var logout = require('./controllers/logout');
var verify = require('./controllers/verify');
var store = require('./controllers/store');
var landing = require('./controllers/landing');
var complain = require('./controllers/complain');
var inbox = require('./controllers/inbox');
var appointment = require('./controllers/appointment');
var schedule = require('./controllers/schedule');
var patient_controller = require('./controllers/patient_controller');
var roles = require('./controllers/roles.js');


var receipt = require('./controllers/receipt');
var chat = require('./controllers/chat');

var app = express();

app.use(session({
    secret: 'your-secret-key', // Change this for production
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using https
}));

app.use(flash());
app.set('view engine ', 'ejs');


app.use((req, res, next) => {
    res.locals.successMessages = req.flash('success');
    res.locals.errorMessages = req.flash('error');
    next();
});
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookie());
//app.use(expressValidator());


var server = app.listen(3000, function () {

    console.log('server started');
});

app.use('/login', login);
app.use('/home', home);
app.use('/signup', signup);
app.use('/doctors', doc_controller);
app.use('/patients', patient_controller);
app.use('/resetpassword', reset);
app.use('/setpassword', set);
app.use('/employee', employee);
app.use('/roles', roles)
app.use('/logout', logout);
app.use('/verify', verify);
app.use('/store', store);
app.use('/', landing);
app.use('/complain', complain);
app.use('/inbox', inbox);
app.use('/appointment', appointment);
app.use('/schedule', schedule);
app.use('/receipt', receipt);
app.use('/roles', roles);