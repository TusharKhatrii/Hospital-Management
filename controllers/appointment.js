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

    const
        {
            appointment_number,
            appointment_date,
            appointment_status,
            patient_id,
            schedule_id,
        } = req.body;
    console.log(req.body);

    if (!appointment_number || !appointment_date || !appointment_status || !patient_id || !schedule_id) {
        return res.status(400).send('All fields are required.');
    }
    db.getAppointmentId(function (err, result) {
        if (err) {
            console.error('Error fetching max appointment:', err);
            return res.status(500).send('Error fetching last appointment ID.');
        }

        const newAppointmentID = result[0].maxId ? result[0].maxId + 1 : 1;
        db.addAppointment(newAppointmentID, appointment_number, appointment_date, appointment_status, patient_id, schedule_id, function (err, result) {
            if (err) {
                console.error("Error adding appointment:", err);
                return res.status(400).send('Error adding appointment.');
            }
            req.flash('success','New Appointment Added');
            res.redirect('/appointment');
        });
    });
}); 


router.get('/edit_appointment/:id', function (req, res) {
    var id = req.params.id;
    db.getappointmentbyid(id, function (err, result) {
        res.render('edit_appointment.ejs', { list: result });
    });
});

router.post('/edit_appointment/:id', function (req, res) {
    var id = req.params.id;
    db.editappointment(id, req.body.p_name, req.body.department, req.body.d_name, req.body.date, req.body.time, req.body.email, req.body.phone, function (err, result) {
        res.redirect('/appointment');
    });
});

router.get('/delete_appointment/:id', function (req, res) {
    var id = req.params.id;
    db.getappointmentbyid(id, function (err, result) {
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