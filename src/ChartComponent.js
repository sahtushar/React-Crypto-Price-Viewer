// ChartComponent.js

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import React, { useEffect, useState } from "react";

const ChartComponent = ({ data, preferences }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (data && preferences.length > 0) {
      const res = Object.keys(data).map((key) => {
        const entry = { date: key };
        preferences.forEach((pref) => {
          entry[pref] = data[key][pref];
        });
        return entry;
      });
      setChartData(res);
    }
  }, [data, preferences]);

  return (
    <div className="lineChart">
      <LineChart width={800} height={400} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        {preferences.map((pref) => (
          <Line
            key={pref}
            type="monotone"
            dataKey={pref}
            stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
          />
        ))}
      </LineChart>
    </div>
  );
};

export default ChartComponent;
