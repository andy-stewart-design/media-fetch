import { ComponentProps, useRef } from "react";
import { useEnhancedDialog } from "@hooks/use-enhanced-dialog";
import type { DialogState } from "@src/types/dialog";
import classes from "./component.module.css";

interface PropTypes extends ComponentProps<"dialog"> {
  showDialog: DialogState;
  setShowDialog: () => void;
}

export default function Dialog({
  showDialog,
  setShowDialog,
  children,
  className,
}: PropTypes) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEnhancedDialog({ dialogRef, showDialog, setShowDialog });

  return (
    <dialog
      ref={dialogRef}
      className={`${classes["dialog"]} ${className}`}
      onCancel={setShowDialog}
      inert={showDialog === "open" || showDialog === "opening" ? undefined : ""}
      data-state={showDialog}
    >
      {children}
    </dialog>
  );
}
