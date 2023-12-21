import {
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Stack,
  Typography,
} from "@mui/joy";
import { useState } from "react";
import { PlayersData } from "../types";
import LivePlayer from "./LivePlayer";

export default function Live() {
  const [livePlayersData, setLivePlayersData] = useState<PlayersData>([
    {
      name: "",
      start_balance: "",
      end_balance: "",
    },
  ]);
  const [buyin, setBuyin] = useState<number | string>("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBuyin(event.target.value);
  };

  return (
    <Container>
      <Typography level="h4">Welcome to live mode!</Typography>
      <Typography level="body-md">
        Here you can keep track of a live cash game while you are playing!
      </Typography>
      <br />
      <FormControl>
        <FormLabel>Please fill in the buy-in amout:</FormLabel>
        <Input
          placeholder="Buy-in amount"
          variant="soft"
          type="number"
          value={buyin}
          startDecorator={"€"}
          onChange={(e) => handleChange(e)}
        />
        <FormHelperText>
          This will be used as a unit to add extra buy-ins to players.
        </FormHelperText>
      </FormControl>
      <br />
      <Stack spacing={3}>
        <LivePlayer
          playersData={livePlayersData}
          setPlayersData={setLivePlayersData}
          buyin={buyin}
        />
      </Stack>
    </Container>
  );
}
