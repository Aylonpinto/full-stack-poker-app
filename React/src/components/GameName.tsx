import { FormLabel } from "@mui/joy";
import Input from "@mui/joy/Input";
import { ReactNode } from "react";

type Props = {
  gameName: string;
  setGameName(name: string): void;
  endDecorator?: ReactNode;
};

export default function GameName({
  gameName,
  setGameName,
  endDecorator,
}: Props) {
  return (
    <>
      <FormLabel>What is the name of your game?</FormLabel>
      <Input
        placeholder="Game name"
        variant="soft"
        value={gameName}
        onChange={(e) => setGameName(e.target.value)}
        endDecorator={endDecorator ?? <></>}
        required
      />
    </>
  );
}
