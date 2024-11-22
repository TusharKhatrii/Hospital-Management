// var mysql = require("mysql");
// var express = require("express");
// var router = express.Router();

// // Create a connection to the database
// var con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "hms",
//   // port: 3307
// });

// // Connect to MySQL and run a test query
// con.connect(function (err) {
//   if (err) {
//     throw err;
//   } else {
//     console.log("Connected to MySQL database");
//   }
// });

// // Function to insert a new patient record into the database
// module.exports.signup = function (
//   first_name,
//   last_name,
//   email,
//   password,
//   date_of_birth,
//   address,
//   cnic,
//   contact,
//   gender,
//   callback
// ) {
//   // SQL query for inserting new data
//   var query = "INSERT INTO `Patient` (`first_name`, `last_name`, `email`, `password`, `date_of_birth`, `address`, `cnic`, `contact`, `gender`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

//   con.query(
//     query,
//     [first_name, last_name, email, password, date_of_birth, address, cnic, contact, gender],
//     function (err, results) {
//       if (err) {
//         console.error("Error during database insertion:", err); // Log any error
//         return callback(err); // Pass the error to the callback
//       }

//     }
//   );
// };

// module.exports.getDocId = function (callback) {
//   var query = "SELECT MAX(doctor_id) AS maxId FROM Doctor";
//   con.query(query, function (err, res) {
//     if (err) {
//       console.log("error in getting doctor id");
//       return callback(err);
//     }

//     callback(null, res);

//   })
// }

// module.exports.add_doctor = function (
//   doc_id,
//   first_name,
//   last_name,
//   email,
//   password,
//   date_of_birth,
//   address,
//   image,           // BLOB for the doctor's image
//   cnic,
//   contact,
//   gender,
//   specialist_id,  // Specialist ID from the Specialties table
//   callback
// ) {
//   // SQL query for inserting new doctor data
//   var query = "INSERT INTO `Doctor` (`doctor_id`,`first_name`, `last_name`, `email`, `password`, `date_of_birth`, `address`, `image`, `cnic`, `contact`, `gender`, `specialist_id`) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
//   // Execute the query with the provided values
//   con.query(
//     query,
//     [doc_id, first_name, last_name, email, password, date_of_birth, address, image, cnic, contact, gender, specialist_id],
//     function (err, results) {
//       if (err) {
//         console.error("Error during database insertion:", err); // Log any error
//         return callback(err); // Pass the error to the callback
//       }

//       // If the insertion is successful, return the results
//       callback(null, results);
//     }
//   );
// };
// // Example function to get all doctors with their specialties
// module.exports.getAllDoctorsWithSpecialties = function (callback) {
//   const sql = `
//       SELECT doctor.*, specialties.specialist_name
//       FROM doctor
//       LEFT JOIN specialties ON doctor.specialist_id = specialties.specialist_id
//   `;
//   con.query(sql, callback);
// };

// module.exports.getAllDoctors_with_schedule = function (callback) {
//   const sql = `
//      SELECT *, CONCAT(D.first_name,D.last_name) AS dname FROM doctor D JOIN SCHEDULE S ON S.doctor_id = D.doctor_id
//   `;
//   con.query(sql, callback);
// };

// module.exports.getDoctorById = function (id, callback) {
//   const sql = 'SELECT * FROM doctor WHERE doctor_id = ?';
//   con.query(sql, [id], function (err, result) {
//     if (err) {
//       console.error('Error executing query:', err);
//       return callback(err, null);
//     }
//     callback(null, result);
//   });
// };
// // Function to update doctor details
// module.exports.updateDoctor = function (
//   doctor_id,
//   first_name,
//   last_name,
//   email,
//   date_of_birth,
//   gender,
//   address,
//   phone,
//   image,
//   specialist_id,
//   callback
// ) {
//   // SQL query for updating doctor information including specialist_id
//   var query = `UPDATE Doctor SET 
//     first_name = ?, 
//     last_name = ?, 
//     email = ?, 
//     date_of_birth = ?, 
//     gender = ?, 
//     address = ?, 
//     contact = ?, 
//     image = ?,
//     specialist_id = ?
//     WHERE doctor_id = ?`;

//   con.query(
//     query,
//     [first_name, last_name, email, date_of_birth, gender, address, phone, image, specialist_id, doctor_id],
//     function (err, results) {
//       if (err) {
//         console.error("Error updating doctor:", err);
//         return callback(err);
//       }
//       callback(null, results);
//     }
//   );
// };

