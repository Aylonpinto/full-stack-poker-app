import React, { useEffect, useState } from "react";

import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";

export default function SettleBalanceModal({ settleBalanceData }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!settleBalanceData.length) {
      return;
    }
    setOpen(true);
  }, [settleBalanceData]);

  return (
    <React.Fragment>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          {settleBalanceData.map((str) => (
            <p>{str}</p>
          ))}
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}
