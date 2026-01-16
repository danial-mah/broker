'use client';

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const data = Array.from({ length: 32 }, (_, index) => ({
  time: `${index}:00`,
  price: 180 + Math.sin(index / 2) * 12 + index * 0.9
}));

export function MarketChart() {
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="price" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#2DD4BF" stopOpacity={0.42} />
              <stop offset="95%" stopColor="#2DD4BF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="time" stroke="#64748b" />
          <YAxis stroke="#64748b" domain={['dataMin - 5', 'dataMax + 5']} />
          <Tooltip contentStyle={{ background: '#11151E', border: '1px solid #273142' }} />
          <Area type="monotone" dataKey="price" stroke="#2DD4BF" fill="url(#price)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
