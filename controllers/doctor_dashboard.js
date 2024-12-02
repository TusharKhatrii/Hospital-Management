var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var multer = require('multer');
var fs = require('fs');
var path = require('path');



var db = require.main.require('./models/db_controller');


router.get('*', function (req, res, next) {
    // if(req.cookies['email'] == null){
    // 	res.redirect('/login');
    // }else{
    next();
    // }
});
router.get('/:id', function (req, res) {
    const doctorId = req.params.id;

    // Fetch doctor's details (name and specialty)
    db.getDoctorDetails(doctorId, function (err, doctorDetails) {
        if (err) {
            console.error("Error fetching doctor details:", err);
            return res.send('Error fetching doctor details');
        }

        if (!doctorDetails) {
            return res.send('Doctor not found');
        }

        // Fetch total number of patients
        db.getTotalPatients(doctorId, function (err, totalPatients) {
            if (err) {
                console.error("Error fetching total patients:", err);
                return res.send('Error fetching total patients');
            }

            // Fetch total number of appointments
            db.getTotalAppointments(doctorId, function (err, totalAppointments) {
                if (err) {
                    console.error("Error fetching total appointments:", err);
                    return res.send('Error fetching total appointments');
                }

                // Fetch all appointments
                db.getAppointmentsForDoctor(doctorId, function (err, appointmentList) {
                    if (err) {
                        console.error("Error fetching appointments:", err);
                        return res.send('Error fetching appointments');
                    }

                    // Fetch list of patients
                    db.getPatientsForDoctor(doctorId, function (err, patientList) {
                        if (err) {
                            console.error("Error fetching patients list:", err);
                            return res.send('Error fetching patients list');
                        }

                        // Render the doctor's dashboard page
                        res.render('doctor_dashboard.ejs', {
                            doctor: doctorDetails,
                            totalPatients: totalPatients,
                            totalAppointments: totalAppointments,
                            appointmentList: appointmentList,
                            patientList: patientList,
                            doctorName: doctorDetails.doctorName,
                            doctorSpecialty: doctorDetails.doctorSpecialty,
                        });
                    });
                });
            });
        });
    });
});


// router.get('/:id', function (req, res) {
//     const id = req.params.id;

//     db.getDoctorById(id, function (error, results) {
//         if (error) {
//             console.error("Database error: ", error);
//             return res.send('Database error');
//         }

//         if (results.length > 0) {
//             res.render('doctor_dashboard.ejs', { doctor: results[0] });
//         } else {
//             res.send('Doctor not found');
//         }
//     });
// });

module.exports = router;