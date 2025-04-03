import { Chart } from '../../Charts'

export const DraftPool = ({ data, draftPoolsState }) => {

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-blue-600 mt-6">
        {draftPoolsState}
      </h1>
      {data && (
        <>
          <div className="w-full max-w-4xl p-6 bg-white shadow-md rounded-lg mt-6">
            <h2 className="text-2xl font-semibold mb-4">Draft pool test</h2>
            <Chart data={data.single_color_avg_picks} />
          </div>

          <div className="w-full max-w-4xl p-6 bg-white shadow-md rounded-lg mt-6">
            <h2 className="text-2xl font-semibold mb-4">Two Color Average Picks</h2>
            <Chart data={data.single_color_avg_picks} />
          </div>

          <div className="w-full max-w-4xl p-6 bg-white shadow-md rounded-lg mt-6">
            <h2 className="text-2xl font-semibold mb-4">Three Color Average Picks</h2>
            <Chart data={data.single_color_avg_picks} />
          </div>
        </>
      )}
    </div>
  );
};
