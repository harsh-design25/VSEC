let students = [];

document.getElementById("resultForm").addEventListener("submit", function(event) {

    event.preventDefault();

    let name = document.getElementById("name").value;
    let roll = document.getElementById("roll").value;

    let maths = Number(document.getElementById("maths").value);
    let science = Number(document.getElementById("science").value);
    let english = Number(document.getElementById("english").value);

    let total = maths + science + english;
    let percentage = total / 3;

    let student = {
        name: name,
        roll: roll,
        total: total,
        percentage: percentage
    };

    students.push(student);

    displayStudents();

    findTopper();

    document.getElementById("resultForm").reset();
});


function displayStudents() {

    let table = document.getElementById("studentTable");

    table.innerHTML = "";

    students.forEach(function(student) {

        let row = `
            <tr>
                <td>${student.roll}</td>
                <td>${student.name}</td>
                <td>${student.total}</td>
                <td>${student.percentage.toFixed(2)}%</td>
            </tr>
        `;

        table.innerHTML += row;
    });
}


function findTopper() {

    let topper = students[0];

    for (let i = 1; i < students.length; i++) {

        if (students[i].percentage > topper.percentage) {
            topper = students[i];
        }
    }

    document.getElementById("topper").innerHTML =
        "Topper: " + topper.name +
        " - " + topper.percentage.toFixed(2) + "%";
}