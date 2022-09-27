import React, { forwardRef, useEffect, useRef, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ru } from "date-fns/esm/locale";
import { format } from "date-fns";
import { MyInputForDatePicker } from "../MyInputForDatePicker/MyInputForDatePicker";
import MyUnderlinedBlock from "../MyUnderlinedBlock/MyUnderlinedBlock";

const OrgFirstBlock = ({ blockData, chosenCurrencyID, text, reportYear }) => {
  const { format } = require("date-fns");
  const [date, setDate] = useState(new Date());

  const [prevFormattedDate, setPrevFormattedDate] = useState();
  const [formattedDate, setFormattedDate] = useState(
    format(date, "yyyy-MM-dd")
  );
  const [balanceForUseEffect, setBalanceForUseEffect] = useState();
  const balanceRef = useRef();
  const [currency, setCurrency] = useState("0");
  const [sum, setSum] = useState(null);
  const [error, setError] = useState("");
  const numberFormatter = Intl.NumberFormat("en-US");

  const getRate = () => {
    if (/[a-zA-Z]/.test(balanceRef.current.value)) {
      setError("Уберите буквы из поля");
      return;
    }
    if (prevFormattedDate === formattedDate) {
      setCurrency(currency);
      setSum(Number(currency) * Number(balanceRef.current.value));
      setError("");
      blockData({
        balance: Number.parseFloat(balanceRef.current.value).toFixed(2),
        date: formattedDate,
        currency: Number.parseFloat(currency).toFixed(2),
        sum: Number.parseFloat(currency * balanceRef.current.value).toFixed(2),
      });
    } else {
      axios
        .get(
          `${process.env.REACT_APP_API_LINK}/get_valuta_by_date/${chosenCurrencyID}/${formattedDate}/`
        )
        .then((res) => {
          setCurrency(res.data.rate);
          setSum(Number(res.data.rate) * Number(balanceRef.current.value));
          setError("");
          blockData({
            balance: Number.parseFloat(balanceRef.current.value).toFixed(2),
            date: formattedDate,
            currency: Number.parseFloat(res.data.rate).toFixed(2),
            sum: Number.parseFloat(
              res.data.rate * balanceRef.current.value
            ).toFixed(2),
          });
          setPrevFormattedDate(formattedDate);
        })
        .catch((error) => {
          setError(error.response.data.error_message);
          setSum("");
          setCurrency("");
        });
    }
  };
  const getDataAndCount = () => {
    if (balanceRef.current.value === null) return;
    if (chosenCurrencyID === undefined) {
      setCurrency("");
      setSum("");
    } else {
      getRate();
    }
  };

  useEffect(() => {
    getDataAndCount();
  }, [formattedDate, balanceForUseEffect]);

  useEffect(() => {
    if (text === "Остаток на начало года") {
      let d = new Date();
      if (isNaN(reportYear) || reportYear === "") return;
      d.setFullYear(JSON.parse(reportYear) - 1, 11, 31);
      setDate(d);
      getDataAndCount();
    }
  }, [reportYear]);

  return (
    <div className="row">
      <div className="col-4 col-md-5 mb3 d-grid gap-1">
        <span>{text}</span>
        <input
          type="text"
          className="form-control mb-3"
          ref={balanceRef}
          onChange={(event) => {
            setBalanceForUseEffect(event.target.value);
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
        <MyUnderlinedBlock text="Курс" value={currency} />
      </div>
      <div className="col-7 d">
        <MyUnderlinedBlock text="Сумма в сомах" value={sum} />
      </div>
      <p className="text-danger">{error}</p>
    </div>
  );
};

export default OrgFirstBlock;