// module.exports.getAllSpecialties = function (callback) {
//   const query = `SELECT specialist_id,specialist_name FROM specialties`;
//   con.query(query, function (err, results) {
//     if (err) {
//       return callback(err);
//     }
//     // console.log("Specialties fetched from DB:", results);
//     callback(null, results);
//   });
// };

// module.exports.deleteDoctor = function (id, callback) {
//   // Use a parameterized query to prevent SQL injection
//   var query = "DELETE FROM doctor WHERE doctor_id = ?";

//   con.query(query, [id], function (err, results) {
//     if (err) {
//       console.error("Error deleting doctor:", err);
//       return callback(err);
//     }
//     callback(null, results);
//   });
// };

// module.exports.getAllPatients = function (callback) {
//   var query = `SELECT * FROM PATIENT`;
//   con.query(query, function (err, res) {
//     if (err) {
//       return callback(err);
//     }
//     callback(null, res);
//   })
// };
// module.exports.getAllPatients_with_fullname = function (callback) {
//   var query = `SELECT patient_id, CONCAT(first_name, ' ', last_name) AS pname FROM PATIENT`;
//   con.query(query, function (err, res) {
//     if (err) {
//       return callback(err);
//     }
//     callback(null, res);
//   })
// };

// module.exports.getPatientById = function (id, callback) {
//   var query = `SELECT * FROM PATIENT WHERE PATIENT_ID = ?`;
//   con.query(query, [id], function (err, result) {
//     if (err) {
//       console.error('Error executing query:', err);
//       return callback(err, null);
//     }
//     callback(null, result);
//   });
// }

// module.exports.updatePatient = function (
//   patient_id,
//   first_name,
//   last_name,
//   email,
//   date_of_birth,
//   address,
//   phone,
//   gender,
//   callback
// ) {
//   var query = `UPDATE Patient SET 
//     first_name = ?, 
//     last_name = ?, 
//     email = ?, 
//     date_of_birth = ?, 
//     address = ?, 
//     contact = ?,
//     gender = ?
//     WHERE patient_id = ?`;

//   con.query(
//     query,
//     [first_name, last_name, email, date_of_birth, address, phone, gender, patient_id],
//     function (err, results) {
//       if (err) {
//         console.error("Error updating patient:", err);
//         return callback(err);
//       }
//       console.log("Update successful:", results);
//       callback(null, results);
//     }
//   );
// };

// module.exports.deletePatient = function (id, callback) {
//   var query = "DELETE FROM patient WHERE patient_id = ?";

//   con.query(query, [id], function (err, results) {
//     if (err) {
//       console.error("Error deleting patient:", err);
//       return callback(err);
//     }
//     callback(null, results);
//   });
// };

// //getPaitentID and addPatinet...
// module.exports.getPatientId = function (callback) {
//   var query = `SELECT MAX(patient_id) AS maxId FROM patient`;
//   con.query(query, function (err, res) {
//     if (err) {
//       console.log("error in getting patient id");
//       return callback(err);
//     }
//     callback(null, res);
//   })
// };


// module.exports.addPatient = function (
//   patient_id,
//   first_name,
//   last_name,
//   email,
//   password,
//   date_of_birth,
//   address,
//   cnic,
//   contact,
//   gender,
//   callback
// ) {
//   var query = `INSERT INTO PATIENT(patient_id,first_name,last_name,email,password,date_of_birth,address,cnic,contact,gender) VALUES (?,?,?,?,?,?,?,?,?,?)`;
//   con.query(
//     query,
//     [patient_id, first_name, last_name, email, password, date_of_birth, address, cnic, contact, gender],
//     function (err, results) {
//       if (err) {
//         console.error("Error during database insertion:", err); // Log any error
//         return callback(err); // Pass the error to the callback
//       }

//       // If the insertion is successful, return the results
//       callback(null, results);
//     }
//   );
// };




// module.exports.getEmpbyId = function (id, callback) {
//   var query = "select * from employee where id =" + id;
//   con.query(query, callback);
// };


// module.exports.editEmp = function (
//   id,
//   name,
//   email,
//   contact,
//   join_date,
//   role,
//   callback
// ) {
//   var query =
//     "update `employee` set `name`='" +
//     name +
//     "', `email`='" +
//     email +
//     "', `contact`='" +
//     contact +
//     "', `join_date`='" +
//     join_date +
//     "', `role`='" +
//     role +
//     "' where id=" +
//     id;
//   con.query(query, callback);
// };



