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
router.post(
  "/",
  [
    check("first_name").notEmpty().withMessage("First name is required"),
    check("last_name").notEmpty().withMessage("Last name is required"),
    check("email").isEmail().withMessage("Valid email is required"),
    check("password").notEmpty().withMessage("Password is required"),
    check("date_of_birth").notEmpty().withMessage("Date of birth is required"),
    check("address").notEmpty().withMessage("Address is required"),
    check("cnic").isInt().withMessage("Valid CNIC is required"),
    check("contact").isInt().withMessage("Valid contact number is required"),
    check("gender").notEmpty().withMessage("Gender is required")
  ],
  function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // Extract data from the form
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
    db.signup(
      first_name,
      last_name,
      email,
      password,
      date_of_birth,
      address,
      cnic,
      contact,
      gender,
      function (err, result) {
        if (err) {
          console.error("Error saving user data:", err);
          return res.status(500).json({ error: "Error saving user data" });
        }
        res.send("Signup successful. You can now log in.");
      }
    );
  }
);

module.exports = router;
