import React, { forwardRef, useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ru } from "date-fns/esm/locale";
import { format } from "date-fns";

const MoneyLeft = ({
  b4,
  sumInSomsLeft,
  sumM,
  text,
  blockData,
  chosenCurrencyID,
}) => {
  const { format } = require("date-fns");
  const [date, setDate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState("");
  const [price, setPrice] = useState("0");

  useEffect(() => {
    axios
      .get(
        `http://10.100.4.104:8001/api/v1/get_valuta_by_date/${chosenCurrencyID}/${formattedDate}/`
      )
      .then((res) => {
        setPrice(res.data.rate);
        blockData({ date: formattedDate, price: res.data.rate });
      });
  }, [date]);

  // ui
  const MyInputForDatePicker = forwardRef(({ value, onClick }, ref) => (
    <button className="form-control text-dark" onClick={onClick} ref={ref}>
      {value}
    </button>
  ));

  return (
    <div className="row">
      <h3>{text}</h3>
      <div className="col-3 col-md-4 mb-3 d-grid gap-1">
        <div className="col-12">
          <span>Сумма в валюте:</span>
          <div className="d-inline-block border-bottom border-dark p-1">
            {Number.parseFloat(sumM).toFixed(2)}
          </div>
        </div>
      </div>
      <div className="col-6 col-md-4 mb-3 d-grid gap-1">
        <span>
          Сумма в сомах (остатка <br /> в валюте):
          <span className="text-body d-inline-block d-inline d-inline-block border-bottom border-dark p-1 col-4">
            {Number.parseFloat(b4).toFixed(2)}
          </span>
        </span>
      </div>
      <div className="col-auto col-md-3 mb-3 d-grid gap-1">
        <span>Дата</span>
        <DatePicker
          selected={date}
          closeOnScroll={true}
          dateFormat="dd-MM-yyyy"
          customInput={<MyInputForDatePicker />}
          maxDate={new Date()}
          locale={ru}
          onChange={(date) => {
            setDate(date);
            setFormattedDate(format(date, "yyyy-MM-dd"));
          }}
        />
      </div>
      <div className="col-3 col-md-4 mb-3 d-grid gap-1">
        <span>
          Сумма в сомах:
          <div className="d-inline-block border-bottom border-dark p-1 col-2">
            <span className="text-body">
              {Number.parseFloat(sumInSomsLeft).toFixed(2)}
            </span>
          </div>
        </span>
      </div>
      <div className="col-6 col-md-4 mb-3 d-grid gap-1">
        <span>
          Курс:
          <span className="text-body d-inline-block d-inline d-inline-block border-bottom border-dark p-1 col-4">
            {Number.parseFloat(price).toFixed(2)}
          </span>
        </span>
      </div>
    </div>
  );
};

export default MoneyLeft;
