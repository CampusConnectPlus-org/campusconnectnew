 import React from "react";
import "./StatsCard.css";

const StatsCard = ({ title, value, color }) => {
  console.log("Rendering StatsCard with title:", title, "value:", value, "color:", color);

  return (
    <div className={`card ${color}`}>
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
};

export default StatsCard;