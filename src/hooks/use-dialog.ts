import { useState, useCallback, useRef } from "react";
import { DialogState } from "@src/types/dialog";

export type UseDialogReturn = [DialogState, () => void];
export type DialogSetupHook = (initialState?: DialogState) => UseDialogReturn;

export const useDialog: DialogSetupHook = (initialState = "closed") => {
  const [dialogState, setDialogState] = useState<DialogState>(initialState);
  const showModalTimer = useRef<number | null>(null);

  const handleSetDialogState = useCallback(() => {
    if (dialogState === "closed" || dialogState === "closing") {
      setDialogState("opening");
      if (showModalTimer.current) clearTimeout(showModalTimer.current);
      showModalTimer.current = setTimeout(() => setDialogState("open"), 300);
    } else if (dialogState === "open" || dialogState === "opening") {
      setDialogState("closing");
      if (showModalTimer.current) clearTimeout(showModalTimer.current);
      showModalTimer.current = setTimeout(() => setDialogState("closed"), 300);
    }
  }, [dialogState]);

  return [dialogState, handleSetDialogState];
};
