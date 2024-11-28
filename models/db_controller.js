var mysql = require("mysql");
var express = require("express");
var router = express.Router();

// Create a connection to the database
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "hms",
  port: 3307
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

module.exports.getAllDoctors = function (callback) {
  const sql = `SELECT *, CONCAT(D.first_name,D.last_name) AS dname FROM doctor D`;
  con.query(sql, callback);
};

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
  var query = `SELECT * , concat(first_name , ' ' , last_name) as dname FROM schedule s join doctor d on d.doctor_id = s.doctor_id`;
  con.query(query, function (err, results) {
    if (err) {
      console.log(err);

    }
    callback(null, results);
  });
};
module.exports.getScheduleId = function (callback) {
  var query = `SELECT MAX(Schedule_id) AS maxId FROM schedule`;
  con.query(query, function (err, res) {
    if (err) {
      console.log("error in getting Schedule id");
      return callback(err);
    }
    callback(null, res);
  })
};

module.exports.addschedule = function (
  schedule_id,
  title,
  start_time,
  end_time,
  NOP,
  doctor_id,
  callback
) {
  var query = `INSERT INTO schedule(schedule_id,title,start_time,end_time,NOP,doctor_id) VALUES (?,?,?,?,?,?)`;
  con.query(
    query,
    [schedule_id, title, start_time, end_time, NOP, doctor_id],
    function (err, results) {
      if (err) {
        console.error("Error during database insertion:", err);
        return callback(err);
      }
      callback(null, results);
    }
  );
};

module.exports.getschedule = function (id, callback) {
  var query = "select * from schedule where schedule_id =" + id;
  console.log(query);
  con.query(query, callback);
};
module.exports.deleteschedule = function (id, callback) {
  var query = "delete from schedule where schedule_id =" + id;
  con.query(query, callback);
};
module.exports.getschedulebyid1 = function (id, callback) {
  var query = "select * from schedule where schedule_id =" + id;
  console.log(query);
  con.query(query, callback);
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
module.exports.getappointmentbyid2 = function (id, callback) {
  var query = `SELECT * FROM appointment WHERE appointment_id = ?`;
  con.query(query, [id], function (err, result) {
    if (err) {
      console.error('Error executing query:', err);
      return callback(err, null);
    }
    callback(null, result);
  });
}
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

module.exports.getAllAppointment = function (callback) {
  var query = `select a.appointment_id, a.appointment_num, p.patient_id,  CONCAT(p.first_name, ' ', p.last_name) AS pname,d.doctor_id ,CONCAT(d.first_name, ' ', d.last_name) AS dname, a.appointment_date, s.start_time, s.end_time from appointment a join patient p on p.patient_id = a.patient_id join schedule s on s.schedule_id = a.schedule_id join doctor d on d.doctor_id = s.schedule_id`;
  con.query(query, function (err, res) {
    if (err) {
      return callback(err);
    }
    callback(null, res);
  });
};

module.exports.getAllRoles = function (callback) {
  var query = `SELECT * FROM ROLES`;
  console.log(query);
  con.query(query, function (err, result) {
    if (err) {
      console.error('Error executing query:', err);
      return callback(err, null);
    }
    callback(null, result);
  });
};

module.exports.getRoleId = function (callback){
  var query=`SELECT MAX(role_id) AS maxId FROM ROLES`;
  con.query(query,function(err,res){
    if(err){
      console.error(err);
      return callback(err);
    }
    callback(null,res);
  });
};

module.exports.updateRole = function (role_id, role_name, callback) {
  var query = `UPDATE Roles SET 
    role_name = ?
    WHERE role_id = ?`;

  con.query(
    query,
    [role_name, role_id],
    function (err, results) {
      if (err) {
        console.error("Error updating Roles:", err);
        return callback(err);
      }
      console.log("Update successful:", results);
      callback(null, results);
    }
  );
};

module.exports.deleteRole = function (role_id, callback) {
  var query = `DELETE FROM ROLES WHERE ROLE_ID = ?`;
  con.query(query, role_id, function (err, res) {
    if (err) {
      console.error("Error deleting Roles:", err)
      return callback(err);
    }
    callback(null, res);
  });
};

module.exports.addRole = function (role_id, role_name, callback) {
  var query = `INSERT INTO ROLES(role_id,role_name) VALUES(?,?)`;
  con.query(query, [role_id, role_name], function (err, res) {
    if (err) {
      console.error("Error inserting Roles:", err)
      return callback(err);
    }
    callback(null, res);
  });
};

module.exports.getAllEmployees = function (callback)
{
  var query = `SELECT E.*,R.ROLE_NAME AS 'role_name' FROM EMPLOYEE E LEFT JOIN ROLES R ON R.ROLE_ID = E.ROLE_ID `;
  con.query(query,function(err,res){
    if (err) {
      console.error("Error Fetching Employees:", err)
      return callback(err);
    }
    callback(null, res);
  });
};

module.exports.getEmployeeId = function (callback)
{
  var query = `SELECT MAX(employee_id) AS maxId FROM EMPLOYEE`;
  con.query(query,function(err,res){
    if(err)
    {
      console.error(err);
      return callback(err);
    }
    callback(null,res);
  });
};

module.exports.addEmployee = function (
  employee_id,
  first_name,
  last_name,
  email,
  password,
  date_of_birth,
  address,
  cnic,
  contact,
  gender,
  role_id,  
  callback
) {
  // SQL query for inserting new employee data
  var query = "INSERT INTO `Employee` (`employee_id`,`first_name`, `last_name`, `email`, `password`, `date_of_birth`, `address`, `cnic`, `contact`, `gender`, `role_id`) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  // Execute the query with the provided values
  con.query(
    query,
    [employee_id, first_name, last_name, email, password, date_of_birth, address, cnic, contact, gender, role_id],
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

module.exports.searchDoc = function (key, callback) {
  var query = 'SELECT  *from doctor where first_name like "%' + key + '%"';
  con.query(query, callback);
  console.log(query);
};