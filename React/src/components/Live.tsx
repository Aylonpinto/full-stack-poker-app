import DialogContent from "@mui/joy/DialogContent";
import Input from "@mui/joy/Input";

export default function Live() {
  return (
    <>
      <DialogContent>Welcome to live!</DialogContent>
      <Input placeholder="Game name" variant="soft" required />
    </>
  );
}
