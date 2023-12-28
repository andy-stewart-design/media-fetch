import { createContext, type ReactNode } from "react";
import { useDialog } from "@hooks/use-dialog";
import { DialogState } from "@src/types/dialog";

interface FilterDialogDisplayContext {
  showDialog: DialogState;
  setShowDialog: () => void;
}

export const FilterDialogDisplayContext =
  createContext<FilterDialogDisplayContext>({
    showDialog: "closed",
    setShowDialog: () => {},
  });

interface ProviderProps {
  children: ReactNode;
}

export default function FilterDialogDisplayProvider({
  children,
}: ProviderProps) {
  const [showDialog, setShowDialog] = useDialog("closed");

  return (
    <FilterDialogDisplayContext.Provider value={{ showDialog, setShowDialog }}>
      {children}
    </FilterDialogDisplayContext.Provider>
  );
}
