import React, { useEffect, useState } from "react";
import InfoOfForm from "../components/OrganizationsPageComponents/InfoOfForm";
import axios from "axios";
import { useParams } from "react-router-dom";

const FormsByIdPage = () => {
  const params = useParams();
  const [data, setData] = useState({
    contribution_payments: [],
    restructuring_payments: [],
    assessed_contribution_payments: [],
  });

  useEffect(() => {
    axios
      .get(
        `http://10.100.4.104:8001/api/v1/organization_exchange_difference/${params.id}/`
      )
      .then((res) => {
        setData(res.data);
      });
  }, []);

  return (
    <div className="min-vh-100">
      <div className="min-vh-100 m-1 p-3 shadow border mb-5 p-3">
        <InfoOfForm data={data} />
      </div>
    </div>
  );
};

export default FormsByIdPage;
