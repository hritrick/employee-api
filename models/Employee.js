const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
  },
  department: {
    type: String,
    default: 'General',
  },
  salary: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
