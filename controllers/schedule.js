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
    db.getAllSchedule(function (err, schedules) {
        if (err) {
            // console.error("Error updating Patient details: ", err);
            return res.status(500).send("Server Error");
        }
        res.render('schedule.ejs', { list: schedules });
    })

});

router.get('/add_schedule', function (req, res) {
    db.getAllDoctors(function (err, doctors) {
        if (err) {
            console.error("Error fetching schedules details: ", err);
            return res.status(500).send("Server Error");
        }

            res.render('add_schedule.ejs', {doctors: doctors});
        });
});


router.post('/add_schedule', function (req, res) {

    const
        {
            title,
            start_time,
            end_time,
            NOP,
            doctor_id,
        } = req.body;
    console.log(req.body);

    if (!title || !start_time || !end_time || !NOP || !doctor_id) {
        return res.status(400).send('All fields are required.');
    }
    db.getScheduleId(function (err, result) {
        if (err) {
            console.error('Error fetching max schedule:', err);
            return res.status(500).send('Error fetching last schedule ID.');
        }

        const newScheduleID = result[0].maxId ? result[0].maxId + 1 : 1;
        console.log(newScheduleID);
        db.addschedule(newScheduleID, title, start_time, end_time, NOP, doctor_id, function (err, schedule) {
            if (err) {
                console.error("Error adding Schedule:", err);
                return res.status(400).send('Error adding Schedule.');
            }
            req.flash('success','New Schedule Added');
            res.redirect('/schedule');
        });
    });
}); 


// router.get('/edit_appointment/:id', function (req, res) {
//     var id = req.params.id;
//     db.getappointmentbyid1(id, function (err, result) {
//         res.render('edit_appointment.ejs', { list: result });
//     });
// });

// router.post('/edit_appointment/:id', function (req, res) {
//     var id = req.params.id;
//     db.editappointment(id, req.body.p_name, req.body.department, req.body.d_name, req.body.date, req.body.time, req.body.email, req.body.phone, function (err, result) {
//         res.redirect('/appointment');
//     });
// });

router.get('/delete_schedule/:id', function (req, res) { 
    var id = req.params.id;
    db.getschedulebyid1(id, function (err, result) {
        if (err) {
            console.error('Error fetching schedule:', err);
            return res.status(500).send('Error fetching schedule.');
        }
        res.render('delete_schedule.ejs', { list: result });
    });
});

router.post('/delete_schedule/:id', function (req, res) {
    var id = req.params.id;
    db.deleteschedule(id, function (err, result) {
        if (err) {
            console.error('Error deleting schedule:', err);
            return res.status(500).send('Error deleting schedule.');
        }
        res.redirect('/schedule');
    });
});


module.exports = router;