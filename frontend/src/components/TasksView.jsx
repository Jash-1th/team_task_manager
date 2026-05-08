import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { taskAPI } from '../services/api'
import { CheckSquare, Calendar, Clock, User, Filter, Loader2 } from 'lucide-react'

const TasksView = () => {
  const { isAdmin, user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      const response = await taskAPI.getMyTasks()
      setTasks(response.data.tasks || [])
    } catch (error) {
      console.error('Error loading tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskAPI.update(taskId, { status: newStatus })
      setTasks(prev => prev.map(t =>
        t._id === taskId ? { ...t, status: newStatus } : t
      ))
    } catch (error) {
      alert('Failed to update task status')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'To-Do': return 'bg-gray-500 text-gray-300'
      case 'Doing': return 'bg-blue-500 text-blue-100'
      case 'Done': return 'bg-green-500 text-green-100'
      default: return 'bg-gray-500'
    }
  }

  const isOverdue = (task) => {
    return task.status !== 'Done' && new Date(task.dueDate) < new Date()
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true
    if (filter === 'todo') return task.status === 'To-Do'
    if (filter === 'doing') return task.status === 'Doing'
    if (filter === 'done') return task.status === 'Done'
    if (filter === 'overdue') return isOverdue(task)
    return true
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="text-blue-500 animate-spin" size={32} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-white">Tasks</h2>

        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Tasks</option>
            <option value="todo">To-Do</option>
            <option value="doing">In Progress</option>
            <option value="done">Done</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-12 bg-dark-800 rounded-xl border border-dark-700">
          <CheckSquare className="mx-auto text-gray-500 mb-4" size={48} />
          <p className="text-gray-400">No tasks found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className={`p-4 bg-dark-800 rounded-xl border ${
                isOverdue(task) ? 'border-red-500/50' : 'border-dark-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium text-white">{task.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                    {isOverdue(task) && (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-red-500/20 text-red-400">
                        Overdue
                      </span>
                    )}
                  </div>

                  <p className="text-gray-400 text-sm mb-3">
                    {task.description || 'No description'}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span className={isOverdue(task) ? 'text-red-400' : ''}>
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User size={14} />
                      <span>Assigned to: {task.assignedTo?.name || 'Unassigned'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>Project: {task.projectId?.title || 'Unknown'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {task.status !== 'To-Do' && (
                    <button
                      onClick={() => handleStatusChange(task._id, 'To-Do')}
                      className="px-3 py-1.5 text-xs bg-gray-600 hover:bg-gray-500 rounded-lg text-white transition-colors"
                    >
                      To-Do
                    </button>
                  )}
                  {task.status !== 'Doing' && (
                    <button
                      onClick={() => handleStatusChange(task._id, 'Doing')}
                      className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition-colors"
                    >
                      In Progress
                    </button>
                  )}
                  {task.status !== 'Done' && (
                    <button
                      onClick={() => handleStatusChange(task._id, 'Done')}
                      className="px-3 py-1.5 text-xs bg-green-600 hover:bg-green-500 rounded-lg text-white transition-colors"
                    >
                      Done
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TasksView
