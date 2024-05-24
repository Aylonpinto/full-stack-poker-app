import Typography from "@mui/joy/Typography";
import _ from "lodash";
import { useEffect } from "react";
import { PlayersData } from "../types";

type Props = {
  playersData: PlayersData;
};

export default function SumBalance({ playersData }: Props) {
  const totalIn = _.sumBy(playersData, (p) => Number(p.start_balance));
  const totalOut = _.sumBy(playersData, (p) => Number(p.end_balance));

  const total = _.round(totalOut - totalIn, 2);
  const text = `The sum of in and out is ${_.round(totalOut - totalIn, 2)}`;

  const jsx = !total ? (
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
      color="warning"
      startDecorator="⚠️"
      fontSize="sm"
      sx={{ "--Typography-gap": "0.5rem", p: 1 }}
    >
      {text}
    </Typography>
  );

  useEffect(() => {}, [playersData]);

  return jsx;
}
