// var express = require ('express');
// var router = express.Router();
// var db = require.main.require ('./models/db_controller');
// var bodyParser = require ('body-parser');

// router.get('*', function(req, res, next){
//     // if(req.cookies['email'] == null){ 
//     //     res.redirect('/login');
//     // } else {
//         next();
//     // }
// });



// router.get('/',function(req,res){
//     db.getAllDoc(function(err,result){
//         db.getallappointment(function(err,result1){
//             var total_doc = result.length ;
//             var appointment = result1.length;
//             res.render('home.ejs',{
//                 doc : total_doc, 
//                 doclist : result, 
//                 appointment : appointment, 
//                 applist : result1
//             });
//         });
//     });
// });

// router.get('/departments',function(req,res){
//     db.getalldept(function(err,result){
//         res.render('departments.ejs',{list:result});
//     });
// });

// router.get('/add_departments',function(req,res){
//     res.render('add_departments.ejs');
// });

// router.post('/add_departments',function(req,res){
//     var name = req.body.dpt_name;
//     var desc = req.body.desc;
//     db.add_dept(name,desc,function(err,result){
//         res.redirect('/home/departments');
//     });
// });

// router.get('/delete_department/:id',function(req,res){
//     var id = req.params.id;
//     db.getdeptbyId(id,function(err,result){
//         res.render('delete_department.ejs',{list:result});
//     });
// });

// router.post('/delete_department/:id',function(req,res){
//     var id = req.params.id;
//     db.delete_department(id,function(err,result){
//         res.redirect('/home/departments');
//     });
// });

// router.get('/edit_department/:id',function(req,res){
//     var id = req.params.id;
//     db.getdeptbyId(id,function(err,result){
//         res.render('edit_department.ejs',{list:result});
//     })
// });

// router.post('/edit_department/:id',function(req,res){
//     db.edit_dept(req.params.id,req.body.dpt_name,req.body.desc,function(err,result){
//         res.redirect('/home/departments');
//     });
// });

// router.get('/profile',function(req,res){
//     var email = req.cookies['email']; // Change username to email
//     db.getuserdetails(email,function(err,result){
//         res.render('profile.ejs',{list:result});
//     });
// });

// router.post('/profile',function(req,res){
//     var email = req.cookies['email'];  // Change username to email
//     db.getuserdetails(email,function(err,result){
//         var id = result[0].id;
//         var password = result[0].password;
//         if (password == req.body.password){
//             db.edit_profile(id,req.body.email,req.body.new_password,function(err,result1){
//                 if (result1){
//                     res.send("Profile edited successfully");
//                 }
//                 if (!result1) { 
//                     res.send("Old password did not match"); 
//                 }
//             });
//         }
//     });
// });

// module.exports = router;


var express = require ('express');
var router = express.Router();
var db = require.main.require ('./models/db_controller');
var bodyPaser = require ('body-parser');


router.get('*', function(req, res, next){
	// if(req.cookies['email'] == null){
	// 	res.redirect('/login');
	// }else{
		next();
	// }
});


router.get('/',function(req,res){
    db.getAllDoctorsWithSpecialties(function(err,result){
        db.getallappointment(function(err,result1){
        var total_doc = result.length ;
        var appointment = result1.length;
         
        res.render('home.ejs',{doc : total_doc , doclist : result, appointment : appointment, applist : result1});
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
router.post('/edit_doctor/:id', function (req, res) {
    var doctorId = req.params.id;
    var updatedData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        date_of_birth: req.body.date_of_birth,
        address: req.body.address,
        gender: req.body.gender,
        contact: req.body.contact
    };

    db.updateDoctor(doctorId, updatedData, function (err, result) {
        if (err) {
            console.error("Error updating doctor details: ", err);
            return res.status(500).send("Server Error");
        }
        res.redirect('/doctors'); // Redirect back to the doctors list after updating
    });
});

router.get('/patients', (req, res) => {
    db.getAllPatients(function(err,patients){
        if(err)
        {
            console.error("Error updating doctor details: ", err);
            return res.status(500).send("Server Error");   
        }
        patients.forEach(patient => {
            const date = new Date(patient.date_of_birth);
            if (!isNaN(date.getTime())) { // Check if the date is valid
                patient.date_of_birth = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
            } else {
                patient.date_of_birth = ''; // Handle case where date is invalid
            }
        });
        res.render('patients.ejs', { list: patients }); // Replace `null` with actual data if needed
    })
});


router.get('/profile',function(req,res){
    var username = req.cookies['username'];
    db.getuserdetails(username,function(err,result){
        //console.log(result);
        res.render('profile.ejs',{list:result});
    });
});

router.post('/profile',function(req,res){
    var username = req.cookies['username'];
    db.getuserdetails(username,function(err,result){
        var id = result[0].id;
        var password = result[0].password;
        var username = result[0].username; 
        if (password== req.body.password){

            db.edit_profile(id,req.body.username,req.body.email,req.body.new_password,function(err,result1){
                if (result1){
                    res.send("profile edited successfully");
                }
                if(!result1){ res.send("old password did not match");}
            });
        }
    }) ;
});

module.exports =router;