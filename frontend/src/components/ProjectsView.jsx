import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { projectAPI, authAPI, taskAPI } from '../services/api'
import { Plus, Folder, Users, Trash2, Edit2, Loader2, X } from 'lucide-react'

const ProjectsView = () => {
  const { isAdmin, user } = useAuth()
  const [projects, setProjects] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [allTasks, setAllTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    members: []
  })

  useEffect(() => {
    loadProjects()
    loadUsers()
    loadAllTasks()
  }, [])

  const loadUsers = async () => {
    try {
      const response = await authAPI.getAllUsers()
      setAllUsers(response.data.users || [])
    } catch (error) {
      console.error('Error loading users:', error)
    }
  }

  const loadAllTasks = async () => {
    try {
      const response = await taskAPI.getAll()
      setAllTasks(response.data.tasks || [])
    } catch (error) {
      console.error('Error loading tasks:', error)
    }
  }

  const getAvailableMembers = () => {
    const busyMemberIds = new Set()
    allTasks.forEach(task => {
      if (task.status !== 'Done' && task.assignedTo) {
        busyMemberIds.add(task.assignedTo._id || task.assignedTo)
      }
    })
    return allUsers.filter(user => !busyMemberIds.has(user._id))
  }

  const loadProjects = async () => {
    try {
      const response = await projectAPI.getMyProjects()
      setProjects(response.data.projects || [])
    } catch (error) {
      console.error('Error loading projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingProject) {
        await projectAPI.update(editingProject._id, formData)
      } else {
        await projectAPI.create(formData)
      }
      setIsModalOpen(false)
      setEditingProject(null)
      setFormData({ title: '', description: '', members: [] })
      loadProjects()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save project')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    try {
      await projectAPI.delete(id)
      loadProjects()
    } catch (error) {
      alert('Failed to delete project')
    }
  }

  const handleEdit = (project) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description || '',
      members: project.members || []
    })
    setIsModalOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="text-blue-500 animate-spin" size={32} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Projects</h2>
        {isAdmin() && (
          <button
            onClick={() => {
              setEditingProject(null)
              setFormData({ title: '', description: '', members: [] })
              setIsModalOpen(true)
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-medium transition-colors"
          >
            <Plus size={18} />
            Create Project
          </button>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12 bg-dark-800 rounded-xl border border-dark-700">
          <Folder className="mx-auto text-gray-500 mb-4" size={48} />
          <p className="text-gray-400">No projects found</p>
          {isAdmin() && (
            <p className="text-gray-500 text-sm mt-2">Create your first project to get started</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div
              key={project._id}
              className="p-6 bg-dark-800 rounded-xl border border-dark-700 hover:border-dark-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-blue-600/20 rounded-lg">
                  <Folder className="text-blue-400" size={20} />
                </div>
                {isAdmin() && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>

              <h3 className="font-semibold text-white mb-2">{project.title}</h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {project.description || 'No description'}
              </p>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Users size={14} />
                <span>{project.members?.length || 0} members</span>
              </div>

              <div className="mt-4 pt-4 border-t border-dark-700">
                <p className="text-xs text-gray-500">
                  Admin: {project.adminId?.name || 'Unknown'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-dark-800 rounded-2xl border border-dark-700 shadow-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">
              {editingProject ? 'Edit Project' : 'Create Project'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-blue-500 h-24 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Users size={14} className="inline mr-1" />
                  Members
                </label>
                <select
                  multiple
                  value={formData.members}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, opt => opt.value)
                    setFormData({ ...formData, members: selected })
                  }}
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-blue-500 h-32"
                  disabled={getAvailableMembers().length === 0}
                >
                  {getAvailableMembers().length === 0 ? (
                    <option value="">No available members</option>
                  ) : (
                    getAvailableMembers().map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.name} ({u.email})
                      </option>
                    ))
                  )}
                </select>
                <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple members</p>
                {getAvailableMembers().length === 0 && (
                  <p className="text-xs text-red-400 mt-1">
                    All members are currently assigned to incomplete tasks.
                    Complete tasks to make them available.
                  </p>
                )}

                {formData.members.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.members.map(memberId => {
                      const member = allUsers.find(u => u._id === memberId)
                      return member ? (
                        <span key={memberId} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs">
                          {member.name}
                          <button
                            type="button"
                            onClick={() => setFormData({
                              ...formData,
                              members: formData.members.filter(id => id !== memberId)
                            })}
                            className="hover:text-white"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ) : null
                    })}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-dark-700 hover:bg-dark-600 rounded-lg text-gray-300 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-medium transition-colors"
                >
                  {editingProject ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectsView
