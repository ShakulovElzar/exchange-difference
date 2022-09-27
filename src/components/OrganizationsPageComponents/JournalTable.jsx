import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import { ru } from "date-fns/esm/locale";
import { MyInputForDatePicker } from "../MyInputForDatePicker/MyInputForDatePicker";

const LinkButton = ({ item }) => {
  return (
    <Link className="btn btn-secondary btn-sm" to={`/organizations/${item.id}`}>
      Подробнее
    </Link>
  );
};

const JournalTable = () => {
  const numberFormatter = Intl.NumberFormat("en-US");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  // filter states
  const [organizationsData, setOrganizationsData] = useState([]);
  const [organizationTypesData, setOrganizationTypesData] = useState([]);
  const [currenciesData, setCurrenciesData] = useState([]);
  const [chosenOrganization, setChosenOrganization] = useState("");
  const [chosenOrganizationType, setChosenOrganizationType] = useState("");
  const [chosenCurrency, setChosenCurrency] = useState("");
  const { format } = require("date-fns");
  // date from
  const [dateFirst, setDateFirst] = useState(null);
  const [formattedDateFirst, setFormattedDateFirst] = useState("");
  // date until
  const [dateSecond, setDateSecond] = useState(null);
  const [formattedDateSecond, setFormattedDateSecond] = useState("");
  // date for sum counter
  const [dateCounter, setDateCounter] = useState(null);
  const [formattedDateCounter, setFormattedDateCounter] = useState("");
  const [allFiltersCleared, setAllFiltersCleared] = useState(false);
  // counter states
  const [sumCounterType, setSumCounterType] = useState("default");
  const [sumCounterAmount, setSumCounterAmount] = useState("");
  const [sumCounterAmountTimesRate, setSumCounterAmountTimesRate] =
    useState("");
  const [counterError, setCounterError] = useState("");

  const columns = [
    {
      id: 1,
      name: "Организация",
      selector: (row) => row.organization,
      sortable: true,
      reorder: true,
    },
    {
      id: 2,
      name: "Валюта организации",
      selector: (row) => row.organization_valuta,
      sortable: true,
      reorder: true,
    },
    {
      id: 3,
      name: "Отчетный год",
      selector: (row) => row.reporting_year,
      sortable: true,
      reorder: true,
    },
    {
      id: 4,
      name: "Детали",
      selector: (row) => <LinkButton item={row} />,
      // style: {
      //   minWidth: 150,
      // },
    },
  ];

  const addFiltersToLink = (requestLink) => {
    if (chosenOrganization !== "") {
      requestLink += `organization=${chosenOrganization}&`;
    }
    if (chosenOrganizationType !== "") {
      requestLink += `organization_type=${chosenOrganizationType}&`;
    }
    if (chosenCurrency !== "") {
      requestLink += `valuta=${chosenCurrency}&`;
    }
    if (formattedDateFirst !== "") {
      requestLink += `start_date=${formattedDateFirst}&`;
    }
    if (formattedDateSecond !== "") {
      requestLink += `end_date=${formattedDateSecond}&`;
    }
    return requestLink;
  };

  const fetchFilterData = () => {
    axios.get(`${process.env.REACT_APP_API_LINK}/organization/`).then((res) => {
      setOrganizationsData(res.data);
    });
    axios
      .get(`${process.env.REACT_APP_API_LINK}/organization_type/`)
      .then((res) => {
        setOrganizationTypesData(res.data);
      });
    axios.get(`${process.env.REACT_APP_API_LINK}/valuta/`).then((res) => {
      setCurrenciesData(res.data);
    });
  };

  const fetchUsers = async (page) => {
    setLoading(true);
    let requestLink = `${process.env.REACT_APP_API_LINK}/organization_exchange_difference/?`;
    requestLink = addFiltersToLink(requestLink);

    const response = await axios.get(
      requestLink + `page=${page}&per_page=${perPage}`
    );

    setData(response.data.items);
    setTotalRows(response.data.total);
    setLoading(false);
  };

  const handlePageChange = (page) => {
    fetchUsers(page);
  };

  const handleFilterClear = () => {
    setChosenOrganization("");
    setChosenOrganizationType("");
    setChosenCurrency("");
    setDateFirst(null);
    setDateSecond(null);
    setFormattedDateFirst("");
    setFormattedDateSecond("");
    setAllFiltersCleared(!allFiltersCleared);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoading(true);

    const response = await axios.get(
      `${process.env.REACT_APP_API_LINK}/organization_exchange_difference/?page=${page}&per_page=${newPerPage}`
    );

    setData(response.data.items);
    setPerPage(newPerPage);
    setLoading(false);
  };

  const handleSumCounter = () => {
    if (sumCounterType === "default") {
      setCounterError("Выберите тип рассчета");
      return;
    }
    const loaderIcon = document.getElementsByClassName(
      "spinner-border spinner-border-sm d-none"
    )[0];
    loaderIcon.classList.remove("d-none");
    setCounterError("");
    setSumCounterAmount("");

    let requestLink = `${process.env.REACT_APP_API_LINK}/organization_exchange_difference/?`;
    requestLink = addFiltersToLink(requestLink);

    axios
      .get(requestLink + `page=1&per_page=1000000`)
      .then((response) => {
        let sum = 0;
        if (sumCounterType === "soms") {
          for (let i = 0; i < response.data.total; i++) {
            sum += Number(response.data.items[i].sum_in_soms_residue);
          }
        }
        if (sumCounterType === "currency") {
          for (let i = 0; i < response.data.total; i++) {
            sum += Number(response.data.items[i].sum_amount);
          }
        }
        if (dateCounter !== null) {
          axios
            .get(`${process.env.REACT_APP_API_LINK}/valuta/${chosenCurrency}/`)
            .then((res) => {
              axios
                .get(
                  `${process.env.REACT_APP_API_LINK}/get_valuta_by_date/${res.data.code}/${formattedDateCounter}/`
                )
                .then((response) => {
                  setSumCounterAmountTimesRate(
                    Number(response.data.rate) * sum
                  );
                })
                .catch((error) => console.log(error));
            })
            .catch((error) => console.log(error));
        }
        setSumCounterAmount(sum);
        loaderIcon.classList.add("d-none");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchFilterData();
  }, []);

  useEffect(() => {
    fetchUsers(1);
  }, [allFiltersCleared]);

  const customStyles = {
    // rows: {
    //   style: {
    //     minHeight: '72px', // override the row height
    //   },
    // },
    headCells: {
      style: {
        fontSize: 16,
        fontWeight: "bold",
        backgroundColor: "#f8f9fb",
      },
    },
    cells: {
      style: {
        fontSize: 16,
      },
    },
  };
  return (
    <div>
      <div
        className="row mb-3 gap-4"
        style={{ marginLeft: 15, marginRight: 5 }}
      >
        <div className="card card-body row flex-row flex-wrap col-8">
          <h4 className="col-12">Фильтры</h4>
          <div className="col-4">
            <select
              className="form-select"
              onChange={(event) => setChosenOrganization(event.target.value)}
              value={chosenOrganization}
            >
              <option defaultValue value="">
                Организации...
              </option>
              {organizationsData.map((item, index) => (
                <option key={index} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-4">
            <select
              className="form-select"
              onChange={(event) =>
                setChosenOrganizationType(event.target.value)
              }
              value={chosenOrganizationType}
            >
              <option defaultValue value="">
                Типы организаций...
              </option>
              {organizationTypesData.map((item, index) => (
                <option key={index} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-4">
            <select
              className="form-select"
              onChange={(event) => setChosenCurrency(event.target.value)}
              value={chosenCurrency}
            >
              <option defaultValue value="">
                Валюты...
              </option>
              {currenciesData.map((item, index) => (
                <option key={index} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-3 mb-3 row col-11 align-items-center">
            <div className="col-2" style={{ fontSize: 18 }}>
              Дата с
            </div>
            <div className="col-3">
              <DatePicker
                selected={dateFirst}
                closeOnScroll={true}
                dateFormat="dd-MM-yyyy"
                customInput={<MyInputForDatePicker />}
                maxDate={new Date()}
                locale={ru}
                onChange={(date) => {
                  setDateFirst(date);
                  setFormattedDateFirst(format(date, "yyyy-MM-dd"));
                }}
              />
            </div>
            <div className="col-1" style={{ fontSize: 18 }}>
              по
            </div>
            <div className="col-3">
              <DatePicker
                selected={dateSecond}
                closeOnScroll={true}
                dateFormat="dd-MM-yyyy"
                customInput={<MyInputForDatePicker />}
                maxDate={new Date()}
                locale={ru}
                onChange={(date) => {
                  setDateSecond(date);
                  setFormattedDateSecond(format(date, "yyyy-MM-dd"));
                }}
              />
            </div>
          </div>
          <div className="col-12 d-flex justify-content-end gap-2 mt-3">
            <div className="col-7 d-flex gap-2 me-1">
              <button
                className="btn btn-primary col-6"
                onClick={() => fetchUsers(1)}
              >
                Применить фильтр
              </button>
              <button
                className="btn btn-primary col-6"
                onClick={handleFilterClear}
              >
                Очистить фильтр
              </button>
            </div>
          </div>
        </div>
        <div className="card card-body col-4">
          <div className="d-flex flex-row gap-2">
            <div>Высчитать сумму в:</div>
            <div>
              <select
                className="form-select"
                onChange={(event) => setSumCounterType(event.target.value)}
                value={sumCounterType}
              >
                <option defaultValue value="default">
                  Выбрать...
                </option>
                <option value="soms">В сомах</option>
                <option value="currency">В валюте</option>
              </select>
            </div>
          </div>
          <div className="mt-3">
            <span className="fw-bold">Сумма:</span>{" "}
            {numberFormatter.format(sumCounterAmount)}
          </div>
          <div className="d-flex justify-content-sm-between gap-2 align-items-md-center mt-2">
            <div className="text-danger" style={{ fontSize: 15 }}>
              {counterError.length !== 0 && counterError}
            </div>
            <button
              className="btn btn-primary text-start"
              onClick={handleSumCounter}
            >
              Рассчитать
              <span
                className="spinner-border spinner-border-sm ms-3 d-none"
                role="status"
                aria-hidden="true"
              ></span>
            </button>
          </div>
          <div className="col-6">
            <DatePicker
              selected={dateCounter}
              closeOnScroll={true}
              dateFormat="dd-MM-yyyy"
              customInput={<MyInputForDatePicker />}
              maxDate={new Date()}
              locale={ru}
              onChange={(date) => {
                setDateCounter(date);
                setFormattedDateCounter(format(date, "yyyy-MM-dd"));
              }}
            />
          </div>
          <div className="mt-3">
            <span className="fw-bold">Сумма по дате:</span>{" "}
            {numberFormatter.format(sumCounterAmountTimesRate)}
          </div>
        </div>
      </div>
      <DataTable
        noDataComponent="Нет данных по данным настройкам"
        columns={columns}
        data={data}
        progressPending={loading}
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        customStyles={customStyles}
      />
    </div>
  );
};

export default JournalTable;
