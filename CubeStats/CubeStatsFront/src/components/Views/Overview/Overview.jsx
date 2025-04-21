import { Chart, PieCharts } from '../../'

export const Overview = ({ data }) => {
  const singleColorAverages = data?.aggregates?.color_id_averages?.filter(
    (color) => color[0].length === 1,
  );
  const twoColorAverages = data?.aggregates?.color_id_averages?.filter(
    (color) => color[0].length === 2,
  );
  const threeColorAverages = data?.aggregates?.color_id_averages?.filter(
    (color) => color[0].length === 3,
  );
  const twoColorDistributions =
    data?.aggregates?.color_distribution_of_multi?.filter(
      (color) => color[0].length === 2,
    );
  const threeColorDistributions =
    data?.aggregates?.color_distribution_of_multi?.filter(
      (color) => color[0].length === 3,
    );
  const commanderTwoColorDistributions =
    data?.aggregates?.color_distribution_of_commanders?.filter(
      (color) => color[0].length === 2,
    );
  const commanderThreeColorDistributions =
    data?.aggregates?.color_distribution_of_commanders?.filter(
      (color) => color[0].length === 3,
    );
  return (
    <>
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

          <div className="w-full max-w-4xl p-6 bg-white shadow-md rounded-lg mt-6">
            <h2 className="text-2xl font-semibold mb-4">Color Distributions of MultiColors</h2>
            <div className="flex flex-row gap-4"> {/* Added flex container */}
              <div className="flex-1"> {/* Each chart gets equal space */}
                <PieCharts data={twoColorDistributions} header={"Two Color"} />
              </div>
              <div className="flex-1">
                <PieCharts
                  data={threeColorDistributions}
                  header={"Three Color"}
                />
              </div>
            </div>
          </div>
          <div className="w-full max-w-4xl p-6 bg-white shadow-md rounded-lg mt-6">
            <h2 className="text-2xl font-semibold mb-4">Color Distributions of Commanders</h2>
            <div className="flex flex-row gap-4"> {/* Added flex container */}
              <div className="flex-1"> {/* Each chart gets equal space */}
                <PieCharts
                  data={commanderTwoColorDistributions}
                  header={"Two Color"}
                />
              </div>
              <div className="flex-1">
                <PieCharts
                  data={commanderThreeColorDistributions}
                  header={"Three Color"}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
