const Task = require('../models/Task');

// Create Task
exports.createTask = async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      user: req.userId
    });

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Tasks with pagination & filtering
exports.getTasks = async (req, res) => {
  try {
    const { page = 1, limit = 10, completed, priority, category } = req.query;

    const filter = { user: req.userId };

    if (completed !== undefined)
      filter.completed = completed === 'true';
    if (priority) filter.priority = priority;
    if (category) filter.category = category;

    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Task.countDocuments(filter);

    res.json({
      success: true,
      data: tasks,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );

    if (!task)
      return res.status(404).json({ message: "Task not found" });

    res.json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });

    if (!task)
      return res.status(404).json({ message: "Task not found" });

    res.json({ success: true, message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
