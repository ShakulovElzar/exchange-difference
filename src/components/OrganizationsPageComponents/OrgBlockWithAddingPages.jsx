import React, { useEffect, useState } from "react";
import OrgAddingBlock from "./OrgAddingBlock";
import AddIcon from "../AddIcon/AddIcon";

const OrgBlockWithAddingPages = ({
  setFourthBlockData,
  chosenCurrencyID,
  text,
}) => {
  const [blocksData, setBlocksData] = useState([{ amount: "0", balance: "0" }]);
  let sum = 0;
  let balance = 0;

  const deleteElement = () => {
    setBlocksData(blocksData.slice(0, blocksData.length - 1));
  };

  const setExternalData = () => {
    sum = 0;
    balance = 0;
    blocksData.forEach((item) => {
      try {
        balance += JSON.parse(item.balance);
        sum += JSON.parse(item.amount);
      } catch (error) {
        console.log(error);
      }
    });
    setFourthBlockData({
      sum,
      balance,
      array: blocksData,
    });
  };

  useEffect(() => setExternalData(), [blocksData]);

  return (
    <div className="position-relative">
      {blocksData.map((item, index) => (
        <div className="position-relative" key={index}>
          <OrgAddingBlock
            number={index + 1}
            text={text}
            chosenCurrencyID={chosenCurrencyID}
            blocksData={blocksData}
            setBlocksData={setBlocksData}
            setExternalData={setExternalData}
          />
          {index === blocksData.length - 1 && index !== 0 && (
            <button
              type="button"
              className="btn btn-danger position-absolute col-1 bottom-0 end-0 m-2 mb-4"
              onClick={() => {
                deleteElement();
              }}
            >
              Удалить
            </button>
          )}
          <hr className="border border-dark border-1" />
        </div>
      ))}
      <AddButton setBlocksData={setBlocksData} blocksData={blocksData} />
    </div>
  );
};

const AddButton = ({ blocksData, setBlocksData }) => {
  return (
    <button
      className="btn btn-white rounded-circle position-absolute top-0 end-0  m-1"
      style={{
        width: 65,
        height: 65,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onClick={() => {
        setBlocksData([...blocksData, { amount: "0", balance: "0" }]);
      }}
    >
      <AddIcon />
    </button>
  );
};

export default OrgBlockWithAddingPages;
