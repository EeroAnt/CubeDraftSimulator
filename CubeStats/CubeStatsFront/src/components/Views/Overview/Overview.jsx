import { Chart } from '../../Charts'

export const Overview = ({ data }) => {
  const singleColorAverages = data?.aggragates?.color_id_averages?.filter(
    (color) => color[0].length === 1,
  );
  const twoColorAverages = data?.aggragates?.color_id_averages?.filter(
    (color) => color[0].length === 2,
  );
  const threeColorAverages = data?.aggragates?.color_id_averages?.filter(
    (color) => color[0].length === 3,
  );
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-blue-600 mt-6">Overview</h1>
      {data && (
        <>
          <div className="w-full max-w-4xl p-6 bg-white shadow-md rounded-lg mt-6">
            <h2 className="text-2xl font-semibold mb-4">Single Color Average Picks</h2>
            <Chart data={singleColorAverages} />
          </div>

          <div className="w-full max-w-4xl p-6 bg-white shadow-md rounded-lg mt-6">
            <h2 className="text-2xl font-semibold mb-4">Two Color Average Picks</h2>
            <Chart data={twoColorAverages} />
          </div>

          <div className="w-full max-w-4xl p-6 bg-white shadow-md rounded-lg mt-6">
            <h2 className="text-2xl font-semibold mb-4">Three Color Average Picks</h2>
            <Chart data={threeColorAverages} />
          </div>
        </>
      )}
    </div>
  );
};
