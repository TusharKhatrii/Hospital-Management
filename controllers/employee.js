var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require.main.require('./models/db_controller');
const { check, validationResult } = require('express-validator');


router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('*', function (req, res, next) {
    // if(req.cookies['email'] == null){
    // res.redirect('/login');
    // }else{
    next();
    // }
});

router.get('/', function (req, res) {
    db.getAllEmployees(function (err, result) {
        if (err) {
            console.error(err);
            return res.status(500).send('Server Error'); // Sends a server error response
        }
        result.forEach(doctor => {
            const date = new Date(doctor.date_of_birth);
            if (!isNaN(date.getTime())) { // Check if the date is valid
                doctor.date_of_birth = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
            } else {
                doctor.date_of_birth = ''; // Handle case where date is invalid
            }
        });
        res.render('employee.ejs', { list: result }); // Render the Employee.ejs template with data
    });
});

router.get('/add_employee', function (req, res) {
    db.getAllEmployees(function (err, result) {
        if (err) {
            console.error(err);
            return callback(err);
        }
        res.render('add_employee.ejs', { list: result });
    });
});

router.post('/add_employee', function (req, res) {
    const { 
        first_name, 
        last_name, 
        email, 
        password, 
        date_of_birth, 
        address, 
        cnic, 
        contact, 
        gender, 
        role_id
    } = req.body; // Destructure req.body

    // Use your db method for adding a doctor
    if (!first_name || !last_name || !email || !password || !contact || !cnic) {
        return res.status(400).send("Please fill all required fields.");
    }

    // Step 1: Fetch the last employee_id
    db.getEmployeeId(function(err, result) {
        if (err) {
            console.error('Error fetching max employee_id:', err);
            return res.status(500).send('Error fetching last employee ID.');
        }

        // Step 2: Calculate new employee_id
        const newEmployeeId = result[0].maxId ? result[0].maxId + 1 : 1; // Start at 1 if no records exist

        // Step 3: Insert the new Employee record with the calculated employee_id
        db.addEmployee(newEmployeeId, first_name, last_name, email, password, date_of_birth, address, cnic, contact, gender, role_id, function (err, result) {
            if (err) {
                console.error("Error adding employee:", err);
                return res.status(500).send('Error adding employee.');
            }
        console.log('1 employee inserted');

        // Redirect to the employee list or a success page
        req.flash('success', 'Employee added successfully with ID: ',newEmployeeId);
        res.redirect('/employee'); // Change this to your intended after-insertion page
    });
});
});

module.exports = router;