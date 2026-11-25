const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Employee = require('./models/Employee');

const app = express();
const PORT = 5001;
const MONGO_URI = 'mongodb://127.0.0.1:27017/employeedb';

app.use(cors());
app.use(express.json());

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB (employeedb)'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.post('/api/employees', async (req, res) => {
  try {
    const { name, email, department, salary } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Both name and email are required' });
    }

    const employee = new Employee({ name, email, department, salary });
    const saved = await employee.save();
    return res.status(201).json(saved);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/api/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    return res.status(200).json(employees);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/api/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid employee ID format' });
    }

    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    return res.status(200).json(employee);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.delete('/api/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid employee ID format' });
    }

    const deletedEmployee = await Employee.findByIdAndDelete(id);

    if (!deletedEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    return res.status(200).json({
      message: 'Employee deleted successfully',
      deletedEmployee,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Employee API server running at http://localhost:${PORT}`);
});
