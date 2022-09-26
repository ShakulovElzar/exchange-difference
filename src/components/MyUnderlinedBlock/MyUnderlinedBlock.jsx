import React from "react";

const MyUnderlinedBlock = ({ text, value }) => {
  const numberFormatter = Intl.NumberFormat("en-US");

  return (
    <div style={{ fontSize: 18 }}>
      <span className="fw-bold">{text}:</span>
      <div className="d-inline-block border-bottom border-dark p-1 col-3 fw-bold">
        {!isNaN(value) &&
          value !== "" &&
          numberFormatter.format(Number.parseFloat(value).toFixed(2))}
      </div>
    </div>
  );
};

export default MyUnderlinedBlock;
