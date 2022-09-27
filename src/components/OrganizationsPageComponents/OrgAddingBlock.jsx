import React, { forwardRef, useEffect, useRef, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ru } from "date-fns/esm/locale";
import { format } from "date-fns";
import MyUnderlinedBlock from "../MyUnderlinedBlock/MyUnderlinedBlock";
import { MyInputForDatePicker } from "../MyInputForDatePicker/MyInputForDatePicker";

const OrgAddingBlock = ({
  number,
  blocksData,
  chosenCurrencyID,
  text,
  setExternalData,
}) => {
  const { format } = require("date-fns");
  const [date, setDate] = useState(null);
  const [prevFormattedDate, setPrevFormattedDate] = useState();
  const [formattedDate, setFormattedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const balanceRef = useRef();
  const [balanceForUseEffect, setBalanceForUseEffect] = useState();
  const [currency, setCurrency] = useState(0);
  const [sum, setSum] = useState(0);
  const [error, setError] = useState("");
  const numberFormatter = Intl.NumberFormat("en-US");

  const getRate = () => {
    if (prevFormattedDate === formattedDate) {
      setCurrency(currency);
      setSum(currency * balanceRef.current.value);
      blocksData[number - 1] = {
        balance: Number.parseFloat(balanceRef.current.value).toFixed(2),
        date: formattedDate,
        currency: Number.parseFloat(currency).toFixed(2),
        amount: Number.parseFloat(currency * balanceRef.current.value).toFixed(
          2
        ),
      };
      setExternalData();
    } else {
      axios
        .get(
          `${process.env.REACT_APP_API_LINK}/get_valuta_by_date/${chosenCurrencyID}/${formattedDate}/`
        )
        .then((res) => {
          setCurrency(res.data.rate);
          setSum(res.data.rate * balanceRef.current.value);
          blocksData[number - 1] = {
            balance: Number.parseFloat(balanceRef.current.value).toFixed(2),
            date: formattedDate,
            currency: Number.parseFloat(res.data.rate).toFixed(2),
            amount: Number.parseFloat(
              res.data.rate * balanceRef.current.value
            ).toFixed(2),
          };
          setExternalData();
          setPrevFormattedDate(formattedDate);
        })
        .catch((error) => {
          setError(error.response.data.error_message);
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
      setError("");
    }
  };
  useEffect(() => {
    getDataAndCount();
  }, [formattedDate, balanceForUseEffect]);

  return (
    <div className="row">
      <div className="col-4 col-md-5 mb3 d-grid gap-1">
        <span>
          {number}. {text}
        </span>
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
      <div className="col-7 ">
        <MyUnderlinedBlock text="Сумма в сомах" value={sum} />
      </div>
      <p className="text-danger">{error}</p>
    </div>
  );
};

export default OrgAddingBlock;
