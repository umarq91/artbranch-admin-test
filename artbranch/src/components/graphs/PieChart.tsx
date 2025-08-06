import { PureComponent } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface StateData {
  name: string;
  value: number;
}

interface PieChartGraphProps {
  data: StateData[];
}

const COLORS = [
  "#95A4FC",
  "#85986B",
  "#1C1C1C",
  "#CCA660",
  "#A8C5DA",
  "#346759",
  "#fcaf95",
  "#af95fc",
];

export default class PieChartGraph extends PureComponent<PieChartGraphProps> {
  onPieEnter = (data: StateData[], index: number) => {
    console.log(`Mouse entered ${data[index].name}`);
  };

  render() {
    const { data } = this.props;

    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart onMouseEnter={() => this.onPieEnter(data, -1)}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={14}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    );
  }
}
