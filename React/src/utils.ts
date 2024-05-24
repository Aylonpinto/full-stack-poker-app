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

export const numberToStringMoney = (num: number) => {
  const rounded = _.round(num, 2);
  let string = `€${rounded}`;
  const negative = rounded < 0;
  if (negative) {
    string = `-€${-rounded}`;
  }
  const split = string.split(".");
  if (split.length !== 1) {
    const decimal = split.slice(-1)[0];
    const oneDecimal = decimal.length === 1 && decimal !== "0";
    if (oneDecimal) {
      string += "0";
    }
  }
  return string;
};

export const getTransactions = (balance: Record<string, number>) => {
  let sortedAndFilteredBalance = _.sortBy(
    _.toPairs(balance),
    ([, value]) => value,
  ).filter((b) => b[1] !== 0);
  let transactions: string[] = [];
  let player = sortedAndFilteredBalance[0];
  let total = _.sum(_.values(balance));

  while (player[1] < 0) {
    let otherPlayer =
      sortedAndFilteredBalance[sortedAndFilteredBalance.length - 1];
    if (-player[1] === otherPlayer[1]) {
      let amount = numberToStringMoney(Math.abs(-player[1]));
      transactions.push(`${player[0]} pays ${amount} to ${otherPlayer[0]}`);
      sortedAndFilteredBalance = _.slice(sortedAndFilteredBalance, 1, -1);
    } else if (-player[1] < otherPlayer[1]) {
      let amount = numberToStringMoney(Math.abs(-player[1]));
      transactions.push(`${player[0]} pays ${amount} to ${otherPlayer[0]}`);
      sortedAndFilteredBalance = _.slice(sortedAndFilteredBalance, 1);
      sortedAndFilteredBalance[sortedAndFilteredBalance.length - 1] = [
        otherPlayer[0],
        otherPlayer[1] + player[1],
      ];
    } else {
      let amount = numberToStringMoney(Math.abs(otherPlayer[1]));
      transactions.push(`${player[0]} pays ${amount} to ${otherPlayer[0]}`);
      sortedAndFilteredBalance = _.initial(sortedAndFilteredBalance);
      player = [player[0], player[1] + otherPlayer[1]];
    }

    if (sortedAndFilteredBalance.length <= 1) {
      break;
    }

    player = sortedAndFilteredBalance[0];
  }

  let amount = numberToStringMoney(Math.abs(total));
  transactions.push(`Amount not accounted for: ${amount}`);

  return transactions;
};
