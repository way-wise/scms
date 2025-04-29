interface StatProps {
  value: string
  label: string
  description?: string
}

interface StatsSectionProps {
  stats: StatProps[] | undefined
}

export default function StatsSection({ stats = [] }: StatsSectionProps) {
  if (!Array.isArray(stats) || stats.length === 0) {
    return null
  }

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-3xl md:text-4xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
            {stat.description && <div className="text-sm text-gray-700 mt-1">{stat.description}</div>}
          </div>
        ))}
      </div>
    </section>
  )
}
