import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/joy/Button";
import ButtonGroup from "@mui/joy/ButtonGroup";
import Stack from "@mui/joy/Stack";
import { Input } from "@mui/joy";

export default function CalculatorNumbers(props) {
  const [amount, setAmount] = useState("");

  return (
    <Stack
      spacing={0}
      direction="column"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <div style={{ display: "flex", flexDirection: "row" }}>
        <Input
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          variant="soft"
          placeholder="Enter amount"
          size="sm"
          style={{ flex: `0 1 ${props.buttonWidth * 3}px` }}
          sx={{
            "--Input-radius": "20px",
          }}
          endDecorator={<Button>Enter</Button>}
        />
      </div>
      <ButtonGroup
        orientation="horizontal"
        aria-label="horizontal outlined button group"
        buttonFlex={`0 1 ${props.buttonWidth}px`}
        sx={{ "--ButtonGroup-radius": "20px" }}
      >
        <Button key="seven" onClick={() => setAmount((prev) => prev + "7")}>
          7
        </Button>
        <Button key="aight" onClick={() => setAmount((prev) => prev + "8")}>
          8
        </Button>
        <Button key="nine" onClick={() => setAmount((prev) => prev + "9")}>
          9
        </Button>
      </ButtonGroup>
      <ButtonGroup
        orientation="horizontal"
        aria-label="horizontal plain button group"
        buttonFlex={`0 1 ${props.buttonWidth}px`}
        sx={{ "--ButtonGroup-radius": "20px" }}
      >
        <Button key="four" onClick={() => setAmount((prev) => prev + "4")}>
          4
        </Button>
        <Button key="five" onClick={() => setAmount((prev) => prev + "5")}>
          5
        </Button>
        <Button key="six" onClick={() => setAmount((prev) => prev + "6")}>
          6
        </Button>
      </ButtonGroup>
      <ButtonGroup
        orientation="horizontal"
        aria-label="horizontal soft button group"
        buttonFlex={`0 1 ${props.buttonWidth}px`}
        sx={{ "--ButtonGroup-radius": "20px" }}
      >
        <Button key="one" onClick={() => setAmount((prev) => prev + "1")}>
          1
        </Button>
        <Button key="two" onClick={() => setAmount((prev) => prev + "2")}>
          2
        </Button>
        <Button key="three" onClick={() => setAmount((prev) => prev + "3")}>
          3
        </Button>
      </ButtonGroup>
      <ButtonGroup
        orientation="horizontal"
        aria-label="horizontal solid button group"
        variant="solid"
        buttonFlex={`0 1 ${props.buttonWidth}px`}
        sx={{ "--ButtonGroup-radius": "20px" }}
      >
        <Button key="clear" onClick={() => setAmount("")}>
          C
        </Button>
        <Button key="zero" onClick={() => setAmount((prev) => prev + "0")}>
          0
        </Button>
        <Button key="comma" onClick={() => setAmount((prev) => prev + ",")}>
          ,
        </Button>
      </ButtonGroup>
    </Stack>
  );
}
