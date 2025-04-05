import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
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

export const PieCharts = ({ data, header }) => {
  const chartData = data.map(([name, value]) => ({
    name: name,
    value: value,
  }));
  return (
    <ResponsiveContainer width="100%" height={300}>
      <h4 className="text-2xl font-semibold mb-4">{header}</h4>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
        />
        <Tooltip
          formatter={(value, name, props) => [value, props.payload.name]}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};