// module.exports.deleteEmp = function (id, callback) {
//   //console.log("i m here");
//   var query = "delete from employee where id=" + id;
//   con.query(query, callback);
// };

// module.exports.deletemed = function (id, callback) {
//   //console.log("i m here");
//   var query = "delete from store where id=" + id;
//   con.query(query, callback);
// };

// module.exports.postcomplain = function (
//   message,
//   name,
//   email,
//   subject,
//   callback
// ) {
//   var query =
//     "insert into complain (message,name,email,subject) values ('" +
//     message +
//     "','" +
//     name +
//     "','" +
//     email +
//     "','" +
//     subject +
//     "')";
//   console.log(query);
//   con.query(query, callback);
// };

// module.exports.getcomplain = function (callback) {
//   var query = "select * from complain";
//   con.query(query, callback);
// };

// module.exports.add_appointment = function (
//   p_name,
//   department,
//   d_name,
//   date,
//   time,
//   email,
//   phone,
//   callback
// ) {
//   var query =
//     "insert into appointment (patient_name,department,doctor_name,date,time,email,phone) values ('" +
//     p_name +
//     "','" +
//     department +
//     "','" +
//     d_name +
//     "','" +
//     date +
//     "','" +
//     time +
//     "','" +
//     email +
//     "','" +
//     phone +
//     "')";
//   con.query(query, callback);
// };

// module.exports.getallappointment = function (callback) {
//   var query = "select a.appointment_id, a.appointment_num, p.patient_id,  CONCAT(p.first_name, ' ', p.last_name) AS pname,d.doctor_id ,CONCAT(d.first_name, ' ', d.last_name) AS dname, a.appointment_date, s.start_time, s.end_time from appointment a join patient p on p.patient_id = a.patient_id join schedule s on s.schedule_id = a.schedule_id join doctor d on d.doctor_id = s.schedule_id";
//   con.query(query, callback);
// };

// module.exports.searchDoc = function (key, callback) {
//   var query = 'SELECT  *from doctor where first_name like "%' + key + '%"';
//   con.query(query, callback);
//   console.log(query);
// };

// module.exports.searchmed = function (key, callback) {
//   var query = 'SELECT  *from store where name like "%' + key + '%"';
//   con.query(query, callback);
// };

// module.exports.searchEmp = function (key, callback) {
//   var query = 'SELECT  *from employee where name  like "%' + key + '%"';
//   con.query(query, callback);
//   console.log(query);
// };

// module.exports.getappointmentbyid = function (id, callback) {
//   var query = "select * from appointment where appointment_id =" + id;
//   console.log(query);
//   con.query(query, callback);
// };

// module.exports.editappointment = function (
//   appointment_id,
//   p_name,
//   department,
//   d_name,
//   date,
//   time,
//   email,
//   phone,
//   callback
// ) {
//   var query =
//     "update appointment set patient_name='" +
//     p_name +
//     "',department='" +
//     department +
//     "',doctor_name='" +
//     d_name +
//     "',date='" +
//     date +
//     "',time='" +
//     time +
//     "',email='" +
//     email +
//     "',phone='" +
//     phone +
//     "' where id=" +
//     id;
//   con.query(query, callback);
// };

// module.exports.deleteappointment = function (id, callback) {
//   var query = "delete from appointment where appointment_id=" + id;
//   con.query(query, callback);
// };
// //module.exports =router;

// module.exports.findOne = function (email, callback) {
//   var query = "select *from users where email='" + email + "'";
//   con.query(query, callback);
//   console.log(query);
// };

// module.exports.temp = function (id, email, token, callback) {
//   var query =
//     "insert into `temp` (`id`,`email`,`token`) values ('" +
//     id +
//     "','" +
//     email +
//     "','" +
//     token +
//     "')";
//   con.query(query, callback);
// };

// module.exports.checktoken = function (token, callback) {
//   var query = "select *from temp where token='" + token + "'";
//   con.query(query, callback);
//   console.log(query);
// };

// module.exports.setpassword = function (id, newpassword, callback) {
//   var query =
//     "update `users` set `password`='" + newpassword + "' where id=" + id;
//   con.query(query, callback);
// };

