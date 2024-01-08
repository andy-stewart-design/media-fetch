import { createContext, useState, type ReactNode, type Dispatch, type SetStateAction } from 'react';
import { useDialog } from '@hooks/use-dialog';
import { DialogState } from '@src/types/dialog';

interface ErrorDialogDisplayContext {
  showDialog: DialogState;
  setShowDialog: () => void;
  message: string;
  setMessage: Dispatch<SetStateAction<string>>;
}

export const ErrorDialogDisplayContext = createContext<ErrorDialogDisplayContext>({
  showDialog: 'closed',
  setShowDialog: () => {},
  message: '',
  setMessage: () => {},
});

interface ProviderProps {
  children: ReactNode;
}

export default function FilterDialogDisplayProvider({ children }: ProviderProps) {
  const [showDialog, setShowDialog] = useDialog('closed');
  const [message, setMessage] = useState('');

  return (
    <ErrorDialogDisplayContext.Provider value={{ showDialog, setShowDialog, message, setMessage }}>
      {children}
    </ErrorDialogDisplayContext.Provider>
  );
}
