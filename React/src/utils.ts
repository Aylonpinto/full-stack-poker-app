import _ from "lodash";
import { PlayerData, PlayersData } from "./types";

export const setPlayerData = (
  index: number,
  setPlayersData: React.Dispatch<React.SetStateAction<PlayersData>>,
) => {
  return (data: PlayerData) => {
    setPlayersData((prev) => [
      ...prev.slice(0, index),
      { ...data },
      ...prev.slice(index + 1),
    ]);
  };
};

export const getTransactions = (balance: Record<string, number>) => {
  let sortedBalance = _.sortBy(_.toPairs(balance), ([, value]) => value);
  let transactions: string[] = [];
  let player = sortedBalance[0];
  let total = _.sum(_.values(balance));

  while (player[1] < 0) {
    let otherPlayer = sortedBalance[sortedBalance.length - 1];
    if (-player[1] === otherPlayer[1]) {
      let amount = "€" + Math.abs(-player[1]).toFixed(2);
      transactions.push(`${player[0]} pays ${amount} to ${otherPlayer[0]}`);
      sortedBalance = _.slice(sortedBalance, 1, -1);
    } else if (-player[1] < otherPlayer[1]) {
      let amount = "€" + Math.abs(-player[1]).toFixed(2);
      transactions.push(`${player[0]} pays ${amount} to ${otherPlayer[0]}`);
      sortedBalance = _.slice(sortedBalance, 1);
      sortedBalance[sortedBalance.length - 1] = [
        otherPlayer[0],
        otherPlayer[1] + player[1],
      ];
    } else {
      let amount = "€" + Math.abs(otherPlayer[1]).toFixed(2);
      transactions.push(`${player[0]} pays ${amount} to ${otherPlayer[0]}`);
      sortedBalance = _.initial(sortedBalance);
      player = [player[0], player[1] + otherPlayer[1]];
    }

    if (sortedBalance.length <= 1) {
      break;
    }

    player = sortedBalance[0];
  }

  let amount = "€" + Math.abs(total).toFixed(2);
  transactions.push(`Amount not accounted for: ${amount}`);

  return transactions;
};