// module.exports.add_employee = function (
//   name,
//   email,
//   contact,
//   join_date,
//   role,
//   salary,
//   callback
// ) {
//   var query =
//     "Insert into `employee` (`name`,`email`,`contact`,`join_date`,`role`,`salary`) values ('" +
//     name +
//     "','" +
//     email +
//     "','" +
//     contact +
//     "','" +
//     join_date +
//     "','" +
//     role +
//     "','" +
//     salary +
//     "')";
//   con.query(query, callback);
//   console.log(query);
// };

// module.exports.addMed = function (
//   name,
//   p_date,
//   expire,
//   e_date,
//   price,
//   quantity,
//   callback
// ) {
//   var query =
//     "Insert into `store` (name,p_date,expire,expire_end,price,quantity) values('" +
//     name +
//     "','" +
//     p_date +
//     "','" +
//     expire +
//     "','" +
//     e_date +
//     "','" +
//     price +
//     "','" +
//     quantity +
//     "')";
//   console.log(query);
//   con.query(query, callback);
// };

// module.exports.getMedbyId = function (id, callback) {
//   var query = "select * from store where id=" + id;
//   con.query(query, callback);
// };

// module.exports.editmed = function (
//   id,
//   name,
//   p_date,
//   expire,
//   e_date,
//   price,
//   quantity,
//   callback
// ) {
//   var query =
//     "update store set name='" +
//     name +
//     "', p_date='" +
//     p_date +
//     "',expire='" +
//     expire +
//     "' ,expire_end='" +
//     e_date +
//     "',price='" +
//     price +
//     "',quantity='" +
//     quantity +
//     "' where id=" +
//     id;
//   console.log(query);
//   con.query(query, callback);
// };

// module.exports.getallmed = function (callback) {
//   var query = "select *from store order by id desc";
//   console.log(query);
//   con.query(query, callback);
// };

// module.exports.getAllemployee = function (callback) {
//   var query = "select * from employee";
//   con.query(query, callback);
// };

// module.exports.add_leave = function (
//   name,
//   id,
//   type,
//   from,
//   to,
//   reason,
//   callback
// ) {
//   var query =
//     "Insert into `leaves` (`employee`,`emp_id`,`leave_type`,`date_from`,`date_to`,`reason`) values ('" +
//     name +
//     "','" +
//     id +
//     "','" +
//     type +
//     "','" +
//     from +
//     "','" +
//     to +
//     "','" +
//     reason +
//     "')";
//   console.log(query);
//   con.query(query, callback);
// };

// module.exports.getAllLeave = function (callback) {
//   var query = "Select * from leaves";
//   con.query(query, callback);
// };

// module.exports.matchtoken = function (id, token, callback) {
//   var query = "select * from `verify` where token='" + token + "' and id=" + id;
//   con.query(query, callback);
//   console.log(query);
// };

// module.exports.updateverify = function (email, email_status, callback) {
//   var query =
//     "update `users` set `email_status`='" +
//     email_status +
//     "' where `email`='" +
//     email +
//     "'";
//   con.query(query, callback);
// };

// module.exports.add_dept = function (name, desc, callback) {
//   var query =
//     "insert into departments(department_name,department_desc) values ('" +
//     name +
//     "','" +
//     desc +
//     "')";
//   con.query(query, callback);
// };

// module.exports.getalldept = function (callback) {
//   var query = "select * from departments";
//   con.query(query, callback);
// };

// module.exports.delete_department = function (id, callback) {
//   var query = "delete from departments where id=" + id;
//   con.query(query, callback);
// };

// module.exports.getdeptbyId = function (id, callback) {
//   var query = "select * from departments where id=" + id;
//   con.query(query, callback);
// };

// module.exports.edit_dept = function (id, name, desc, callback) {
//   var query =
//     "update departments set department_name='" +
//     name +
//     "',department_desc='" +
//     desc +
//     "' where id=" +
//     id;
//   con.query(query, callback);
// };

// module.exports.getuserdetails = function (username, callback) {
//   var query = "select * from users where username='" + username + "'";
//   con.query(query, callback);
//   console.log(query);
// };

// module.exports.edit_profile = function (
//   id,
//   username,
//   email,
//   password,
//   callback
// ) {
//   var query =
//     "update users set username ='" +
//     username +
//     "', email = '" +
//     email +
//     "',password='" +
//     password +
//     "' where id=" +
//     id;
//   con.query(query, callback);
//   console.log(query);
// };

