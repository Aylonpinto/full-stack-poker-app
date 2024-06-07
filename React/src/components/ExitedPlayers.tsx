import _ from "lodash";
import { Balance, PlayersData } from "../types";
import BalanceTable from "./BalanceTable";

type Props = {
  playersData: PlayersData;
};

export default function ExitedPlayers({ playersData }: Props) {
  const data: Balance = _.sortBy(
    _.map(playersData, (data) => {
      const balance = Number(data.end_balance) - Number(data.start_balance);
      return { player_name: data.player_name, balance: balance };
    }),
    (p) => -p.balance,
  );

  if (playersData.length) {
    return <BalanceTable data={data} />;
  }
  return <></>;
}
