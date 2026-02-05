import React, { PureComponent } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Shopping', value: 400 },
    { name: 'Food', value: 300 },
    { name: 'Travel', value: 300 },
];

const COLORS = ['#0088FE', '#00C49F', '#d1f73f', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

export default class Example extends PureComponent {
    render() {
        return (
            <div className="w-full max-w-xl mx-auto text-center">
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%" // Centered
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius="80%" // Responsive radius
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                {/* Custom Legend */}
                <div className="flex justify-center flex-wrap mt-4 gap-4 text-sm">
                    {data.map((entry, index) => (
                        <div key={`legend-${index}`} className="flex items-center">
                            <div
                                className="w-3 h-3 rounded-sm mr-2"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            ></div>
                            <span>{entry.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}
