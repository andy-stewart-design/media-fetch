import { useEffect, type RefObject } from "react";
import { DialogState } from "@src/types/dialog";

interface AnimatedDialogProps {
  dialogRef: RefObject<HTMLDialogElement>;
  showDialog: DialogState;
  setShowDialog: () => void;
}

export function useEnhancedDialog({
  dialogRef,
  showDialog,
  setShowDialog,
}: AnimatedDialogProps) {
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    function animateClose(dialog: HTMLDialogElement) {
      const focusableElements = 'button, [href], input, [tabindex="0"]';
      const firstFocusableElement = dialog.querySelectorAll(
        focusableElements
      )[0] as HTMLElement;

      firstFocusableElement.focus();
      setShowDialog();
    }

    function handleClick(e: MouseEvent) {
      if (!dialog || showDialog !== "open") return;

      const { x, y, width, height } = dialog.getBoundingClientRect();
      const { clientX, clientY } = e;

      if (clientX === 0 && clientY === 0) return;

      const backdropClickedX = clientX < x || clientX > x + width;
      const backdropClickedY = clientY < y || clientY > y + height;

      if (backdropClickedX || backdropClickedY) animateClose(dialog);
    }

    function handleKeydown(e: KeyboardEvent) {
      if (!dialog) return;

      if (e.key === "Escape") {
        e.preventDefault();
        animateClose(dialog);
      }
    }

    if (showDialog === "closed" || showDialog === "closing") {
      dialog.close();
      dialog.removeEventListener("click", handleClick);
      dialog.removeEventListener("keydown", handleKeydown);
    } else if (showDialog === "opening") {
      dialog.showModal();
    } else if (showDialog == "open") {
      dialog.addEventListener("click", handleClick);
      dialog.addEventListener("keydown", handleKeydown);
    }

    return () => {
      dialog.removeEventListener("click", handleClick);
      dialog.removeEventListener("keydown", handleKeydown);
    };
  }, [dialogRef, showDialog, setShowDialog]);
}
