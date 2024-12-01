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

        res.render('add_schedule.ejs', { doctors: doctors });
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
            req.flash('success', 'New Schedule Added');
            res.redirect('/schedule');
        });
    });
});


router.get('/edit_schedule/:id', function (req, res) {
    var id = req.params.id;
    db.getschedulebyid1(id, function (err, result) {
        if (err) {
            return res.status(400).send('Error fetching schedule');
        }
        db.getAllDoctors(function (err1, doctor) {
            if (err1) {
                return res.status(400).send('Error fetching Doctor');
            }
            res.render('edit_schedule.ejs', { list: result[0], doctors: doctor });
        });
    });
});

router.post('/edit_schedule/:id', function (req, res) {
    // Get the schedule ID from the URL parameters
    var id = req.params.id;

    // Destructure the body to get the values
    const {
        title,
        start_time,
        end_time,
        NOP,
        doctor_id,
    } = req.body;

    // Ensure all required fields are present
    if (!title || !start_time || !end_time || !NOP || !doctor_id) {
        return res.status(400).send('All fields are required.');
    }

    // Call the database update function with the parameters
    db.updateSchedule(title, start_time, end_time, NOP, doctor_id,id, function (err, schedule) {
        if (err) {
            console.error("Error updating Schedule:", err);
            return res.status(400).send('Error updating Schedule.');
        }

        // Flash a success message and redirect
        req.flash('success', 'Schedule Updated');
        res.redirect('/schedule'); // Adjust this route if needed
    });
});


// router.post('/edit_schedule/:id', function (req, res) {
//     var id = req.params.id;
//     const
//         {
//             title,
//             start_time,
//             end_time,
//             NOP,
//             doctor_id,
//         } = req.body;

//     db.updateSchedule(id, title, start_time, end_time, NOP, doctor_id, function (err, schedule) {
//         if (err) {
//             console.error("Error updating Schedule:", err);
//             return res.status(400).send('Error updating Schedule.');
//         }
//         req.flash('success', 'Schedule Updated');
//         res.redirect('/schedule');
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