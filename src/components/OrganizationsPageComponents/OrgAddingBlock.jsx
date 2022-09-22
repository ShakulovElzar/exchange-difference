import React, { forwardRef, useEffect, useRef, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ru } from "date-fns/esm/locale";
import { format } from "date-fns";

const OrgAddingBlock = ({
  number,
  blocksData,
  chosenCurrencyID,
  text,
  setTrigger,
  trigger,
}) => {
  const { format } = require("date-fns");
  const [date, setDate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState(
    format(date, "yyyy-MM-dd")
  );
  const [balance, setBalance] = useState();
  const [currency, setCurrency] = useState(0);
  const [sum, setSum] = useState(0);
  const [error, setError] = useState("");

  const getRate = () => {
    axios
      .get(
        `http://10.100.4.104:8001/api/v1/get_valuta_by_date/${chosenCurrencyID}/${formattedDate}/`
      )
      .then((res) => {
        setCurrency(res.data.rate);
        setSum(res.data.rate * balance);
        blocksData[number - 1] = {
          payment_balance: Number.parseFloat(balance).toFixed(2),
          payment_date: formattedDate,
          payment_currency: Number.parseFloat(currency).toFixed(2),
          payment_amount: Number.parseFloat(res.data.rate * balance).toFixed(2),
        };
      })
      .catch((error) => {
        setError(error.response.data.error_message);
      });
  };
  const getDataAndCount = () => {
    if (balance === null) return;
    if (chosenCurrencyID === undefined) {
      setCurrency("");
      setSum("");
    } else {
      getRate();
      setError("");
    }
  };
  useEffect(() => {
    getDataAndCount();
    setTrigger(!trigger);
  }, [balance, formattedDate]);

  // ui
  const MyInputForDatePicker = forwardRef(({ value, onClick }, ref) => (
    <button
      className="form-control text-dark" // btn btn-outline-secondary
      onClick={onClick}
      ref={ref}
    >
      {value}
    </button>
  ));

  return (
    <div className="row">
      <div className="col-4 col-md-5 mb3 d-grid gap-1">
        <span>
          {number}. {text}
        </span>
        <input
          type="text"
          className="form-control mb-3"
          value={balance}
          onChange={(event) => {
            setBalance(event.target.value);
          }}
          placeholder="Числовое значение"
        />
      </div>
      <div className="col-4 col-md-3 mb-3 d-grid gap-1">
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
      <div className="col-5">
        <span>Курс:</span>
        <div className="d-inline-block border-bottom border-dark p-1 col-2">
          <span className={!isNaN(currency) ? "text-body" : "text-white"}>
            {currency}
          </span>
        </div>
      </div>
      <div className="col-7 ">
        <span>Сумма в сомах:</span>
        <div
          className={
            sum !== "NaN" || !isNaN(sum)
              ? "text-body d-inline-block"
              : "text-white d-inline-block"
          }
        >
          <div className="d-inline-block border-bottom border-dark p-1">
            {Number.parseFloat(sum).toFixed(2)}
          </div>
        </div>
      </div>
      <p className="text-danger">{error}</p>
    </div>
  );
};

export default OrgAddingBlock;
