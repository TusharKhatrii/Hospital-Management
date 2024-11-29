function validateForm() {
    const firstName = document.forms["addEmployeeForm"]["first_name"].value;
    const lastName = document.forms["addEmployeeForm"]["last_name"].value;
    const dobInput = document.forms["addEmployeeForm"]["date_of_birth"];
    const dob = new Date(dobInput.value);

    // Regular expression for checking names
    const nameRegex = /^[A-Za-z][A-Za-z\s]*(\d+)?$/;

    // Validate first name
    if (!nameRegex.test(firstName)) {
        alert("First name must start with a letter and can contain letters, spaces, and optionally end with a number.");
        return false; // Prevent form submission
    }

    // Validate last name
    if (!nameRegex.test(lastName)) {
        alert("Last name must start with a letter and can contain letters, spaces, and optionally end with a number.");
        return false; // Prevent form submission
    }

    // Validate Date of Birth
    const today = new Date();
    if (dob > today) {
        alert("Date of Birth cannot be a future date.");
        return false; // Prevent form submission
    }

    return true; // Allow form submission
};
