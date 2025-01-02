function DataSourceSelector({ dataSource, setDataSource }) {
  const sources = [
    { id: 'crypto', name: 'Cryptocurrency' },
    { id: 'stocks', name: 'Stock Market' },
    { id: 'weather', name: 'Weather Data' }
  ]

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Data Source</h2>
      <div className="space-y-2">
        {sources.map((source) => (
          <button
            key={source.id}
            onClick={() => setDataSource(source.id)}
            className={`w-full px-4 py-2 rounded-lg transition-colors ${
              dataSource === source.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
            }`}
          >
            {source.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default DataSourceSelector 