import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import _ from "lodash";
import { Balance } from "../types";
import { numberToStringMoney } from "../utils";

type Props = {
  data: Balance;
};

export default function BalanceTable({ data }: Props) {
  const totalBalance = _.round(_.sum(_.map(data, (b) => b.balance)), 1);
  const body = _.map(data, (el) => {
    const stringBalance = numberToStringMoney(el.balance);

    if (!el.balance) return;
    return (
      <tr style={{ color: el.balance >= 0 ? "#198754" : "#dc3545" }}>
        <td>{el.player_name}</td>
        <td>{stringBalance}</td>
      </tr>
    );
  });
  const foot = totalBalance ? (
    <tfoot>
      <tr>
        <th>Total:</th>
        <th>{totalBalance}</th>
      </tr>
    </tfoot>
  ) : (
    <></>
  );
  return (
    <Sheet>
      <Table
        color="success"
        variant="plain"
        borderAxis="xBetween"
        // color="neutral"
        size="md"
        stickyFooter
        stickyHeader
        stripe="odd"
        // variant="soft"
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>{body}</tbody>
        {foot}
      </Table>
    </Sheet>
  );
}
