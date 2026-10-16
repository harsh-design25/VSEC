
const employeeForm = document.getElementById("employeeForm");
const message = document.getElementById("message");
const employeeTableBody = document.getElementById("employeeTableBody");

employeeForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const phone = document.getElementById("phone").value.trim();
    const department = document.getElementById("department").value;

    // Validate employee name
    if (name === "") {
        showMessage("Please enter employee name.", "red");
        return;
    }

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showMessage("Please enter a valid email.", "red");
        return;
    }

    // Validate password
    if (password.length < 6) {
        showMessage("Password must contain at least 6 characters.", "red");
        return;
    }

    // Validate phone number
    if (!/^\d{10}$/.test(phone)) {
        showMessage("Phone number must contain exactly 10 digits.", "red");
        return;
    }

    // Validate department
    if (department === "") {
        showMessage("Please select a department.", "red");
        return;
    }

    // Remove the empty table message
    const emptyRow = document.getElementById("emptyRow");
    if (emptyRow) {
        emptyRow.remove();
    }

    // Create a new employee row
    const row = document.createElement("tr");

    [name, email, phone, department].forEach(function(value) {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
    });

    // Display employee in the table
    employeeTableBody.appendChild(row);

    showMessage("Employee registered successfully!", "green");

    // Clear form after registration
    employeeForm.reset();
});

function showMessage(text, color) {
    message.textContent = text;
    message.style.color = color;
}
