import React, { forwardRef, useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ru } from "date-fns/esm/locale";
import { format } from "date-fns";
import { MyInputForDatePicker } from "../MyInputForDatePicker/MyInputForDatePicker";
import MyUnderlinedBlock from "../MyUnderlinedBlock/MyUnderlinedBlock";

const MoneyLeft = ({ b4, sumM, text, blockData, chosenCurrencyID }) => {
  const { format } = require("date-fns");
  const [date, setDate] = useState(null);
  const [formattedDate, setFormattedDate] = useState("");
  const [previousFormattedDate, setPreviousFormattedDate] = useState("");
  const [price, setPrice] = useState("0");
  const [sumInSoms, setSumInSoms] = useState(0);
  const numberFormatter = Intl.NumberFormat("en-US");

  useEffect(() => {
    if (previousFormattedDate === formattedDate) {
      setPrice(price);
      setSumInSoms(price * sumM);
      blockData({
        date: formattedDate,
        price: price,
        sum_in_soms: price * sumM,
        exchangeDifference: sumInSoms - sumM,
      });
    } else {
      axios
        .get(
          `http://10.100.4.104:8001/api/v1/get_valuta_by_date/${chosenCurrencyID}/${formattedDate}/`
        )
        .then((res) => {
          setPrice(res.data.rate);
          setSumInSoms(res.data.rate * sumM);
          blockData({
            date: formattedDate,
            price: res.data.rate,
            sum_in_soms: res.data.rate * sumM,
            exchangeDifference: sumInSoms - sumM,
          });
        });
    }
  }, [date, b4]);

  return (
    <div className="row">
      <h3>{text}</h3>
      <div className="col-3 col-md-4 mb-3 d-grid gap-1">
        <div className="col-12">
          <MyUnderlinedBlock text="Сумма в валюте" value={sumM} />
        </div>
      </div>
      <div className="col-6 col-md-4 mb-3 d-grid gap-1">
        <MyUnderlinedBlock text="Сумма в сомах (остатка в валюте)" value={b4} />
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
            setPreviousFormattedDate(formattedDate);
            setFormattedDate(format(date, "yyyy-MM-dd"));
          }}
        />
      </div>
      <div className="col-4 col-d-4 mb-3d-grid gap-1">
        <MyUnderlinedBlock text="Сумма в сомах" value={sumInSoms} />
      </div>
      <div className="col-6 col-md-4 mb-3 d-grid gap-1">
        <MyUnderlinedBlock text="Курс" value={price} />
      </div>
    </div>
  );
};

export default MoneyLeft;
