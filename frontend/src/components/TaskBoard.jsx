import { MoreHorizontal, Calendar, User } from 'lucide-react'

const TaskBoard = ({ tasks, onUpdateStatus }) => {
  const columns = [
    { id: 'To-Do', label: 'To Do', color: 'border-gray-500', bgColor: 'bg-gray-500/10' },
    { id: 'Doing', label: 'In Progress', color: 'border-blue-500', bgColor: 'bg-blue-500/10' },
    { id: 'Done', label: 'Done', color: 'border-green-500', bgColor: 'bg-green-500/10' }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'To-Do': return 'bg-gray-500'
      case 'Doing': return 'bg-blue-500'
      case 'Done': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const isOverdue = (task) => {
    return task.status !== 'Done' && new Date(task.dueDate) < new Date()
  }

  return (
    <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden">
      <div className="p-4 border-b border-dark-700">
        <h2 className="text-lg font-semibold text-white">Task Board</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {columns.map((column) => {
          const columnTasks = tasks.filter(t => t.status === column.id)

          return (
            <div key={column.id} className="flex flex-col">
              <div className={`flex items-center gap-2 mb-3 pb-2 border-b-2 ${column.color}`}>
                <div className={`w-3 h-3 rounded-full ${getStatusColor(column.id)}`} />
                <span className="font-medium text-gray-300">{column.label}</span>
                <span className="ml-auto text-sm text-gray-500 bg-dark-700 px-2 py-0.5 rounded-full">
                  {columnTasks.length}
                </span>
              </div>

              <div className="space-y-3 min-h-[200px]">
                {columnTasks.map((task) => (
                  <div
                    key={task._id}
                    className={`p-4 rounded-lg bg-dark-700 border border-dark-600 hover:border-dark-500 transition-colors ${
                      isOverdue(task) ? 'ring-1 ring-red-500/50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-white text-sm">{task.title}</h3>
                      <button className="text-gray-500 hover:text-white">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>

                    <p className="text-gray-400 text-xs mb-3 line-clamp-2">
                      {task.description || 'No description'}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span className={isOverdue(task) ? 'text-red-400' : ''}>
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      {task.assignedTo && (
                        <div className="flex items-center gap-1">
                          <User size={12} />
                          <span>{task.assignedTo.name || 'Unassigned'}</span>
                        </div>
                      )}
                    </div>

                    {onUpdateStatus && (
                      <div className="mt-3 flex gap-2">
                        {column.id !== 'To-Do' && (
                          <button
                            onClick={() => onUpdateStatus(task._id, 'To-Do')}
                            className="px-2 py-1 text-xs bg-gray-600 hover:bg-gray-500 rounded text-white transition-colors"
                          >
                            ← To Do
                          </button>
                        )}
                        {column.id !== 'Doing' && (
                          <button
                            onClick={() => onUpdateStatus(task._id, 'Doing')}
                            className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-500 rounded text-white transition-colors"
                          >
                            {column.id === 'To-Do' ? 'Start →' : '← In Progress'}
                          </button>
                        )}
                        {column.id !== 'Done' && (
                          <button
                            onClick={() => onUpdateStatus(task._id, 'Done')}
                            className="px-2 py-1 text-xs bg-green-600 hover:bg-green-500 rounded text-white transition-colors"
                          >
                            {column.id === 'To-Do' ? 'Skip to Done →' : 'Complete →'}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TaskBoard
