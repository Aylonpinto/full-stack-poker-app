import Button from "@mui/joy/Button";
import { Container } from "@mui/material";
import { Balance } from "../types";
import BalanceTable from "./BalanceTable";

type Props = {
  balanceData: Balance;
  handleSettleBalance: (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => Promise<void>;
};

const TotalBalance = ({ balanceData, handleSettleBalance }: Props) => {
  return (
    <Container maxWidth="md" sx={{ m: "10px auto" }}>
      <h2>Open balance:</h2>
      <BalanceTable data={balanceData} showZero={false} />
      <Button
        onClick={handleSettleBalance}
        variant="soft"
        sx={{
          display: "inline-block",
          width: "100%",
          margin: "10px 0px",
        }}
      >
        Settle Balance
      </Button>
    </Container>
  );
};

export default TotalBalance;
