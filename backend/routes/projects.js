const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const {
  createProject,
  getAllProjects,
  getMyProjects,
  updateProject,
  deleteProject
} = require('../controllers/projectController');

router.post('/', auth, checkRole(['Admin']), createProject);
router.get('/admin/all', auth, checkRole(['Admin']), getAllProjects);
router.get('/my-projects', auth, getMyProjects);
router.put('/:id', auth, checkRole(['Admin']), updateProject);
router.delete('/:id', auth, checkRole(['Admin']), deleteProject);

module.exports = router;
