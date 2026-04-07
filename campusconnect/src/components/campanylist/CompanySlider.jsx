import React from "react";
import "./CompanySlider.css";
import appperfect from "../../assets/appperfect.png";
import secure from "../../assets/secure.png";
import intimetec from "../../assets/intimetec.png";
import v2solutions from "../../assets/v2solutions.png";
import adani from "../../assets/adani.png";
import adhvaya from "../../assets/adhvaya.png";
import jkcement from "../../assets/jkcement.png";

const companies = [
  {
    name: "Adani",
    logo: adani,
  },
  {
    name: "V2 Solutions",
    logo: v2solutions,
  },
  {
    name: "In Time Tec",
    logo: intimetec,
  },
  {
    name: "SECURE METERS",
    logo: secure,
  },
  {
    name: "AppPerfect",
    logo: appperfect,
  },
  {
    name: "Adhvaya",
    logo: adhvaya,
  },
  {
    name: "JK Cement",
    logo: jkcement,
  },
];

function CompanySlider() {
  return (
    <div className="slider-container">
      <div className="slider-track">
        {/* First Set */}
        {companies.map((company, index) => (
          <div className="company-card" key={index}>
            <img src={company.logo} alt={company.name} />
            <p>{company.name}</p>
          </div>
        ))}

        {/* Duplicate for smooth infinite scroll */}
        {companies.map((company, index) => (
          <div className="company-card" key={`duplicate-${index}`}>
            <img src={company.logo} alt={company.name} />
            <p>{company.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CompanySlider;