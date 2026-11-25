const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Employee = require('./models/Employee');

const app = express();
const PORT = 5001;
const MONGO_URI = 'mongodb://127.0.0.1:27017/employeedb';

// Middlewares
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB (employeedb)'))
  .catch((err) => console.error('MongoDB connection error:', err));

// 1. POST /api/employees - Create an employee
// Returns 400 if required fields are missing, 201 on success
app.post('/api/employees', async (req, res) => {
  try {
    const { name, email, department, salary } = req.body;

    // Requirement: Return 400 for missing required fields
    if (!name || !email) {
      return res.status(400).json({ error: 'Both name and email are required' });
    }

    const employee = new Employee({ name, email, department, salary });
    const saved = await employee.save();
    // Requirement: Return 201 on create
    return res.status(201).json(saved);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// 2. GET /api/employees - Retrieve all employees
// Returns 200 on success
app.get('/api/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    // Requirement: Return 200 otherwise
    return res.status(200).json(employees);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// 3. GET /api/employees/:id - Retrieve single employee by ID
// Returns 400 for invalid ObjectId, 404 for non-existing record, 200 on success
app.get('/api/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Requirement: Return 400 for invalid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid employee ID format' });
    }

    const employee = await Employee.findById(id);

    // Requirement: Return 404 for non-existing records
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Requirement: Return 200 on success
    return res.status(200).json(employee);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// 4. DELETE /api/employees/:id - Delete employee by ID
// Returns 400 for invalid ObjectId, 404 for non-existing record, 200 on success
app.delete('/api/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Requirement: Return 400 for invalid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid employee ID format' });
    }

    const deletedEmployee = await Employee.findByIdAndDelete(id);

    // Requirement: Return 404 for non-existing records
    if (!deletedEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Requirement: Return 200 on success
    return res.status(200).json({
      message: 'Employee deleted successfully',
      deletedEmployee,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Employee API server running at http://localhost:${PORT}`);
});
