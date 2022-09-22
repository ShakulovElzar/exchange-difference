import React, { useEffect, useState } from "react";
import OrgAddingBlock from "./OrgAddingBlock";
import AddIcon from "../AddIcon/AddIcon";

const OrgFourthBlock = ({ setFourthBlockData, chosenCurrencyID }) => {
  const [addArr, setAddArr] = useState(["some"]);
  const [trigger, setTrigger] = useState(false);
  const [blocksData, setBlocksData] = useState([
    { payment_amount: "0", payment_balance: "0" },
  ]);
  let sum = 0;
  let balance = 0;

  useEffect(() => {
    blocksData.forEach((item) => {
      try {
        balance += JSON.parse(item.payment_balance);
        sum += JSON.parse(item.payment_amount);
      } catch (error) {
        console.log(error);
      }
    });
    setFourthBlockData({
      sum,
      balance,
      array: blocksData,
    });
  }, [trigger]);

  return (
    <div className="position-relative">
      {addArr.map((item, index) => (
        <React.Fragment>
          <OrgAddingBlock
            key={index}
            number={index + 1}
            text="Оплата взноса"
            chosenCurrencyID={chosenCurrencyID}
            blocksData={blocksData}
            trigger={trigger}
            setTrigger={setTrigger}
          />
          <hr className="border border-dark border-1" />
        </React.Fragment>
      ))}
      <AddButton setAddArr={setAddArr} addArr={addArr} />
    </div>
  );
};

const AddButton = ({ addArr, setAddArr }) => {
  return (
    <button
      className="btn btn-white rounded-circle position-absolute top-0 end-0"
      style={{
        width: 65,
        height: 65,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onClick={() => {
        setAddArr([...addArr, "some"]);
      }}
    >
      <AddIcon />
    </button>
  );
};

export default OrgFourthBlock;
