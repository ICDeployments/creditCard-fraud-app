import React, { useState } from "react";
import FalsePositivesModal from "../components/FalsePositivesModal";

export default function FalsePositivesModalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Show False Positives Modal</button>
      <FalsePositivesModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