// module.exports.getleavebyid = function (id, callback) {
//   var query = "select * from leaves where id=" + id;
//   con.query(query, callback);
// };

// module.exports.deleteleave = function (id, callback) {
//   var query = "delete  from leaves where id=" + id;
//   con.query(query, callback);
// };

// module.exports.edit_leave = function (
//   id,
//   name,
//   leave_type,
//   from,
//   to,
//   reason,
//   callback
// ) {
//   var query =
//     "update leaves set employee='" +
//     name +
//     "',leave_type='" +
//     leave_type +
//     "',date_from='" +
//     from +
//     "',date_to='" +
//     to +
//     "',reason='" +
//     reason +
//     "' where id=" +
//     id;
//   con.query(query, callback);
// };
var mysql = require("mysql");
var express = require("express");
var router = express.Router();

// Create a connection to the database
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "hms",
  // port: 3307
});

// Connect to MySQL and run a test query
con.connect(function (err) {
  if (err) {
    throw err;
  } else {
    console.log("Connected to MySQL database");
  }
});

// Function to insert a new patient record into the database
module.exports.signup = function (
  first_name,
  last_name,
  email,
  password,
  date_of_birth,
  address,
  cnic,
  contact,
  gender,
  callback
) {
  // SQL query for inserting new data
  var query = "INSERT INTO `Patient` (`first_name`, `last_name`, `email`, `password`, `date_of_birth`, `address`, `cnic`, `contact`, `gender`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

  con.query(
    query,
    [first_name, last_name, email, password, date_of_birth, address, cnic, contact, gender],
    function (err, results) {
      if (err) {
        console.error("Error during database insertion:", err); // Log any error
        return callback(err); // Pass the error to the callback
      }

    }
  );
};

module.exports.getDocId = function (callback) {
  var query = "SELECT MAX(doctor_id) AS maxId FROM Doctor";
  con.query(query, function (err, res) {
    if (err) {
      console.log("error in getting doctor id");
      return callback(err);
    }

    callback(null, res);

  })
}

module.exports.add_doctor = function (
  doc_id,
  first_name,
  last_name,
  email,
  password,
  date_of_birth,
  address,
  image,           // BLOB for the doctor's image
  cnic,
  contact,
  gender,
  specialist_id,  // Specialist ID from the Specialties table
  callback
) {
  // SQL query for inserting new doctor data
  var query = "INSERT INTO `Doctor` (`doctor_id`,`first_name`, `last_name`, `email`, `password`, `date_of_birth`, `address`, `image`, `cnic`, `contact`, `gender`, `specialist_id`) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  // Execute the query with the provided values
  con.query(
    query,
    [doc_id, first_name, last_name, email, password, date_of_birth, address, image, cnic, contact, gender, specialist_id],
    function (err, results) {
      if (err) {
        console.error("Error during database insertion:", err); // Log any error
        return callback(err); // Pass the error to the callback
      }

      // If the insertion is successful, return the results
      callback(null, results);
    }
  );
};
// Example function to get all doctors with their specialties
module.exports.getAllDoctorsWithSpecialties = function (callback) {
  const sql = `
      SELECT doctor.*, specialties.specialist_name
      FROM doctor
      LEFT JOIN specialties ON doctor.specialist_id = specialties.specialist_id
  `;
  con.query(sql, callback);
};

// module.exports.getAllDoctors_with_schedule = function (callback) {
//   const sql = `
//      SELECT *, CONCAT(D.first_name,D.last_name) AS dname FROM doctor D JOIN SCHEDULE S ON S.doctor_id = D.doctor_id
//   `;
//   con.query(sql, callback);
// };

module.exports.getDoctorById = function (id, callback) {
  const sql = 'SELECT * FROM doctor WHERE doctor_id = ?';
  con.query(sql, [id], function (err, result) {
    if (err) {
      console.error('Error executing query:', err);
      return callback(err, null);
    }
    callback(null, result);
  });
};
// Function to update doctor details
module.exports.updateDoctor = function (
  doctor_id,
  first_name,
  last_name,
  email,
  date_of_birth,
  gender,
  address,
  phone,
  image,
  specialist_id,
  callback
) {
  // SQL query for updating doctor information including specialist_id
  var query = `UPDATE Doctor SET 
    first_name = ?, 
    last_name = ?, 
    email = ?, 
    date_of_birth = ?, 
    gender = ?, 
    address = ?, 
    contact = ?, 
    image = ?,
    specialist_id = ?
    WHERE doctor_id = ?`;

  con.query(
    query,
    [first_name, last_name, email, date_of_birth, gender, address, phone, image, specialist_id, doctor_id],
    function (err, results) {
      if (err) {
        console.error("Error updating doctor:", err);
        return callback(err);
      }
      callback(null, results);
    }
  );
};

