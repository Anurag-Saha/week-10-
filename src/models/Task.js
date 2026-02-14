const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    minlength: 3,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  completed: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: Date,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['work', 'personal', 'shopping', 'health', 'other'],
    default: 'personal'
  }
}, { timestamps: true });

taskSchema.index({ user: 1, completed: 1 });
taskSchema.index({ dueDate: 1 });

taskSchema.pre('save', function(next) {
  if (this.title) {
    this.title =
      this.title.charAt(0).toUpperCase() + this.title.slice(1);
  }
  next();
});

module.exports = mongoose.model('Task', taskSchema);
