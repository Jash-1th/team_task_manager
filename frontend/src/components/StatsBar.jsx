import { CheckSquare, Clock, AlertCircle } from 'lucide-react'

const StatsBar = ({ tasks }) => {
  const stats = {
    total: tasks.length,
    inProgress: tasks.filter(t => t.status === 'Doing').length,
    overdue: tasks.filter(t => t.status !== 'Done' && new Date(t.dueDate) < new Date()).length
  }

  const statCards = [
    {
      label: 'Total Tasks',
      value: stats.total,
      icon: CheckSquare,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10'
    },
    {
      label: 'In Progress',
      value: stats.inProgress,
      icon: Clock,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10'
    },
    {
      label: 'Overdue',
      value: stats.overdue,
      icon: AlertCircle,
      color: 'text-red-400',
      bgColor: 'bg-red-400/10'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {statCards.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.label}
            className={`p-4 rounded-xl bg-dark-800 border border-dark-700 ${
              stat.label === 'Overdue' ? 'ring-1 ring-red-500/50' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className={`text-2xl font-bold mt-1 ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <Icon className={stat.color} size={24} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default StatsBar
