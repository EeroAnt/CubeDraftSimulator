import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LabelList 
} from 'recharts';

const COLORS = {
  W: '#EFE7C4',
  U: '#3B82F6',
  B: '#565059',
  R: '#E0473E',
  G: '#2FA35E',
  C: '#B0A79A',
};

const getFill = (name) => (name.length === 1 ? COLORS[name] : `url(#grad-${name})`);
const getStroke = (name) => (name === 'W' ? '#D2C99B' : '#ffffff');

// Returns an ARRAY of <linearGradient> elements — NOT wrapped in a component.
// These get dropped straight into a real <defs> that's a direct chart child.
function buildGradients(names) {
  const multi = [...new Set(names)].filter((n) => n.length > 1);
  return multi.map((name) => {
    const letters = name.split('');
    const n = letters.length;
    return (
      <linearGradient id={`grad-${name}`} key={name} x1="0" y1="0" x2="1" y2="0">
        {letters.flatMap((l, i) => [
          <stop key={`${i}a`} offset={`${(i / n) * 100}%`} stopColor={COLORS[l]} />,
          <stop key={`${i}b`} offset={`${((i + 1) / n) * 100}%`} stopColor={COLORS[l]} />,
        ])}
      </linearGradient>
    );
  });
}

export function Chart({ data }) {
  const chartData = data.map(([name, value]) => ({ name, value }));
  const names = chartData.map((d) => d.name);
  const maxValue = Math.max(...chartData.map((item) => item.value));
  const minValue = Math.min(...chartData.map((item) => item.value));
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <defs>{buildGradients(names)}</defs>
        <XAxis dataKey="name" />
        <YAxis
          domain={[Math.floor(minValue - 1), Math.ceil(maxValue + 1)]}
          tickCount={7}
        />
        <Tooltip formatter={(value) => [Number(value).toFixed(2), 'Value']} />
        <Bar dataKey="value">
          {chartData.map((entry) => (
            <Cell key={entry.name} fill={getFill(entry.name)} stroke={getStroke(entry.name)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function buildGradientsV(names) {
  const multi = [...new Set(names)].filter((n) => n.length > 1);
  return multi.map((name) => {
    const letters = name.split('');
    const n = letters.length;
    return (
      <linearGradient id={`gradv-${name}`} key={name} x1="0" y1="0" x2="0" y2="1">
        {letters.flatMap((l, i) => [
          <stop key={`${i}a`} offset={`${(i / n) * 100}%`} stopColor={COLORS[l]} />,
          <stop key={`${i}b`} offset={`${((i + 1) / n) * 100}%`} stopColor={COLORS[l]} />,
        ])}
      </linearGradient>
    );
  });
}

const getFillV = (name) => (name.length === 1 ? COLORS[name] : `url(#gradv-${name})`);


export const DistributionChart = ({ data, header }) => {
  const total = data.reduce((sum, [, value]) => sum + value, 0);
  const chartData = data
    .map(([name, value]) => ({ name, pct: (value / total) * 100 }))
    .sort((a, b) => b.pct - a.pct);
  const names = chartData.map((d) => d.name);
  const chartHeight = Math.max(240, chartData.length * 40 + 30);

  return (
    <div>
      <h4 className="text-2xl font-semibold mb-4">{header}</h4>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 4, right: 44, bottom: 4, left: 8 }}
        >
          <defs>{buildGradientsV(names)}</defs>
          <XAxis type="number" domain={[0, (max) => Math.ceil(max * 1.1)]} hide />
          <YAxis
            type="category"
            dataKey="name"
            width={44}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: 'rgba(0,0,0,0.04)' }}
            formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Share']}
          />
          <Bar dataKey="pct" barSize={22} radius={[0, 4, 4, 0]}>
            {chartData.map((entry) => (
              <Cell
                key={entry.name}
                fill={getFillV(entry.name)}
                stroke="rgba(90,90,90,0.25)"
                strokeWidth={0.5}
              />
            ))}
            <LabelList
              dataKey="pct"
              position="right"
              formatter={(v) => `${Math.round(v)}%`}
              fill="#6b7280"
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};