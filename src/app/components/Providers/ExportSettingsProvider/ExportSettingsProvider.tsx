import {
  createContext,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";

interface ExportSettings {
  quality: number;
  size: number;
}

interface ExportSettingsContext {
  exportSettings: ExportSettings;
  setExportSettings: Dispatch<SetStateAction<ExportSettings>>;
}

export const ExportSettingsContext = createContext<ExportSettingsContext>({
  exportSettings: {
    quality: 0,
    size: 0,
  },
  setExportSettings: () => {},
});

interface ProviderProps {
  children: ReactNode;
}

export default function FilterDialogDisplayProvider({
  children,
}: ProviderProps) {
  const [exportSettings, setExportSettings] = useState<ExportSettings>({
    quality: 60,
    size: 2400,
  });

  return (
    <ExportSettingsContext.Provider
      value={{ exportSettings, setExportSettings }}
    >
      {children}
    </ExportSettingsContext.Provider>
  );
}
