var express = require('express');
var router = express.Router();
var db = require.main.require('./models/db_controller');
var bodyPaser = require('body-parser');
const bcrypt = require('bcrypt');


router.get('*', function (req, res, next) {
    // if(req.cookies['email'] == null){
    // 	res.redirect('/login');
    // }else{
    next();
    // }
});


router.get('/', function (req, res) {
    db.getAllDoctorsWithSpecialties(function (err, result) {
        db.getAllPatients(function (err, patient) {
            db.getAllAppointment(function (err, result1) {
                if (err) {
                    console.error("Error fetching appointments:", err);
                    return res.status(500).send("Internal Server Error");
                }

                var total_doc = result.length;
                var appointment = result1.length;
                var patients = patient.length;
                res.render('home.ejs', { doc: total_doc, doclist: result, appointment: appointment, applist: result1,patients:patients,tot_patient:patient});
            });

        });
    });

});

router.get('/doctors', (req, res) => {
    db.getAllDoctorsWithSpecialties((err, doctors) => {
        if (err) {
            return res.status(500).send('Error fetching doctor list');
        }
        // Format date of birth for each doctor
        doctors.forEach(doctor => {
            const date = new Date(doctor.date_of_birth);
            if (!isNaN(date.getTime())) { // Check if the date is valid
                doctor.date_of_birth = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
            } else {
                doctor.date_of_birth = ''; // Handle case where date is invalid
            }
        });
        res.render('doctors.ejs', { list: doctors }); // Pass the formatted doctors list to the view
    });
});

router.get('/edit_doctor/:id', function (req, res) {
    var doctorId = req.params.id;
    db.getDoctorById(doctorId, function (err, result) {
        if (err) {
            console.error("Error fetching doctor details: ", err);
            return res.status(500).send("Server Error");
        }
        if (result.length > 0) {
            res.render('edit_doctor.ejs', { doctor: result[0] });
        } else {
            res.status(404).send("Doctor not found");
        }
    });
});

// Edit doctor POST route for saving updates
router.get('/changePassword', function (req, res) {
    res.render('changePassword.ejs', { message: null, messageClass: null });
});

// Handle Change Password on form submit
router.post('/changePassword', function (req, res) {
    const { oldPassword, newPassword } = req.body;
    const adminEmail = req.cookies['email'];

    // Fetch the admin data from the database
    db.getAdminByEmail(adminEmail, function (err, admin) {
        if (err) {
            console.error("Error fetching admin details: ", err);
            return res.status(500).send("Server Error");
        }

        if (!admin) {
            return res.render('changePassword', {
                message: 'Admin not found!',
                messageClass: 'error'
            });
        }

        // Compare the old password with the stored password
        if (oldPassword !== admin.password) {
            return res.render('changePassword.ejs', {
                message: 'Old password is incorrect!',
                messageClass: 'error'
            });
        }

        // Update the new password in the database
        db.updateAdminPassword(adminEmail, newPassword, function (err, result) {
            if (err) {
                console.error("Error updating password: ", err);
                return res.status(500).send("Server Error");
            }

            return res.render('changePassword.ejs', {
                message: 'Password updated successfully!',
                messageClass: 'success'
            });
        });
    });
});


module.exports = router;