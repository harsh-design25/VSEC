# Student Management REST API

A simple REST API to manage student records using Node.js, Express.js, MongoDB and Mongoose.

## Features
- Create a student
- Read all students
- Read one student by ID
- Update a student
- Delete a student
- Basic validation and error responses

## Requirements
- Node.js and npm
- MongoDB Community Server running locally
- VS Code with Thunder Client extension (or Postman)

## Setup
1. Open this folder in VS Code.
2. Make sure MongoDB is running on your computer.
3. Open the terminal in this folder.
4. Install packages:

   ```bash
   npm install
   ```

5. Start the server:

   ```bash
   npm start
   ```

6. Open `http://localhost:3000` in your browser. You should see the API running message.

The app connects to `mongodb://127.0.0.1:27017/studentDB`.

## API endpoints

Base URL: `http://localhost:3000`

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | Check that the API is running |
| POST | `/students` | Create a student |
| GET | `/students` | Get all students |
| GET | `/students/:id` | Get one student by ID |
| PUT | `/students/:id` | Update a student by ID |
| DELETE | `/students/:id` | Delete a student by ID |

## Test with Thunder Client

For POST and PUT requests:
- Select **Body** → **JSON**
- Choose `application/json` if prompted.

Example JSON for POST `/students`:

```json
{
  "name": "Aarav Patil",
  "rollNumber": "IT101",
  "department": "Information Technology",
  "year": 2,
  "email": "aarav@example.com"
}
```

### Test sequence
1. Send POST `/students` with the example JSON.
2. Copy the `_id` from the response.
3. Send GET `/students` to view all records.
4. Send GET `/students/PASTE_ID_HERE` to view one record.
5. Send PUT `/students/PASTE_ID_HERE` with updated JSON.
6. Send DELETE `/students/PASTE_ID_HERE` to remove the record.

Use the actual MongoDB `_id` returned by the API, not the text `PASTE_ID_HERE`.

## Important
`rollNumber` and `email` must be unique. Use different values for each new student.
