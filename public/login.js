function toggleForm() {
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    const toggleBtn = document.getElementById("toggle-btn");
    const formTitle = document.getElementById("form-title");

    if (loginForm.style.display === "none") {
        loginForm.style.display = "block";
        signupForm.style.display = "none";
        formTitle.innerText = "Login";
        toggleBtn.innerText = "Don't have an account? Sign Up";
    } else {
        loginForm.style.display = "none";
        signupForm.style.display = "block";
        formTitle.innerText = "Sign Up";
        toggleBtn.innerText = "Already have an account? Log In";
    }
}
