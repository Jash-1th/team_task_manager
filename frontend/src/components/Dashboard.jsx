import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { taskAPI, projectAPI } from '../services/api'
import { Plus, Loader2, LayoutGrid, Users } from 'lucide-react'
import Sidebar from './Sidebar'
import StatsBar from './StatsBar'
import TaskBoard from './TaskBoard'
import TaskModal from './TaskModal'
import ProjectsView from './ProjectsView'
import TasksView from './TasksView'
import TeamOverview from './TeamOverview'

const Dashboard = () => {
  const { user, logout, isAdmin, isMember, loading: authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (!authLoading && user) {
      loadDashboardData()
    }
  }, [user, authLoading])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      if (isAdmin()) {
        await loadAdminData()
      } else {
        await loadMemberData()
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadAdminData = async () => {
    const [projectsRes, tasksRes] = await Promise.all([
      projectAPI.getAll(),
      taskAPI.getMyTasks()
    ])
    setProjects(projectsRes.data.projects || [])
    setTasks(tasksRes.data.tasks || [])
  }

  const loadMemberData = async () => {
    const response = await taskAPI.getMyTasks()
    setTasks(response.data.tasks || [])
  }

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await taskAPI.update(taskId, { status: newStatus })
      setTasks(prev => prev.map(t =>
        t._id === taskId ? { ...t, status: newStatus } : t
      ))
    } catch (error) {
      console.error('Error updating task:', error)
      alert('Failed to update task status')
    }
  }

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  const handleTaskCreated = () => {
    loadDashboardData()
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <Loader2 className="text-blue-500 animate-spin" size={32} />
      </div>
    )
  }

  if (!user) {
    return <div className="p-8 text-white">Please log in</div>
  }

  return (
    <div className="flex min-h-screen bg-dark-900">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        isAdmin={isAdmin()}
      />

      <main className="flex-1 p-4 lg:p-8 lg:ml-0 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex-1 overflow-y-auto p-8">
            {activeTab === 'dashboard' && (
              <header className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-white">Welcome, {user.name}</h1>
                  {isAdmin() ? (
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">ADMIN</span>
                  ) : (
                    <span className="border border-gray-500 text-gray-400 px-2 py-1 rounded text-xs font-semibold">TEAM MEMBER</span>
                  )}
                </div>
                {isAdmin() && (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-medium transition-colors"
                  >
                    <Plus size={18} />
                    Create Task
                  </button>
                )}
              </header>
            )}

            {activeTab === 'projects' && (
              <header className="mb-8">
                <h1 className="text-2xl font-bold text-white">Projects</h1>
                <p className="text-gray-400 mt-1">Manage your team projects</p>
              </header>
            )}

            {activeTab === 'tasks' && (
              <header className="mb-8">
                <h1 className="text-2xl font-bold text-white">Tasks</h1>
                <p className="text-gray-400 mt-1">View and manage all tasks</p>
              </header>
            )}

            {activeTab === 'team' && (
              <header className="mb-8">
                <h1 className="text-2xl font-bold text-white">Team Overview</h1>
                <p className="text-gray-400 mt-1">Track team performance and task distribution</p>
              </header>
            )}

            {activeTab === 'dashboard' && (
              loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="text-blue-500 animate-spin" size={32} />
                </div>
              ) : (
                <>
                  <StatsBar tasks={tasks} />
                  {isAdmin() ? (
                    <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
                      <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                          onClick={() => setActiveTab('projects')}
                          className="p-4 bg-blue-600/20 border border-blue-600/40 rounded-lg text-left hover:bg-blue-600/30 transition-colors"
                        >
                          <LayoutGrid className="text-blue-400 mb-2" size={24} />
                          <h3 className="text-white font-medium">Manage Projects</h3>
                          <p className="text-gray-400 text-sm mt-1">View and manage team projects</p>
                        </button>
                        <button
                          onClick={() => setIsModalOpen(true)}
                          className="p-4 bg-blue-600/20 border border-blue-600/40 rounded-lg text-left hover:bg-blue-600/30 transition-colors"
                        >
                          <Plus className="text-blue-400 mb-2" size={24} />
                          <h3 className="text-white font-medium">Create Task</h3>
                          <p className="text-gray-400 text-sm mt-1">Assign tasks to team members</p>
                        </button>
                        <button
                          onClick={() =>  setActiveTab('team')}
                          className="p-4 bg-blue-600/20 border border-blue-600/40 rounded-lg text-left hover:bg-blue-600/30 transition-colors"
                        >
                         <Users className="text-blue-400 mb-2" size={24} />
                          <h3 className="text-white font-medium">Team Overview</h3>
                          <p className="text-gray-400 text-sm mt-1">Monitor team progress</p>
                        </button>
                       
                      </div>
                    </div>
                  ) : (
                    <TaskBoard
                      tasks={tasks}
                      onUpdateStatus={handleUpdateStatus}
                      userRole={user?.role}
                    />
                  )}
                </>
              )
            )}

            {activeTab === 'projects' && <ProjectsView />}

            {activeTab === 'tasks' && <TasksView />}

            {activeTab === 'team' && <TeamOverview />}
          </div>
        </div>
      </main>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTaskCreated={handleTaskCreated}
      />
    </div>
  )
}

export default Dashboard
