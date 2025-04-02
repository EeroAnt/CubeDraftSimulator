import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export function Chart({ data }) {
  const chartData = Object.entries(data).map(([key, value]) => ({
    name: key, // 'R', 'G', 'B', etc.
    value: value, // 6, 7, 8, etc.
  }));
  const maxValue = Math.max(...chartData.map(item => item.value));
  const minValue = Math.min(...chartData.map(item => item.value));
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <XAxis dataKey="name" />
        <YAxis domain={[minValue - 1, maxValue + 1]} />
        <Tooltip />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}