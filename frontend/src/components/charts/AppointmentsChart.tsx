// src/components/charts/AppointmentsChart.tsx
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { AppointmentTrendPoint } from '../../api/types';

export function AppointmentsChart({ data }: { data: AppointmentTrendPoint[] }) {
  return (
    <div className="h-40 sm:h-52 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} width={30} />
          <Tooltip contentStyle={{ borderRadius: 8, borderColor: '#E2E8F0', fontSize: 12 }} labelFormatter={(d) => `Day ${d}`} />
          <Line type="monotone" dataKey="appointments" stroke="#2563EB" strokeWidth={2.5} dot={{ r: 3, fill: '#2563EB' }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}