document.getElementById("employeeForm").addEventListener("submit", function(event) {

    event.preventDefault();

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value;
    let phone = document.getElementById("phone").value.trim();
    let department = document.getElementById("department").value;

    let message = document.getElementById("message");


    // Name validation
    if (name === "") {
        message.innerHTML = "Please enter employee name.";
        message.style.color = "red";
        return;
    }


    // Email validation
    if (!email.includes("@") || !email.includes(".")) {
        message.innerHTML = "Please enter a valid email.";
        message.style.color = "red";
        return;
    }


    // Password validation
    if (password.length < 6) {
        message.innerHTML = "Password must contain at least 6 characters.";
        message.style.color = "red";
        return;
    }


    // Phone validation
    if (phone.length !== 10 || isNaN(phone)) {
        message.innerHTML = "Phone number must contain 10 digits.";
        message.style.color = "red";
        return;
    }


    // Department validation
    if (department === "") {
        message.innerHTML = "Please select a department.";
        message.style.color = "red";
        return;
    }


    // Successful registration
    message.innerHTML = "Employee registered successfully!";
    message.style.color = "green";

});