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

module.exports.getAdminByEmail = function (email, callback) {
  var query = "SELECT * FROM admin where email = ?";
  con.query(query, [email], function (err, res) {
    if (err) {
      return callback(err, null);
    }
    callback(null, res[0]);
  });
};


module.exports.updateAdminPassword = function (email, newPassword, callback) {
  var query = "UPDATE admin SET password = ? WHERE email = ?";
  con.query(query, [newPassword, email], function (err, res) {
    if (err) {
      return callback(err);
    }
    callback(null, res);
  })};

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

module.exports.updateSchedule = function (
  schedule_id,
  title,
  start_time,
  end_time,
  NOP,
  doctor_id,
  callback
) {
  var query = `UPDATE schedule SET
              title=?,
              start_time=?,
              end_time=?,
              NOP=?,
              doctor_id=?
              WHERE schedule_id = ?`;
  con.query(
    query,
    [schedule_id, title, start_time, end_time, NOP, doctor_id],
    function (err, results) {
      if (err) {
        console.error("Error during database updation:", err);
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

module.exports.checkAppointmentNumber = function (appointment_number, callback) {
  const query = 'SELECT COUNT(*) AS count FROM appointment WHERE appointment_num = ?';
  con.query(query, [appointment_number], function (err, results) {
    if (err) {
      return callback(err);
    }

    const exists = results[0].count > 0;
    callback(null, exists);
  });
};


module.exports.updateAppointment = function (
  appointment_id,
  appointment_num,
  appointment_date,
  status,
  patient_id,
  schedule_id,
  callback
) {
  var query = `UPDATE appointment SET 
    appointment_num = ?, 
    appointment_date = ?, 
    status = ?,  
    patient_id = ?, 
    schedule_id = ?
    WHERE appointment_id = ?`;

  con.query(
    query,
    [appointment_num, appointment_date, status, patient_id, schedule_id, appointment_id],
    function (err, results) {
      if (err) {
        console.error("Error updating appointment:", err);
        return callback(err);
      }
      console.log("Update successful:", results);
      callback(null, results);
    }
  );
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
  var query = `SELECT 
        a.appointment_id, 
        a.appointment_num, 
        p.patient_id, 
        CONCAT(p.first_name, ' ', p.last_name) AS pname,
        d.doctor_id,
        CONCAT(d.first_name, ' ', d.last_name) AS dname, 
        a.appointment_date, 
        s.start_time, 
        s.end_time 
    FROM 
        appointment a
    JOIN 
        patient p ON p.patient_id = a.patient_id
    JOIN 
        schedule s ON s.schedule_id = a.schedule_id
    JOIN 
        doctor d ON d.doctor_id = s.doctor_id`;
  con.query(query, function (err, res) {
    if (err) {
      return callback(err);
    }
    callback(null, res);
  });
};

module.exports.getAllRoles = function (callback) {
  var query = `SELECT * FROM ROLES`;
  con.query(query, function (err, result) {
    if (err) {
      console.error('Error executing query:', err);
      return callback(err, null);
    }
    callback(null, result);
  });
};

module.exports.getRoleId = function (callback) {
  var query = `SELECT MAX(role_id) AS maxId FROM ROLES`;
  con.query(query, function (err, res) {
    if (err) {
      console.error(err);
      return callback(err);
    }
    callback(null, res);
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

module.exports.getAllEmployees = function (callback) {
  var query = `SELECT E.*,R.ROLE_NAME AS 'role_name' FROM EMPLOYEE E LEFT JOIN ROLES R ON R.ROLE_ID = E.ROLE_ID `;
  con.query(query, function (err, res) {
    if (err) {
      console.error("Error Fetching Employees:", err)
      return callback(err);
    }
    callback(null, res);
  });
};

module.exports.getEmployeeId = function (callback) {
  var query = `SELECT MAX(employee_id) AS maxId FROM EMPLOYEE`;
  con.query(query, function (err, res) {
    if (err) {
      console.error(err);
      return callback(err);
    }
    callback(null, res);
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

module.exports.getEmployeeById = function (id, callback) {
  var query = `SELECT E.*,R.ROLE_NAME AS 'role_name'  FROM EMPLOYEE E LEFT JOIN ROLES R ON R.ROLE_ID = E.ROLE_ID WHERE E.EMPLOYEE_ID = ?`;
  con.query(query, id, function (err, res) {
    if (err) {
      console.error(err);
      return callback(err);
    }
    callback(null, res);
  });
};

module.exports.editEmployee = function (
  employee_id,
  first_name,
  last_name,
  email,
  date_of_birth,
  address,
  phone,
  gender,
  callback
) {
  var query = `UPDATE employee SET 
    first_name = ?, 
    last_name = ?, 
    email = ?, 
    date_of_birth = ?, 
    address = ?, 
    contact = ?,
    gender = ?
    WHERE employee_id = ?`;

  con.query(
    query,
    [first_name, last_name, email, date_of_birth, address, gender, phone, employee_id],
    function (err, results) {
      if (err) {
        console.error("Error updating employee:", err);
        return callback(err);
      }
      callback(null, results);
    }
  );
};

module.exports.deleteEmployee = function (emp_id, callback) {
  var query = `DELETE FROM EMPLOYEE WHERE EMPLOYEE_ID = ?`;
  con.query(query, emp_id, function (err, res) {
    if (err) {
      console.error("Error deleting Employee:", err)
      return callback(err);
    }
    callback(null, res);
  });
};

module.exports.getAllSuppliers = function (callback) {
  const query = `SELECT * FROM SUPPLIERS`;
  con.query(query, function (err, res) {
    if (err) {
      callback(err);
    }
    callback(null, res);
  })
};

module.exports.getAllPharmacy = function (callback) {
  const query = `SELECT 
            p.pharacy_id,
            p.name,
            p.purchase_date,
            p.expire_date,
            p.price,
            p.quantity,
            CONCAT(s.first_name, ' ', s.last_name) AS supplier_name
        FROM pharmacy p 
        LEFT JOIN Suppliers s ON s.supplier_id = p.supplier_id;`;

  con.query(query, callback);
};

module.exports.getAllPharmacyByID = function (id, callback) {
  const query = `SELECT 
            p.name,
            p.purchase_date,
            p.expire_date,
            p.price,
            p.quantity,
            CONCAT(s.first_name, ' ', s.last_name) AS 'supplier_name'
            FROM pharmacy p 
            LEFT JOIN Suppliers s ON s.supplier_id = p.supplier_id
            WHERE p.pharacy_id = ?;`;
  con.query(query, id, callback);
};

module.exports.addPharmacy = function (name, purchase_date, expire_date, price, quantity, supplier_id, callback) {
  const query = `INSERT INTO Pharmacy (name, purchase_date, expire_date, price, quantity, supplier_id) 
                 VALUES (?, ?, ?, ?, ?, ?)`;
  con.query(query, [name, purchase_date, expire_date, price, quantity, supplier_id], function (err, res) {
    if (err) {
      return callback(err);
    }
    callback(null, res);
  })
};

module.exports.updatePharmacy = function (id, name, purchase_date, expire_date, price, quantity, supplier_id, callback) {
  const query = `UPDATE  Pharmacy SET name=?,
  purchase_date=?,
  expire_date=?,
  price=?,
  quantity=?,
  supplier_id=?
  WHERE pharacy_id = ?`;
  con.query(query, [name, purchase_date, expire_date, price, quantity, supplier_id, id], function (err, res) {
    if (err) {
      return callback(err);
    }
    callback(null, res);
  })
};

module.exports.deletePharmacy = function (id, callback) {
  var query = `DELETE FROM pharmacy WHERE pharacy_id = ?`;
  con.query(query, id, function (err, res) {
    if (err) {
      console.error("Error deleting Pharmacy item:", err)
      return callback(err);
    }
    callback(null, res);
  });
};

module.exports.searchMed = function (key, callback) {
  // Use a JOIN to include supplier information
  const query = `
      SELECT pharmacy.*, CONCAT(s.first_name, ' ', s.last_name) AS 'supplier_name' 
      FROM pharmacy 
      LEFT JOIN suppliers s ON pharmacy.supplier_id = s.supplier_id 
      WHERE pharmacy.NAME LIKE ?;
  `;

  const searchTerm = '%' + key + '%';

  con.query(query, [searchTerm], callback);
};

module.exports.getTotalPatientsByDoctorId = function (id, callback) {
  const query = `SELECT COUNT(DISTINCT p.patient_id) AS totalPatients
                   FROM appointment a
                   JOIN Patient p ON a.patient_id = p.patient_id
                   JOIN SCHEDULE s ON a.Schedule_id = s.Schedule_id
                   WHERE s.doctor_id = ?`;
  con.query(query, id, function (err, res) {
    if (err) {
      console.error("Error fetching Total Patients:", err)
      return callback(err);
    }
    callback(null, res);
  });
};

module.exports.getTotalAppointments = function (doctorId, callback) {
  const query = `SELECT COUNT(*) AS totalAppointments
                 FROM appointment a
                 JOIN SCHEDULE s ON a.Schedule_id = s.Schedule_id
                 WHERE s.doctor_id = ?`;
  con.query(query, [doctorId], function (error, results) {
    if (error) return callback(error, null);
    callback(null, results[0].totalAppointments);
  });
};


module.exports.getUpcomingAppointments = function (doctorId, callback) {
  const query = `SELECT a.appointment_id, p.first_name AS patientName, a.appointment_date, s.start_time AS time
                 FROM appointment a
                 JOIN Patient p ON a.patient_id = p.patient_id
                 JOIN SCHEDULE s ON a.Schedule_id = s.Schedule_id
                 WHERE s.doctor_id = ?
                 AND a.appointment_date >= CURDATE()
                 ORDER BY a.appointment_date ASC LIMIT 5`; // Fetching only the next 5 appointments
  con.query(query, [doctorId], function (error, results) {
    if (error) return callback(error, null);
    callback(null, results);
  });
}

module.exports.getPatientsForDoctor = function (doctorId, callback) {
  const query = `SELECT DISTINCT p.patient_id, p.first_name, p.last_name, p.contact
                 FROM appointment a
                 JOIN Patient p ON a.patient_id = p.patient_id
                 JOIN SCHEDULE s ON a.Schedule_id = s.Schedule_id
                 WHERE s.doctor_id = ?`;
  con.query(query, [doctorId], function (error, results) {
    if (error) return callback(error, null);
    callback(null, results);
  });
}

module.exports.getTotalPatients = function (doctorId, callback) {
  const query = `
      SELECT COUNT(DISTINCT p.patient_id) AS totalPatients
      FROM appointment a
      JOIN Patient p ON a.patient_id = p.patient_id
      JOIN SCHEDULE s ON a.Schedule_id = s.Schedule_id
      WHERE s.doctor_id = ?;
  `;
  con.query(query, [doctorId], (error, results) => {
    if (error) return callback(error);
    callback(null, results[0].totalPatients);
  });
}

module.exports.getTotalAppointments = function (doctorId, callback) {
  const query = `
      SELECT COUNT(*) AS totalAppointments
      FROM appointment a
      JOIN SCHEDULE s ON a.Schedule_id = s.Schedule_id
      WHERE s.doctor_id = ?;
  `;
  con.query(query, [doctorId], (error, results) => {
    if (error) return callback(error);
    callback(null, results[0].totalAppointments);
  });
}

module.exports.getDoctorDetails = function (doctorId, callback) {
  const query = `
      SELECT d.doctor_id,d.first_name, d.last_name, s.specialist_name
      FROM Doctor d
      JOIN Specialties s ON d.specialist_id = s.specialist_id
      WHERE d.doctor_id = ?;
  `;
  con.query(query, [doctorId], (error, results) => {
    if (error) return callback(error);
    if (results.length > 0) {
      const doctorDetails = {
        doctorName: `${results[0].first_name} ${results[0].last_name}`,
        doctorSpecialty: results[0].specialist_name,
      };
      callback(null, doctorDetails);
    } else {
      callback(null, null);
    }
  });
};

module.exports.getAppointmentsForDoctor = function (doctorId, callback) {
  const query = `
      SELECT a.appointment_id, a.appointment_num, a.appointment_date, a.status, 
             CONCAT(p.first_name, ' ', p.last_name) AS patient_name
      FROM appointment a
      JOIN Patient p ON a.patient_id = p.patient_id
      JOIN SCHEDULE s ON a.Schedule_id = s.Schedule_id
      WHERE s.doctor_id = ?;
  `;
  con.query(query, [doctorId], (error, results) => {
    if (error) return callback(error);
    callback(null, results);
  });
};


module.exports.getAppointmentsByDoctorId = function (doctorId, callback) {
  const query = `
    SELECT 
      a.appointment_id, 
      a.appointment_num, 
      p.patient_id, 
      CONCAT(p.first_name, ' ', p.last_name) AS pname,
      d.doctor_id,
      CONCAT(d.first_name, ' ', d.last_name) AS dname, 
      a.appointment_date, 
      s.start_time, 
      s.end_time, 
      a.status 
    FROM 
      appointment a
    JOIN 
      patient p ON p.patient_id = a.patient_id
    JOIN 
      schedule s ON s.schedule_id = a.schedule_id
    JOIN 
      doctor d ON d.doctor_id = s.doctor_id
    WHERE 
      d.doctor_id = ?
    ORDER BY 
      a.appointment_date ASC;
  `;

  con.query(query, [doctorId], function (err, results) {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
}


module.exports.searchDoc = function (key, callback) {
  var query = 'SELECT  *from doctor where first_name like "%' + key + '%"';
  con.query(query, callback);
  console.log(query);
};