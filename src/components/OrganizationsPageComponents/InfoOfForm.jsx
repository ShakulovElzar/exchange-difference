import React from "react";

const InfoOfForm = ({ data }) => {
  return (
    <dl className="row" style={{ fontSize: 16 }}>
      <dt className="col-sm-4">Организация:</dt>
      <dd className="col-sm-8">{data.organization}</dd>
      <dt className="col-sm-4">Валюта:</dt>
      <dd className="col-sm-8">{data.organization_valuta}</dd>
      <dt className="col-sm-4">Отчетный год:</dt>
      <dd className="col-sm-8">{data.reporting_year}</dd>
      <dt className="col-sm-4">Предусмотренная сумма:</dt>
      <dd className="col-sm-8">{data.stipulated_amount}</dd>
      <hr className="mt-1" />
      <dt className="col-sm-4">Остаток на начало года:</dt>
      <dd className="col-sm-8">{data.opening_balance}</dd>
      <dt className="col-sm-4">Дата:</dt>
      <dd className="col-sm-8">{data.opening_date}</dd>
      <dt className="col-sm-4">Курс:</dt>
      <dd className="col-sm-8">{data.opening_currency}</dd>
      <dt className="col-sm-4">Сумма в сомах:</dt>
      <dd className="col-sm-8">{data.opening_amount}</dd>
      <hr className="mt-1" />
      <dt className="col-sm-3">Начисленные взносы:</dt>
      <dd className="col-sm-9">
        <dl className="row">
          <dt className="col-sm-2">Список:</dt>
          <dd className="col-sm-10">
            {data.assessed_contribution_payments.map((item, index) => (
              <dl className="row">
                <dt className="col-sm-4">{index + 1}. Начисленные взнос:</dt>
                <dd className="col-sm-8">{item.balance}</dd>
                <dt className="col-sm-4">Дата:</dt>
                <dd className="col-sm-8">{item.date}</dd>
                <dt className="col-sm-4">Курс:</dt>
                <dd className="col-sm-8">{item.currency}</dd>
                <dt className="col-sm-4">Сумма в сомах:</dt>
                <dd className="col-sm-8">{item.amount}</dd>
              </dl>
            ))}
            {data.restructuring_payments.length === 0 && (
              <dd className="col-sm-8">Данных нет</dd>
            )}
          </dd>
        </dl>
      </dd>
      <hr className="mt-1" />
      <dt className="col-sm-3">По графику реструкруризации</dt>
      <dd className="col-sm-9">
        <dl className="row">
          <dt className="col-sm-2">Список:</dt>
          <dd className="col-sm-10">
            {data.restructuring_payments.map((item, index) => (
              <dl className="row">
                <dt className="col-sm-4">{index + 1}. Оплата взноса:</dt>
                <dd className="col-sm-8">{item.balance}</dd>
                <dt className="col-sm-4">Дата:</dt>
                <dd className="col-sm-8">{item.date}</dd>
                <dt className="col-sm-4">Курс:</dt>
                <dd className="col-sm-8">{item.currency}</dd>
                <dt className="col-sm-4">Сумма в сомах:</dt>
                <dd className="col-sm-8">{item.amount}</dd>
              </dl>
            ))}
            {data.restructuring_payments.length === 0 && (
              <dd className="col-sm-8">Данных нет</dd>
            )}
          </dd>
        </dl>
      </dd>
      <hr className="mt-1" />
      <dt className="col-sm-3">Оплаты взносов</dt>
      <dd className="col-sm-9">
        <dl className="row">
          <dt className="col-sm-2">Список</dt>
          <dd className="col-sm-10">
            {data.contribution_payments.map((item, index) => (
              <dl className="row">
                <dt className="col-sm-4">{index + 1}. Оплата взноса:</dt>
                <dd className="col-sm-8">{item.balance}</dd>
                <dt className="col-sm-4">Дата:</dt>
                <dd className="col-sm-8">{item.date}</dd>
                <dt className="col-sm-4">Курс:</dt>
                <dd className="col-sm-8">{item.currency}</dd>
                <dt className="col-sm-4">Сумма в сомах:</dt>
                <dd className="col-sm-8">{item.amount}</dd>
              </dl>
            ))}
            {data.contribution_payments.length === 0 && (
              <dd className="col-sm-8">Данных нет</dd>
            )}
          </dd>
        </dl>
      </dd>
      <hr className="mt-1" />
      <dt className="col-sm-4">Данные об остатке:</dt>
      <dd className="col-sm-8"></dd>
      <dt className="col-sm-4">Сумма в валюте:</dt>
      <dd className="col-sm-8">{data.sum_amount}</dd>
      <dt className="col-sm-4">Сумма в сомах (остатка в валюте):</dt>
      <dd className="col-sm-8">{data.sum_in_soms_residue}</dd>
      <dt className="col-sm-4">Дата:</dt>
      <dd className="col-sm-8">{data.residue_date}</dd>
      <dt className="col-sm-4">Курс:</dt>
      <dd className="col-sm-8">{data.residue_currency}</dd>
      <dt className="col-sm-4">Сумма в сомах:</dt>
      <dd className="col-sm-8">{data.sum_in_soms}</dd>
      <hr className="mt-1" />
      <dt className="col-sm-4">Курсовая разница:</dt>
      <dd className="col-sm-8">{data.exchange_difference}</dd>
      <hr className="mt-1" />
      <dt className="col-sm-4">Дата отчета:</dt>
      <dd className="col-sm-8">{data.report_date}</dd>
    </dl>
  );
};

export default InfoOfForm;
