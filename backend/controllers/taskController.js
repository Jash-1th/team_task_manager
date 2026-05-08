const { Task, Project, User } = require('../models');

const createTask = async (req, res) => {
  try {
    const { title, description, status, dueDate, assignedTo, projectId } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.adminId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only project admin can create tasks' });
    }

    const task = await Task.create({
      title,
      description,
      status: status || 'To-Do',
      dueDate,
      assignedTo,
      projectId
    });

    await task.populate('assignedTo', 'name email');
    await task.populate('projectId', 'title');

    res.status(201).json({
      success: true,
      task
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
};

const getTasksByProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const isAdmin = project.adminId.toString() === req.user._id.toString();
    const isMember = project.members.some(m => m.toString() === req.user._id.toString());

    if (!isAdmin && !isMember) {
      return res.status(403).json({ message: 'Not authorized to view this project' });
    }

    const tasks = await Task.find({ projectId: req.params.projectId })
      .populate('assignedTo', 'name email')
      .populate('projectId', 'title');

    res.json({
      success: true,
      tasks
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};

const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id })
      .populate('assignedTo', 'name email')
      .populate('projectId', 'title');

    res.json({
      success: true,
      tasks
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('assignedTo', 'name email')
      .populate('projectId', 'title');

    res.json({
      success: true,
      tasks
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { status } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (req.user.role === 'Member') {
      if (task.assignedTo.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Can only update your own tasks' });
      }

      const allowedStatuses = ['To-Do', 'Doing', 'Done'];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
      }

      task.status = status;
      await task.save();
    } else {
      const { title, description, dueDate, assignedTo } = req.body;
      const project = await Project.findById(task.projectId);

      if (project.adminId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      task.title = title || task.title;
      task.description = description || task.description;
      task.status = status || task.status;
      task.dueDate = dueDate || task.dueDate;
      task.assignedTo = assignedTo || task.assignedTo;
      await task.save();
    }

    await task.populate('assignedTo', 'name email');
    await task.populate('projectId', 'title');

    res.json({
      success: true,
      task
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await Project.findById(task.projectId);
    if (project.adminId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only project admin can delete tasks' });
    }

    await task.deleteOne();

    res.json({
      success: true,
      message: 'Task deleted'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
};

module.exports = {
  createTask,
  getTasksByProject,
  getMyTasks,
  getAllTasks,
  updateTask,
  deleteTask
};
