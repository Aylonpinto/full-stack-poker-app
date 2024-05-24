import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import _ from "lodash";
import { numberToStringMoney } from "../utils";

type Props = {
  data: Record<string, number>;
};

export default function Balance({ data }: Props) {
  const totalBalance = _.round(_.sum(_.map(data, (b) => b)), 1);
  const body = _.map(data, (balance, name) => {
    const stringBalance = numberToStringMoney(balance);

    if (!balance) return;
    return (
      <tr>
        <td>{name}</td>
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
        borderAxis="xBetween"
        color="neutral"
        size="md"
        stickyFooter
        stickyHeader
        stripe="odd"
        variant="soft"
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
