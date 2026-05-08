import { useState, useEffect } from 'react'
import { projectAPI, taskAPI } from '../services/api'
import { Users, CheckCircle2, Clock, AlertCircle, Loader2, TrendingUp, UserCheck, Folder, ArrowLeft } from 'lucide-react'

const TeamOverview = () => {
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [projectTasks, setProjectTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      setLoading(true)
      const res = await projectAPI.getMyProjects()
      setProjects(res.data.projects || [])
    } catch (err) {
      setError('Failed to load projects')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadProjectDetails = async (project) => {
    try {
      setLoading(true)
      setSelectedProject(project)
      const res = await taskAPI.getByProject(project._id)
      setProjectTasks(res.data.tasks || [])
    } catch (err) {
      setError('Failed to load project tasks')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getMemberStats = (memberId) => {
    const memberTasks = projectTasks.filter(t => t.assignedTo?._id === memberId || t.assignedTo === memberId)
    return {
      total: memberTasks.length,
      completed: memberTasks.filter(t => t.status === 'Done').length,
      inProgress: memberTasks.filter(t => t.status === 'Doing').length,
      todo: memberTasks.filter(t => t.status === 'To-Do').length,
      overdue: memberTasks.filter(t => {
        if (t.status === 'Done') return false
        return new Date(t.dueDate) < new Date()
      }).length
    }
  }

  const teamStats = {
    totalMembers: selectedProject?.members?.length || 0,
    totalTasks: projectTasks.length,
    completedTasks: projectTasks.filter(t => t.status === 'Done').length,
    inProgressTasks: projectTasks.filter(t => t.status === 'Doing').length,
    overdueTasks: projectTasks.filter(t => {
      if (t.status === 'Done') return false
      return new Date(t.dueDate) < new Date()
    }).length
  }

  const completionRate = teamStats.totalTasks > 0
    ? Math.round((teamStats.completedTasks / teamStats.totalTasks) * 100)
    : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="text-blue-500 animate-spin" size={32} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
        {error}
      </div>
    )
  }

  if (!selectedProject) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Select a Project</h2>
        </div>
        {projects.length === 0 ? (
          <div className="text-center py-12 bg-dark-800 rounded-xl border border-dark-700">
            <Folder className="mx-auto text-gray-500 mb-4" size={48} />
            <p className="text-gray-400">No projects found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <button
                key={project._id}
                onClick={() => loadProjectDetails(project)}
                className="p-6 bg-dark-800 rounded-xl border border-dark-700 hover:border-blue-500 transition-colors text-left"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-blue-600/20 rounded-lg">
                    <Folder className="text-blue-400" size={20} />
                  </div>
                </div>
                <h3 className="font-semibold text-white mb-2">{project.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {project.description || 'No description'}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Users size={14} />
                  <span>{project.members?.length || 0} members</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            setSelectedProject(null)
            setProjectTasks([])
          }}
          className="flex items-center gap-2 px-4 py-2 bg-dark-800 hover:bg-dark-700 border border-dark-700 rounded-lg text-gray-300 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Projects
        </button>
        <h2 className="text-xl font-bold text-white">{selectedProject.title}</h2>
      </div>

      {/* Team Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Team Members</p>
              <p className="text-2xl font-bold text-white">{teamStats.totalMembers}</p>
            </div>
            <Users className="text-blue-400" size={24} />
          </div>
        </div>
        <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Tasks</p>
              <p className="text-2xl font-bold text-white">{teamStats.totalTasks}</p>
            </div>
            <CheckCircle2 className="text-emerald-400" size={24} />
          </div>
        </div>
        <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">In Progress</p>
              <p className="text-2xl font-bold text-yellow-400">{teamStats.inProgressTasks}</p>
            </div>
            <Clock className="text-yellow-400" size={24} />
          </div>
        </div>
        <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Overdue</p>
              <p className="text-2xl font-bold text-red-400">{teamStats.overdueTasks}</p>
            </div>
            <AlertCircle className="text-red-400" size={24} />
          </div>
        </div>
      </div>

      {/* Completion Rate */}
      <div className="bg-dark-800 p-6 rounded-lg border border-dark-700">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="text-blue-400" size={24} />
          <h3 className="text-lg font-semibold text-white">Team Completion Rate</h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-dark-700 rounded-full h-4">
            <div
              className="bg-blue-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <span className="text-2xl font-bold text-blue-400">{completionRate}%</span>
        </div>
        <p className="text-gray-400 text-sm mt-2">
          {teamStats.completedTasks} of {teamStats.totalTasks} tasks completed
        </p>
      </div>

      {/* Member Performance Table */}
      <div className="bg-dark-800 rounded-lg border border-dark-700 overflow-hidden">
        <div className="p-6 border-b border-dark-700">
          <div className="flex items-center gap-3">
            <UserCheck className="text-blue-400" size={24} />
            <h3 className="text-lg font-semibold text-white">Member Performance</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-700/50">
              <tr>
                <th className="text-left px-6 py-3 text-gray-400 text-sm font-medium">Member</th>
                <th className="text-center px-4 py-3 text-gray-400 text-sm font-medium">Total Tasks</th>
                <th className="text-center px-4 py-3 text-gray-400 text-sm font-medium">Completed</th>
                <th className="text-center px-4 py-3 text-gray-400 text-sm font-medium">In Progress</th>
                <th className="text-center px-4 py-3 text-gray-400 text-sm font-medium">To Do</th>
                <th className="text-center px-4 py-3 text-gray-400 text-sm font-medium">Overdue</th>
                <th className="text-center px-4 py-3 text-gray-400 text-sm font-medium">Completion %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700">
              {selectedProject.members?.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-400">
                    No members assigned to this project
                  </td>
                </tr>
              ) : (
                selectedProject.members?.map(member => {
                  const stats = getMemberStats(member._id)
                  const percent = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0
                  return (
                    <tr key={member._id} className="hover:bg-dark-700/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                            {member.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-white font-medium">{member.name}</p>
                            <p className="text-gray-400 text-sm">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-center px-4 py-4 text-white">{stats.total}</td>
                      <td className="text-center px-4 py-4 text-emerald-400">{stats.completed}</td>
                      <td className="text-center px-4 py-4 text-yellow-400">{stats.inProgress}</td>
                      <td className="text-center px-4 py-4 text-gray-400">{stats.todo}</td>
                      <td className="text-center px-4 py-4">
                        {stats.overdue > 0 ? (
                          <span className="text-red-400">{stats.overdue}</span>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-dark-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                percent >= 80 ? 'bg-emerald-500' : percent >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <span className={`text-sm font-medium ${
                            percent >= 80 ? 'text-emerald-400' : percent >= 50 ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {percent}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default TeamOverview
