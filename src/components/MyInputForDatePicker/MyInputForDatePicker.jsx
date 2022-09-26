import React, { forwardRef } from "react";

export const MyInputForDatePicker = forwardRef(
  ({ onChange, placeholder, value, id, onClick }, ref) => (
    <input
      onChange={onChange}
      placeholder={placeholder}
      value={value}
      id={id}
      onClick={onClick}
      className="form-control text-dark text-center"
    />
  )
);
