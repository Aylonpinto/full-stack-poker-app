import React, { useEffect } from "react";
import DialogContent from "@mui/joy/DialogContent";
import Typography from "@mui/joy/Typography";
import _ from "lodash";

export default function SumBalance({ playersData }) {
  const totalIn = _.sumBy(playersData, (p) => Number(p.start_balance));
  const totalOut = _.sumBy(playersData, (p) => Number(p.end_balance));

  playersData.map((p) => console.log(typeof p.start_balance === "number"));

  const totalZero = totalOut === totalIn;
  const text = `The sum of in and out is ${totalOut - totalIn}`;

  const jsx = totalZero ? (
    <Typography
      variant="soft"
      color="success"
      startDecorator="✅"
      fontSize="sm"
      sx={{ "--Typography-gap": "0.5rem", p: 1 }}
    >
      {text}
    </Typography>
  ) : (
    <Typography
      variant="soft"
      color="danger"
      startDecorator="🚨"
      fontSize="sm"
      sx={{ "--Typography-gap": "0.5rem", p: 1 }}
    >
      {text}
    </Typography>
  );

  useEffect(() => {}, [playersData]);

  return jsx;
}
