import { createContext, useContext, useState, ReactNode } from 'react';
import type { User, AppSettings } from '../types/user';

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<AppSettings>({
    soundEnabled: true,
    buttonSoundEnabled: true,
    autoCheck: true,
  });

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <UserContext.Provider value={{ user, setUser, settings, updateSettings }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}