module.exports.getAllSpecialties = function (callback) {
  const query = `SELECT specialist_id,specialist_name FROM specialties`;
  con.query(query, function (err, results) {
    if (err) {
      return callback(err);
    }
    // console.log("Specialties fetched from DB:", results);
    callback(null, results);
  });
};

module.exports.deleteDoctor = function (id, callback) {
  // Use a parameterized query to prevent SQL injection
  var query = "DELETE FROM doctor WHERE doctor_id = ?";

  con.query(query, [id], function (err, results) {
    if (err) {
      console.error("Error deleting doctor:", err);
      return callback(err);
    }
    callback(null, results);
  });
};

module.exports.getAllPatients = function (callback) {
  var query = `SELECT * FROM PATIENT`;
  con.query(query, function (err, res) {
    if (err) {
      return callback(err);
    }
    callback(null, res);
  })
};
module.exports.getAllPatients_with_fullname = function (callback) {
  var query = `SELECT patient_id, CONCAT(first_name, ' ', last_name) AS pname FROM PATIENT`;
  con.query(query, function (err, res) {
    if (err) {
      return callback(err);
    }
    callback(null, res);
  })
};

module.exports.getPatientById = function (id, callback) {
  var query = `SELECT * FROM PATIENT WHERE PATIENT_ID = ?`;
  con.query(query, [id], function (err, result) {
    if (err) {
      console.error('Error executing query:', err);
      return callback(err, null);
    }
    callback(null, result);
  });
}

module.exports.updatePatient = function (
  patient_id,
  first_name,
  last_name,
  email,
  date_of_birth,
  address,
  phone,
  gender,
  callback
) {
  var query = `UPDATE Patient SET 
    first_name = ?, 
    last_name = ?, 
    email = ?, 
    date_of_birth = ?, 
    address = ?, 
    contact = ?,
    gender = ?
    WHERE patient_id = ?`;

  con.query(
    query,
    [first_name, last_name, email, date_of_birth, address, phone, gender, patient_id],
    function (err, results) {
      if (err) {
        console.error("Error updating patient:", err);
        return callback(err);
      }
      console.log("Update successful:", results);
      callback(null, results);
    }
  );
};

module.exports.deletePatient = function (id, callback) {
  var query = "DELETE FROM patient WHERE patient_id = ?";

  con.query(query, [id], function (err, results) {
    if (err) {
      console.error("Error deleting patient:", err);
      return callback(err);
    }
    callback(null, results);
  });
};

//getPaitentID and addPatinet...
module.exports.getPatientId = function (callback) {
  var query = `SELECT MAX(patient_id) AS maxId FROM patient`;
  con.query(query, function (err, res) {
    if (err) {
      console.log("error in getting patient id");
      return callback(err);
    }
    callback(null, res);
  })
};


module.exports.addPatient = function (
  patient_id,
  first_name,
  last_name,
  email,
  password,
  date_of_birth,
  address,
  cnic,
  contact,
  gender,
  callback
) {
  var query = `INSERT INTO PATIENT(patient_id,first_name,last_name,email,password,date_of_birth,address,cnic,contact,gender) VALUES (?,?,?,?,?,?,?,?,?,?)`;
  con.query(
    query,
    [patient_id, first_name, last_name, email, password, date_of_birth, address, cnic, contact, gender],
    function (err, results) {
      if (err) {
        console.error("Error during database insertion:", err); // Log any error
        return callback(err); // Pass the error to the callback
      }

      // If the insertion is successful, return the results
      callback(null, results);
    }
  );
};


module.exports.getAllSchedule = function (callback) {
  var query = `SELECT * FROM schedule`;
  con.query(query, function (err, results) {
    if (err) {
      return callback(err);
    }
    callback(null, results);
  });
};

