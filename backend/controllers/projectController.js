const { Project, Task, User } = require('../models');

const createProject = async (req, res) => {
  try {
    const { title, description, members } = req.body;

    const project = await Project.create({
      title,
      description,
      adminId: req.user._id,
      members: members || []
    });

    await project.populate('members', 'name email');

    res.status(201).json({
      success: true,
      project
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating project', error: error.message });
  }
};

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({ adminId: req.user._id })
      .populate('adminId', 'name email')
      .populate('members', 'name email');

    res.json({
      success: true,
      projects
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
};

const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { adminId: req.user._id },
        { members: req.user._id }
      ]
    })
      .populate('adminId', 'name email')
      .populate('members', 'name email');

    res.json({
      success: true,
      projects
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const { title, description, members } = req.body;

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, adminId: req.user._id },
      { title, description, members },
      { new: true }
    )
      .populate('adminId', 'name email')
      .populate('members', 'name email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found or not authorized' });
    }

    res.json({
      success: true,
      project
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating project', error: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      adminId: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found or not authorized' });
    }

    await Task.deleteMany({ projectId: req.params.id });

    res.json({
      success: true,
      message: 'Project and associated tasks deleted'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project', error: error.message });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getMyProjects,
  updateProject,
  deleteProject
};
