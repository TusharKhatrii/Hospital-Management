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
    db.getAllDoctorsWithSpecialties(function (err, result) {
        if (err)
            throw err;
        result.forEach(doctor => {
            const date = new Date(doctor.date_of_birth);
            if (!isNaN(date.getTime())) { // Check if the date is valid
                doctor.date_of_birth = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
            } else {
                doctor.date_of_birth = ''; // Handle case where date is invalid
            }
        });
        res.render('doctors.ejs', { list: result })
    });
});

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/add_doctor', function (req, res) {
    db.getAllSpecialties(function (err, result) {
        if (err) {
            return res.status(500).send('Error fetching specialties.');
        }
        res.render('add_doctor.ejs', { list: result }); // Pass specialties to EJS
    });
});

router.post('/add_doctor', upload.single("image"), function (req, res) {
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
        specialist_id
    } = req.body; // Destructure req.body

    const image = req.file ? req.file.buffer : null; // Use the file buffer if image is uploaded
    // Use your db method for adding a doctor
    if (!first_name || !last_name || !email || !password || !contact || !cnic) {
        return res.status(400).send("Please fill all required fields.");
    }

    // Step 1: Fetch the last doctor_id
    db.getDocId(function(err, result) {
        if (err) {
            console.error('Error fetching max doctor_id:', err);
            return res.status(500).send('Error fetching last doctor ID.');
        }

        // Step 2: Calculate new doctor_id
        const newDoctorId = result[0].maxId ? result[0].maxId + 1 : 1; // Start at 1 if no records exist

        // Step 3: Insert the new doctor record with the calculated doctor_id
        db.add_doctor(newDoctorId, first_name, last_name, email, password, date_of_birth, address, image, cnic, contact, gender, specialist_id, function (err, result) {
            if (err) {
                console.error("Error adding doctor:", err);
                return res.status(500).send('Error adding doctor.');
            }
        console.log('1 doctor inserted');

        // Redirect to the doctor list or a success page
        req.flash('success', 'Doctor added successfully with ID: ',newDoctorId);
        res.redirect('/doctors'); // Change this to your intended after-insertion page
    });
});
}); 

router.get('/edit_doctor/:id', (req, res) => {
    const doctorId = req.params.id;
    db.getDoctorById(doctorId, (err, doctor) => {
        if (err) {
            return res.status(500).send('Error fetching doctor details');
        }
        if (doctor.length > 0) {
            db.getAllSpecialties((err, specialties) => {
                if (err) {
                    return res.status(500).send('Error fetching specialties');
                }
                // Render the EJS view with both doctor and specialties data
                // console.log(specialties);
                res.render('edit_doctor.ejs', {
                    doctor: doctor[0],
                    specialties: specialties
                });
            });
        } else {
            res.status(404).send('Doctor not found');
        }
    });
});

router.post('/edit_doctor/:id', upload.single("image"), function (req, res) {
    var id = req.params.id;
    const image = req.file ? req.file.buffer : null;
    db.updateDoctor(id, req.body.first_name, req.body.last_name, req.body.email, req.body.date_of_birth, req.body.gender, req.body.address, req.body.phone, image, function (err, result) {
        if (err) throw err;
        res.render('edit_doctor.ejs', { list: result });
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
        phone,
        specialist_id // Ensure this is included
    } = req.body;


    // Check if an image was uploaded

    // Check if an image was uploaded
    const image = req.file ? req.file.buffer : null;

    db.updateDoctor(id, first_name, last_name, email, date_of_birth, gender, address, phone, image, specialist_id, (err, result) => {
        if (err) {
            console.error("Error during update:", err);
            return res.render('edit_doctor.ejs', {
                message: 'Update failed. Please try again.',
                doctor: req.body,
                error: true,
                specialties: [] // Ensure specialties are available when rendering
            });
        }

        // Fetch the updated doctor details to render again
        db.getDoctorById(id, (err, updatedDoctor) => {
            if (err) {
                return res.status(500).send('Error fetching updated doctor details');
            }
            if (updatedDoctor.length > 0) {
                db.getAllSpecialties((err, specialties) => {
                    if (err) {
                        return res.status(500).send('Error fetching specialties');
                    }
                    return res.render('edit_doctor.ejs', {
                        message: 'Doctor updated successfully!',
                        doctor: updatedDoctor[0], // Updated doctor details
                        specialties: specialties,
                        error: false
                    });
                });
            } else {
                res.status(404).send('Doctor not found');
            }
        });
    });
});

router.get('/delete_doctor/:id', (req, res) => {
    const id = req.params.id;
    // console.log("Trying to delete doctor with ID:", id); // Log for debugging

    db.deleteDoctor(id, (err, result) => {
        if (err) {
            console.error("Error deleting doctor:", err);
            return res.status(500).send('Error deleting doctor.');
        }

        // Check if any rows were affected/deleted
        if (result.affectedRows === 0) {
            console.log("Doctor not found or already deleted."); // Log if not found
            return res.status(404).send('Doctor not found.');
        }
        req.flash('success', 'Doctor deleted successfully');
        res.redirect('/doctors');
    });
});


router.post('/search', function (req, res) {
    var key = req.body.search;
    db.searchDoc(key, function (err, result) {
        res.render('doctors.ejs', { list: result });
    });
});

module.exports = router;