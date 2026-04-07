import "./ActivityChart.css";

const ActivityChart = () => {
  return (
    <div className="chart">
      <h3>Activity Overview</h3>
      <div className="bars">
        <div className="bar blue" style={{ height: "80px" }}></div>
        <div className="bar green" style={{ height: "60px" }}></div>
        <div className="bar orange" style={{ height: "90px" }}></div>
      </div>
    </div>
  );
};

export default ActivityChart;