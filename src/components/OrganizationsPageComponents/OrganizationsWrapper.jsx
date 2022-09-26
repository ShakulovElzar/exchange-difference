import React, { useState } from "react";
import Organizations from "../../pages/Organizations";
import JournalTable from "./JournalTable";
import MyPopUpForForms from "../MyPopUpForForms/MyPopUpForForms";

const OrganizationsWrapper = () => {
  const [formStatus, setFormStatus] = useState("Отправка прошла успешно.");

  const closeForm = () => {
    let togglerDiv = document.getElementById("collapseTwo");
    togglerDiv.classList.remove("show");
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-vh-100">
      <MyPopUpForForms text={formStatus} />
      <div className="min-vh-100 m-1 p-3 shadow border mb-5 pb-5">
        <br />
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-primary"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseTwo"
            aria-expanded="false"
            aria-controls="collapseTwo"
          >
            Добавить отчет
          </button>
        </div>
        <div
          id="collapseTwo"
          className="accordion-collapse collapse"
          aria-labelledby="headingTwo"
          data-bs-parent="#accordionExample"
        >
          <div className="accordion-body pt-3">
            <Organizations
              closeForm={closeForm}
              setFormStatus={setFormStatus}
            />
          </div>
        </div>
        <hr />
        <h2>Список поданных форм: </h2>
        <JournalTable />
      </div>
    </div>
  );
};

export default OrganizationsWrapper;

// <table className="table">
//   <thead>
//   <tr className="table-light">
//     <th scope="col">#</th>
//     <th scope="col">Организация</th>
//     <th scope="col">Валюта организации</th>
//     <th scope="col">Отчетный год</th>
//     <th scope="col">Подробнее</th>
//   </tr>
//   </thead>
//   <tbody>
//   {formsData.map((item, index) => (
//       <React.Fragment>
//         <tr>
//           <th scope="row">{index + 1}</th>
//           <td>{item.organization}</td>
//           <td>{item.organization_valuta}</td>
//           <td>{item.reporting_year}</td>
//           <td>
//             <Link
//                 class="btn btn-secondary w-75"
//                 to={`/organizations/${item.id}`}
//             >
//               Подробнее
//             </Link>
//           </td>
//         </tr>
//       </React.Fragment>
//   ))}
//   </tbody>
// </table>
