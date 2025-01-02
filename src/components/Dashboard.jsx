import { useDataFetch } from '../hooks/useDataFetch';
import ThreeScene from './ThreeScene';

function Dashboard({ dataSource, visualizationType, timeRange }) {
  const { data, loading, error } = useDataFetch(dataSource, timeRange);

  if (loading) {
    return (
      <div className="h-[600px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[600px] flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="relative h-[600px]">
      <ThreeScene data={data} type={visualizationType} />
      <div className="absolute bottom-4 left-4 bg-gray-900 bg-opacity-75 p-4 rounded-lg">
        <h3 className="font-semibold">{dataSource.toUpperCase()} Data</h3>
        <p className="text-sm text-gray-400">
          Showing {data.length} data points over {timeRange}
        </p>
      </div>
    </div>
  );
}

export default Dashboard; 