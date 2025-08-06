import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface LineChartProps {
  selectedDataType: string;
  selectedYear: number;
  chartData: any[];
}

const dataKeyLabels: Record<string, string> = {
  total_users: "Total Users",
  total_artists: "Total Artists",
};

const LineChartGraph: React.FC<LineChartProps> = ({
  selectedDataType,
  chartData,
}) => {
  return (
    <ResponsiveContainer width="100%" height={335}>
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 22, left: -5, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip
          content={({ payload }) => {
            if (payload && payload.length) {
              return (
                <div className="tooltip">
                  {payload.map((entry) => {
                    const label =
                      dataKeyLabels[
                        entry.dataKey as keyof typeof dataKeyLabels
                      ] || entry.dataKey;
                    return (
                      <p key={entry.name} style={{ color: entry.color }}>
                        {label}: {entry.value}
                      </p>
                    );
                  })}
                </div>
              );
            }
            return null;
          }}
        />
        <Legend
          formatter={(value) =>
            dataKeyLabels[value as keyof typeof dataKeyLabels] || value
          }
        />
        <Line
          type="monotone"
          dataKey={selectedDataType}
          stroke={selectedDataType === "total_users" ? "#85986B" : "#CCA660"}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartGraph;
