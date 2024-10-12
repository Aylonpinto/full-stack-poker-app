import _ from "lodash";
import { Balance, PlayerData, PlayersData, SessionResponse } from "./types";

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

export const getTransactions = (balance: Balance) => {
  let filtered = balance.filter((el) => el.balance !== 0).reverse();
  let transactions: string[] = [];
  let player = filtered[0];
  let total = _.sum(balance.map((el) => el.balance));
  console.log(filtered, player);

  while (player.balance < 0) {
    let otherPlayer = filtered[filtered.length - 1];
    if (-player.balance === otherPlayer.balance) {
      let amount = numberToStringMoney(Math.abs(-player.balance));
      transactions.push(
        `${player.player_name} pays ${amount} to ${otherPlayer.player_name}`,
      );
      filtered = _.slice(filtered, 1, -1);
    } else if (-player.balance < otherPlayer.balance) {
      let amount = numberToStringMoney(Math.abs(-player.balance));
      transactions.push(
        `${player.player_name} pays ${amount} to ${otherPlayer.player_name}`,
      );
      filtered = _.slice(filtered, 1);
      otherPlayer.balance += player.balance;
    } else {
      let amount = numberToStringMoney(Math.abs(otherPlayer.balance));
      transactions.push(
        `${player.player_name} pays ${amount} to ${otherPlayer.player_name}`,
      );
      filtered = _.initial(filtered);
      player.balance += otherPlayer.balance;
    }

    if (filtered.length <= 1) {
      break;
    }

    player = filtered[0];
  }

  let amount = numberToStringMoney(Math.abs(total));
  transactions.push(`Amount not accounted for: ${amount}`);

  return transactions;
};

export const balanceFromSessions = (sessions: SessionResponse[]) => {
  const balance: Record<string, number> = {};
  _.each(sessions, (ses) => {
    const playerName = ses.player_name;
    if (!(playerName in balance)) {
      balance[playerName] = 0;
    }
    balance[playerName] += ses.balance;
  });

  const array = Object.keys(balance).map((name) => ({
    player_name: name,
    balance: balance[name],
  }));
  array.sort((a, b) => b.balance - a.balance);

  return array;
};

// Function to return gcd of a and b 
const gcd = (a: number, b: number) =>{ 
    if (a === 0) 
      return b; 
    return gcd(b % a, a); 
} 

export const getBuyInAmount = (startBalances: number[]) => {
  let result = startBalances[0];
  for (const balance of startBalances) {
    result = gcd(balance, result);
    if (result === 1) {
      return 1;
    }
  } 
  return result;
}
