import { useState, useEffect } from 'react'
import { X, Plus, User, Calendar, FileText, Tag } from 'lucide-react'
import { projectAPI, taskAPI } from '../services/api'

const TaskModal = ({ isOpen, onClose, onTaskCreated }) => {
  const [projects, setProjects] = useState([])
  const [members, setMembers] = useState([])
  const [allTasks, setAllTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'To-Do',
    dueDate: '',
    projectId: '',
    assignedTo: ''
  })

  useEffect(() => {
    if (isOpen) {
      fetchProjects()
      fetchAllTasks()
    }
  }, [isOpen])

  useEffect(() => {
    if (formData.projectId) {
      const project = projects.find(p => p._id === formData.projectId)
      if (project) {
        const projectMembers = project.members || []
        const availableMembers = getAvailableMembers(projectMembers, allTasks)
        setMembers(availableMembers)
      }
    }
  }, [formData.projectId, projects, allTasks])

  const fetchProjects = async () => {
    try {
      const response = await projectAPI.getAll()
      setProjects(response.data.projects || [])
    } catch (err) {
      console.error('Error fetching projects:', err)
    }
  }

  const fetchAllTasks = async () => {
    try {
      const response = await taskAPI.getAll()
      setAllTasks(response.data.tasks || [])
    } catch (err) {
      console.error('Error fetching tasks:', err)
    }
  }

  const getAvailableMembers = (projectMembers, tasks) => {
    const busyMemberIds = new Set()
    tasks.forEach(task => {
      if (task.status !== 'Done' && task.assignedTo) {
        busyMemberIds.add(task.assignedTo._id || task.assignedTo)
      }
    })
    return projectMembers.filter(member => !busyMemberIds.has(member._id))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await taskAPI.create(formData)
      onTaskCreated()
      onClose()
      setFormData({
        title: '',
        description: '',
        status: 'To-Do',
        dueDate: '',
        projectId: '',
        assignedTo: ''
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-dark-800 rounded-2xl border border-dark-700 shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-dark-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <Plus className="text-blue-400" size={20} />
            </div>
            <h2 className="text-xl font-bold text-white">Create New Task</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <Tag size={14} />
              Task Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              placeholder="Enter task title"
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <FileText size={14} />
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 h-24 resize-none"
              placeholder="Enter task description"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <Calendar size={14} />
              Due Date
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Project
            </label>
            <select
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value, assignedTo: '' })}
              className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              required
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <User size={14} />
              Assign To
            </label>
            <select
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              required
              disabled={!formData.projectId || members.length === 0}
            >
              <option value="">
                {!formData.projectId ? 'Select a project first' :
                  members.length === 0 ? 'No available members' : 'Select a member'}
              </option>
              {members.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name}
                </option>
              ))}
            </select>
            {formData.projectId && members.length === 0 && (
              <p className="text-xs text-red-400 mt-2">
                All members in this project are currently assigned to incomplete tasks.
                Complete existing tasks to make them available.
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-dark-700 hover:bg-dark-600 rounded-lg text-gray-300 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 rounded-lg text-white font-medium transition-colors"
            >
              {loading ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskModal
