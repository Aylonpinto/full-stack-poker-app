import Input from "@mui/joy/Input";
import DialogContent from "@mui/joy/DialogContent";

type Props = {
  gameName: string;
  setGameName(name: string): void;
};

export default function GameName({ gameName, setGameName }: Props) {
  return (
    <>
      <DialogContent>What is the name of your game?</DialogContent>
      <Input
        placeholder="Game name"
        variant="soft"
        value={gameName}
        onChange={(e) => setGameName(e.target.value)}
        required
      />
    </>
  );
}
