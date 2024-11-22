var express = require ('express');
var router = express.Router();
var db = require.main.require ('./models/db_controller');
var bodyPaser = require ('body-parser');

router.get('*', function(req, res, next){
	// if(req.cookies['username'] == null){
	// 	res.redirect('/login');
	// }else{
		next();
	// }
});

router.get('/',function(req,res){
    db.getallappointment(function(err,appointments){
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
        console.log(appointments);
        res.render('appointment.ejs',{list :appointments});
    })
    
});

// router.get('/add_appointment',function(req,res){
//     res.render('add_appointment.ejs');
// });
// router.get('/add_appointment',function(req,res){
//     db.getAllPatients_with_fullname(function(err,patients){
//         if (err) {
//             console.error("Error updating Patient details: ", err);
//             return res.status(500).send("Server Error");
//         }
//     db.getAllDoctors_with_fullname(function(err,Doctors){
//             if (err) {
//                 console.error("Error updating Patient details: ", err);
//                 return res.status(500).send("Server Error");
//             }
//         console.log(Doctors);
//         res.render('add_appointment.ejs',{doctors :Doctors});
//     })
    
// });
router.get('/add_appointment', function (req, res) {
    db.getAllPatients_with_fullname(function (err, patients) {
        if (err) {
            console.error("Error fetching patient details: ", err);
            return res.status(500).send("Server Error");
        }

        // Fetch doctors after patients
        db.getAllDoctors_with_schedule(function (err, doctors) {
            if (err) {
                console.error("Error fetching doctor details: ", err);
                return res.status(500).send("Server Error");
            }

            // Pass both patients and doctors to the view
            res.render('add_appointment.ejs', { 
                patients: patients, 
                doctors: doctors 
            });
        });
    });
});


router.post('/add_appointment',function(req,res){

    db.add_appointment(req.body.p_name,req.body.department,req.body.d_name,req.body.date,req.body.time,req.body.email,req.body.phone,function(err,result){
        res.redirect('/appointment');
    });

});


router.get('/edit_appointment/:id',function(req,res){
    var id = req.params.id;
    db.getappointmentbyid(id,function(err,result){
        console.log(result);
        res.render('edit_appointment.ejs',{list : result});
    });

});

router.post('/edit_appointment/:id',function(req,res){
    var id = req.params.id;
    db.editappointment(id,req.body.p_name,req.body.department,req.body.d_name,req.body.date,req.body.time,req.body.email,req.body.phone,function(err,result){
        res.redirect('/appointment');
    });
});


router.get('/delete_appointment/:id',function(req,res){
    var id = req.params.id;
    db.getappointmentbyid(id,function(err,result){
        console.log(result);
        res.render('delete_appointment.ejs',{list:result});
    })
    
});

router.post('/delete_appointment/:id',function(req,res){
    var id =req.params.id;
    db.deleteappointment(id,function(err,result){
        res.redirect('/appointment');
    });
})
module.exports =router;