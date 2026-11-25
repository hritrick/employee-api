# Employee API (Node.js, Express, Mongoose)

A robust RESTful API for Employee records with strict HTTP status code handling (200, 201, 400, 404) and MongoDB validation via Mongoose.

## What this Project Does
- Implements full CRUD endpoints for Employee records:
  - `POST /api/employees` - Create employee
  - `GET /api/employees` - List all employees
  - `GET /api/employees/:id` - Fetch single employee
  - `DELETE /api/employees/:id` - Remove employee
- Enforces strict HTTP status code rules:
  - **`400 Bad Request`**: Missing required fields (`name`, `email`) or invalid MongoDB ObjectId format.
  - **`404 Not Found`**: Target record does not exist in the database.
  - **`201 Created`**: Successful record creation.
  - **`200 OK`**: Successful retrieval or deletion.
- Persists data to MongoDB at `mongodb://127.0.0.1:27017/employeedb`.

---

## Step-by-Step Commands (From Scratch)

### 1. Initialize project from an empty folder
```bash
mkdir employee-api
cd employee-api
npm init -y
```

### 2. Install dependencies
```bash
npm install express mongoose cors
```

### 3. Start MongoDB
Ensure MongoDB is running locally:
```bash
# macOS (Homebrew):
brew services start mongodb-community
# or direct mongod command:
mongod --dbpath /usr/local/var/mongodb
```

### 4. Run the API server
```bash
# Production / standard start:
npm start

# Development mode (auto-restart with Node 18+):
npm run dev
```

The server listens on **`http://localhost:5001`**.

---

## Required Ports & Services
- **API Port:** `5001` (`http://localhost:5001`)
- **MongoDB URI:** `mongodb://127.0.0.1:27017/employeedb` (port `27017`)

---

## File-by-File Implementation Notes

| File | Purpose & Requirements Covered |
| :--- | :--- |
| `models/Employee.js` | Defines Mongoose schema with `name` (required), `email` (required), `department` (optional), and `salary` (optional) |
| `server.js` | - Express setup with `cors` and `express.json`<br>- Connects to `mongodb://127.0.0.1:27017/employeedb`<br>- **POST `/api/employees`**: checks `!name || !email` -> sends `400`; on success -> sends `201`<br>- **GET `/api/employees`**: returns array with `200`<br>- **GET `/api/employees/:id`**: validates ObjectId (`mongoose.Types.ObjectId.isValid`) -> sends `400` if invalid; checks existence -> sends `404` if not found; sends `200` on success<br>- **DELETE `/api/employees/:id`**: validates ObjectId -> sends `400` if invalid; checks deleted doc -> sends `404` if not found; sends `200` on success |
| `package.json` | Express and Mongoose dependencies, `start` and `dev` npm scripts |

---

## Sample Postman / Thunder Client Requests

### 1. Create Employee (POST - Valid)
- **Method:** `POST`
- **URL:** `http://localhost:5001/api/employees`
- **Headers:** `Content-Type: application/json`
- **Body (JSON):**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane.doe@company.com",
    "department": "Engineering",
    "salary": 85000
  }
  ```
- **Response:** `201 Created`
  ```json
  {
    "_id": "65b925f190e2d1001234abcd",
    "name": "Jane Doe",
    "email": "jane.doe@company.com",
    "department": "Engineering",
    "salary": 85000,
    "createdAt": "2026-11-25T14:50:00.000Z",
    "updatedAt": "2026-11-25T14:50:00.000Z",
    "__v": 0
  }
  ```

---

### 2. Create Employee (POST - Missing Required Field -> 400 Bad Request)
- **Method:** `POST`
- **URL:** `http://localhost:5001/api/employees`
- **Body (JSON):**
  ```json
  {
    "name": "Jane Doe"
  }
  ```
- **Response:** `400 Bad Request`
  ```json
  {
    "error": "Both name and email are required"
  }
  ```

---

### 3. Get All Employees (GET -> 200 OK)
- **Method:** `GET`
- **URL:** `http://localhost:5001/api/employees`
- **Response:** `200 OK`

---

### 4. Get Employee by ID (GET - Non-Existing Record -> 404 Not Found)
- **Method:** `GET`
- **URL:** `http://localhost:5001/api/employees/65b925f190e2d1001234ffff`
- **Response:** `404 Not Found`
  ```json
  {
    "error": "Employee not found"
  }
  ```

---

### 5. Get Employee with Invalid ID Format (GET -> 400 Bad Request)
- **Method:** `GET`
- **URL:** `http://localhost:5001/api/employees/invalid-mongo-id-123`
- **Response:** `400 Bad Request`
  ```json
  {
    "error": "Invalid employee ID format"
  }
  ```

---

### 6. Delete Employee (DELETE -> 200 OK)
- **Method:** `DELETE`
- **URL:** `http://localhost:5001/api/employees/65b925f190e2d1001234abcd`
- **Response:** `200 OK`
  ```json
  {
    "message": "Employee deleted successfully",
    "deletedEmployee": {
      "_id": "65b925f190e2d1001234abcd",
      "name": "Jane Doe",
      "email": "jane.doe@company.com"
    }
  }
  ```
