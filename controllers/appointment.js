var express = require('express');
var router = express.Router();
var db = require.main.require('./models/db_controller');
var bodyPaser = require('body-parser');

router.get('*', function (req, res, next) {
    // if(req.cookies['username'] == null){
    // 	res.redirect('/login');
    // }else{
    next();
    // }
});

router.get('/', function (req, res) {
    db.getAllAppointment(function (err, appointments) {
        if (err) {
            console.error("Error updating Patient details: ", err);
            return res.status(500).send("Server Error");
        }
        appointments.forEach(appointment => {
            const date = new Date(appointment.appointment_date);
            if (!isNaN(date.getTime())) { // Check if the date is valid
                appointment.appointment_date = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
            } else {
                appointment.appointment_date = ''; // Handle case where date is invalid
            }
        });
        res.render('appointment.ejs', { list: appointments });
    })

});

router.get('/add_appointment', function (req, res) {
    db.getAllPatients_with_fullname(function (err, patients) {
        if (err) {
            console.error("Error fetching patient details: ", err);
            return res.status(500).send("Server Error");
        }

        // Fetch doctors after patients
        db.getAllSchedule(function (err, schedule) {
            if (err) {
                console.error("Error fetching schedule details: ", err);
                return res.status(500).send("Server Error");
            }

            // Pass both patients and doctors to the view
            res.render('add_appointment.ejs', {
                patients: patients,
                list: schedule
            });
        });
    });
});


router.post('/add_appointment', function (req, res) {
    const {
        appointment_number,
        appointment_date,
        appointment_status,
        patient_id,
        schedule_id,
    } = req.body;
    
    console.log(req.body);
    
    // Validate all fields are provided
    if (!appointment_number || !appointment_date || !appointment_status || !patient_id || !schedule_id) {
        return res.status(400).send('All fields are required.');
    }
    
    if (appointment_number < 100) {
        return res.status(400).send('Appointment number should be grater than 100');
    }
    // Check if the appointment number already exists
    db.checkAppointmentNumber(appointment_number, function (err, exists) {
        if (err) {
            console.error('Error checking appointment number:', err);
            return res.status(500).send('Error checking appointment number.');
        }

        if (exists) {
            return res.status(400).send('Appointment number already exists.');
        }

        // Generate new appointment ID
        db.getAppointmentId(function (err, result) {
            if (err) {
                console.error('Error fetching max appointment:', err);
                return res.status(500).send('Error fetching last appointment ID.');
            }

            const newAppointmentID = result[0].maxId ? result[0].maxId + 1 : 1;

            // Add new appointment to database
            db.addAppointment(newAppointmentID, appointment_number, appointment_date, appointment_status, patient_id, schedule_id, function (err, result) {
                if (err) {
                    console.error('Error adding appointment:', err);
                    return res.status(400).send('Error adding appointment.');
                }

                req.flash('success', 'New Appointment Added');
                res.redirect('/appointment');
            });
        });
    });
});


router.get('/edit_appointment/:id', function (req, res) {
    var id = req.params.id;

    db.getappointmentbyid2(id, function (err, appointment) {
        if (err) {
            console.error("Error fetching appointment details: ", err);
            return res.status(500).send("Server Error");
        }
        // console.log(appointment);
        db.getAllPatients_with_fullname(function (err, patients) {
            if (err) {
                console.error("Error fetching patient details: ", err);
                return res.status(500).send("Server Error");
            }

            // Fetch doctors after patients
            db.getAllSchedule(function (err, schedule) {
                if (err) {
                    console.error("Error fetching schedule details: ", err);
                    return res.status(500).send("Server Error");
                }

                // Pass both patients and doctors to the view
                res.render('edit_appointment.ejs', {
                    patients: patients,
                    list: schedule,
                    appointment: appointment[0]
                });
            });
        });
    });
    //  res.render('edit_appointment.ejs');
});

router.post('/edit_appointment/:id', function (req, res) {
    var id = req.params.id;
    const
        {
            appointment_num,
            appointment_date,
            appointment_status,
            patient_id,
            schedule_id,
        } = req.body;
    db.updateAppointment(id, appointment_num, appointment_date, appointment_status, patient_id, schedule_id, function (err, result) {
        if (err) {
            console.error("Error updating appointment:", err);
            return res.status(400).send('Error updating appointment.');
        }
        req.flash('success', ' Appointment Updated');
        res.redirect('/appointment');
    });
});

router.get('/delete_appointment/:id', function (req, res) {
    var id = req.params.id;
    db.getappointmentbyid1(id, function (err, result) {
        res.render('delete_appointment.ejs', { list: result });
    })
});

router.post('/delete_appointment/:id', function (req, res) {
    var id = req.params.id;
    db.deleteappointment(id, function (err, result) {
        res.redirect('/appointment');
    });
})
module.exports = router;