var express = require('express');
var mysql = require('mysql');
var session = require('express-session');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require.main.require('./models/db_controller'); // Adjust if necessary
const { check, validationResult } = require('express-validator');
var sweetalert = require('sweetalert2');

// Database connection
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hms',
    port: 3307 // Updated to match your settings
});

// Middleware
router.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

router.get('/', function (req, res) {
    res.render('login.ejs');  // This renders the login page when you visit '/login'
});

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Login route
router.post('/', [
    check('email').notEmpty().withMessage("Email is required"),
    check('password').notEmpty().withMessage("Password is required"),
    check('user_type').notEmpty().withMessage("Please select user type")
], function (request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(422).json({ errors: errors.array() });
    }

    const { email, password, user_type } = request.body;

    console.log('Received data:', email, password, user_type);  // Log the form data

    let table = user_type;

    if (email && password && user_type) {
        const query = `SELECT * FROM ${table} WHERE email = ? AND password = ?`;

        con.query(query, [email, password], function (error, results) {
            if (error) {
                console.error("Database error: ", error);
                return response.send('Database error');
            }

            if (results.length > 0) {
                const doctorId = results[0].doctor_id;
                response.cookie('email', email, { httpOnly: true, secure: false }); // Set email cookie
                sweetalert.fire('logged In!');
                if (user_type === 'doctor') {
                    response.redirect(`/doctor/home/${doctorId}`); // Redirect to doctor dashboard
                } else {
                    response.redirect('/home'); // Redirect to home for other user types
                }
            } else {
                response.render('login.ejs', { error: 'Invalid credentials. Please try again.' }); // Render with an error message
                // response.redirect('/login');  // If credentials don't match, stay on login page
            }

        });

    } else {
        response.send('Please enter email, password, and user type');
        response.end();
    }
});


module.exports = router;
