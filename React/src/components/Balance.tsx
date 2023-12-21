import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import _ from "lodash";

type Props = {
  data: Record<string, number>;
  totalBalance: number;
};

export default function Balance({ data, totalBalance }: Props) {
  const body = _.map(data, (balance, name) => {
    return (
      <tr>
        <td>{name}</td>
        <td>{balance < 0 ? `-€${-balance}` : `€${balance}`}</td>
      </tr>
    );
  });
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
        <tfoot>
          <tr>
            <th>Total:</th>
            <th>{totalBalance}</th>
          </tr>
        </tfoot>
      </Table>
    </Sheet>
  );
}
