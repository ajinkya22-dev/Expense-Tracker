import React, { PureComponent } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const data = [
    { name: 'Sun', Income: 4000, Expense: 2400, Entertainment: 2400 },
    { name: 'Mon', Income: 3000, Expense: 1398, Entertainment: 2210 },
    { name: 'Tue', Income: 2000, Expense: 9800, Entertainment: 2290 },
    { name: 'Wed', Income: 2780, Expense: 3908, Entertainment: 2000 },
    { name: 'Thr', Income: 1890, Expense: 4800, Entertainment: 2181 },
    { name: 'Fri', Income: 2390, Expense: 3800, Entertainment: 2500 },
    { name: 'Sat', Income: 3490, Expense: 4300, Entertainment: 2100 },
];

export default class Example extends PureComponent {
    render() {
        return (
            <div className="w-full h-[300px] sm:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Expense" stackId="a" fill="#8884d8" />
                        <Bar dataKey="Entertainment" stackId="a" fill="#82ca9d" />
                        <Bar dataKey="Income" fill="#ffc658" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        );
    }
}