module.exports.getAppointmentId = function (callback) {
  var query = `SELECT MAX(appointment_id) AS maxId FROM appointment`;
  con.query(query, function (err, res) {
    if (err) {
      console.log("error in getting appointment id");
      return callback(err);
    }
    callback(null, res);
  })
};

module.exports.getappointmentbyid1 = function (id, callback) {
  var query = "select * from appointment where appointment_id =" + id;
  console.log(query);
  con.query(query, callback);
};

module.exports.deleteappointment = function (id, callback) {
  var query = "delete from appointment where appointment_id=" + id;
  con.query(query, callback);
};
module.exports.addAppointment = function (
  appointment_id,
  appointment_number,
  appointment_date,
  status,
  patient_id,
  schedule_id,
  callback
) {
  var query = `INSERT INTO APPOINTMENT(appointment_id,appointment_num,appointment_date,status,patient_id,schedule_id) VALUES (?,?,?,?,?,?)`;
  con.query(
    query,
    [appointment_id, appointment_number, appointment_date, status, patient_id, schedule_id],
    function (err, results) {
      if (err) {
        console.error("Error during database insertion:", err);
        return callback(err);
      }
      callback(null, results);
    }
  );
};

module.exports.getEmpbyId = function (id, callback) {
  var query = "select * from employee where id =" + id;
  con.query(query, callback);
};


module.exports.editEmp = function (
  id,
  name,
  email,
  contact,
  join_date,
  role,
  callback
) {
  var query =
    "update `employee` set `name`='" +
    name +
    "', `email`='" +
    email +
    "', `contact`='" +
    contact +
    "', `join_date`='" +
    join_date +
    "', `role`='" +
    role +
    "' where id=" +
    id;
  con.query(query, callback);
};



module.exports.deleteEmp = function (id, callback) {
  //console.log("i m here");
  var query = "delete from employee where id=" + id;
  con.query(query, callback);
};

module.exports.deletemed = function (id, callback) {
  //console.log("i m here");
  var query = "delete from store where id=" + id;
  con.query(query, callback);
};

module.exports.postcomplain = function (
  message,
  name,
  email,
  subject,
  callback
) {
  var query =
    "insert into complain (message,name,email,subject) values ('" +
    message +
    "','" +
    name +
    "','" +
    email +
    "','" +
    subject +
    "')";
  console.log(query);
  con.query(query, callback);
};

module.exports.getcomplain = function (callback) {
  var query = "select * from complain";
  con.query(query, callback);
};


module.exports.getAllAppointment = function (callback) {
  var query = "select a.appointment_id, a.appointment_num, p.patient_id,  CONCAT(p.first_name, ' ', p.last_name) AS pname,d.doctor_id ,CONCAT(d.first_name, ' ', d.last_name) AS dname, a.appointment_date, s.start_time, s.end_time from appointment a join patient p on p.patient_id = a.patient_id join schedule s on s.schedule_id = a.schedule_id join doctor d on d.doctor_id = s.schedule_id";
  con.query(query, callback);
};

module.exports.searchDoc = function (key, callback) {
  var query = 'SELECT  *from doctor where first_name like "%' + key + '%"';
  con.query(query, callback);
  console.log(query);
};

module.exports.searchmed = function (key, callback) {
  var query = 'SELECT  *from store where name like "%' + key + '%"';
  con.query(query, callback);
};

module.exports.searchEmp = function (key, callback) {
  var query = 'SELECT  *from employee where name  like "%' + key + '%"';
  con.query(query, callback);
  console.log(query);
};


module.exports.findOne = function (email, callback) {
  var query = "select *from users where email='" + email + "'";
  con.query(query, callback);
  console.log(query);
};

module.exports.temp = function (id, email, token, callback) {
  var query =
    "insert into `temp` (`id`,`email`,`token`) values ('" +
    id +
    "','" +
    email +
    "','" +
    token +
    "')";
  con.query(query, callback);
};

module.exports.checktoken = function (token, callback) {
  var query = "select *from temp where token='" + token + "'";
  con.query(query, callback);
  console.log(query);
};

module.exports.setpassword = function (id, newpassword, callback) {
  var query =
    "update `users` set `password`='" + newpassword + "' where id=" + id;
  con.query(query, callback);
};

module.exports.add_employee = function (
  name,
  email,
  contact,
  join_date,
  role,
  salary,
  callback
) {
  var query =
    "Insert into `employee` (`name`,`email`,`contact`,`join_date`,`role`,`salary`) values ('" +
    name +
    "','" +
    email +
    "','" +
    contact +
    "','" +
    join_date +
    "','" +
    role +
    "','" +
    salary +
    "')";
  con.query(query, callback);
  console.log(query);
};

