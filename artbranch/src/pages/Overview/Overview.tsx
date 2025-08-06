import React from "react";
import { FiTrendingUp } from "react-icons/fi";
// import LineChartGraph from "../../components/Graphs/LineGraph.tsx";
// import BarGraph from "../../components/Graphs/BarGraph.tsx";
import { useOverview } from "./useOverview";
import Spinner from "../../components/Spinner.tsx";
import LineChartGraph from "../../components/graphs/LineGraph.tsx";
import BarGraph from "../../components/graphs/BarGraph.tsx";
import PieChartGraph from "../../components/graphs/PieChart.tsx";
// import PieChartGraph from "../../components/Graphs/PieChart.tsx";


interface OverviewCardProps {
  title: string;
  count: string;
  percentage: string;
}

const OverviewCard: React.FC<OverviewCardProps> = ({
  title,
  count,
  percentage,
}) => (
  <div className="px-4 py-5 rounded-lg shadow-md flex justify-between items-center bg-light w-full">
    <div className="w-2/3">
      <div className="text-sm sm:text-md font-semibold truncate">{title}</div>
      <div className="text-base sm:text-lg font-bold truncate">{count}</div>
    </div>
    <div className="text-green-500 flex items-center text-xs sm:text-sm">
      <span>{percentage}</span>
      <FiTrendingUp className="ml-1" />
    </div>
  </div>
);

const Overview = () => {
  const {
    loading,
    portfoliosCount,
    profiles,
    artists,
    collaborations,
    year,
    setYear,
    selectedDataType,
    setSelectedDataType,
    filteredChartData,
    stateDistribution,
    monthlyStats,
    selectedPieChartCategory,
    setSelectedPieChartCategory,
  } = useOverview();

  const overviewData = [
    {
      title: "Users",
      count: profiles.length.toString(),
      percentage: monthlyStats.usersPercentage,
    },
    {
      title: "Portfolios",
      count: portfoliosCount.toString(),
      percentage: monthlyStats.portfoliosPercentage,
    },
    {
      title: "Artists",
      count: artists.length.toString(),
      percentage: monthlyStats.artistsPercentage,
    },
    {
      title: "Collaborators",
      count: collaborations.length.toString(),
      percentage: monthlyStats.collaboratorsPercentage,
    },
  ];

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mt-20 bg-light px-4 py-3 rounded-2xl shadow-md mx-4 font-poppins z-20">
        <div className="text-lg font-semibold">Overview</div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4 mx-4 font-poppins">
        {overviewData.map((data, index) => (
          <div key={index} className="flex flex-wrap">
            <OverviewCard {...data} />
          </div>
        ))}
      </div>

      <div
        style={{ height: 440 }}
        className="bg-light mb-4 rounded-xl font-poppins mx-4 mt-4"
      >
        <div className="flex items-center md:px-8 px-6 py-6 rounded-lg w-full sm:flex-wrap lg:flex-nowrap">
          <div className="mr-4">
            <select
              value={selectedDataType}
              onChange={(e) => setSelectedDataType(e.target.value)}
              className="border p-2 rounded-md outline-none text-sm bg-light cursor-pointer"
            >
              <option value="total_users">Total Audience</option>
              <option value="total_artists">Total Artists</option>
            </select>
          </div>
          <div className="md:mr-4 ml-16 md:ml-8">
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="border p-2 rounded-md outline-none text-sm bg-light cursor-pointer"
            >
              <option value={year}>{year}</option>
            </select>
          </div>
        </div>

        <LineChartGraph
          selectedDataType={selectedDataType}
          selectedYear={parseInt(year)}
          chartData={filteredChartData}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 mt-4 mx-4 mb-4 font-poppins">
        <div className="bg-light rounded-xl px-2 py-4">
          <p className="md:text-2xl text-[16px] font-bold px-4 py-4">
            Top Categories
          </p>
          <BarGraph />
        </div>
        <div>
          <div className="bg-light rounded-tl-xl rounded-tr-xl rounded-bl-none rounded-br-none md:py-10 py-6 px-4 text-2xl flex justify-between items-center">
            <p className="text-left md:text-2xl text-[16px] font-bold">
              Traffic by Location
            </p>
            <div className="ml-auto">
              <select
                className="p-2 text-sm rounded-md outline-none bg-light border cursor-pointer"
                value={selectedPieChartCategory}
                onChange={(e) =>
                  setSelectedPieChartCategory(e.target.value as "users" | "artists")
                }
              >
                <option className="cursor-pointer" value="users">
                  Total Users
                </option>
                <option className="cursor-pointer" value="artists">
                  Total Artists
                </option>
              </select>
            </div>
          </div>
          <div className="bg-light md:py-8 py-0 rounded-tl-none rounded-tr-none rounded-bl-xl rounded-br-xl flex flex-col md:flex-row pb-4">
            <div className="flex justify-center items-center md:w-1/2">
              <PieChartGraph data={stateDistribution} />
            </div>
            <div className="md:w-1/2 flex flex-col justify-center items-start px-8 space-y-6">
              {stateDistribution.map((state, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between w-full space-x-4"
                >
                  <span
                    className="w-2 h-2 rounded-full inline-block mr-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></span>
                  <span className="flex-grow font-semibold text-[12px]">
                    {state.name}
                  </span>
                  <span className="font-extrabold">{state.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Overview;
