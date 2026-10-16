
import { useState } from "react";

function StudentForm({ onAddStudent }) {
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [department, setDepartment] = useState("");
  const [marks, setMarks] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    onAddStudent({ name, rollNo, department, marks });

    setName("");
    setRollNo("");
    setDepartment("");
    setMarks("");
  }

  return (
    <form onSubmit={handleSubmit} className="student-form">
      <label>Student Name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <label>Roll Number</label>
      <input
        value={rollNo}
        onChange={(e) => setRollNo(e.target.value)}
        required
      />

      <label>Department</label>
      <select
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        required
      >
        <option value="">Select Department</option>
        <option>Computer Engineering</option>
        <option>Information Technology</option>
        <option>AI & Data Science</option>
        <option>Mechanical Engineering</option>
      </select>

      <label>Marks (out of 100)</label>
      <input
        type="number"
        min="0"
        max="100"
        value={marks}
        onChange={(e) => setMarks(e.target.value)}
        required
      />

      <button type="submit">Add Student</button>
    </form>
  );
}

export default StudentForm;