module.exports.addMed = function (
  name,
  p_date,
  expire,
  e_date,
  price,
  quantity,
  callback
) {
  var query =
    "Insert into `store` (name,p_date,expire,expire_end,price,quantity) values('" +
    name +
    "','" +
    p_date +
    "','" +
    expire +
    "','" +
    e_date +
    "','" +
    price +
    "','" +
    quantity +
    "')";
  console.log(query);
  con.query(query, callback);
};

module.exports.getMedbyId = function (id, callback) {
  var query = "select * from store where id=" + id;
  con.query(query, callback);
};

module.exports.editmed = function (
  id,
  name,
  p_date,
  expire,
  e_date,
  price,
  quantity,
  callback
) {
  var query =
    "update store set name='" +
    name +
    "', p_date='" +
    p_date +
    "',expire='" +
    expire +
    "' ,expire_end='" +
    e_date +
    "',price='" +
    price +
    "',quantity='" +
    quantity +
    "' where id=" +
    id;
  console.log(query);
  con.query(query, callback);
};

module.exports.getallmed = function (callback) {
  var query = "select *from store order by id desc";
  console.log(query);
  con.query(query, callback);
};

module.exports.getAllemployee = function (callback) {
  var query = "select * from employee";
  con.query(query, callback);
};

module.exports.add_leave = function (
  name,
  id,
  type,
  from,
  to,
  reason,
  callback
) {
  var query =
    "Insert into `leaves` (`employee`,`emp_id`,`leave_type`,`date_from`,`date_to`,`reason`) values ('" +
    name +
    "','" +
    id +
    "','" +
    type +
    "','" +
    from +
    "','" +
    to +
    "','" +
    reason +
    "')";
  console.log(query);
  con.query(query, callback);
};

module.exports.getAllLeave = function (callback) {
  var query = "Select * from leaves";
  con.query(query, callback);
};

module.exports.matchtoken = function (id, token, callback) {
  var query = "select * from `verify` where token='" + token + "' and id=" + id;
  con.query(query, callback);
  console.log(query);
};

module.exports.updateverify = function (email, email_status, callback) {
  var query =
    "update `users` set `email_status`='" +
    email_status +
    "' where `email`='" +
    email +
    "'";
  con.query(query, callback);
};

module.exports.add_dept = function (name, desc, callback) {
  var query =
    "insert into departments(department_name,department_desc) values ('" +
    name +
    "','" +
    desc +
    "')";
  con.query(query, callback);
};

module.exports.getalldept = function (callback) {
  var query = "select * from departments";
  con.query(query, callback);
};

module.exports.delete_department = function (id, callback) {
  var query = "delete from departments where id=" + id;
  con.query(query, callback);
};

module.exports.getdeptbyId = function (id, callback) {
  var query = "select * from departments where id=" + id;
  con.query(query, callback);
};

module.exports.edit_dept = function (id, name, desc, callback) {
  var query =
    "update departments set department_name='" +
    name +
    "',department_desc='" +
    desc +
    "' where id=" +
    id;
  con.query(query, callback);
};

module.exports.getuserdetails = function (username, callback) {
  var query = "select * from users where username='" + username + "'";
  con.query(query, callback);
  console.log(query);
};

module.exports.edit_profile = function (
  id,
  username,
  email,
  password,
  callback
) {
  var query =
    "update users set username ='" +
    username +
    "', email = '" +
    email +
    "',password='" +
    password +
    "' where id=" +
    id;
  con.query(query, callback);
  console.log(query);
};

module.exports.getleavebyid = function (id, callback) {
  var query = "select * from leaves where id=" + id;
  con.query(query, callback);
};

module.exports.deleteleave = function (id, callback) {
  var query = "delete  from leaves where id=" + id;
  con.query(query, callback);
};

module.exports.edit_leave = function (
  id,
  name,
  leave_type,
  from,
  to,
  reason,
  callback
) {
  var query =
    "update leaves set employee='" +
    name +
    "',leave_type='" +
    leave_type +
    "',date_from='" +
    from +
    "',date_to='" +
    to +
    "',reason='" +
    reason +
    "' where id=" +
    id;
  con.query(query, callback);
};
