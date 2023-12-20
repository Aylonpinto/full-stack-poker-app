// src/components/Calculator.js
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/joy/Button";
import ButtonGroup from "@mui/joy/ButtonGroup";
import Stack from "@mui/joy/Stack";
import CalculatorNumbers from "./CalculatorNumbers";
import { Input } from "@mui/joy";
import { NumericFormat } from "react-number-format";

const Calculator = ({ onCalculate }) => {
  const [amount, setAmount] = useState("");

  const handleAddAmount = () => {
    onCalculate(parseFloat(amount));
    setAmount("");
  };

  return <CalculatorNumbers buttonWidth="110" />;
};

export default Calculator;
