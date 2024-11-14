-- DROP DATABASE IF EXISTS hospital_management;
-- CREATE DATABASE hospital_management;
-- USE hospital_management;

DROP TABLE IF EXISTS `Roles`;
CREATE TABLE `Roles` (
  `role_id` INT PRIMARY KEY AUTO_INCREMENT,
  `role_name` VARCHAR(100)
);

DROP TABLE IF EXISTS `Specialties`;
CREATE TABLE `Specialties` (
  `specialist_id` INT PRIMARY KEY AUTO_INCREMENT,
  `specialist_name` VARCHAR(500)
);

DROP TABLE IF EXISTS `Suppliers`;
CREATE TABLE `Suppliers` (
  `supplier_id` INT PRIMARY KEY AUTO_INCREMENT,
  `first_name` VARCHAR(100),
  `last_name` VARCHAR(100),
  `date_of_birth` DATE,
  `address` VARCHAR(500),
  `cnic` INT,
  `contact` INT
);

DROP TABLE IF EXISTS `Patient`;
CREATE TABLE `Patient` (
  `patient_id` INT PRIMARY KEY AUTO_INCREMENT,
  `first_name` VARCHAR(100),
  `last_name` VARCHAR(100),
  `email` VARCHAR(50),
  `password` VARCHAR(64),
  `date_of_birth` DATE,
  `address` VARCHAR(500),
  `cnic` INT,
  `contact` INT,
  `gender` VARCHAR(10)
);

DROP TABLE IF EXISTS `Doctor`;
CREATE TABLE `Doctor` (
  `doctor_id` INT PRIMARY KEY AUTO_INCREMENT,
  `first_name` VARCHAR(100),
  `last_name` VARCHAR(100),
  `email` VARCHAR(50),
  `password` VARCHAR(64),
  `date_of_birth` DATE,
  `address` VARCHAR(500),
  `image` BLOB,
  `cnic` INT,
  `contact` INT,
  `gender` VARCHAR(10),
  `specialist_id` INT,
  FOREIGN KEY (`specialist_id`) REFERENCES `Specialties`(`specialist_id`)
);

DROP TABLE IF EXISTS `Employee`;
CREATE TABLE `Employee` (
  `employee_id` INT PRIMARY KEY AUTO_INCREMENT,
  `first_name` VARCHAR(100),
  `last_name` VARCHAR(100),
  `email` VARCHAR(50),
  `password` VARCHAR(64),
  `date_of_birth` DATE,
  `address` VARCHAR(500),
  `cnic` INT,
  `contact` INT,
  `gender` VARCHAR(10),
  `role_id` INT,
  FOREIGN KEY (`role_id`) REFERENCES `Roles`(`role_id`)
);

DROP TABLE IF EXISTS `SCHEDULE`;
CREATE TABLE `SCHEDULE` (
  `Schedule_id` INT PRIMARY KEY AUTO_INCREMENT,
  `title` VARCHAR(50),
  `start_time` DATE,
  `end_time` DATE,
  `NOP` INT,
  `doctor_id` INT,
  FOREIGN KEY (`doctor_id`) REFERENCES `Doctor`(`doctor_id`)
);

DROP TABLE IF EXISTS `Schedule_Days`;
CREATE TABLE `Schedule_Days` (
  `sd_id` INT PRIMARY KEY AUTO_INCREMENT,
  `DAY` VARCHAR(20),
  `Schedule_id` INT,
  FOREIGN KEY (`Schedule_id`) REFERENCES `SCHEDULE`(`Schedule_id`)
);

DROP TABLE IF EXISTS `appointment`;
CREATE TABLE `appointment` (
  `appointment_id` INT PRIMARY KEY AUTO_INCREMENT,
  `appintment_number` INT,
  `date` DATE,
  `status` VARCHAR(20),
  `patient_id` INT,
  `Schedule_id` INT,
  FOREIGN KEY (`patient_id`) REFERENCES `Patient`(`patient_id`),
  FOREIGN KEY (`Schedule_id`) REFERENCES `SCHEDULE`(`Schedule_id`)
);

DROP TABLE IF EXISTS `Medical_Records`;
CREATE TABLE `Medical_Records` (
  `medical_id` INT PRIMARY KEY AUTO_INCREMENT,
  `Diagonsis` INT,
  `Treatment` VARCHAR(100),
  `Prescription` VARCHAR(500),
  `appointment_id` INT,
  FOREIGN KEY (`appointment_id`) REFERENCES `appointment`(`appointment_id`)
);

DROP TABLE IF EXISTS `Billing`;
CREATE TABLE `Billing` (
  `billing_id` INT PRIMARY KEY AUTO_INCREMENT,
  `total_amount` INT,
  `payment_status` VARCHAR(20),
  `billing_date` DATE,
  `payment_method` VARCHAR(50),
  `appointment_id` INT,
  FOREIGN KEY (`appointment_id`) REFERENCES `appointment`(`appointment_id`)
);

