import Button from "@mui/joy/Button";
import { Container } from "@mui/material";
import Balance from "./Balance";

type Props = {
  balanceData: Record<string, number>;
  handleSettleBalance(): void;
};

const TotalBalance = ({ balanceData, handleSettleBalance }: Props) => {
  return (
    <Container>
      <h2>Total Balance:</h2>
      <Balance data={balanceData} />
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
