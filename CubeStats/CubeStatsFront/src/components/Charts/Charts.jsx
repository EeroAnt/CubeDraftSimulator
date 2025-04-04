import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export function Chart({ data }) {
  const chartData = data.map(([name, value]) => ({
    name: name,
    value: value,
  }));
  const maxValue = Math.max(...chartData.map(item => item.value));
  const minValue = Math.min(...chartData.map(item => item.value));
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <XAxis dataKey="name" />
        <YAxis
          domain={[Math.floor(minValue - 1), Math.ceil(maxValue + 1)]}
          tickCount={7}
        />
        <Tooltip formatter={(value) => [Number(value).toFixed(2), "Value"]} />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}
