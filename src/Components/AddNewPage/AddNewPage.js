import React, { useReducer } from "react";
import PageTitle from "../PageTitle";
import { useGlobalState } from "../../Context/ReducerContext";
import { nanoid } from "nanoid";
import Thead from "./Thead";
import Tfoot from "./Tfoot";
import Tbody from "./TBody";

const AddNewPage = () => {
  const { state, dispatch } = useGlobalState();

  const handleInputChange = (initialState, action) => {
    switch (action.type) {
      case "clear":
        return action.payload;
      case "showForm":
        return {
          ...initialState,
          showForm: !initialState.showForm,
        };
      default:
        return {
          ...initialState,
          [action.type]: action.payload,
        };
    }
  };

  const initialInputState = {
    name: "",
    age: "",
    dob: "",
    aadhar: "",
    mob: "",
    showForm: false,
  };

  const [inputs, inputDispatch] = useReducer(handleInputChange, initialInputState);

  const calculateAge = (dob) => {
    let today = new Date();
    let birthDate = new Date(dob);
    let calculatedAge = +today.getFullYear() - +birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    let d = today.getDate() - birthDate.getDate();
    if (m < 0 || (m === 0 && d < 0)) {
      calculatedAge--;
    }
    return calculatedAge;
  };

  const addData = () => {
    if (!inputs.name || !inputs.dob || inputs.aadhar === "" || inputs.mob === "") {
      alert("Please fill all the fields");
      return;
    }

    var aadharRegex = /^[0-9]{12}$/;
    if (!aadharRegex.test(inputs.aadhar)) {
      alert("Aadhaar Number should be exactly 12 digits");
      return;
    }

    var mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(inputs.mob)) {
      alert("Mobile Number should be exactly 10 digits");
      return;
    }

    let calculatedAge = calculateAge(inputs.dob);

    const newData = { ...inputs, id: nanoid(), age: calculatedAge };

    dispatch({ type: "newAdd", payload: newData });

    const storedData = JSON.parse(localStorage.getItem("data")) || [];
    localStorage.setItem("data", JSON.stringify([...storedData, newData]));

    inputDispatch({ type: "clear", payload: initialInputState });
  };

  const deleteItem = (id) => {
    const storedData = JSON.parse(localStorage.getItem("data")).filter(
      (element) => element.id !== id
    );
    localStorage.setItem("data", JSON.stringify(storedData));
    dispatch({ type: "delete", payload: id });
  };

  return (
    <>
      <PageTitle title="Add New Person" />
      <div className="data-container">
        <div className="table-container">
          <table frame="box" rules="all">
            <Thead />
            <Tbody data={state.personData} deleteFn={deleteItem} />
            <Tfoot inputs={inputs} inputDispatch={inputDispatch} addData={addData} />
          </table>
        </div>
      </div>
      <button className="add-btn" onClick={() => inputDispatch({ type: "showForm" })}>
        {inputs.showForm ? "Cancel" : "ADD"}
      </button>
    </>
  );
};

export default AddNewPage;
