import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { supabase } from "../../utils/services/supabase";

const categories = [
  { name: "Photography", color: "#95A4FC" },
  { name: "Painting", color: "#85986B" },
  { name: "Sculpture", color: "#1C1C1C" },
  { name: "Digital Art", color: "#CCA660" },
  { name: "Mixed Media", color: "#A8C5DA" },
  { name: "Illustration", color: "#346759" },
  { name: "Printmaking", color: "#FFCB6B" },
  { name: "Others", color: "#888888" },
];

const RoundedBar = (props: {
  fill?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}) => {
  const { fill, x, y, width, height } = props;
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={fill}
      rx={10}
      ry={10}
    />
  );
};

const BarGraph: React.FC = () => {
  const [topCategoriesData, setTopCategoriesData] = useState<
    { name: string; uv: number }[]
  >([]);
  const [otherCategoriesList, setOtherCategoriesList] = useState<string[]>([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const calculateTopCategories = async () => {
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("categories, role")
      .eq("role", "Artist");

    if (error) {
      console.error("Error fetching profiles:", error);
      return;
    }

    const categoryCount: Record<string, number> = {};

    profiles.forEach((profile) => {
      if (profile.categories) {
        const uniqueCategories = new Set<string>(profile.categories);
        uniqueCategories.forEach((category) => {
          categoryCount[category] = (categoryCount[category] || 0) + 1;
        });
      }
    });

    const sortedCategories = Object.entries(categoryCount)
      .map(([name, count]) => ({ name, uv: count }))
      .sort((a, b) => b.uv - a.uv);

    const topCategories = sortedCategories.slice(0, 5);
    const otherCategories = sortedCategories.slice(5);
    const otherCount = otherCategories.reduce(
      (sum, category) => sum + category.uv,
      0,
    );

    if (otherCount > 0) {
      topCategories.push({ name: "Others", uv: otherCount });
      setOtherCategoriesList(otherCategories.map((cat) => cat.name));
    } else {
      setOtherCategoriesList([]);
    }

    setTopCategoriesData(topCategories);
  };

  useEffect(() => {
    calculateTopCategories();

    const updateWindowWidth = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", updateWindowWidth);
    return () => window.removeEventListener("resize", updateWindowWidth);
  }, []);

  const xAxisFontSize = windowWidth < 768 ? 5 : 8;
  const yAxisFontSize = windowWidth < 768 ? 8 : 12;

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: any;
  }) => {
    if (active && payload && payload.length) {
      const categoryName = payload[0].payload.name;

      return (
        <div
          style={{
            backgroundColor: "white",
            border: "1px solid #ccc",
            padding: "5px",
            fontSize: "10px",
          }}
        >
          <strong>{categoryName}:</strong>
          {categoryName === "Others" ? (
            <ul style={{ padding: 0, margin: 0, listStyleType: "none" }}>
              {otherCategoriesList.map((category, index) => (
                <li key={index} style={{ margin: "2px 0" }}>
                  {category}
                </li>
              ))}
            </ul>
          ) : (
            <div>{payload[0].value} artists</div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={470}>
      <BarChart
        data={topCategoriesData}
        margin={{
          top: 40,
          right: -6,
          left: -20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fontSize: xAxisFontSize }} />
        <YAxis tick={{ fontSize: yAxisFontSize }} />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="uv"
          shape={<RoundedBar />}
          label={{ position: "top", fontSize: 12 }}
        >
          {topCategoriesData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                categories.find((cat) => cat.name === entry.name)?.color ||
                "#888888"
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarGraph;
