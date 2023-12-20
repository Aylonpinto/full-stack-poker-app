import _ from "lodash";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";

type Props = {
  data: Record<string, number>;
};

export default function Balance({ data }: Props) {
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
      </Table>
    </Sheet>
  );
}
