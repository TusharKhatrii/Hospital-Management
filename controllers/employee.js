var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require.main.require('./models/db_controller');
const { check, validationResult } = require('express-validator');
const { callbackPromise } = require('nodemailer/lib/shared');


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
            return res.status(500).send('Server Error');
        }
        result.forEach(doctor => {
            const date = new Date(doctor.date_of_birth);
            if (!isNaN(date.getTime())) {
                doctor.date_of_birth = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
            } else {
                doctor.date_of_birth = '';
            }
        });
        res.render('employee.ejs', { list: result });
    });
});

router.get('/add_employee', function (req, res) {
    db.getAllRoles(function (err, role) {
        if (err) {
            console.error(err);
            return callback(err);
        }
        res.render('add_employee.ejs', { list: role });
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
    } = req.body;

    if (!first_name || !last_name || !email || !password || !contact || !cnic) {
        return res.status(400).send("Please fill all required fields.");
    }

    db.getEmployeeId(function (err, result) {
        if (err) {
            console.error('Error fetching max employee_id:', err);
            return res.status(500).send('Error fetching last employee ID.');
        }

        const newEmployeeId = result[0].maxId ? result[0].maxId + 1 : 1; // Start at 1 if no records exist

        db.addEmployee(newEmployeeId, first_name, last_name, email, password, date_of_birth, address, cnic, contact, gender, role_id, function (err, result) {
            if (err) {
                console.error("Error adding employee:", err);
                return res.status(500).send('Error adding employee.');
            }

            // Redirect to the employee list or a success page
            req.flash('success', 'Employee added successfully with ID: ', newEmployeeId);
            res.redirect('/employee');
        });
    });
});

router.get('/edit_employee/:id', function (req, res) {
    id = req.params.id;
    db.getEmployeeById(id, function (err, emp) {
        if (err) {
            console.error(err);
            return res.status(500).send('Error updating employee');
        }
        if (emp.length > 0) {
            db.getAllRoles(function (err, roles) {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error getting roles');
                }
                res.render('edit_employee.ejs', { employee: emp[0], roles: roles });
            });
        }
        else {
            return res.status(400).send('Employee not found');
        }
    });
});

router.post('/edit_employee/:id', function (req, res) {
    var id = req.params.id;
    db.editEmployee(id, req.body.first_name, req.body.last_name, req.body.email, req.body.date_of_birth, req.body.address, req.body.gender, req.body.phone, function (err, result) {
        if (err) throw err;
        req.flash('success', 'Employee updated successfully');
        res.redirect('/employee');
    });
});

router.post('/delete_employee/:id', function (req, res) {
    var id = req.params.id;
    db.deleteEmployee(id, function (err, result) {
        if (err) {
            console.error(err);
            res.status(500).send('Cannot delete employee');
        }
        req.flash('success', 'Employee Deleted Successfully');
        res.redirect('/employee');
    });
});

module.exports = router;