// src/components/Calculator.js
import { useState } from "react";
import CalculatorNumbers from "./CalculatorNumbers";

const Calculator = ({ onCalculate }) => {
  const [amount, setAmount] = useState("");

  const handleAddAmount = () => {
    onCalculate(parseFloat(amount));
    setAmount("");
  };

  return <CalculatorNumbers buttonWidth="110" />;
};

export default Calculator;
