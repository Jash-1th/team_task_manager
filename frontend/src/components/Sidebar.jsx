import { LayoutGrid, CheckSquare, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'

const Sidebar = ({ activeTab, setActiveTab, onLogout }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'projects', label: 'Projects', icon: LayoutGrid },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  ]

  const handleNavClick = (id) => {
    setActiveTab(id)
    setIsMobileOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-dark-800 rounded-lg text-gray-300 hover:text-white"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-dark-800 border-r border-dark-700 transform transition-transform duration-300 lg:transform-none ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-dark-700">
            <h1 className="text-xl font-bold text-white">Task Manager</h1>
            <p className="text-sm text-gray-400 mt-1">Team Collaboration</p>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:bg-dark-700 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>

          <div className="p-4 border-t border-dark-700">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
