const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['To-Do', 'Doing', 'Done'],
    default: 'To-Do'
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Task must be assigned to a user']
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'Task must belong to a project']
  }
}, { timestamps: true });

taskSchema.virtual('isOverdue').get(function() {
  return this.status !== 'Done' && this.dueDate < new Date();
});

taskSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Task', taskSchema);
