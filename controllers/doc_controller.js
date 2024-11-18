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



var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets/images/upload_images"); //here we specify the destination. in this case i specified the current directory
    },
    filename: function (req, file, cb) {
        console.log(file); //log the file object info in console
        cb(null, file.originalname);//here we specify the file saving name. in this case. 
        //i specified the original file name .you can modify this name to anything you want
    }
});

var upload = multer({ storage: storage });


router.get('/', function (req, res) {
    db.getAllDoc(function (err, result) {
        if (err)
            throw err;
        res.render('doctors.ejs', { list: result })
    });

});

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/add_doctor', function (req, res) {
    db.getalldept(function (err, result) {
        res.render('add_doctor.ejs', { list: result });
    });
});

router.post('/add_doctor', upload.single("image"), function (req, res) {
    // console.log(req.body.first_name);
    db.add_doctor(req.body.first_name, req.body.last_name, req.body.email, req.body.dob, req.body.gender, req.body.address, req.body.phone, req.file.filename, req.body.department, req.body.biography);
    if (db.add_doctor) {
        console.log('1 doctor inserted');
    }
    res.redirect('add_doctor.ejs');
});

router.get('/edit_doctor/:id', function (req, res) {
    const doctorId = req.params.id;
    db.getDoctorById(doctorId, (err, doctor) => {
        if (err) {
            return res.status(500).send('Error fetching doctor details');
        }
        if (doctor.length > 0) {
            res.render('edit_doctor.ejs', { doctor: doctor[0] });  // Pass doctor data to the view
        } else {
            res.status(404).send('Doctor not found');
        }
    });
});

router.post('/edit_doctor/:id',upload.single("image"), function (req, res) {
    var id = req.params.id;
    const image = req.file ? req.file.buffer : null;
    db.updateDoctor(id, req.body.first_name, req.body.last_name, req.body.email, req.body.date_of_birth, req.body.gender, req.body.address, req.body.phone,image, function (err, result) {
        if (err) throw err;
        res.render('edit_doctor.ejs',{list:result});
        res.redirect('back');
    });
});

// Update doctor route
router.post('/update_doctor/:id', upload.single("image"), (req, res) => {
    const { id } = req.params;
    const {
        first_name,
        last_name,
        email,
        date_of_birth,
        gender,
        address,
        phone
    } = req.body;
    
    // Check if an image was uploaded
    const image = req.file ? req.file.buffer : null;
    
    db.updateDoctor(id, first_name, last_name, email, date_of_birth, gender, address, phone, image, (err, result) => {
        if (err) {
            console.error("Error during update:", err);
            return res.render('edit_doctor.ejs', {
                message: 'Update failed. Please try again.',
                doctor: req.body,
                error: true
            });
        }
        
        // Render the edit page with a success message
        // console.log(req.body.date_of_birth);
        res.render('edit_doctor.ejs', {
            message: 'Doctor updated successfully!',
            doctor: req.body,
            error: false
        });
    });
});

router.get('/delete_doctor/:id', function (req, res) {
    // console.log('Doctor data:', doctor[0]);  // Debugging the data
    var id = req.params.id;
    db.getDocbyId(id, function (err, result) {
        res.render('delete_doctor.ejs', { list: result })
    });


});

router.post('/delete_doctor/:id', function (req, res) {
    var id = req.params.id;
    db.deleteDoc(id, function (err, result) {

        res.redirect('/doctors');
    });
});
//  router.get('/search',function(req,res){
//      res.rende
//      var key = req.body.search;
//      console.log(key);
//     db.searchDoc(key,function(err, rows, fields) {
//         if (err) throw err;
//       var data=[];
//       for(i=0;i<rows.length;i++)
//         {
//           data.push(rows[i].first_name);
//         }
//         res.end(JSON.stringify(data));
//       });
//     });


router.get('/', function (req, res) {

    db.getAllDoc(function (err, result) {
        if (err)
            throw err;
        res.render('doctors.ejs', { list: result })
    });

});


router.post('/search', function (req, res) {
    var key = req.body.search;
    db.searchDoc(key, function (err, result) {
        console.log(result);

        res.render('doctors.ejs', { list: result });
    });
});

module.exports = router;