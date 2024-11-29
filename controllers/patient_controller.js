var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
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

router.get('/', (req, res) => {
    db.getAllPatients(function (err, patients) {
        if (err) {
            console.error("Error updating Patient details: ", err);
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



router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


router.get('/edit_patient/:id', (req, res) => {
    const patientId = req.params.id;
    db.getPatientById(patientId, (err, patient) => {
        if (err) {
            console.error("Error fetching patient details:", err);
            return res.status(500).send("Error fetching patient details.");
        }
        res.render('edit_patient.ejs', { patient: patient[0] });
    });
});


router.post('/update_patient/:id', (req, res) => {
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

    db.updatePatient(id, first_name, last_name, email, date_of_birth, address, phone, gender, (err, result) => {
        if (err) {
            console.error("Error during update:", err);
            return res.render('edit_patient.ejs', {
                message: 'Update failed. Please try again.',
                patient: req.body, // Send form data back for the user to see
                error: true,
            });
        }

        // Fetch the updated patient details and render the edit form
        db.getPatientById(id, (err, updatedPatient) => {
            if (err) {
                console.error("Error fetching updated patient details:", err);
                return res.status(500).send("Error fetching updated patient details.");
            }

            if (updatedPatient.length > 0) {
                req.flash('success','Patient updated successfully!');
                res.redirect('/patients');
            } else {
                return res.status(404).send("Patient not found.");
            }
        });
    });
});

router.get('/delete_patient/:id', (req, res) => {
    const id = req.params.id;
    // console.log("Trying to delete patient with ID:", id); // Log for debugging

    db.deletePatient(id, (err, result) => {
        if (err) {
            console.error("Error deleting patient:", err);
            return res.status(500).send('Error deleting patient.');
        }

        // Check if any rows were affected/deleted
        if (result.affectedRows === 0) {
            console.log("Patient not found or already deleted."); // Log if not found
            return res.status(404).send('Patient not found.');
        }
        req.flash('success', 'Patient deleted successfully');
        res.redirect('/patients');
    });
});

router.get('/add_patient', function (req, res) {
    res.render('add_patient.ejs');
});

router.post('/add_patient', function (req, res) {
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
    } = req.body;

    if (!first_name || !last_name || !email || !password || !contact || !cnic) {
        return res.status(400).send("Please fill all required fields.");
    }

    // Step 1: Fetch the last doctor_id
    db.getPatientId(function (err, result) {
        if (err) {
            console.error('Error fetching max patient_id:', err);
            return res.status(500).send('Error fetching last patient ID.');
        }

        // Step 2: Calculate new doctor_id
        const newPatientId = result[0].maxId ? result[0].maxId + 1 : 1; // Start at 1 if no records exist

        // Step 3: Insert the new doctor record with the calculated doctor_id
        db.addPatient(newPatientId, first_name, last_name, email, password, date_of_birth, address, cnic, contact, gender, function (err, result) {
            if (err) {
                console.error("Error adding patient:", err);
                return res.status(500).send('Error adding patient.');
            }

            // Redirect to the patient list or a success page
            req.flash('success', 'Patient added successfully with ID: ', newPatientId);
            res.redirect('/patients'); // Change this to your intended after-insertion page
        });
    });
});


module.exports = router;