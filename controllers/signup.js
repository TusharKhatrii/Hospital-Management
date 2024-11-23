var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var db = require.main.require("./models/db_controller");
const { check, validationResult } = require("express-validator");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Render the signup page
router.get("/", function (req, res) {
  res.render("signup.ejs");
});

// Handle form submission
router.post("/", function (req, res) {
  var {
    first_name,
    last_name,
    email,
    password,
    date_of_birth,
    address,
    cnic,
    contact,
    gender
  } = req.body;

  // Insert user details into the database
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
      req.flash('success', 'Sign up successfully');
      res.redirect('/signup'); // Change this to your intended after-insertion page
    });
  });
});

module.exports = router;
