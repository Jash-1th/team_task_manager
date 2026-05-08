const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const {
  createTask,
  getTasksByProject,
  getMyTasks,
  getAllTasks,
  updateTask,
  deleteTask
} = require('../controllers/taskController');

router.post('/', auth, checkRole(['Admin']), createTask);
router.get('/all', auth, checkRole(['Admin']), getAllTasks);
router.get('/my-tasks', auth, getMyTasks);
router.get('/project/:projectId', auth, getTasksByProject);
router.put('/:id', auth, updateTask);
router.delete('/:id', auth, checkRole(['Admin']), deleteTask);

module.exports = router;
