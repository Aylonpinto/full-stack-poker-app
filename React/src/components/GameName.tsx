import DialogContent from "@mui/joy/DialogContent";
import Input from "@mui/joy/Input";

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
