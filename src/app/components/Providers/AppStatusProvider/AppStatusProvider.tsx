import { createContext, useState, type ReactNode, type Dispatch, type SetStateAction } from 'react';

export type AppStatus = 'IDLE' | 'SEARCHING' | 'GENERATING' | 'QUERY_ERROR';

interface AppStatusContext {
  appStatus: AppStatus;
  setAppStatus: Dispatch<SetStateAction<AppStatus>>;
}

export const AppStatusContext = createContext<AppStatusContext>({
  appStatus: 'IDLE',
  setAppStatus: () => {},
});

interface ProviderProps {
  children: ReactNode;
}

export default function AppStatusProvider({ children }: ProviderProps) {
  const [appStatus, setAppStatus] = useState<AppStatus>('IDLE');

  return (
    <AppStatusContext.Provider value={{ appStatus, setAppStatus }}>
      {children}
    </AppStatusContext.Provider>
  );
}