DROP TABLE IF EXISTS `Rooms`;
CREATE TABLE `Rooms` (
  `room_id` INT PRIMARY KEY AUTO_INCREMENT,
  `room_number` INT,
  `room_type` VARCHAR(100),
  `status` VARCHAR(20),
  `patient_id` INT,
  FOREIGN KEY (`patient_id`) REFERENCES `Patient`(`patient_id`)
);

DROP TABLE IF EXISTS `Pharmacy`;
CREATE TABLE `Pharmacy` (
  `pharacy_id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(100),
  `purchase_date` DATE,
  `expire_date` DATE,
  `price` INT,
  `quantity` INT,
  `supplier_id` INT,
  FOREIGN KEY (`supplier_id`) REFERENCES `Suppliers`(`supplier_id`)
);

DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin` (
  `email` VARCHAR(50) PRIMARY KEY,
  `password` VARCHAR(64)
);

INSERT INTO Roles (role_id, role_name)
VALUES
  (1, 'Doctor'),
  (2, 'Nurse');

INSERT INTO Specialties (specialist_id, specialist_name)
VALUES
  (1, 'Cardiologist'),
  (2, 'Pediatrician');

INSERT INTO Suppliers (supplier_id, first_name, last_name, date_of_birth, address, cnic, contact)
VALUES
  (1, 'John', 'Doe', '1990-01-01', '123 Main St', 1234567890, 1234567890),
  (2, 'Jane', 'Smith', '1995-05-15', '456 Elm St', 9876543210, 9876543210);

INSERT INTO Patient (patient_id, first_name, last_name, email, password, date_of_birth, address, cnic, contact, gender)
VALUES
  (1, 'Alice', 'Johnson', 'alice@example.com', 'password123', '1985-10-25', '789 Oak St', 1112223333, 1112223333, 'Female'),
  (2, 'Bob', 'Williams', 'bob@example.com', 'password456', '1992-03-10', '222 Elm St', 2223334444, 2223334444, 'Male');

INSERT INTO Doctor (doctor_id, first_name, last_name, email, password, date_of_birth, address, image, cnic, contact, gender, specialist_id)
VALUES
  (1, 'Dr. Michael', 'Brown', 'dr.michael@example.com', 'doc_password', '1975-07-20', '555 Pine St', NULL, 5556667777, 5556667777, 'Male', 1),
  (2, 'Dr. Emily', 'Davis', 'dr.emily@example.com', 'doc_password2', '1980-11-12', '666 Cedar St', NULL, 6667778888, 6667778888, 'Female', 2);

INSERT INTO Employee (employee_id, first_name, last_name, email, password, date_of_birth, address, cnic, contact, gender, role_id)
VALUES
  (1, 'Nurse Anna', 'Smith', 'nurse.anna@example.com', 'nurse_password', '1988-02-15', '999 Maple St', 9998887777, 9998887777, 'Female', 2),
  (2, 'Receptionist Ben', 'Johnson', 'receptionist.ben@example.com', 'receptionist_password', '1993-09-22', '333 Oak St', 3334445555, 3334445555, 'Male', 1);

INSERT INTO SCHEDULE (Schedule_id, title, start_time, NOP, doctor_id)
VALUES
  (1, 'Morning Clinic', '2023-11-20', 20, 1),
  (2, 'Evening Clinic', '2023-11-21', 15, 2);

INSERT INTO Schedule_Days (sd_id, DAY, Schedule_id)
VALUES
  (1, 'Monday', 1),
  (2, 'Wednesday', 2);

INSERT INTO appointment (appointment_id, appintment_number, date, status, patient_id, Schedule_id)
VALUES
  (1, 101, '2023-11-20', 'Confirmed', 1, 1),
  (2, 102, '2023-11-21', 'Pending', 2, 2);

INSERT INTO Medical_Records (medical_id, Diagonsis, Treatment, Prescription, appointment_id)
VALUES
  (1, 10, 'Medication', 'Take 2 pills daily', 1),
  (2, 20, 'Surgery', 'Refer to specialist', 2);

INSERT INTO Billing (billing_id, total_amount, payment_status, billing_date, payment_method, appointment_id)
VALUES
  (1, 100, 'Paid', '2023-11-21', 'Credit Card', 1),
  (2, 500, 'Pending', '2023-11-22', 'Cash', 2);

INSERT INTO Rooms (room_id, room_number, room_type, status, patient_id)
VALUES
  (1, 101, 'Private', 'Occupied', 1),
  (2, 202, 'Semi-Private', 'Available', 2);

INSERT INTO Pharmacy (pharacy_id, name, purchase_date, expire_date, price, quantity, supplier_id)
VALUES
  (1, 'Paracetamol', '2023-01-01', '2024-12-31', 10, 100, 1),
  (2, 'Ibuprofen', '2023-02-15', '2025-02-14', 15, 50, 2);

INSERT INTO admin (email, password)
VALUES
  ('admin@example.com', 'admin123'),
  ('superadmin@example.com', 'superadmin123');

