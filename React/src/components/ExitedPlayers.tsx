import { Sheet, Table } from "@mui/joy";
import _ from "lodash";
import { PlayersData } from "../types";

type Props = {
  playersData: PlayersData;
};

export default function ExitedPlayers({ playersData }: Props) {
  const body = _.map(playersData, (data) => {
    const balance = Number(data.end_balance) - Number(data.start_balance);
    const isPositive = balance >= 0;
    return (
      <tr style={{ color: isPositive ? "#198754" : "#dc3545" }}>
        <td>{data.name}</td>
        <td>{!isPositive ? `-€${-balance}` : `€${balance}`}</td>
      </tr>
    );
  });

  if (playersData.length) {
    return (
      <Sheet>
        <Table
          borderAxis="xBetween"
          size="md"
          stickyFooter
          stickyHeader
          color="success"
          variant="plain"
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Win or loss</th>
            </tr>
          </thead>
          <tbody>{body}</tbody>
        </Table>
      </Sheet>
    );
  }
  return <></>;
}
